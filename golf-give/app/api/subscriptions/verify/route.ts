import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(_req: NextRequest) {
  try {
    // 1. Verify the caller is a logged-in user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized', found: false }, { status: 401 })
    }

    const adminSupabase = await createAdminClient()

    // 2. Find this user's Stripe customer ID from our DB
    const { data: existingSub, error: subError } = await adminSupabase
      .from('subscriptions')
      .select('id, stripe_customer_id, status')
      .eq('user_id', user.id)
      .maybeSingle()

    if (subError) {
      console.error('[verify] DB read error:', subError)
      return NextResponse.json({ found: false, message: `DB error: ${subError.message}` })
    }

    let customerId: string | null = existingSub?.stripe_customer_id ?? null

    // 3. If no customer ID in DB, look up by email in Stripe
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

    // 4. Fetch active subscriptions from Stripe
    let stripeSub: Stripe.Subscription | null = null

    const activeSubs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    })

    if (activeSubs.data.length > 0) {
      stripeSub = activeSubs.data[0]
    } else {
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
      return NextResponse.json({
        found: false,
        message: 'No active Stripe subscription found',
        customerId,
        userId: user.id,
      })
    }

    // 5. Determine plan from the price ID
    const priceId = stripeSub.items.data[0]?.price.id ?? ''
    const plan: 'yearly' | 'monthly' =
      priceId === process.env.STRIPE_YEARLY_PRICE_ID ? 'yearly' : 'monthly'

    // Cast for period timestamps (newer Stripe API version moves these in types)
    interface StripePeriod { current_period_start: number; current_period_end: number }
    const subPeriod = stripeSub as unknown as StripePeriod
    const periodStart = new Date(subPeriod.current_period_start * 1000).toISOString()
    const periodEnd = new Date(subPeriod.current_period_end * 1000).toISOString()

    // 6. Upsert the subscription in our database
    if (existingSub?.id) {
      const { error: updateError } = await adminSupabase.from('subscriptions').update({
        plan,
        status: 'active',
        stripe_subscription_id: stripeSub.id,
        stripe_customer_id: customerId,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id)

      if (updateError) {
        console.error('[verify] DB update error:', updateError)
        return NextResponse.json({ found: false, message: `DB update error: ${updateError.message}` })
      }
    } else {
      const { error: insertError } = await adminSupabase.from('subscriptions').insert({
        user_id: user.id,
        plan,
        status: 'active',
        stripe_subscription_id: stripeSub.id,
        stripe_customer_id: customerId,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        charity_percentage: 10,
      })

      if (insertError) {
        console.error('[verify] DB insert error:', insertError)
        return NextResponse.json({ found: false, message: `DB insert error: ${insertError.message}` })
      }
    }

    return NextResponse.json({ found: true, plan, status: 'active', periodEnd })

  } catch (err) {
    // Always return JSON — never let the route return an empty 500
    const message = err instanceof Error ? err.message : 'Unknown server error'
    console.error('[verify] unhandled error:', err)
    return NextResponse.json(
      { found: false, error: message },
      { status: 500 }
    )
  }
}
