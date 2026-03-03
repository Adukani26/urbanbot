import { db } from '../services/db.js';
import { jobQueue } from '../queues/jobQueue.js';

export default async function jobsRouter(app) {

  app.get('/', async (req) => {
    const { status, zone_id } = req.query;
    let query = 'SELECT j.*, z.name as zone_name FROM jobs j LEFT JOIN zones z ON j.zone_id = z.id WHERE 1=1';
    const params = [];
    if (status)  { params.push(status);  query += ` AND j.status = $${params.length}`; }
    if (zone_id) { params.push(zone_id); query += ` AND j.zone_id = $${params.length}`; }
    query += ' ORDER BY j.created_at DESC';
    const result = await db.query(query, params);
    return result.rows;
  });

  app.post('/', async (req, reply) => {
    const { zone_id, type, scheduled_at, notes } = req.body;
    const result = await db.query(
      'INSERT INTO jobs (zone_id, type, status, scheduled_at, notes) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [zone_id, type, 'pending', scheduled_at || new Date(), notes]
    );
    const job = result.rows[0];
    const delay = scheduled_at ? Math.max(0, new Date(scheduled_at) - Date.now()) : 0;
    await jobQueue.add('dispatch', { jobId: job.id, zoneId: zone_id, type }, { delay });
    return reply.code(201).send(job);
  });

  app.patch('/:id/cancel', async (req, reply) => {
    const result = await db.query(
      `UPDATE jobs SET status = 'cancelled' WHERE id = $1 AND status = 'pending' RETURNING *`,
      [req.params.id]
    );
    if (!result.rows.length) return reply.code(400).send({ error: 'Job cannot be cancelled' });
    return result.rows[0];
  });

  app.get('/:id', async (req, reply) => {
    const result = await db.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return reply.code(404).send({ error: 'Job not found' });
    return result.rows[0];
  });
}