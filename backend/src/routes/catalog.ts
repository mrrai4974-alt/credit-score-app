import { Router } from 'express';

import { requireAuth } from '../auth';
import { db } from '../db';
import { Brand, Service } from '../types';
import { genId } from '../util';

const router = Router();

/* ------------------------------------------------------------- Services */

router.get('/services', (req, res) => {
  let list = db.data.services;
  if (req.query.active === 'true') list = list.filter((s) => s.active);
  if (req.query.category) list = list.filter((s) => s.category === req.query.category);
  res.json(list);
});

router.post('/services', requireAuth('admin'), (req, res) => {
  const { name, category, price, durationMin, inspectionPoints } = req.body ?? {};
  if (!name || !category) return res.status(400).json({ error: 'name and category required' });
  const svc: Service = {
    id: genId('s'),
    name,
    category,
    price: price === '' || price == null ? null : Number(price),
    durationMin: Number(durationMin) || 60,
    inspectionPoints: Number(inspectionPoints) || 0,
    active: true,
  };
  db.data.services.unshift(svc);
  db.save();
  res.status(201).json(svc);
});

router.patch('/services/:id', requireAuth('admin'), (req, res) => {
  const svc = db.data.services.find((s) => s.id === req.params.id);
  if (!svc) return res.status(404).json({ error: 'Service not found' });
  Object.assign(svc, req.body ?? {});
  db.save();
  res.json(svc);
});

/* --------------------------------------------------------------- Brands */

router.get('/brands', (_req, res) => res.json(db.data.brands));

router.post('/brands', requireAuth('admin'), (req, res) => {
  const { name, type } = req.body ?? {};
  if (!name) return res.status(400).json({ error: 'name required' });
  const brand: Brand = { id: genId('b'), name, type: type ?? 'Petrol', models: [] };
  db.data.brands.unshift(brand);
  db.save();
  res.status(201).json(brand);
});

router.post('/brands/:id/models', requireAuth('admin'), (req, res) => {
  const brand = db.data.brands.find((b) => b.id === req.params.id);
  if (!brand) return res.status(404).json({ error: 'Brand not found' });
  const { model } = req.body ?? {};
  if (!model) return res.status(400).json({ error: 'model required' });
  brand.models.push(model);
  db.save();
  res.json(brand);
});

export default router;
