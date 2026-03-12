import pg from 'pg';
import { config } from '../config/index.js';

const { Pool } = pg;

export let db;

export const initDB = async () => {
  db = new Pool({ connectionString: config.databaseUrl });
  await db.query('SELECT 1');
  console.log('✅ PostgreSQL connected');
};