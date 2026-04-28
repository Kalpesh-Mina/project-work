# Setup

Everything you need to get Golf & Give running end-to-end.

---

## 1. Supabase

Create a new project at [supabase.com](https://supabase.com), then run the schema:

1. Open the **SQL Editor** in your Supabase dashboard
2. Paste in the contents of `supabase/schema.sql` and hit Run
3. Go to **Storage** → New Bucket → name it `verifications`, set to Public

Grab your keys from **Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 2. Stripe

Create two products in your [Stripe dashboard](https://dashboard.stripe.com):

- **Monthly** — £19.99/month recurring
- **Yearly** — £199.99/year recurring

Copy the `price_` IDs into your `.env.local`:

```env
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_YEARLY_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
```

For local webhook testing:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

For production, create a webhook in the Stripe dashboard pointing to `https://yourdomain.com/api/webhooks/stripe` and subscribe to: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`.

---

## 3. Environment file

Full `.env.local` example:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_YEARLY_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. First admin account

1. `npm run dev` → go to `/signup` and register
2. In Supabase → Table Editor → `profiles` → find your row → set `role` to `admin`
3. You can now access `/admin`

---

## 5. Test data

Paste this in the Supabase SQL editor to get some charities in:

```sql
INSERT INTO charities (name, description, long_description, is_active, is_featured)
VALUES 
  ('Golf for Good Foundation', 'Supporting youth golf programs across the UK', 'We believe every young person should have the chance to play golf and develop life skills through the sport.', true, true),
  ('Veterans on the Fairway', 'Helping veterans find community through golf', 'Supporting veterans with PTSD and mental health challenges through therapeutic golf programs.', true, false),
  ('Green Spaces for All', 'Making golf courses accessible to everyone', 'Removing barriers to golf participation for people with disabilities.', true, false);
```

---

## 6. Running draws

Go to `/admin/draws`:
- **Run Draw** — pulls this month's scores, generates 5 numbers, calculates prizes
- **Simulate** — preview before publishing
- **Publish** — makes results visible to subscribers

---

## 7. Pages

| Path | What it is |
|------|-----------|
| `/` | Homepage |
| `/charities` | Charity listings |
| `/draws` | Published draw results |
| `/how-it-works` | Explainer page |
| `/signup` | Onboarding + subscribe |
| `/login` | Sign in |
| `/dashboard` | Member overview |
| `/dashboard/scores` | Score submission |
| `/dashboard/draws` | Draw history |
| `/dashboard/charity` | Charity preference |
| `/dashboard/winnings` | Prize claims |
| `/dashboard/settings` | Account settings |
| `/admin` | Admin overview |
| `/admin/users` | User management |
| `/admin/draws` | Draw management |
| `/admin/charities` | Charity CRUD |
| `/admin/winners` | Verify and pay winners |
| `/admin/reports` | Analytics |

---

## 8. Deploy

```bash
npm i -g vercel
vercel
```

Add all env vars in the Vercel project dashboard. Update `NEXT_PUBLIC_APP_URL` to your production domain and switch the Stripe webhook to the production URL.
