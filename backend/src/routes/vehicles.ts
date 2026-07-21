import { Router } from 'express';

import { AuthedRequest, requireAuth } from '../auth';
import { db } from '../db';
import { Vehicle } from '../types';
import { genId } from '../util';

const router = Router();

router.get('/', requireAuth('customer'), (req: AuthedRequest, res) => {
  res.json(db.data.vehicles.filter((v) => v.customerId === req.auth!.sub));
});

router.post('/', requireAuth('customer'), (req: AuthedRequest, res) => {
  const { brand, model, registration, type } = req.body ?? {};
  if (!brand || !model) return res.status(400).json({ error: 'brand and model required' });
  const vehicle: Vehicle = {
    id: genId('v'),
    customerId: req.auth!.sub,
    brand,
    model,
    registration: registration || 'Not provided',
    type: type === 'EV' ? 'EV' : 'Petrol',
  };
  db.data.vehicles.push(vehicle);
  db.save();
  res.status(201).json(vehicle);
});

router.delete('/:id', requireAuth('customer'), (req: AuthedRequest, res) => {
  const before = db.data.vehicles.length;
  db.data.vehicles = db.data.vehicles.filter(
    (v) => !(v.id === req.params.id && v.customerId === req.auth!.sub),
  );
  if (db.data.vehicles.length === before) return res.status(404).json({ error: 'Not found' });
  db.save();
  res.json({ ok: true });
});

export default router;
