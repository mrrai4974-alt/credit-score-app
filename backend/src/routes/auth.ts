import { Router } from 'express';

import { AuthedRequest, requireAuth, signToken } from '../auth';
import { db } from '../db';
import { Mechanic, User } from '../types';
import { genId, nowIso } from '../util';

const router = Router();
const DEV_OTP = process.env.DEV_OTP || '123456';

/** Request an OTP. In dev we return it so the flow is testable end-to-end. */
router.post('/otp/request', (req, res) => {
  const { phone } = req.body ?? {};
  if (!phone || String(phone).replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'Valid 10-digit phone required' });
  }
  res.json({ requested: true, devOtp: DEV_OTP });
});

/** Verify OTP; creates the account on first login. */
router.post('/otp/verify', (req, res) => {
  const { phone, otp, role, name, city } = req.body ?? {};
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length < 10) return res.status(400).json({ error: 'Invalid phone' });
  // Accept the fixed dev OTP or any 6-digit code (demo).
  if (String(otp) !== DEV_OTP && !/^\d{6}$/.test(String(otp))) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }
  const wantRole = role === 'mechanic' ? 'mechanic' : 'customer';

  let user = db.data.users.find((u) => u.phone === digits && u.role === wantRole);
  if (!user) {
    user = {
      id: genId(wantRole === 'mechanic' ? 'u-mech' : 'u-cust'),
      role: wantRole,
      name: name || (wantRole === 'mechanic' ? 'New Mistri' : 'Rider'),
      phone: digits,
      city: city || 'Bengaluru',
      createdAt: nowIso(),
    };
    db.data.users.push(user);

    if (wantRole === 'mechanic') {
      const mech: Mechanic = {
        id: genId('m'),
        userId: user.id,
        name: user.name,
        phone: digits,
        city: user.city,
        verification: 'in_review',
        skills: ['General'],
        rating: 0,
        jobsCompleted: 0,
        utilization: 0,
        trainingComplete: 0,
        kycComplete: false,
        serviceRadiusKm: 8,
        online: false,
      };
      db.data.mechanics.push(mech);
    }
    db.save();
  }

  const token = signToken({ sub: user.id, role: user.role, name: user.name });
  res.json({ token, user: publicUser(user) });
});

/** Admin login with email + password. */
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body ?? {};
  const user = db.data.users.find(
    (u) => u.role === 'admin' && u.email === email && u.password === password,
  );
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken({ sub: user.id, role: user.role, name: user.name });
  res.json({ token, user: publicUser(user) });
});

/** Current session — includes the mechanic profile for mechanic users. */
router.get('/me', requireAuth(), (req: AuthedRequest, res) => {
  const user = db.data.users.find((u) => u.id === req.auth!.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const mechanic =
    user.role === 'mechanic'
      ? db.data.mechanics.find((m) => m.userId === user.id) ?? null
      : null;
  res.json({ user: publicUser(user), mechanic });
});

function publicUser(u: User) {
  const { password, ...rest } = u;
  void password;
  return rest;
}

export default router;
