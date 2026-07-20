# Doorstep Backend API

The shared REST API for the Doorstep Two-Wheeler Service Platform. All four
clients (customer app, mechanic app, admin console, marketing site) connect to
it, so a single `Booking` entity flows across the whole platform.

**Node + Express + TypeScript**, JWT auth, and a JSON-file store behind a
storage-agnostic repository (swappable for Postgres/Prisma without touching the
route handlers). Runs with `tsx` — no build step.

## Run

```bash
npm install
npm start        # http://localhost:4000  (tsx src/index.ts)
npm run dev      # watch mode
npm run typecheck
```

Config via env (see `.env.example`): `PORT`, `JWT_SECRET`, `DEV_OTP`. The store
seeds demo data on first run into `data/db.json` (git-ignored). `POST /api/dev/reset`
restores the seed.

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
  index.ts            # Express app + route wiring
  db.ts               # JSON-file store (data/db.json)
  seed.ts             # demo data + checklist templates
  auth.ts             # JWT sign/verify + role middleware
  types.ts            # domain model (API contract)
  util.ts             # ids, booking codes, GST helpers
  routes/             # auth, catalog, vehicles, bookings, mechanics, ops
```

## Notes

Prices are stored **excluding** 18% GST; clients display GST-inclusive totals.
The store is single-process in-memory-with-persistence — fine for development and
demos. For production, replace `db.ts` with a real database behind the same
`db.data` / `db.save()` surface.
