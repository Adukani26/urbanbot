import { Queue, Worker } from 'bullmq';
import { db } from '../services/db.js';
import { publishCommand } from '../mqtt/client.js';

const connection = { host: 'redis', port: 6379 };

export let jobQueue;

export const initQueues = async () => {
  jobQueue = new Queue('robot-jobs', { connection });

  const worker = new Worker('robot-jobs', async (bullJob) => {
    const { jobId, zoneId, type } = bullJob.data;

    console.log(`🤖 Dispatching job ${jobId} — type: ${type}, zone: ${zoneId}`);

    await db.query(
      `UPDATE jobs SET status = 'running', started_at = NOW() WHERE id = $1`,
      [jobId]
    );

    publishCommand({
      action: 'start_job',
      job_id: jobId,
      zone_id: zoneId,
      task_type: type,
      timestamp: new Date().toISOString()
    });

  }, { connection });

  worker.on('completed', async (bullJob) => {
    await db.query(
      `UPDATE jobs SET status = 'completed', completed_at = NOW() WHERE id = $1`,
      [bullJob.data.jobId]
    );
    console.log(`✅ Job ${bullJob.data.jobId} completed`);
  });

  worker.on('failed', async (bullJob, err) => {
    await db.query(
      `UPDATE jobs SET status = 'failed' WHERE id = $1`,
      [bullJob.data.jobId]
    );
    console.error(`❌ Job ${bullJob.data.jobId} failed:`, err.message);
  });

  console.log('✅ Job queue initialized');
};