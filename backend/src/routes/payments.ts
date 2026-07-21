import crypto from 'crypto';
import { Router } from 'express';
import Razorpay from 'razorpay';

import { AuthedRequest, requireAuth } from '../auth';
import { db } from '../db';
import { Booking } from '../types';
import { genId, withGst } from '../util';

const router = Router();

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const LIVE = Boolean(KEY_ID && KEY_SECRET);

const rzp = LIVE ? new Razorpay({ key_id: KEY_ID!, key_secret: KEY_SECRET! }) : null;

/** Amount payable for a booking, in paise (Razorpay's smallest unit). */
function amountPaise(b: Booking): number {
  const approvedExtras = b.extras
    .filter((e) => e.approved === 'approved')
    .reduce((s, e) => s + e.price, 0);
  const total = Math.max(0, withGst(b.basePrice + approvedExtras) - b.discount);
  return Math.max(100, total * 100);
}

/** Razorpay's documented signature: HMAC-SHA256(order_id|payment_id, key_secret). */
export function expectedSignature(orderId: string, paymentId: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
}

function ownBooking(req: AuthedRequest, id: string) {
  const b = db.data.bookings.find((x) => x.id === id);
  if (!b || b.customerId !== req.auth!.sub) return null;
  return b;
}

/** Create a payment order for a booking. */
router.post('/order', requireAuth('customer'), async (req: AuthedRequest, res) => {
  const b = ownBooking(req, req.body?.bookingId);
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  if (b.paid) return res.status(400).json({ error: 'Booking already paid' });

  const amount = amountPaise(b);
  try {
    let orderId: string;
    if (LIVE && rzp) {
      const order = await rzp.orders.create({ amount, currency: 'INR', receipt: b.code });
      orderId = order.id;
    } else {
      // Mock mode: no Razorpay keys / no outbound. Real order id shape mirrored.
      orderId = 'order_' + genId('mock').replace('mock-', '');
    }
    res.json({
      orderId,
      amount,
      currency: 'INR',
      keyId: KEY_ID ?? 'rzp_test_mock',
      bookingId: b.id,
      mock: !LIVE,
    });
  } catch (e) {
    res.status(502).json({ error: 'Could not create payment order', detail: (e as Error).message });
  }
});

/**
 * Verify a completed payment and mark the booking paid.
 * With live keys the Razorpay signature is verified; in mock mode the payment
 * is accepted so the flow is demonstrable without credentials.
 */
router.post('/verify', requireAuth('customer'), (req: AuthedRequest, res) => {
  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body ?? {};
  const b = ownBooking(req, bookingId);
  if (!b) return res.status(404).json({ error: 'Booking not found' });

  if (LIVE) {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment fields' });
    }
    const expected = expectedSignature(razorpay_order_id, razorpay_payment_id, KEY_SECRET!);
    const ok =
      expected.length === String(razorpay_signature).length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(razorpay_signature)));
    if (!ok) return res.status(400).json({ error: 'Payment signature verification failed' });
  }

  b.paid = true;
  b.updatedAt = new Date().toISOString();
  db.save();
  res.json({ ok: true, booking: b });
});

/** Public config for the client checkout (key id + mode). */
router.get('/config', (_req, res) => {
  res.json({ keyId: KEY_ID ?? 'rzp_test_mock', mock: !LIVE });
});

export default router;
