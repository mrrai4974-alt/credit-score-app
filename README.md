# Doorstep Two-Wheeler Service Platform

This repository contains the full Doorstep Two-Wheeler Service Platform defined
in the BRD *(Doorstep Two-Wheeler Service Platform, v1.0)*: four client
applications plus a shared backend API. All clients share one platform brand and
one data source, covering the three-sided marketplace (customer, mechanic,
operations) plus the public marketing site.

| Component | Audience | Stack | BRD section | Location |
|---|---|---|---|---|
| **Backend API** | All clients | Node + Express + TS · PostgreSQL · Razorpay | §7 (shared) | [`backend/`](backend/) |
| **Bike Mistri** | Field mechanic ("mistri") / partner | Expo RN (Android/iOS/web) | §7.2 (FR-17 … FR-24) | repo root (this README) |
| **Doorstep Bike Service** | Customer / rider | Expo RN (Android/iOS/web) | §7.1 (FR-01 … FR-16) | [`customer-app/`](customer-app/) |
| **Doorstep Ops** | Admin / operations team | Vite + React (web) | §7.3 (FR-25 … FR-35) | [`admin-console/`](admin-console/) |
| **Marketing site** | Prospective customers & partners | Astro (static, SEO) | §5.1 | [`marketing-site/`](marketing-site/) |

Each component is self-contained with its own `package.json`; run `npm install`
inside its directory. READMEs:
[backend](backend/README.md) ·
[customer-app](customer-app/README.md) ·
[admin-console](admin-console/README.md) ·
[marketing-site](marketing-site/README.md).

## Connected architecture

All clients talk to the **one backend API**, so a single `Booking` entity flows
across the whole platform:

```
Customer app ──create booking──▶  ┌───────────────┐  ◀──assign / verify / resolve── Admin console
Mechanic app ──accept / update──▶ │  Backend API  │  ◀──lead capture──────────────── Marketing site
                                  │  (Express +   │
                                  │  JWT + store) │
                                  └───────────────┘
```

A booking created in the customer app immediately appears as an **Unassigned**
order in the admin console and in the mechanic's **available jobs**; as the
mechanic works it (en route → in service → complete) and the customer approves
extras, pays and rates, every client and the admin dashboard reflect the same
state. Marketing-site franchise/partner/callback forms POST leads that show up in
the admin pipeline.

Auth is JWT-based: customers and mechanics sign in with mobile OTP (dev OTP
`123456`), admins with email + password (`admin@doorstepbike.example` /
`admin123`). Data persists in **PostgreSQL**; **payments** run through Razorpay
(order → checkout → server-side signature verification), with a mock mode when
no keys are set. See [`backend/README.md`](backend/README.md) for the full
endpoint list, data model, and payment flow.

## Run the whole platform locally

```bash
# 0) PostgreSQL — the backend needs a database (default:
#    postgresql://doorstep:doorstep@localhost:5432/doorstep). See backend/README.

# 1) Backend — start first (clients default to http://localhost:4000/api)
cd backend && npm install && npm start        # http://localhost:4000

# 2) Admin console (web)
cd admin-console && npm install && npm run dev

# 3) Marketing site (web)
cd marketing-site && npm install && npm run dev

# 4) Customer app / 5) Mechanic app (Expo)
cd customer-app && npm install && npm run web  # or: npm start (Expo Go)
npm install && npm run web                     # mechanic app is at the repo root
```

On a physical device, set each app's API base to your machine's LAN IP via the
documented env var (`EXPO_PUBLIC_API_URL`, `VITE_API_URL`, `PUBLIC_API_URL`).
The backend seeds demo data on first run; `POST /api/dev/reset` restores it.

---

# Bike Mistri — Partner (Mechanic) App

A cross-platform mobile app for the **field mechanic ("mistri")** of the
Doorstep Two-Wheeler Service Platform described in the BRD
*(Doorstep Two-Wheeler Service Platform, v1.0)*. It is the partner-facing
client from **BRD section 7.2 (FR-17 … FR-24)** — the app a verified mechanic
uses to receive doorstep jobs, run the service checklist, get customer approval
for extra work, capture proof, and track earnings.

Built with **Expo + React Native + TypeScript**, so a single codebase runs on
Android, iOS, and web.

## What's implemented

| BRD ref | Feature | Where |
|---|---|---|
| FR-17 | Partner registration with document/skill verification + a "verified mechanic" gate | `screens/auth/RegisterScreen`, `VerificationPendingScreen` |
| FR-18 | Job queue — view, accept, or decline jobs within a service radius; online/offline toggle | `screens/jobs/JobsScreen`, `components/JobCard` |
| FR-19 | Navigation to the customer + status updates (accepted → en route → arrived → in service → completed) | `screens/jobs/JobDetailScreen` |
| FR-20 | Digital service checklist per package (points vary by service tier) | `JobDetailScreen` checklist section |
| FR-21 / FR-09 | Log additional issues, propose cost, and trigger the customer approval flow — **no billing without approval** | `JobDetailScreen` additional-issues section |
| FR-22 | Before/after photos + customer confirmation on completion | `JobDetailScreen` proof-of-service + complete |
| FR-23 | Earnings, payout schedule, and incentive tracking | `screens/earnings/EarningsScreen` |
| FR-24 | Training/certification modules with renewal reminders | `screens/training/TrainingScreen` |

Pricing follows the reference catalog in the BRD (INR, **18% GST** shown
explicitly), reflecting the platform's transparent-pricing pillar.

## Project structure

```
App.tsx                     # Root: providers + navigation
src/
  theme/theme.ts            # Design tokens (colors, spacing, type)
  types/                    # Domain types (Job, Mechanic, …)
  data/mockData.ts          # Seed jobs, earnings, training, catalog prices
  utils/format.ts           # ₹ + GST helpers
  context/AppContext.tsx    # App-wide state & job workflow actions
  components/               # Reusable UI (Card, Button, Badge, JobCard, …)
  screens/
    auth/                   # Login, Register, Verification-pending
    jobs/                   # Jobs list + Job detail workflow
    earnings/               # Earnings & payouts
    training/               # Training & certifications
    profile/                # Partner profile
  navigation/               # Root / tabs / jobs stack
```

## Running

```bash
npm install
npm start        # Expo dev server — scan the QR with Expo Go
# or:
npm run android  # Android emulator/device
npm run ios      # iOS simulator (macOS)
npm run web      # run in a browser
npm run typecheck
```

> No backend is required. State lives in `AppContext` and is seeded from
> `src/data/mockData.ts` so the whole flow is explorable end-to-end.

## Try the full flow

1. **Login** with any 10-digit number → tap *Send OTP* → *Verify* (demo
   accepts any OTP). Or tap **Become a partner** to see the KYC/verification
   onboarding and the "under review" gate.
2. On **Jobs**, make sure you're *Online*, then **Accept** a new request.
3. Open the job → *Start ride* → *I've arrived* → *Start service*.
4. Tick off the **checklist**, add an **additional issue**, then *Request
   customer approval* and simulate the customer's response.
5. Add **before/after** photos, then **Complete job** to collect confirmation.
6. Check **Earnings** and **Training** tabs.

## Scope notes

This deliverable is the **mechanic/partner app** only. The customer app,
admin/ops console, and marketing site (other sections of the BRD) are separate
clients on the same platform and are out of scope here. Photo capture, OTP,
maps, and payouts are wired as demo interactions (deep-link to maps is real);
they are the integration points for the production build.
