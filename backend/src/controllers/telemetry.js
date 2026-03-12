import { db } from '../db/index.js';
import { validate } from '../middleware/validate.js';

export const getLatestTelemetry = async (req, reply) => {
  const result = await db.query('SELECT * FROM telemetry ORDER BY time DESC LIMIT 1');
  return result.rows[0] || {};
};

export const getTelemetryHistory = async (req, reply) => {
  const minutes = parseInt(req.query.minutes) || 30;
  const result = await db.query(
    `SELECT time, battery_level, speed, lat, lng, status
     FROM telemetry
     WHERE time > NOW() - INTERVAL '${minutes} minutes'
     ORDER BY time ASC`
  );
  return result.rows;
};

export const ingestTelemetry = async (req, reply) => {
  validate(req.body, ['robot_id']);
  const { robot_id, battery, speed, lat, lng, status, job_id } = req.body;
  await db.query(
    `INSERT INTO telemetry (robot_id, battery_level, speed, lat, lng, status, current_job_id, raw)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [robot_id, battery, speed, lat, lng, status, job_id, req.body]
  );
  return reply.code(201).send({ received: true });
};