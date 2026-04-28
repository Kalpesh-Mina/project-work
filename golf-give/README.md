# ⛳ Golf & Give

A subscription-based golf platform where members compete in monthly prize draws while supporting their chosen charity.

## What it does

Members pay a monthly or yearly subscription, submit their golf scores each month, and get entered into a prize draw. A portion of every subscription goes directly to the charity each member selects. Winners are verified and paid out through the admin panel.

## Tech

- **Next.js 16** — App Router, server components, route handlers
- **Supabase** — Postgres database, Row Level Security, Auth
- **Stripe** — subscription billing and webhooks
- **Vanilla CSS** — custom design system with CSS variables

## Running locally

```bash
npm install
npm run dev
```

You'll need a `.env.local` file with your Supabase and Stripe keys. See `SETUP.md` for the full setup walkthrough.

## Project structure

```
app/
  (public)/        # public-facing pages (home, charities, draws)
  dashboard/       # subscriber member area
  admin/           # admin panel (restricted to role=admin)
  api/             # route handlers (Stripe webhooks, draw engine)
lib/               # supabase clients, stripe config, helpers
components/        # shared UI components
supabase/          # schema SQL and migrations
```

## Deployment

Deploy to Vercel. Set all environment variables in the Vercel project settings and point your Stripe webhook to `https://yourdomain.com/api/webhooks/stripe`.
