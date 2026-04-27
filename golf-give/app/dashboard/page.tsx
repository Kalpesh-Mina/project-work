import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardOverviewClient from './DashboardOverviewClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dashboard | Golf & Give' }

export default async function DashboardPage() {
  // Regular client to verify session/identity
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Admin client to bypass RLS for fetching the user's own data reliably
  const adminSupabase = await createAdminClient()

  const [profileRes, subRes, scoresRes, resultsRes] = await Promise.all([
    adminSupabase.from('profiles').select('*').eq('id', user.id).single(),
    adminSupabase.from('subscriptions').select('*, charities(name)').eq('user_id', user.id).single(),
    adminSupabase.from('scores').select('*').eq('user_id', user.id).order('score_date', { ascending: false }).limit(5),
    adminSupabase.from('draw_results').select('*, draws(month, year)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <DashboardOverviewClient
      profile={profileRes.data}
      subscription={subRes.data}
      scores={scoresRes.data || []}
      results={resultsRes.data || []}
    />
  )
}
