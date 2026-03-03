import { db } from '../services/db.js';

export default async function telemetryRouter(app) {

  app.get('/latest', async () => {
    const result = await db.query(`SELECT * FROM telemetry ORDER BY time DESC LIMIT 1`);
    return result.rows[0] || {};
  });

  app.get('/history', async (req) => {
    const minutes = req.query.minutes || 30;
    const result = await db.query(
      `SELECT time, battery_level, speed, lat, lng, status
       FROM telemetry
       WHERE time > NOW() - INTERVAL '${parseInt(minutes)} minutes'
       ORDER BY time ASC`
    );
    return result.rows;
  });

  app.post('/', async (req, reply) => {
    const { robot_id, battery, speed, lat, lng, status, job_id } = req.body;
    await db.query(
      `INSERT INTO telemetry (robot_id, battery_level, speed, lat, lng, status, current_job_id, raw)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [robot_id, battery, speed, lat, lng, status, job_id, req.body]
    );
    return reply.code(201).send({ received: true });
  });
}