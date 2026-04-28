import { createAdminClient } from '@/lib/supabase/server'
import AdminOverviewClient from './AdminOverviewClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin Dashboard | Golf & Give' }

export default async function AdminPage() {
  // Use admin client (service role) to bypass RLS for all admin queries
  const adminSupabase = await createAdminClient()

  const [usersRes, subsRes, drawsRes, charitiesRes, resultsRes] = await Promise.all([
    adminSupabase.from('profiles').select('id', { count: 'exact' }),
    adminSupabase.from('subscriptions').select('id, status', { count: 'exact' }).eq('status', 'active'),
    adminSupabase.from('draws').select('*').order('year', { ascending: false }).order('month', { ascending: false }).limit(5),
    adminSupabase.from('charities').select('id', { count: 'exact' }).eq('is_active', true),
    adminSupabase.from('draw_results').select('prize_amount, payment_status'),
  ])

  const totalPrizePool = (resultsRes.data || []).reduce((s: number, r: { prize_amount: number; payment_status: string }) => s + r.prize_amount, 0)
  const pendingVerifications = await adminSupabase.from('winner_verifications').select('id', { count: 'exact' }).eq('status', 'pending')

  return (
    <AdminOverviewClient
      totalUsers={usersRes.count || 0}
      activeSubscribers={subsRes.count || 0}
      totalCharities={charitiesRes.count || 0}
      totalPrizePool={totalPrizePool}
      pendingVerifications={pendingVerifications.count || 0}
      recentDraws={drawsRes.data || []}
    />
  )
}
