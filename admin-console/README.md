# Doorstep Ops — Admin / Operations Console

The **admin/operations web console** for the Doorstep Two-Wheeler Service
Platform — the back-office client from **BRD section 7.3 (FR-25 … FR-35)**.
Operations teams use it to run city operations, manage the mechanic network and
service catalog, dispatch and monitor orders against SLA, handle disputes, and
drive growth (franchise, memberships, promotions) and marketing content.

Built with **Vite + React + TypeScript** — a fast single-page web app. Charts are
dependency-free inline SVG following the platform's data-viz method (single-hue
magnitude marks, recessive grid, hover tooltips, colorblind-safe palette).

## What's implemented

| BRD ref | Module | Page |
|---|---|---|
| FR-34 | Analytics dashboard — bookings, revenue, city performance, utilization, ratings, SLA | `pages/Dashboard` |
| FR-29 | Order & dispatch management — assign/reassign, live SLA monitoring | `pages/Orders` |
| FR-28 | Mechanic onboarding, verification, training records & performance scorecards | `pages/Mechanics` |
| FR-30 | Dispute / refund / warranty workflow with full **audit trail** | `pages/Disputes` |
| FR-25 | Service catalog management — pricing, GST, duration, checklist points, category | `pages/Catalog` |
| FR-26 | Brand/model master data management | `pages/Brands` |
| FR-27 | City / hub / serviceability-zone management + "Request Area" demand | `pages/Cities` |
| FR-31 | Franchise / partner / vendor lead pipeline | `pages/Franchise` |
| FR-32 | Membership plan configuration (tiers, entitlements, renewal) | `pages/Memberships` |
| FR-33 | Promotions / coupon management (flat & %, caps, limits, expiry) | `pages/Promotions` |
| FR-35 | Marketing content management (service/brand/city/blog/media pages) | `pages/Content` |

All figures are illustrative and served from `src/data/mockData.ts`; every table
and workflow is interactive (assign a mechanic, verify a partner, resolve a
dispute, add a service/coupon, launch a hub) with in-memory state — no backend.

## Project structure

```
index.html
src/
  main.tsx / App.tsx        # Entry + hash-router routes
  styles.css                # Design system (brand tokens + chart palette)
  types.ts                  # Domain types
  data/mockData.ts          # Seed data & analytics series
  components/
    Layout.tsx              # Sidebar nav + topbar
    ui.tsx                  # Card, Badge, StatTile, Button, PillTabs
    charts.tsx              # BarList, TrendChart (hover), Meter — inline SVG
  pages/                    # One page per FR module
```

## Running

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm run typecheck
```

## Notes

- Routing uses `HashRouter`, so the built `dist/` is deployable as static files
  on any host (no server-side rewrites needed).
- The chart palette and mark specs follow the shared data-viz method; the
  categorical/sequential colors are validated as colorblind-safe.
