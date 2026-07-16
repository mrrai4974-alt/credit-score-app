# GoodCredit — Credit Score & Financial Health App

A mobile-first credit score app modelled on **GoodScore**, built with
**React Native (Expo) + TypeScript**. Users check and understand their credit
score, get a personalised plan to improve it, track loans & EMIs, raise
disputes, pay bills, and talk to experts — all in one app.

It ships with a fully working **mock credit bureau** so it runs end-to-end with
no backend, and is **structured to plug into a real bureau** (CIBIL / Experian /
Equifax / CRIF) by changing configuration, not code.

> Built to the [Business Requirements Document](#brd-coverage) for a
> GoodScore-style platform.

---

## Features

| Area | What's included |
|------|-----------------|
| **Onboarding** | Mobile + OTP login, KYC-lite (name/PAN), explicit & revocable bureau-data consent |
| **Score** | 300–900 gauge, month-on-month change, 12-month trend chart |
| **Report** | Score-factor breakdown, account-level detail (cards & loans), enquiries, **fraud/error flagging** |
| **Improve** | Personalised, impact-ranked step-by-step plan with a projected-score simulator |
| **Loans & EMIs** | Portfolio summary, due-date reminders, overdue alerts, autopay toggles, **loan savings calculator** |
| **Offers** | Pre-approved card & loan offers filtered by the user's score |
| **Disputes** | File disputes and track status (Submitted → Under Review → Resolved) |
| **Advisory** | Expert consultation booking + 24×7 chat support |
| **Pay & Rewards** | BBPS-style bill pay, recharge, cashback/rewards |
| **Notifications** | Score, payment, offer, enquiry & dispute alerts |

---

## Getting started

```bash
npm install
npx expo start
```

Then press `i` (iOS simulator), `a` (Android emulator), or scan the QR code
with **Expo Go** on your phone.

> Requires Node 18+ and the Expo tooling. The app runs on the built-in mock
> bureau out of the box — sign in with any name and 10-digit number; the OTP is
> shown on screen in demo mode.

### Type-check

```bash
npx tsc --noEmit
```

---

## Architecture

```
App.tsx                     Providers (Auth → Credit → Dispute) + NavigationContainer
src/
  config/env.ts             Reads runtime config from expo-constants
  theme/                    Design tokens (colors, spacing, score bands, type)
  components/               Reusable UI: Screen, ScoreGauge, ScoreHistoryChart, ui kit
  context/
    AuthContext.tsx         OTP auth flow + persisted session (AsyncStorage)
    CreditContext.tsx       Fetches & caches the credit report; pull-to-refresh
    DisputeContext.tsx      In-session dispute tracking
  navigation/               Root stack (auth vs. app) + 5-tab bottom navigator
  screens/                  Dashboard, Report, Loans, Pay, More + detail screens
  services/
    bureau/                 Bureau abstraction (see below)
    appData.ts              Non-bureau fixtures (bills, rewards, notifications)
  utils/format.ts           Rupee / date / relative-time formatting
```

Custom SVG (via `react-native-svg`) powers the **score gauge** and **history
chart** — no heavyweight chart dependency.

---

## Connecting a real credit bureau

The app never names a concrete bureau. Every provider implements one interface:

```ts
interface BureauClient {
  readonly provider: BureauProvider;
  fetchReport(subject: BureauSubject): Promise<CreditReport>;
}
```

- `MockBureauClient` — deterministic demo data (default).
- `HttpBureauClient` — talks to an HTTP endpoint and maps the response onto the
  app's `CreditReport` model.

`getBureauClient()` (in `src/services/bureau/index.ts`) returns the configured
client based on `env`. Screens only ever call `getBureauClient()`.

### Going live

1. Stand up a backend endpoint `POST /credit/report` that accepts a KYC subject
   and calls the bureau server-to-server (keep bureau credentials on the
   backend — **never in the app bundle**).
2. Map the bureau's raw payload to the app's `CreditReport` shape. If your
   backend already returns that shape, no client changes are needed; otherwise
   edit `mapResponse` in `src/services/bureau/HttpBureauClient.ts`.
3. Configure the environment:

   ```bash
   cp .env.example .env
   # set BUREAU_PROVIDER=experian and BUREAU_BASE_URL=https://api.yourbackend.com
   ```

`app.config.js` injects these into `expo.extra`, read by `src/config/env.ts`.

---

## BRD coverage

Phase-1 MVP items are implemented as interactive UI on mock data; items needing
external rails (BBPS, payment gateway, live agents, video generation) are built
as clearly-marked integration points.

- **6.1 Onboarding** — mobile+OTP, KYC-lite, consent capture & withdrawal ✅
- **6.2 Score & report** — FR-1…FR-5 (score, trend, factors, full report, error/fraud flags) ✅
- **6.3 Advisory** — FR-6 credit story, FR-7 improvement plan, FR-8 consultation, FR-9 chat, FR-10 disputes ✅
- **6.4 Loans** — FR-11…FR-16 (aggregation, reminders, autopay, overdue, offers, savings calculator) ✅
- **6.5 Bill pay & rewards** — FR-17…FR-19 (bills, recharge, rewards); FR-20 UPI is Phase 2 ✅
- **6.6 Notifications** — FR-21…FR-23 (score, payment, offer/enquiry alerts) ✅

---

## Notes & disclaimers

This is a functional prototype. Bureau data, payments, chat, consultations and
notifications are simulated. Before production use, integrate a licensed bureau,
a PCI-DSS-compliant payment gateway (BBPS/UPI), real auth/SMS, secure storage,
and complete the compliance work (data consent, grievance redressal) outlined
in the BRD.
