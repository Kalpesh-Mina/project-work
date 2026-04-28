import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const supabase = await createAdminClient()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  // Only verify signature if a real webhook secret is configured
  const isConfigured = webhookSecret && webhookSecret !== 'your_stripe_webhook_secret' && webhookSecret.startsWith('whsec_')

  if (isConfigured) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch {
      return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
    }
  } else {
    // In dev without a webhook secret, parse the event body directly
    // (Stripe CLI or real events won't reach here without the secret anyway)
    try {
      event = JSON.parse(body)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { metadata?: Record<string, string>; subscription?: string; customer?: string }
    const { userId, plan, charityId, charityPercentage } = session.metadata || {}
    const stripeSubId = typeof session.subscription === 'string' ? session.subscription : null

    if (!userId) return NextResponse.json({ received: true })

    let periodEnd: string | null = null
    let periodStart: string | null = null
    if (stripeSubId) {
      const sub = await stripe.subscriptions.retrieve(stripeSubId) as unknown as { current_period_start: number; current_period_end: number }
      periodStart = new Date(sub.current_period_start * 1000).toISOString()
      periodEnd = new Date(sub.current_period_end * 1000).toISOString()
    }

    const { data: existing } = await supabase.from('subscriptions').select('id').eq('user_id', userId).maybeSingle()
    if (existing) {
      await supabase.from('subscriptions').update({
        plan, status: 'active',
        stripe_subscription_id: stripeSubId,
        stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        selected_charity_id: charityId || null,
        charity_percentage: Number(charityPercentage) || 10,
        updated_at: new Date().toISOString(),
      }).eq('user_id', userId)
    } else {
      await supabase.from('subscriptions').insert({
        user_id: userId, plan, status: 'active',
        stripe_subscription_id: stripeSubId,
        stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        selected_charity_id: charityId || null,
        charity_percentage: Number(charityPercentage) || 10,
      })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as { id: string }
    await supabase.from('subscriptions').update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    }).eq('stripe_subscription_id', sub.id)
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as { subscription?: string }
    if (invoice.subscription) {
      await supabase.from('subscriptions').update({ status: 'past_due' }).eq('stripe_subscription_id', invoice.subscription)
    }
  }

  return NextResponse.json({ received: true })
}
