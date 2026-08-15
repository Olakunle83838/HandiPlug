# HandiPlug — Full-Stack App (React + Express)

## This update (read this first)

1. **Fixed the search/category bug.** Root cause: category tiles on Home
   navigated to `/search` with no information about which trade was
   clicked, and the Search screen never read any filter from the URL — so
   every click showed the same unfiltered list. Fixed at the source:
   clicking "Plumber" now goes to `/search?trade=Plumber`, and Search
   actually filters on it — verified with curl against the real API
   (`?trade=Plumber` → only plumbers, `?trade=Carpenter` → only carpenters)
   **and** against the offline mock-data fallback, so it's correct whether
   or not the backend is running.
2. **Rebuilt the UI to match your uploaded prototype** (both zips reviewed
   screen-by-screen): new brand blue (`#1C4CD1`) hero/header color, the
   2-column desktop layouts with sidebar promos, verification badge pills
   on artisan profiles, the 4-stat/3-button artisan dashboard with a
   weekly chart and profile-completeness bar, the sidebar-nav Admin panel,
   and simplified KYC guarantor fields (phone only, matching your design).
3. **Logo is back to plain code control** — no admin panel, no upload
   flow, no gating. `src/assets/logo.png` (full lockup) and
   `src/assets/logo-icon.png` (icon only) are your actual uploaded file,
   background removed. Change the size anywhere with one prop:
   ```jsx
   <Logo size={40} />              // full lockup, 40px tall
   <Logo size={32} variant="icon" />  // icon only
   ```
   To replace the artwork itself later, just overwrite those two PNGs.
4. **Wired the dead-end pages in.** Payment had zero links pointing to it
   anywhere in the app. Now: when an artisan marks a job complete, it
   shows up in the customer's My Bookings "Completed" tab with a
   **"Pay Now →"** action that carries the real artisan/booking context
   into the Payment screen. KYC was already reachable (Signup → OTP →
   Build Profile → Portfolio → KYC for new artisans, or "Verification
   Status" from the artisan's own profile) — double-checked it still
   works end to end.
5. Only touched what was asked — the rest of last round's work (auth,
   bookings, KYC upload, admin approve/reject, the input-focus bug fix)
   is untouched and still fully wired.

---

## Quick start (both pieces)

**1. Backend**
```bash
cd server
npm install
cp .env.example .env
npm start
```
Runs on `http://localhost:4000`, auto-seeds demo data on first run.

**2. Frontend**
```bash
npm install react-router-dom
cp .env.example .env
```
Copy `src/handiplug.css`, import it once in your entry file:
```js
import "./handiplug.css";
```
Then run your usual `vite dev`.

If the backend isn't running, screens that fetch live data fall back to
demo data automatically.

## Demo accounts

| Role     | Email                    | Password      |
|----------|---------------------------|----------------|
| Admin    | admin@handiplug.ng        | admin1234      |
| Artisan  | ifeanyi@handiplug.ng      | password123    |
| Artisan  | tunde@handiplug.ng        | password123    |
| Artisan  | musa@handiplug.ng         | password123 *(unverified)* |

---

## Step-by-step: getting the full backend running for real

This walks through everything from "I have this zip file" to "the whole
app works end-to-end on my machine," assuming no prior Node experience.

### Step 1 — Install Node.js

You need Node 18 or newer. Check what you have:
```bash
node -v
```
If that fails or shows something older than v18, install it from
[nodejs.org](https://nodejs.org) (choose the LTS version) — or, if you're
comfortable with a version manager, `nvm install --lts`.

### Step 2 — Unzip and lay out the folders

Unzip this package. You should have two top-level folders: `src/` (the
React frontend) and `server/` (the Express backend). Keep them as
siblings inside one project folder — e.g.:
```
handiplug/
  src/
  server/
  handiplug.css   (actually lives inside src/, see below)
```

### Step 3 — Start the backend

```bash
cd server
npm install
```
This downloads Express, JWT, bcrypt, and the other backend dependencies —
takes under a minute.

```bash
cp .env.example .env
```
Open `.env` in a text editor. At minimum, change `JWT_SECRET` to a long
random string (this is what signs login tokens — anyone who knows it can
forge logins, so don't leave the example value in anything real).

```bash
npm start
```
You should see:
```
HandiPlug API running on http://localhost:4000
```
Leave this terminal window open — the backend needs to keep running.
First run auto-creates `server/data/db.json` with the seed accounts from
the table above.

**Sanity check it's alive**, in a second terminal:
```bash
curl http://localhost:4000/api/health
```
Should print `{"ok":true,"service":"handiplug-api"}`.

### Step 4 — Start the frontend

Open a **new terminal tab** (leave the backend running in the first one).
If you don't already have a React project set up, the fastest path is:

```bash
npm create vite@latest handiplug-app -- --template react
cd handiplug-app
npm install react-router-dom
```

Then copy this package's `src/` folder contents **into** that new
project's `src/` folder, replacing the default `App.jsx`.

```bash
cp .env.example .env
```
The default `VITE_API_URL=http://localhost:4000/api` already points at
the backend you started in Step 3 — no change needed unless you're
running the backend somewhere else.

In your entry file (`src/main.jsx`), add one line:
```js
import "./handiplug.css";
```

Now run:
```bash
npm run dev
```
Open the printed `localhost` URL. You should land on the Splash screen.

### Step 5 — Prove it's really working

1. Click **Get Started** → **Create Account** → register a brand new
   account (real email doesn't matter, it's not verified by an email
   provider — just needs to be unique).
2. You'll land on Home. Click a category that isn't Electrician, e.g.
   **Plumber** — confirm you see plumbers, not electricians (this was the
   bug you reported; it's fixed).
3. Book an artisan. Log out, log back in as
   `ifeanyi@handiplug.ng` / `password123`, go to the Artisan Dashboard —
   your booking request should be sitting there waiting to be accepted.
4. Log in as `admin@handiplug.ng` / `admin1234`, go to `/admin` — you'll
   see the verification queue once an artisan submits KYC documents.

If all four of those work, the full stack — registration, search,
bookings, and admin — is genuinely wired end to end, not just UI.

### Step 6 — When you're ready to put this online

- **Backend**: any plain Node host works (no native dependencies) —
  Render, Railway, Fly.io, or a VPS. Before real users register, swap
  `server/db.js` (currently a JSON file) for a real database — Postgres
  via Prisma is a common, well-documented choice. The JSON file store is
  fine for development and demos but will not hold up to concurrent
  writes from many simultaneous users.
- **Frontend**: any static host — Vercel, Netlify, Cloudflare Pages. Run
  `npm run build`, deploy the output folder, and set `VITE_API_URL` to
  wherever you deployed the backend.
- Rotate `JWT_SECRET` to something long and random in production, and
  don't commit `.env` to version control (a `.gitignore` for it is
  already included in `server/`).

---

## What's intentionally NOT wired (and why)

- **Payment/escrow** — the payment flow now has a real entry point (My
  Bookings → Pay Now), but the actual money movement is still UI-only.
  Real payment needs a licensed processor (Paystack/Flutterwave in
  Nigeria); faking a "success" state against real data would be
  misleading rather than helpful.
- **Chat** — local/UI-only. Real-time messaging needs WebSockets, which
  is a meaningfully bigger scope than the REST endpoints here.
- **OTP/SMS verification** — UX step only, no SMS provider account wired
  up (Termii/Twilio would be the usual choice for Nigeria).
- **Job Boost / Verified Pro Plan payments** — the upsell cards are real
  UI, but "Upgrade"/"Boost" don't charge anything (again, needs a payment
  processor to be honest rather than fake).
- **Flagged Content** (admin) — no reporting system built yet; the tab
  exists in the UI but there's nothing to flag content with yet.

None of these are hard to add — they're separate, genuine scopes (payment
processor integration, SMS provider, WebSocket server) rather than
something to fake with what's already here.

## Known gaps

- No automated tests (unit or e2e) yet — everything above was verified
  manually via curl and full production builds after each change.
- The two prototype links originally shared couldn't be fetched for
  source code (Claude's public artifact viewer only exposes the page
  shell) — this update was built from the screenshots you uploaded
  instead, reviewed screen-by-screen.
