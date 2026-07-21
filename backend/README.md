# Doorstep Backend API

The shared REST API for the Doorstep Two-Wheeler Service Platform. All four
clients (customer app, mechanic app, admin console, marketing site) connect to
it, so a single `Booking` entity flows across the whole platform.

**Node + Express + TypeScript**, JWT auth, **PostgreSQL** persistence, and
**Razorpay** payments. Runs with `tsx` — no build step.

## Prerequisites

- **PostgreSQL** running with a database the backend can reach. For local dev:

  ```bash
  createdb doorstep                 # or use an existing cluster
  psql -c "CREATE ROLE doorstep LOGIN PASSWORD 'doorstep'; ALTER DATABASE doorstep OWNER TO doorstep;"
  ```

  The default `DATABASE_URL` is `postgresql://doorstep:doorstep@localhost:5432/doorstep`.

## Run

```bash
npm install
npm start        # http://localhost:4000  (tsx src/index.ts)
npm run dev      # watch mode
npm run typecheck
```

Config via env (see `.env.example`): `PORT`, `JWT_SECRET`, `DEV_OTP`,
`DATABASE_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.

## Persistence (PostgreSQL)

On first run the backend creates its tables and seeds demo data; on subsequent
runs it loads the existing dataset (data survives restarts). Each collection is
a real table (`id TEXT PRIMARY KEY, doc JSONB`); the `bookings` table adds
generated columns so it's queryable with plain SQL:

```sql
SELECT doc->>'code' AS code, status, city FROM bookings WHERE status = 'booked';
```

The full dataset is held in memory for fast synchronous reads and written
through to Postgres (serialized) on every change — a pragmatic pattern for this
scale. `POST /api/dev/reset` restores the seed.

## Payments (Razorpay)

Two endpoints implement the standard Razorpay order → checkout → verify flow:

- `POST /api/payments/order` — creates a Razorpay order for a booking (amount =
  service + approved extras + 18% GST − discount, in paise).
- `POST /api/payments/verify` — verifies the returned
  `razorpay_signature` (HMAC-SHA256 of `order_id|payment_id` with the key
  secret) and marks the booking paid.

Set `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` to enable **live** payments. With
no keys the API runs in **mock mode**: orders are stubbed and verification is
accepted, so the flow works end-to-end without credentials (the client then
swaps the mock checkout for the real Razorpay SDK).

## Auth

| Who | How | Credentials (demo) |
|---|---|---|
| Customer / Mechanic | Mobile OTP — `POST /auth/otp/request` then `/auth/otp/verify` | any 10-digit phone; OTP `123456` (or any 6 digits) |
| Admin | `POST /auth/admin/login` | `admin@doorstepbike.example` / `admin123` |

Accounts are created on first OTP verify. New mechanics start `in_review` (gated
until an admin verifies them). Send the returned JWT as `Authorization: Bearer <token>`.

## Endpoints

```
GET   /api/health

# Auth
POST  /api/auth/otp/request            { phone }
POST  /api/auth/otp/verify             { phone, otp, role, name?, city? }
POST  /api/auth/admin/login            { email, password }
GET   /api/auth/me

# Catalog (services admin-managed; brands admin-managed)
GET   /api/services  ?active=&category=
POST  /api/services                    (admin)
PATCH /api/services/:id                (admin)
GET   /api/brands
POST  /api/brands                      (admin)
POST  /api/brands/:id/models           (admin)

# Customer garage
GET   /api/vehicles                    (customer)
POST  /api/vehicles                    (customer)
DELETE/api/vehicles/:id                (customer)

# Bookings — the shared entity
POST  /api/bookings                    (customer)  create
GET   /api/bookings  ?scope=available&status=&city=   role-aware listing
GET   /api/bookings/:id
POST  /api/bookings/:id/assign         (admin)     { mechanicId }
POST  /api/bookings/:id/accept         (mechanic)  self-accept an available job
POST  /api/bookings/:id/status         (mechanic)  { status }
PATCH /api/bookings/:id/checklist      (mechanic)  { itemId, done }
POST  /api/bookings/:id/extras         (mechanic)  { title, price }
DELETE/api/bookings/:id/extras/:extraId(mechanic)
POST  /api/bookings/:id/request-approval (mechanic)
POST  /api/bookings/:id/extras/:extraId/decision (customer) { approve }
POST  /api/bookings/:id/photo          (mechanic)  { kind: before|after }
POST  /api/bookings/:id/complete       (mechanic)
POST  /api/bookings/:id/pay            (customer)
POST  /api/bookings/:id/rate           (customer)  { rating }

# Mechanics
GET   /api/mechanics/me                (mechanic)
PATCH /api/mechanics/me                (mechanic)  { online }
GET   /api/mechanics/me/earnings       (mechanic)
GET   /api/mechanics                   (admin)
PATCH /api/mechanics/:id               (admin)     { verification }

# Payments (Razorpay)
GET   /api/payments/config             keyId + mode
POST  /api/payments/order              (customer)  { bookingId }
POST  /api/payments/verify             (customer)  { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature }

# Ops
POST  /api/promos/validate             { code }
GET   /api/coupons | POST | PATCH /:id  (admin)
GET   /api/plans | PATCH /:id           (plans public; admin toggle)
POST  /api/plans/:id/subscribe         (customer)
GET   /api/memberships/me              (customer)
GET   /api/disputes                    (admin)
POST  /api/disputes                    (customer/admin)
POST  /api/disputes/:id/action         (admin)
POST  /api/leads                       (public)    marketing forms
GET   /api/leads | PATCH /:id           (admin)
GET   /api/content | PATCH /:id         (admin)
GET   /api/analytics/dashboard         (admin)     computed KPIs & series
POST  /api/dev/reset                   reseed the store
```

## Structure

```
src/
  index.ts            # Express app + route wiring + startup (db.init)
  db.ts               # Postgres-backed store (tables + JSONB docs)
  seed.ts             # demo data + checklist templates
  auth.ts             # JWT sign/verify + role middleware
  types.ts            # domain model (API contract)
  util.ts             # ids, booking codes, GST helpers
  routes/             # auth, catalog, vehicles, bookings, mechanics, payments, ops
```

## Notes

Prices are stored **excluding** 18% GST; clients display GST-inclusive totals.
The in-memory-with-Postgres-write-through store is fine for this scale; for a
high-write production system, move to per-entity SQL writes behind the same
`db.data` / `db.save()` surface.
