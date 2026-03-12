import {
  getLatestTelemetry,
  getTelemetryHistory,
  ingestTelemetry
} from '../controllers/telemetry.js';

export default async function telemetryRouter(app) {
  app.get('/latest',  getLatestTelemetry);
  app.get('/history', getTelemetryHistory);
  app.post('/',       ingestTelemetry);
}