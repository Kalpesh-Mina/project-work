import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  // Use session client to verify who the user is
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan, charityId, charityPercentage } = await req.json()
  const planConfig = PLANS[plan as 'monthly' | 'yearly']
  if (!planConfig) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  // Use admin client to bypass RLS for reading profile and existing subscription
  const adminSupabase = await createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('email').eq('id', user.id).single()
  const { data: existingSub } = await adminSupabase.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).maybeSingle()

  let customerId = existingSub?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email || user.email!,
      metadata: { userId: user.id },
    })
    customerId = customer.id
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    metadata: {
      userId: user.id,
      plan,
      charityId: charityId || '',
      charityPercentage: charityPercentage || '10',
    },
  })

  return NextResponse.json({ url: session.url })
}
