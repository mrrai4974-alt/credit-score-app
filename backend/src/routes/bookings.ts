import { Router } from 'express';

import { AuthedRequest, requireAuth } from '../auth';
import { db } from '../db';
import { checklistFor } from '../seed';
import { Booking, BookingStatus, ExtraItem } from '../types';
import { genBookingCode, genId, nowIso } from '../util';

const router = Router();

const touch = (b: Booking) => {
  b.updatedAt = nowIso();
  db.save();
};

/* ------------------------------------------------------------- Create (customer) */

router.post('/', requireAuth('customer'), (req: AuthedRequest, res) => {
  const { serviceId, vehicleId, slot, address, paymentMethod, promoCode, discount } = req.body ?? {};
  const service = db.data.services.find((s) => s.id === serviceId);
  const vehicle = db.data.vehicles.find(
    (v) => v.id === vehicleId && v.customerId === req.auth!.sub,
  );
  const user = db.data.users.find((u) => u.id === req.auth!.sub)!;
  if (!service) return res.status(400).json({ error: 'Invalid service' });
  if (!vehicle) return res.status(400).json({ error: 'Invalid vehicle' });

  const membership = db.data.memberships.find((m) => m.customerId === user.id);
  const plan = db.data.plans.find((p) => p.id === membership?.planId);

  const booking: Booking = {
    id: genId('bk'),
    code: genBookingCode(),
    status: 'booked',
    customerId: user.id,
    customerName: user.name,
    mechanicId: null,
    mechanicName: null,
    serviceId: service.id,
    serviceName: service.name,
    category: service.category,
    basePrice: service.price ?? 0,
    inspectionPoints: service.inspectionPoints,
    estimatedDurationMin: service.durationMin,
    vehicle: `${vehicle.brand} ${vehicle.model}`,
    city: user.city,
    address: address || user.city,
    slot: slot || 'Next available',
    checklist: checklistFor(service.category),
    extras: [],
    beforePhoto: false,
    afterPhoto: false,
    paymentMethod: paymentMethod === 'cod' ? 'cod' : 'online',
    paid: paymentMethod === 'online',
    promoCode: promoCode || undefined,
    discount: Number(discount) || 0,
    warrantyDays: plan ? plan.warrantyDays : 10,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  db.data.bookings.unshift(booking);
  db.save();
  res.status(201).json(booking);
});

/* ------------------------------------------------------------- List (role-aware) */

router.get('/', requireAuth(), (req: AuthedRequest, res) => {
  const { role, sub } = req.auth!;
  let list = db.data.bookings;

  if (role === 'customer') {
    list = list.filter((b) => b.customerId === sub);
  } else if (role === 'mechanic') {
    const mech = db.data.mechanics.find((m) => m.userId === sub);
    if (!mech) return res.json([]);
    if (req.query.scope === 'available') {
      // Unassigned jobs in the mechanic's city, offered to accept.
      list = list.filter((b) => b.status === 'booked' && !b.mechanicId && b.city === mech.city);
    } else {
      list = list.filter((b) => b.mechanicId === mech.id);
    }
  } else if (req.query.city && req.query.city !== 'All cities') {
    list = list.filter((b) => b.city === req.query.city);
  }

  if (req.query.status) list = list.filter((b) => b.status === req.query.status);
  res.json(list);
});

router.get('/:id', requireAuth(), (req, res) => {
  const b = db.data.bookings.find((x) => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  res.json(b);
});

/* ------------------------------------------------------------- Dispatch / assignment */

// Admin assigns or reassigns a mechanic.
router.post('/:id/assign', requireAuth('admin'), (req, res) => {
  const b = find(req.params.id, res);
  if (!b) return;
  const mech = db.data.mechanics.find((m) => m.id === req.body?.mechanicId);
  if (!mech) return res.status(400).json({ error: 'Invalid mechanic' });
  b.mechanicId = mech.id;
  b.mechanicName = mech.name;
  if (b.status === 'booked') b.status = 'assigned';
  touch(b);
  res.json(b);
});

// Mechanic self-accepts an available job.
router.post('/:id/accept', requireAuth('mechanic'), (req: AuthedRequest, res) => {
  const b = find(req.params.id, res);
  if (!b) return;
  const mech = db.data.mechanics.find((m) => m.userId === req.auth!.sub);
  if (!mech) return res.status(403).json({ error: 'No mechanic profile' });
  if (b.mechanicId && b.mechanicId !== mech.id) {
    return res.status(409).json({ error: 'Job already assigned' });
  }
  b.mechanicId = mech.id;
  b.mechanicName = mech.name;
  b.status = 'assigned';
  touch(b);
  res.json(b);
});

/* ------------------------------------------------------------- Status transitions */

const FLOW: BookingStatus[] = ['assigned', 'en_route', 'in_service', 'completed'];

router.post('/:id/status', requireAuth('mechanic', 'admin'), (req: AuthedRequest, res) => {
  const b = mine(req, res);
  if (!b) return;
  const next = req.body?.status as BookingStatus;
  if (!FLOW.includes(next) && next !== 'cancelled') {
    return res.status(400).json({ error: 'Invalid status' });
  }
  b.status = next;
  touch(b);
  res.json(b);
});

router.patch('/:id/checklist', requireAuth('mechanic'), (req: AuthedRequest, res) => {
  const b = mine(req, res);
  if (!b) return;
  const item = b.checklist.find((c) => c.id === req.body?.itemId);
  if (!item) return res.status(404).json({ error: 'Checklist item not found' });
  item.done = req.body?.done ?? !item.done;
  touch(b);
  res.json(b);
});

/* ------------------------------------------------------------- Extras & approval */

router.post('/:id/extras', requireAuth('mechanic'), (req: AuthedRequest, res) => {
  const b = mine(req, res);
  if (!b) return;
  const { title, price } = req.body ?? {};
  if (!title || !price) return res.status(400).json({ error: 'title and price required' });
  const extra: ExtraItem = { id: genId('x'), title, price: Number(price), approved: 'pending' };
  b.extras.push(extra);
  touch(b);
  res.json(b);
});

router.delete('/:id/extras/:extraId', requireAuth('mechanic'), (req: AuthedRequest, res) => {
  const b = mine(req, res);
  if (!b) return;
  b.extras = b.extras.filter((e) => e.id !== req.params.extraId);
  touch(b);
  res.json(b);
});

router.post('/:id/request-approval', requireAuth('mechanic'), (req: AuthedRequest, res) => {
  const b = mine(req, res);
  if (!b) return;
  if (b.extras.some((e) => e.approved === 'pending')) b.status = 'awaiting_approval';
  touch(b);
  res.json(b);
});

// Customer approves/rejects a proposed extra.
router.post('/:id/extras/:extraId/decision', requireAuth('customer'), (req: AuthedRequest, res) => {
  const b = find(req.params.id, res);
  if (!b) return;
  if (b.customerId !== req.auth!.sub) return res.status(403).json({ error: 'Not your booking' });
  const extra = b.extras.find((e) => e.id === req.params.extraId);
  if (!extra) return res.status(404).json({ error: 'Extra not found' });
  extra.approved = req.body?.approve ? 'approved' : 'rejected';
  if (!b.extras.some((e) => e.approved === 'pending')) b.status = 'in_service';
  touch(b);
  res.json(b);
});

router.post('/:id/photo', requireAuth('mechanic'), (req: AuthedRequest, res) => {
  const b = mine(req, res);
  if (!b) return;
  if (req.body?.kind === 'before') b.beforePhoto = true;
  if (req.body?.kind === 'after') b.afterPhoto = true;
  touch(b);
  res.json(b);
});

router.post('/:id/complete', requireAuth('mechanic'), (req: AuthedRequest, res) => {
  const b = mine(req, res);
  if (!b) return;
  b.status = 'completed';
  const mech = db.data.mechanics.find((m) => m.id === b.mechanicId);
  if (mech) mech.jobsCompleted += 1;
  touch(b);
  res.json(b);
});

/* ------------------------------------------------------------- Payment & rating (customer) */

router.post('/:id/pay', requireAuth('customer'), (req: AuthedRequest, res) => {
  const b = find(req.params.id, res);
  if (!b) return;
  if (b.customerId !== req.auth!.sub) return res.status(403).json({ error: 'Not your booking' });
  b.paid = true;
  touch(b);
  res.json(b);
});

router.post('/:id/rate', requireAuth('customer'), (req: AuthedRequest, res) => {
  const b = find(req.params.id, res);
  if (!b) return;
  if (b.customerId !== req.auth!.sub) return res.status(403).json({ error: 'Not your booking' });
  b.rating = Math.max(1, Math.min(5, Number(req.body?.rating) || 5));
  touch(b);
  res.json(b);
});

/* --------------------------------------------------------------------- helpers */

function find(id: string, res: import('express').Response): Booking | undefined {
  const b = db.data.bookings.find((x) => x.id === id);
  if (!b) {
    res.status(404).json({ error: 'Booking not found' });
    return undefined;
  }
  return b;
}

/** Booking the caller is allowed to mutate (mechanic must own it; admin any). */
function mine(req: AuthedRequest, res: import('express').Response): Booking | undefined {
  const b = find(req.params.id, res);
  if (!b) return undefined;
  if (req.auth!.role === 'admin') return b;
  const mech = db.data.mechanics.find((m) => m.userId === req.auth!.sub);
  if (!mech || b.mechanicId !== mech.id) {
    res.status(403).json({ error: 'Not your job' });
    return undefined;
  }
  return b;
}

export default router;
