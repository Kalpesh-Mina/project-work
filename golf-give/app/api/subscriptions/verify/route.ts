import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient, createAdminClient } from '@/lib/supabase/server'

/**
 * POST /api/subscriptions/verify
 *
 * Called client-side when the user lands on /dashboard?subscribed=true
 * after completing Stripe checkout. Since the webhook secret is not
 * configured (local dev) or webhooks may be delayed, this route
 * directly asks Stripe "does this customer have an active subscription?"
 * and writes the result into our database.
 */
export async function POST(req: NextRequest) {
  // 1. Verify the caller is a logged-in user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminSupabase = await createAdminClient()

  // 2. Find this user's Stripe customer ID from our DB (if it exists already)
  const { data: existingSub } = await adminSupabase
    .from('subscriptions')
    .select('id, stripe_customer_id, status')
    .eq('user_id', user.id)
    .maybeSingle()

  let customerId = existingSub?.stripe_customer_id

  // 3. If no customer ID in DB, look them up in Stripe by email
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

  // 4. Fetch all active subscriptions for this customer from Stripe
  const stripeSubs = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
    expand: ['data.items.data.price'],
  })

  if (stripeSubs.data.length === 0) {
    // Also check for trialing
    const trialingSubs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'trialing',
      limit: 1,
    })
    if (trialingSubs.data.length === 0) {
      return NextResponse.json({ found: false, message: 'No active Stripe subscription found' })
    }
  }

  const stripeSub = stripeSubs.data[0] || (await stripe.subscriptions.list({ customer: customerId, status: 'trialing', limit: 1 })).data[0]

  // 5. Determine plan from the Stripe price ID
  const priceId = stripeSub.items.data[0]?.price?.id
  const plan = priceId === process.env.STRIPE_YEARLY_PRICE_ID ? 'yearly' : 'monthly'

  const periodStart = new Date(stripeSub.current_period_start * 1000).toISOString()
  const periodEnd = new Date(stripeSub.current_period_end * 1000).toISOString()

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

  return NextResponse.json({
    found: true,
    plan,
    status: 'active',
    periodEnd,
  })
}
