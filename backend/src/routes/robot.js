import {
  sendCommand,
  emergencyStop
} from '../controllers/robot.js';

export default async function robotRouter(app) {
  app.post('/command',        sendCommand);
  app.post('/emergency-stop', emergencyStop);
}