# ⛳ Golf & Give

Golf & Give is a subscription-based platform where golfers submit their monthly scores to compete in prize draws, while simultaneously raising money for charities they care about.

## How it works

Users sign up for a monthly or annual subscription and pick a charity to support. A cut of their subscription fee goes straight to that charity. Every month, members upload their scorecards to enter the prize draw. We verify the winning scores and handle payouts via the admin dashboard.

## Tech Stack

- **Next.js 16**: App Router, Server Components, Route Handlers
- **Supabase**: Postgres DB, Auth, Row Level Security
- **Stripe**: Billing and webhooks
- **Vanilla CSS**: Kept it simple with CSS variables for the design system

## Local Development

```bash
npm install
npm run dev
```

Requires a `.env.local` file with Supabase and Stripe keys.

## Project Structure

```text
app/
  (public)/        # Public pages like home, charity list, and past draws
  dashboard/       # Protected member area
  admin/           # Admin dashboard (requires admin role)
  api/             # Next.js API routes (Stripe webhooks, draw logic)
components/        # Shared React components
lib/               # Supabase/Stripe clients and utility functions
supabase/          # Database migrations and SQL schema
```


