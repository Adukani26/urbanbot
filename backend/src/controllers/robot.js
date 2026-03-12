import { publishCommand } from '../mqtt/client.js';

const VALID_ACTIONS = ['stop', 'pause', 'resume', 'return_home', 'start_job', 'set_speed'];

export const sendCommand = async (req, reply) => {
  const { action, params } = req.body;

  if (!action) {
    const error = new Error('Action is required');
    error.statusCode = 400;
    throw error;
  }

  if (!VALID_ACTIONS.includes(action)) {
    const error = new Error(`Invalid action. Valid actions: ${VALID_ACTIONS.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  publishCommand({ action, params, timestamp: new Date().toISOString() });
  return { sent: true, action, params };
};

export const emergencyStop = async (req, reply) => {
  publishCommand({
    action:    'EMERGENCY_STOP',
    priority:  'critical',
    timestamp: new Date().toISOString()
  });
  return { sent: true, action: 'EMERGENCY_STOP' };
};