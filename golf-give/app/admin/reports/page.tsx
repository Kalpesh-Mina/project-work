import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminReportsClient from './AdminReportsClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Reports | Admin' }

export default async function AdminReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const [usersRes, subsRes, drawsRes, resultsRes, charityRes] = await Promise.all([
    supabase.from('profiles').select('created_at, role'),
    supabase.from('subscriptions').select('plan, status, charity_percentage'),
    supabase.from('draws').select('month, year, status'),
    supabase.from('draw_results').select('prize_amount, match_type, payment_status'),
    supabase.from('subscriptions').select('charity_percentage').eq('status', 'active'),
  ])

  const totalCharityDonated = (charityRes.data || []).reduce((s: number, sub: { charity_percentage: number }) => {
    const monthlyFee = 1999 // base monthly pence
    return s + (monthlyFee * (sub.charity_percentage / 100)) / 100
  }, 0)

  return (
    <AdminReportsClient
      users={usersRes.data || []}
      subscriptions={subsRes.data || []}
      draws={drawsRes.data || []}
      results={resultsRes.data || []}
      totalCharityDonated={totalCharityDonated}
    />
  )
}
