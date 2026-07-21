# Testing Guide — how to try the whole platform

You can test everything **on your own computer in a web browser** — no phone,
no app store, no cloud needed. All four apps run in the browser and talk to the
local backend.

## Demo logins

| App | Login | Value |
|---|---|---|
| Customer app | Mobile OTP | any 10-digit number, e.g. `9800000001` · OTP `123456` |
| Mechanic app | Mobile OTP | `9876543210` (a verified mechanic) · OTP `123456` |
| Admin console | Email + password | `admin@doorstepbike.example` / `admin123` |

> Tip: use customer `9800000001` and mechanic `9876543210` — they share a city
> (Bengaluru), so a booking made by the customer shows up in the mechanic's job
> queue.

---

## Step 1 — Start the backend + database

**Easiest (Docker):** one command runs Postgres + the API together.

```bash
docker compose up --build
# API is now at http://localhost:4000/api
```

**Or without Docker** (needs Node 18+ and PostgreSQL installed):

```bash
# create the database once
createdb doorstep
psql -c "CREATE ROLE doorstep LOGIN PASSWORD 'doorstep'; ALTER DATABASE doorstep OWNER TO doorstep;"

cd backend
npm install
npm start          # http://localhost:4000  (creates tables + demo data)
```

Check it works: open <http://localhost:4000/api/health> — you should see
`{"ok":true,...}`.

---

## Step 2 — Open the apps (each in its own terminal)

```bash
# Customer app (rider)         -> opens a browser tab
cd customer-app && npm install && npm run web

# Mechanic app (Bike Mistri)   -> repo root
npm install && npm run web

# Admin console (operations)
cd admin-console && npm install && npm run dev

# Marketing website
cd marketing-site && npm install && npm run dev
```

Each command prints a local URL (e.g. `http://localhost:8081`,
`http://localhost:5173`, `http://localhost:4321`). Open them in your browser.

---

## Step 3 — Try the connected flow (the fun part)

This shows all the apps sharing one backend:

1. **Customer app** — log in (`9800000001` / `123456`). On Home pick a service →
   **Book** (choose vehicle, slot, address) → confirm.
2. **Admin console** — log in. Open **Orders & Dispatch**: your new booking is
   there as **Unassigned**. (The dashboard counters update too.)
3. **Mechanic app** — log in (`9876543210` / `123456`). Pull to refresh on
   **Jobs** → your booking appears under **New**. **Accept** it → *Start ride* →
   *I've arrived — start service*.
4. Tick the **checklist**, add an **extra issue**, tap **Request approval**.
5. **Customer app** — open the booking under **Bookings** → tap **Refresh
   status** → **Approve** the extra.
6. **Mechanic app** — add before/after photos → **Complete job**.
7. **Customer app** — **Pay ₹… securely** (runs the Razorpay flow in mock mode)
   → rate the mechanic.
8. **Admin dashboard** — revenue, ratings and completed count reflect it all.
9. **Marketing site** — submit the **Franchise** form → it appears in the admin
   **Franchise & Partners** pipeline.

---

## Testing on a real phone (optional)

Install **Expo Go** (Play Store / App Store), then in `customer-app` (or the
mechanic app at the repo root):

```bash
# tell the app your computer's LAN IP so the phone can reach the backend
EXPO_PUBLIC_API_URL=http://<your-computer-ip>:4000/api npx expo start
```

Scan the QR code with Expo Go. (Phone and computer must be on the same Wi-Fi.)

For a standalone installable APK (no Expo Go), see **DEPLOYMENT.md**.

---

## Reset the demo data

```bash
curl -X POST http://localhost:4000/api/dev/reset
```
