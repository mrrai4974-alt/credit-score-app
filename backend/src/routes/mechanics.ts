import { Router } from 'express';

import { AuthedRequest, requireAuth } from '../auth';
import { db } from '../db';
import { withGst } from '../util';

const router = Router();

/* ------------------------------------------------------------- Mechanic self */

router.get('/me', requireAuth('mechanic'), (req: AuthedRequest, res) => {
  const mech = db.data.mechanics.find((m) => m.userId === req.auth!.sub);
  if (!mech) return res.status(404).json({ error: 'Mechanic profile not found' });
  res.json(mech);
});

router.patch('/me', requireAuth('mechanic'), (req: AuthedRequest, res) => {
  const mech = db.data.mechanics.find((m) => m.userId === req.auth!.sub);
  if (!mech) return res.status(404).json({ error: 'Mechanic profile not found' });
  if (typeof req.body?.online === 'boolean') mech.online = req.body.online;
  db.save();
  res.json(mech);
});

/** Earnings derived from the mechanic's completed bookings. */
router.get('/me/earnings', requireAuth('mechanic'), (req: AuthedRequest, res) => {
  const mech = db.data.mechanics.find((m) => m.userId === req.auth!.sub);
  if (!mech) return res.status(404).json({ error: 'Mechanic profile not found' });
  const completed = db.data.bookings.filter(
    (b) => b.mechanicId === mech.id && b.status === 'completed',
  );
  // Mechanic payout modelled as 65% of the GST-inclusive service value.
  const entries = completed.map((b) => ({
    id: b.id,
    jobCode: b.code,
    service: b.serviceName,
    amount: Math.round(withGst(b.basePrice) * 0.65),
    date: b.updatedAt.slice(0, 10),
    status: b.paid ? 'paid' : 'pending',
  }));
  const paid = entries.filter((e) => e.status === 'paid').reduce((s, e) => s + e.amount, 0);
  const pending = entries.filter((e) => e.status === 'pending').reduce((s, e) => s + e.amount, 0);
  res.json({ entries, paid, pending });
});

/* ------------------------------------------------------------- Admin management */

router.get('/', requireAuth('admin'), (req, res) => {
  let list = db.data.mechanics;
  if (req.query.city && req.query.city !== 'All cities') {
    list = list.filter((m) => m.city === req.query.city);
  }
  res.json(list);
});

router.patch('/:id', requireAuth('admin'), (req, res) => {
  const mech = db.data.mechanics.find((m) => m.id === req.params.id);
  if (!mech) return res.status(404).json({ error: 'Mechanic not found' });
  const { verification } = req.body ?? {};
  if (verification) mech.verification = verification;
  db.save();
  res.json(mech);
});

export default router;
