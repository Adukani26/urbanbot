import pg from 'pg';
const { Pool } = pg;

export let db;

export const initDB = async () => {
  db = new Pool({ connectionString: process.env.DATABASE_URL });
  await db.query('SELECT 1');
  console.log('✅ PostgreSQL connected');
};