import Fastify from 'fastify';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from '@fastify/cors';
import 'dotenv/config';

import { initDB } from './services/db.js';
import { initMQTT } from './mqtt/client.js';
import { initQueues } from './queues/jobQueue.js';

import zonesRouter from './routes/zones.js';
import jobsRouter from './routes/jobs.js';
import telemetryRouter from './routes/telemetry.js';
import robotRouter from './routes/robot.js';

const app = Fastify({ logger: true });
const httpServer = createServer(app.server);

export const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

await app.register(cors, { origin: '*' });

app.register(zonesRouter,    { prefix: '/zones' });
app.register(jobsRouter,     { prefix: '/jobs' });
app.register(telemetryRouter,{ prefix: '/telemetry' });
app.register(robotRouter,    { prefix: '/robot' });

app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

io.on('connection', (socket) => {
  app.log.info(`Client connected: ${socket.id}`);

  socket.on('command', (data) => {
    import('./mqtt/client.js').then(({ publishCommand }) => publishCommand(data));
  });

  socket.on('disconnect', () => {
    app.log.info(`Client disconnected: ${socket.id}`);
  });
});

const start = async () => {
  try {
    await initDB();
    await initMQTT(io);
    await initQueues();
    await app.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    app.log.info('UrbanBot API running on port 3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();