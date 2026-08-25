# KuroCal ♡

Your cute little food diary — a kawaii-gothic, purple/lavender/pink personal calorie & nutrition tracker with AI-powered food scanning.

Open the app, see today's calories and protein at a glance, log meals in seconds (by hand or by photo), browse any past day on a calendar, and check your weekly trends — all wrapped in a soft, original purple-bunny aesthetic.

## Features

- **Today dashboard** — animated calorie ring, remaining calories, protein progress, cute rotating status messages
- **Add food** — manual entry, or **📸 AI Food Scanner**: snap/upload a photo and let Gemini estimate each item's calories, protein, and portion, with confidence badges and full editing before you save anything
- **Calendar** — month view with per-day totals and goal indicators; tap any day to view or edit its diary
- **History** — 7-day averages and a calorie chart
- **Settings** — editable calorie/protein goals, dark mode, reset data, sign out
- **Accounts** — email/password auth via Supabase; your diary syncs across devices and is private to your account (enforced by Postgres row-level security)

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router
- Supabase — Postgres (data), Auth (email/password), Edge Functions (AI proxy)
- Gemini API (`gemini-3.6-flash`) for food photo analysis
- Lucide icons

## Project structure

```
src/
  components/
    calendar/     month grid, day cells
    dashboard/    today's summary, macro cards, food list, calorie ring
    history/      weekly chart
    layout/       top nav, bottom nav, app shell
    mascot/       the original purple bunny illustration
    modals/       add/edit food, add-food choice (manual vs AI)
    scanner/      AI Food Scanner modal, confidence badges, entry card
    ui/           modal, confirm dialog, toggle, loading screen
  context/        AuthContext (Supabase session), DataContext (foods/settings)
  lib/            date/calorie math, meal metadata, cute status messages
  pages/          Today, Calendar, Day Detail, History, Settings, Login
  services/       foodScanner.ts — calls the analyze-food edge function
  types.ts

supabase/
  schema.sql                     Postgres tables + row-level security policies
  functions/analyze-food/        Edge Function that calls Gemini (key never touches the frontend)
  config.toml
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com) → New Project (free tier is fine).

Open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the `food_entries` and `user_settings` tables with row-level security so each user only ever sees their own data.

In **Authentication → Providers → Email**, keep "Confirm email" **on** for real use (turn it off only if you want to skip email verification while testing locally).

### 3. Configure the frontend

Copy `.env.example` to `.env` and fill in your project's URL and anon/publishable key (**Project Settings → API**):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

This key is safe to expose client-side — it's the public key that only ever acts within the row-level-security rules from `schema.sql`.

### 4. Set up the AI Food Scanner (optional but recommended)

The Gemini API key must **never** live in the frontend, so photo analysis runs through a Supabase Edge Function instead.

Get a free key from [Google AI Studio](https://aistudio.google.com/apikey), then deploy the function:

```bash
npx supabase login
npx supabase secrets set GEMINI_API_KEY=your_gemini_key --project-ref your-project-ref
npx supabase functions deploy analyze-food --project-ref your-project-ref
```

(`your-project-ref` is the subdomain in your Supabase URL, e.g. `abcdefghijklmnop`.)

To test the function locally instead of deploying, copy `supabase/.env.example` to `supabase/.env`, fill in the key, and run:

```bash
npx supabase functions serve analyze-food --env-file supabase/.env
```

If this step is skipped, the rest of the app still works fine — the scanner just falls back to its "couldn't figure this one out" screen with a manual-entry option.

### 5. Run the app

```bash
npm run dev
```

Open the printed local URL, sign up, and start logging food.

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env` (frontend) | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `.env` (frontend) | Public anon/publishable key — safe client-side, gated by RLS |
| `GEMINI_API_KEY` | Supabase secret (or `supabase/.env` for local testing) | **Never** put this in the frontend `.env` — it's read only inside the `analyze-food` Edge Function |

`.env` and `supabase/.env` are both gitignored — never commit real keys.

## Building for production

```bash
npm run build
```

Outputs static files to `dist/` — deploy anywhere that serves static sites (Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.). No custom server is needed; Supabase is the entire backend.

## Notes on the AI Scanner

- Nutrition values are AI estimates, not medical-grade measurements — the UI always frames them as such and lets you edit every field before saving.
- Portion size, sauces, oil, and mixed dishes naturally lower Gemini's confidence rather than producing falsely precise numbers.
- The Edge Function verifies the caller's Supabase auth token automatically (Supabase's default JWT verification) — only signed-in users can trigger an analysis.
