import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

export const PLANS = {
  monthly: {
    name: 'Monthly Plan',
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    amount: 1999, // £19.99 in pence
    interval: 'month' as const,
    poolContribution: 500, // £5.00 goes to prize pool
    charityBase: 200,      // £2.00 base charity (10%)
  },
  yearly: {
    name: 'Yearly Plan',
    priceId: process.env.STRIPE_YEARLY_PRICE_ID!,
    amount: 19999, // £199.99 in pence
    interval: 'year' as const,
    poolContribution: 5000, // £50.00 goes to prize pool
    charityBase: 2000,      // £20.00 base charity (10%)
  },
}
