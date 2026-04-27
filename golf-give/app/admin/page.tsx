import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminOverviewClient from './AdminOverviewClient'

export const metadata = { title: 'Admin Dashboard | Golf & Give' }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const [usersRes, subsRes, drawsRes, charitiesRes, resultsRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact' }),
    supabase.from('subscriptions').select('id, status', { count: 'exact' }).eq('status', 'active'),
    supabase.from('draws').select('*').order('year', { ascending: false }).order('month', { ascending: false }).limit(5),
    supabase.from('charities').select('id', { count: 'exact' }).eq('is_active', true),
    supabase.from('draw_results').select('prize_amount, payment_status'),
  ])

  const totalPrizePool = (resultsRes.data || []).reduce((s: number, r: { prize_amount: number; payment_status: string }) => s + r.prize_amount, 0)
  const pendingVerifications = await supabase.from('winner_verifications').select('id', { count: 'exact' }).eq('status', 'pending')

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
