import {
  getAllZones,
  getZoneById,
  createZone,
  updateZone,
  deleteZone
} from '../controllers/zones.js';

export default async function zonesRouter(app) {
  app.get('/',       getAllZones);
  app.get('/:id',    getZoneById);
  app.post('/',      createZone);
  app.put('/:id',    updateZone);
  app.delete('/:id', deleteZone);
}