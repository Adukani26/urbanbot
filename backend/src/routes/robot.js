import { publishCommand } from '../mqtt/client.js';

export default async function robotRouter(app) {

  app.post('/command', async (req, reply) => {
    const { action, params } = req.body;
    const validActions = ['stop', 'pause', 'resume', 'return_home', 'start_job', 'set_speed'];
    if (!validActions.includes(action)) {
      return reply.code(400).send({ error: `Invalid action. Valid: ${validActions.join(', ')}` });
    }
    publishCommand({ action, params, timestamp: new Date().toISOString() });
    return { sent: true, action, params };
  });

  app.post('/emergency-stop', async () => {
    publishCommand({ action: 'EMERGENCY_STOP', priority: 'critical', timestamp: new Date().toISOString() });
    return { sent: true, action: 'EMERGENCY_STOP' };
  });
}