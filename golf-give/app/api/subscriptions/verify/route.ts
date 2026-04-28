import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createClient, createAdminClient } from '@/lib/supabase/server'

/**
 * POST /api/subscriptions/verify
 *
 * Called client-side when the user lands on /dashboard?subscribed=true
 * after completing Stripe checkout. Since the webhook secret may not be
 * configured in local dev, this route directly polls Stripe for the
 * user's active subscription and writes it to the database.
 */
export async function POST(_req: NextRequest) {
  // 1. Verify the caller is a logged-in user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminSupabase = await createAdminClient()

  // 2. Find this user's Stripe customer ID from our DB
  const { data: existingSub } = await adminSupabase
    .from('subscriptions')
    .select('id, stripe_customer_id, status')
    .eq('user_id', user.id)
    .maybeSingle()

  let customerId: string | null = existingSub?.stripe_customer_id ?? null

  // 3. If no customer ID in DB yet, look them up in Stripe by email
  if (!customerId) {
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    const email = profile?.email || user.email!
    const customers = await stripe.customers.list({ email, limit: 1 })
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    }
  }

  if (!customerId) {
    return NextResponse.json({ found: false, message: 'No Stripe customer found for this account' })
  }

  // 4. Fetch active subscriptions from Stripe (no expand — keep types clean)
  let stripeSub: Stripe.Subscription | null = null

  const activeSubs = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  })

  if (activeSubs.data.length > 0) {
    stripeSub = activeSubs.data[0]
  } else {
    // Also check trialing
    const trialSubs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'trialing',
      limit: 1,
    })
    if (trialSubs.data.length > 0) {
      stripeSub = trialSubs.data[0]
    }
  }

  if (!stripeSub) {
    return NextResponse.json({ found: false, message: 'No active Stripe subscription found' })
  }

  // The newer Stripe API version (2026-04-22.dahlia) moved period timestamps in its
  // TypeScript definitions, but they still exist at runtime on the object.
  // Cast through a typed interface to access them safely.
  interface StripePeriod {
    id: string
    current_period_start: number
    current_period_end: number
    items: { data: Array<{ price: { id: string } }> }
  }
  const sub = stripeSub as unknown as StripePeriod

  // 5. Determine plan from the Stripe price ID
  const priceId = sub.items.data[0]?.price.id ?? ''
  const plan: 'yearly' | 'monthly' = priceId === process.env.STRIPE_YEARLY_PRICE_ID ? 'yearly' : 'monthly'

  const periodStart = new Date(sub.current_period_start * 1000).toISOString()
  const periodEnd = new Date(sub.current_period_end * 1000).toISOString()

  // 6. Upsert the subscription in our database
  if (existingSub) {
    await adminSupabase.from('subscriptions').update({
      plan,
      status: 'active',
      stripe_subscription_id: stripeSub.id,
      stripe_customer_id: customerId,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    }).eq('user_id', user.id)
  } else {
    await adminSupabase.from('subscriptions').insert({
      user_id: user.id,
      plan,
      status: 'active',
      stripe_subscription_id: stripeSub.id,
      stripe_customer_id: customerId,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      charity_percentage: 10,
    })
  }

  return NextResponse.json({ found: true, plan, status: 'active', periodEnd })
}
