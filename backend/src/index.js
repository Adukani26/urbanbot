import Fastify from 'fastify';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from '@fastify/cors';
import staticPlugin from '@fastify/static';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import { config } from './config/index.js';
import { initDB } from './db/index.js';
import { initMQTT } from './mqtt/client.js';
import { initQueues } from './queues/jobQueue.js';
import { errorHandler } from './middleware/errorHandler.js';

import zonesRouter     from './routes/zones.js';
import jobsRouter      from './routes/jobs.js';
import telemetryRouter from './routes/telemetry.js';
import robotRouter     from './routes/robot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// ── APP SETUP ─────────────────────────────────────────────
const app        = Fastify({ logger: true });
const httpServer = createServer(app.server);

// ── SOCKET.IO ─────────────────────────────────────────────
export const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// ── PLUGINS ───────────────────────────────────────────────
await app.register(cors, { origin: '*' });
await app.register(staticPlugin, {
  root:   resolve(__dirname, '../../frontend'),
  prefix: '/'
});

// ── ROUTES ────────────────────────────────────────────────
app.register(zonesRouter,     { prefix: '/zones'     });
app.register(jobsRouter,      { prefix: '/jobs'      });
app.register(telemetryRouter, { prefix: '/telemetry' });
app.register(robotRouter,     { prefix: '/robot'     });

// ── HEALTH CHECK ──────────────────────────────────────────
app.get('/health', async () => ({
  status:    'ok',
  timestamp:  new Date().toISOString(),
  env:        config.nodeEnv
}));

// ── ERROR HANDLER ─────────────────────────────────────────
app.setErrorHandler(errorHandler);

// ── SOCKET EVENTS ─────────────────────────────────────────
io.on('connection', (socket) => {
  app.log.info(`Client connected: ${socket.id}`);

  socket.on('command', (data) => {
    import('./mqtt/client.js').then(({ publishCommand }) => publishCommand(data));
  });

  socket.on('disconnect', () => {
    app.log.info(`Client disconnected: ${socket.id}`);
  });
});

// ── BOOT ──────────────────────────────────────────────────
const start = async () => {
  try {
    await initDB();
    await initMQTT(io);
    await initQueues();
    await app.listen({ port: config.port, host: '0.0.0.0' });
    app.log.info(`UrbanBot API running on port ${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();