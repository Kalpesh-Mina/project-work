# ⛳ Golf & Give — Setup Guide

> Complete setup instructions for getting the platform fully operational.

---

## ✅ Current Status
The Next.js application compiles and runs at **http://localhost:3000**.  
All pages render. You need to connect **Supabase** and **Stripe** for full functionality.

---

## 1. Supabase Setup

### 1.1 Create a Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name (e.g. `golf-give`) and a strong database password
3. Select a region closest to your users

### 1.2 Run the Database Schema
1. In Supabase → **SQL Editor** → paste the contents of `supabase/schema.sql`
2. Click **Run** — this creates all 10 tables with RLS policies, triggers, and indexes

### 1.3 Create a Storage Bucket
1. In Supabase → **Storage** → New Bucket
2. Name: `verifications` | Set to **Public**

### 1.4 Get Your Keys
In Supabase → **Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` → service_role key (keep secret!)

---

## 2. Stripe Setup

### 2.1 Create Products
In your [Stripe Dashboard](https://dashboard.stripe.com):

**Monthly Plan:**
- Product: "Golf & Give Monthly"  
- Price: £19.99/month recurring  
- Copy the **Price ID** (starts with `price_`)

**Yearly Plan:**
- Product: "Golf & Give Yearly"  
- Price: £199.99/year recurring  
- Copy the **Price ID**

### 2.2 Update Plan Config
In `lib/stripe/index.ts`, replace the placeholder price IDs:
```ts
export const PLANS = {
  monthly: { priceId: 'price_YOUR_MONTHLY_ID', amount: 1999 },
  yearly:  { priceId: 'price_YOUR_YEARLY_ID',  amount: 19999 },
}
```

### 2.3 Webhook Setup
```bash
# Install Stripe CLI
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copy the webhook secret (starts with `whsec_`) to your `.env.local`.

For production, create a webhook in Stripe Dashboard pointing to:  
`https://yourdomain.com/api/webhooks/stripe`  
Events to listen for: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`

---

## 3. Environment Variables

Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Create Your Admin Account

1. Start the dev server: `npm run dev`
2. Go to `http://localhost:3000/signup` and create an account
3. In Supabase → Table Editor → `profiles` table
4. Find your record and set `role` = `admin`
5. You now have access to `http://localhost:3000/admin`

---

## 5. Seed Test Data (Optional)

In Supabase SQL Editor, run:

```sql
-- Add a featured charity
INSERT INTO charities (name, description, long_description, is_active, is_featured)
VALUES 
  ('Golf for Good Foundation', 'Supporting youth golf programs across the UK', 'We believe every young person should have the chance to play golf and develop life skills through the sport.', true, true),
  ('Veterans on the Fairway', 'Helping veterans find community through golf', 'Supporting veterans with PTSD and mental health challenges through therapeutic golf programs.', true, false),
  ('Green Spaces for All', 'Making golf courses accessible to everyone', 'Removing barriers to golf participation for people with disabilities.', true, false);
```

---

## 6. Running Monthly Draws

1. Go to `/admin/draws`
2. Click **Run Draw** — this auto-collects scores, generates 5 numbers, and calculates prizes
3. Review results with **Simulate**
4. Click **Publish** to make results visible to subscribers

---

## 7. Page Reference

| URL | Description |
|-----|-------------|
| `/` | Public homepage |
| `/charities` | Browse all charities |
| `/draws` | Published draw results |
| `/how-it-works` | Platform explainer |
| `/signup` | Subscribe / onboarding |
| `/login` | Sign in |
| `/dashboard` | Subscriber overview |
| `/dashboard/scores` | Enter golf scores |
| `/dashboard/draws` | View draw history |
| `/dashboard/charity` | Change charity preference |
| `/dashboard/winnings` | Claim prizes |
| `/dashboard/settings` | Account settings |
| `/admin` | Admin overview |
| `/admin/users` | User management |
| `/admin/draws` | Draw management |
| `/admin/charities` | Charity CRUD |
| `/admin/winners` | Verify & pay winners |
| `/admin/reports` | Analytics dashboard |

---

## 8. Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| Payments | Stripe Subscriptions |
| Styling | Vanilla CSS + CSS variables |
| Animations | Framer Motion |
| Icons | Lucide React |
| Deployment | Vercel (recommended) |

---

## 9. Deploy to Production (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel
vercel

# Set environment variables in Vercel dashboard
# Change NEXT_PUBLIC_APP_URL to your production URL
# Update Stripe webhook endpoint to production URL
```
