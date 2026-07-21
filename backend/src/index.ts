import cors from 'cors';
import express from 'express';

import { parseAuth } from './auth';
import { db } from './db';
import authRoutes from './routes/auth';
import bookingRoutes from './routes/bookings';
import catalogRoutes from './routes/catalog';
import mechanicRoutes from './routes/mechanics';
import opsRoutes from './routes/ops';
import paymentRoutes from './routes/payments';
import vehicleRoutes from './routes/vehicles';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());
app.use(parseAuth);

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, service: 'doorstep-backend', time: new Date().toISOString() }),
);

app.use('/api/auth', authRoutes);
app.use('/api', catalogRoutes); // /api/services, /api/brands
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', opsRoutes); // /api/promos, /api/coupons, /api/plans, /api/disputes, /api/leads, /api/content, /api/analytics

// Dev helper: reset the store to its seed state.
app.post('/api/dev/reset', (_req, res) => {
  db.reset();
  res.json({ ok: true, reset: true });
});

// 404 + error handlers
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function main() {
  await db.init();
  const server = app.listen(PORT, () => {
    console.log(`Doorstep backend listening on http://localhost:${PORT}`);
  });

  const shutdown = async () => {
    await db.flush();
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((e) => {
  console.error('Failed to start backend:', e);
  process.exit(1);
});
