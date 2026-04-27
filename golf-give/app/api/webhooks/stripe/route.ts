import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const supabase = await createAdminClient()

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { metadata?: Record<string, string>; subscription?: string; customer?: string }
    const { userId, plan, charityId, charityPercentage } = session.metadata || {}
    const stripeSubId = typeof session.subscription === 'string' ? session.subscription : null

    let periodEnd: string | null = null
    let periodStart: string | null = null
    if (stripeSubId) {
      const sub = await stripe.subscriptions.retrieve(stripeSubId)
      periodStart = new Date(sub.current_period_start * 1000).toISOString()
      periodEnd = new Date(sub.current_period_end * 1000).toISOString()
    }

    const { data: existing } = await supabase.from('subscriptions').select('id').eq('user_id', userId).single()
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
    await supabase.from('subscriptions').update({ status: 'cancelled', cancelled_at: new Date().toISOString() }).eq('stripe_subscription_id', sub.id)
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as { subscription?: string }
    if (invoice.subscription) {
      await supabase.from('subscriptions').update({ status: 'past_due' }).eq('stripe_subscription_id', invoice.subscription)
    }
  }

  return NextResponse.json({ received: true })
}
