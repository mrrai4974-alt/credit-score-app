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
