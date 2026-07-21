# Deployment Guide — publish so people can install it

There are two things to publish:

1. **The backend + database** → gets a public URL (e.g. `https://…onrender.com`).
2. **The apps** → point them at that URL, then build an installable Android APK
   (and/or host the web versions).

> Just testing on your own machine? See **TESTING.md** — no deployment needed.

---

## Part A — Deploy the backend (pick one)

### Option 1: Render.com (free, easiest)

This repo includes [`render.yaml`](render.yaml), which provisions the API **and**
a managed Postgres automatically.

1. Push this repo to GitHub.
2. Go to <https://render.com> → **New → Blueprint** → select your repo.
3. Render reads `render.yaml`, creates the database and web service, and deploys.
4. (Optional) In the service's **Environment**, add `RAZORPAY_KEY_ID` and
   `RAZORPAY_KEY_SECRET` for live payments.
5. Your API is now at `https://<your-service>.onrender.com/api`. Verify
   `…/api/health`.

### Option 2: Any VPS with Docker

```bash
git clone <your-repo> && cd credit-score-app
RAZORPAY_KEY_ID=... RAZORPAY_KEY_SECRET=... docker compose up -d --build
# API on port 4000 — put Nginx/Caddy in front for HTTPS
```

### Option 3: Railway / Fly.io

Point them at `backend/` (build `npm install`, start `npx tsx src/index.ts`) and
attach a Postgres plugin; set `DATABASE_URL` from it.

**Managed Postgres** (if you don't use Render's): Neon, Supabase or Railway all
have free tiers — copy their connection string into `DATABASE_URL`.

---

## Part B — Build an installable Android app (EAS)

Expo builds the APK in the cloud; you just download and install it. You need a
free **Expo account** (<https://expo.dev>).

```bash
npm install -g eas-cli
eas login

# Customer app
cd customer-app
# edit eas.json -> set EXPO_PUBLIC_API_URL to your deployed backend URL
eas init                    # links the app to your Expo account (one time)
eas build -p android --profile preview
```

When it finishes, EAS gives you a **download link / QR** for the `.apk`. Open it
on your Android phone to install (allow "install from unknown sources"). Repeat
in the repo root for the **mechanic app**.

- iOS installable builds need an Apple Developer account ($99/yr) and
  `eas build -p ios`.
- To publish to the **Play Store**, use `--profile production` (builds an
  `.aab`) then `eas submit -p android` with a Google Play developer account
  ($25 one-time).

## Part B (alternative) — Host the apps as web / PWA (no app store)

Every app can run as a website; users "install" via **Add to Home Screen**.

```bash
# Customer app  (repeat at repo root for the mechanic app)
cd customer-app
EXPO_PUBLIC_API_URL=https://<your-backend>/api npx expo export -p web
# deploy the ./dist folder to Netlify, Vercel or Render (static site)

# Admin console
cd admin-console && VITE_API_URL=https://<your-backend>/api npm run build   # deploy ./dist

# Marketing site
cd marketing-site && PUBLIC_API_URL=https://<your-backend>/api npm run build # deploy ./dist
```

---

## Part C — Point the apps at the backend

| App | Env var | Where |
|---|---|---|
| Customer app | `EXPO_PUBLIC_API_URL` | `eas.json` (builds) or the shell (web/Expo Go) |
| Mechanic app | `EXPO_PUBLIC_API_URL` | `eas.json` (repo root) or the shell |
| Admin console | `VITE_API_URL` | `.env.local` or the build command |
| Marketing site | `PUBLIC_API_URL` | `.env` or the build command |

Set each to `https://<your-backend>/api` (with the `/api` suffix).

---

## Go-live checklist

- [ ] Backend deployed with a strong `JWT_SECRET` and a managed Postgres.
- [ ] Real `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` set (live payments).
- [ ] Replace the dev OTP with a real SMS provider (see `backend/src/routes/auth.ts`).
- [ ] Every app's API URL points at the deployed backend.
- [ ] APKs built with the production profile; web apps deployed with HTTPS.

> What still needs *your* accounts: a hosting provider (Render/Railway/VPS), an
> Expo account (APK builds), Razorpay keys (payments), and — only if publishing
> to stores — Google Play / Apple Developer accounts. Everything else is ready.
