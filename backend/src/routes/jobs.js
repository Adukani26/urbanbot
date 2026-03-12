import {
  getAllJobs,
  getJobById,
  createJob,
  cancelJob
} from '../controllers/jobs.js';

export default async function jobsRouter(app) {
  app.get('/',             getAllJobs);
  app.get('/:id',          getJobById);
  app.post('/',            createJob);
  app.patch('/:id/cancel', cancelJob);
}