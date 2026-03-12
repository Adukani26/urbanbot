import { db } from '../db/index.js';
import { validate } from '../middleware/validate.js';

export const getAllZones = async (req, reply) => {
  const result = await db.query('SELECT * FROM zones ORDER BY priority ASC');
  return result.rows;
};

export const getZoneById = async (req, reply) => {
  const result = await db.query('SELECT * FROM zones WHERE id = $1', [req.params.id]);
  if (!result.rows.length) {
    const error = new Error('Zone not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
};

export const createZone = async (req, reply) => {
  validate(req.body, ['name']);
  const { name, description, geojson, priority } = req.body;
  const result = await db.query(
    'INSERT INTO zones (name, description, geojson, priority) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, description, geojson, priority || 1]
  );
  return reply.code(201).send(result.rows[0]);
};

export const updateZone = async (req, reply) => {
  validate(req.body, ['name', 'description', 'priority']);
  const { name, description, priority } = req.body;
  const result = await db.query(
    'UPDATE zones SET name=$1, description=$2, priority=$3 WHERE id=$4 RETURNING *',
    [name, description, priority, req.params.id]
  );
  if (!result.rows.length) {
    const error = new Error('Zone not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
};

export const deleteZone = async (req, reply) => {
  await db.query('DELETE FROM zones WHERE id = $1', [req.params.id]);
  return reply.code(204).send();
};