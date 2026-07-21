import { Router } from 'express';

import { AuthedRequest, requireAuth } from '../auth';
import { db } from '../db';
import { Coupon, Dispute, Lead } from '../types';
import { genId, gstAmount, nowIso, withGst } from '../util';

const router = Router();

/* ------------------------------------------------------------- Promos / coupons */

router.post('/promos/validate', (req, res) => {
  const code = String(req.body?.code ?? '').trim().toUpperCase();
  const c = db.data.coupons.find((x) => x.code === code && x.active);
  if (!c) return res.status(404).json({ valid: false, error: 'Invalid or expired code' });
  const value = c.type === 'flat' ? c.value : c.value; // % handled client-side against cart
  res.json({ valid: true, code: c.code, type: c.type, value, cap: c.cap });
});

router.get('/coupons', requireAuth('admin'), (_req, res) => res.json(db.data.coupons));

router.post('/coupons', requireAuth('admin'), (req, res) => {
  const { code, type, value, cap, limit, expiry } = req.body ?? {};
  if (!code || !value) return res.status(400).json({ error: 'code and value required' });
  const coupon: Coupon = {
    id: genId('c'),
    code: String(code).toUpperCase(),
    type: type === 'percent' ? 'percent' : 'flat',
    value: Number(value),
    cap: cap ? Number(cap) : undefined,
    uses: 0,
    limit: Number(limit) || 1000,
    expiry: expiry || '31 Dec 2026',
    active: true,
  };
  db.data.coupons.unshift(coupon);
  db.save();
  res.status(201).json(coupon);
});

router.patch('/coupons/:id', requireAuth('admin'), (req, res) => {
  const c = db.data.coupons.find((x) => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  if (typeof req.body?.active === 'boolean') c.active = req.body.active;
  db.save();
  res.json(c);
});

/* --------------------------------------------------------------- Plans / membership */

router.get('/plans', (_req, res) => res.json(db.data.plans));

router.patch('/plans/:id', requireAuth('admin'), (req, res) => {
  const p = db.data.plans.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  if (typeof req.body?.active === 'boolean') p.active = req.body.active;
  db.save();
  res.json(p);
});

router.post('/plans/:id/subscribe', requireAuth('customer'), (req: AuthedRequest, res) => {
  const plan = db.data.plans.find((x) => x.id === req.params.id);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  const existing = db.data.memberships.find((m) => m.customerId === req.auth!.sub);
  if (existing) existing.planId = plan.id;
  else db.data.memberships.push({ customerId: req.auth!.sub, planId: plan.id });
  db.save();
  res.json({ ok: true, planId: plan.id });
});

router.get('/memberships/me', requireAuth('customer'), (req: AuthedRequest, res) => {
  const m = db.data.memberships.find((x) => x.customerId === req.auth!.sub);
  res.json({ planId: m?.planId ?? null });
});

/* --------------------------------------------------------------------- Disputes */

router.get('/disputes', requireAuth('admin'), (_req, res) => res.json(db.data.disputes));

router.post('/disputes', requireAuth('customer', 'admin'), (req: AuthedRequest, res) => {
  const { bookingCode, type, amount, summary, customer } = req.body ?? {};
  const dispute: Dispute = {
    id: genId('d'),
    bookingCode: bookingCode || '—',
    customer: customer || req.auth!.name,
    type: type ?? 'quality',
    status: 'open',
    amount: Number(amount) || 0,
    opened: 'just now',
    summary: summary || 'Customer raised a dispute.',
    audit: [{ time: 'just now', actor: customer || req.auth!.name, action: 'Dispute raised' }],
  };
  db.data.disputes.unshift(dispute);
  db.save();
  res.status(201).json(dispute);
});

router.post('/disputes/:id/action', requireAuth('admin'), (req: AuthedRequest, res) => {
  const d = db.data.disputes.find((x) => x.id === req.params.id);
  if (!d) return res.status(404).json({ error: 'Not found' });
  const { status, action } = req.body ?? {};
  if (status) d.status = status;
  d.audit.unshift({ time: 'just now', actor: `Ops · ${req.auth!.name}`, action: action || `Marked ${status}` });
  db.save();
  res.json(d);
});

/* ----------------------------------------------------------------------- Leads */

router.post('/leads', (req, res) => {
  const { name, phone, city, type, detail } = req.body ?? {};
  if (!name || !phone) return res.status(400).json({ error: 'name and phone required' });
  const lead: Lead = {
    id: genId('l'),
    name,
    phone: String(phone),
    city: city || '—',
    type: type ?? 'Callback',
    detail: detail || '',
    stage: 'new',
    submittedAt: nowIso(),
  };
  db.data.leads.unshift(lead);
  db.save();
  res.status(201).json({ ok: true, id: lead.id });
});

router.get('/leads', requireAuth('admin'), (_req, res) => res.json(db.data.leads));

router.patch('/leads/:id', requireAuth('admin'), (req, res) => {
  const l = db.data.leads.find((x) => x.id === req.params.id);
  if (!l) return res.status(404).json({ error: 'Not found' });
  if (req.body?.stage) l.stage = req.body.stage;
  db.save();
  res.json(l);
});

/* --------------------------------------------------------------------- Content */

router.get('/content', requireAuth('admin'), (_req, res) => res.json(db.data.content));

router.patch('/content/:id', requireAuth('admin'), (req, res) => {
  const c = db.data.content.find((x) => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  if (req.body?.status) {
    c.status = req.body.status;
    c.updated = 'just now';
  }
  db.save();
  res.json(c);
});

/* --------------------------------------------------------------------- Analytics */

router.get('/analytics/dashboard', requireAuth('admin'), (_req, res) => {
  const bookings = db.data.bookings;
  const completed = bookings.filter((b) => b.status === 'completed');
  const revenue = completed.reduce(
    (s, b) => s + withGst(b.basePrice + b.extras.filter((e) => e.approved === 'approved').reduce((a, e) => a + e.price, 0)),
    0,
  );
  const rated = completed.filter((b) => b.rating);
  const avgRating = rated.length
    ? (rated.reduce((s, b) => s + (b.rating ?? 0), 0) / rated.length).toFixed(1)
    : '—';

  const byCity = groupCount(bookings.map((b) => b.city));
  const byCategory = groupCount(bookings.map((b) => b.category));
  const verified = db.data.mechanics.filter((m) => m.verification === 'verified');
  const avgUtil = verified.length
    ? Math.round(verified.reduce((s, m) => s + m.utilization, 0) / verified.length)
    : 0;

  res.json({
    kpis: {
      bookings: bookings.length,
      revenue,
      revenueGst: gstAmount(revenue / 1.18),
      avgRating,
      openOrders: bookings.filter((b) => !['completed', 'cancelled'].includes(b.status)).length,
      unassigned: bookings.filter((b) => b.status === 'booked' && !b.mechanicId).length,
    },
    byCity: toSeries(byCity),
    byCategory: toSeries(byCategory),
    mechanics: { total: verified.length, avgUtilization: avgUtil },
    openDisputes: db.data.disputes.filter((d) => d.status === 'open' || d.status === 'investigating').length,
  });
});

function groupCount(items: string[]): Record<string, number> {
  return items.reduce((acc, k) => ((acc[k] = (acc[k] ?? 0) + 1), acc), {} as Record<string, number>);
}
function toSeries(m: Record<string, number>) {
  return Object.entries(m)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export default router;
