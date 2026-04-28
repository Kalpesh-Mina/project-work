import { createAdminClient } from '@/lib/supabase/server'
import AdminReportsClient from './AdminReportsClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Reports | Admin' }

export default async function AdminReportsPage() {
  const adminSupabase = await createAdminClient()

  const [usersRes, subsRes, drawsRes, resultsRes, charityRes] = await Promise.all([
    adminSupabase.from('profiles').select('created_at, role'),
    adminSupabase.from('subscriptions').select('plan, status, charity_percentage'),
    adminSupabase.from('draws').select('month, year, status'),
    adminSupabase.from('draw_results').select('prize_amount, match_type, payment_status'),
    adminSupabase.from('subscriptions').select('charity_percentage').eq('status', 'active'),
  ])

  const totalCharityDonated = (charityRes.data || []).reduce((s: number, sub: { charity_percentage: number }) => {
    const monthlyFee = 1999
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
