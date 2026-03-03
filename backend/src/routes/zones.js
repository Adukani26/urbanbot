import { db } from '../services/db.js';

export default async function zonesRouter(app) {

  app.get('/', async () => {
    const result = await db.query('SELECT * FROM zones ORDER BY priority ASC');
    return result.rows;
  });

  app.get('/:id', async (req, reply) => {
    const result = await db.query('SELECT * FROM zones WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return reply.code(404).send({ error: 'Zone not found' });
    return result.rows[0];
  });

  app.post('/', async (req, reply) => {
    const { name, description, geojson, priority } = req.body;
    const result = await db.query(
      'INSERT INTO zones (name, description, geojson, priority) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, description, geojson, priority || 1]
    );
    return reply.code(201).send(result.rows[0]);
  });

  app.put('/:id', async (req, reply) => {
    const { name, description, priority } = req.body;
    const result = await db.query(
      'UPDATE zones SET name=$1, description=$2, priority=$3 WHERE id=$4 RETURNING *',
      [name, description, priority, req.params.id]
    );
    return result.rows[0];
  });

  app.delete('/:id', async (req, reply) => {
    await db.query('DELETE FROM zones WHERE id = $1', [req.params.id]);
    return reply.code(204).send();
  });
}