# Doorstep Bike Service — Customer App

The **customer/rider-facing** mobile app for the Doorstep Two-Wheeler Service
Platform — the client from **BRD section 7.1 (FR-01 … FR-16)**. Riders discover
services for their exact bike, book a doorstep slot at transparent (GST-inclusive)
pricing, track the mechanic in real time, approve any extra work, pay, and rate.

Built with **Expo + React Native + TypeScript**; one codebase runs on Android,
iOS, and web. It shares the platform brand with the [Bike Mistri partner
app](../README.md).

## What's implemented

| BRD ref | Feature | Where |
|---|---|---|
| FR-01 | Mobile-OTP login + **guest browsing** | `screens/auth/LoginScreen`, `navigation/RootNavigator` |
| FR-02 | **My Garage** — add/manage vehicles (brand, model, registration) | `screens/account/GarageScreen`, inline in booking |
| FR-03 | Browse services by category (EV, General, Premium, Brand-specific, Special) | `screens/home/ServiceListScreen` |
| FR-04 | Service price (base + GST), duration, inspection-point count before booking | `screens/home/ServiceDetailScreen` |
| FR-05 | **Service Finder** — city/neighbourhood serviceability | `screens/home/HomeScreen` (city picker) |
| FR-06 | Book: vehicle, service, slot, address, payment | `screens/home/BookingScreen` |
| FR-07 | **Quick Help** callback (5-min advisor SLA) | `HomeScreen` callback card |
| FR-08 | Real-time order tracking timeline + status | `screens/bookings/TrackingScreen` |
| FR-09 | In-app **approval** of additional repairs, itemised | `TrackingScreen` approval flow |
| FR-10 | Online / pay-after payment + GST invoice | `BookingScreen`, `TrackingScreen` |
| FR-11 | Ratings & reviews + per-job warranty status | `TrackingScreen` |
| FR-12 | Membership/subscription plans & entitlements | `screens/membership/MembershipScreen` |
| FR-13 | Promo code entry & discount at checkout | `BookingScreen` |
| FR-14 | Support — call, WhatsApp, chat + FAQs | `screens/account/SupportScreen` |
| FR-15 | Referral program — share code & track rewards | `screens/account/ReferralScreen` |
| FR-16 | Static content — brand/model directory, FAQs | `data/catalog.ts`, `SupportScreen` |

Catalog and pricing follow **Appendix A** of the BRD (INR, 18% GST shown
explicitly). Excluded doorstep services (puncture/tyre/tube/wheel alignment) are
surfaced per the BRD scope boundary.

## Project structure

```
App.tsx                     # Root: providers + navigation
src/
  theme/theme.ts            # Design tokens (shared brand)
  types/                    # Domain types (Service, Booking, Vehicle, …)
  data/catalog.ts           # Services, brands, cities, plans, promos, seeds
  utils/format.ts           # ₹ + GST helpers
  context/AppContext.tsx    # Auth, garage, bookings, membership, booking flow
  components/               # Reusable UI (Card, Button, ServiceRow, …)
  screens/
    auth/                   # Login / guest
    home/                   # Discovery + booking flow
    bookings/               # List + live tracking / approval / rating
    membership/             # Plans
    account/                # Account, garage, referral, support
  navigation/               # Root / tabs / per-tab stacks
```

## Running

```bash
npm install
npm start        # Expo dev server — scan the QR with Expo Go
npm run android  # / npm run ios / npm run web
npm run typecheck
```

> No backend required. State lives in `AppContext`, seeded from
> `src/data/catalog.ts`, so the whole journey works end-to-end.

## Try the full journey

1. **Login** with any 10-digit number and OTP, or tap **Browse as guest**.
2. On **Home**, change your **city**, pick a **category** (or a popular
   service), and open a service to see transparent pricing.
3. **Book** — choose vehicle (or add one), a slot, address, apply promo
   `FIRST100`, pick payment → confirm.
4. Go to **Bookings → your booking**: tap *Simulate next step* to move
   booked → assigned → en route → in service.
5. In service, tap *mechanic finds an extra issue* → **approve/decline** it.
6. Advance to completed → **pay**, **download invoice**, and **rate** the
   mechanic; see the warranty timer start.
7. Explore **Membership**, **Refer & Earn**, and **Help & Support**.
