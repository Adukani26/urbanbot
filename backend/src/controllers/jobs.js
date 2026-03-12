import { db } from '../db/index.js';
import { jobQueue } from '../queues/jobQueue.js';
import { validate } from '../middleware/validate.js';

export const getAllJobs = async (req, reply) => {
  const { status, zone_id } = req.query;
  let query = `
    SELECT j.*, z.name as zone_name
    FROM jobs j
    LEFT JOIN zones z ON j.zone_id = z.id
    WHERE 1=1
  `;
  const params = [];
  if (status)  { params.push(status);  query += ` AND j.status = $${params.length}`; }
  if (zone_id) { params.push(zone_id); query += ` AND j.zone_id = $${params.length}`; }
  query += ' ORDER BY j.created_at DESC';

  const result = await db.query(query, params);
  return result.rows;
};

export const getJobById = async (req, reply) => {
  const result = await db.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
  if (!result.rows.length) {
    const error = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
};

export const createJob = async (req, reply) => {
  validate(req.body, ['zone_id', 'type']);
  const { zone_id, type, scheduled_at, notes } = req.body;

  const result = await db.query(
    'INSERT INTO jobs (zone_id, type, status, scheduled_at, notes) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [zone_id, type, 'pending', scheduled_at || new Date(), notes]
  );
  const job = result.rows[0];

  const delay = scheduled_at
    ? Math.max(0, new Date(scheduled_at) - Date.now())
    : 0;

  await jobQueue.add('dispatch', { jobId: job.id, zoneId: zone_id, type }, { delay });
  return reply.code(201).send(job);
};

export const cancelJob = async (req, reply) => {
  const result = await db.query(
    `UPDATE jobs SET status = 'cancelled' WHERE id = $1 AND status = 'pending' RETURNING *`,
    [req.params.id]
  );
  if (!result.rows.length) {
    const error = new Error('Job not found or cannot be cancelled');
    error.statusCode = 400;
    throw error;
  }
  return result.rows[0];
};