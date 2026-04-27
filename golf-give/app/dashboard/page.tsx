import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardOverviewClient from './DashboardOverviewClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dashboard | Golf & Give' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, subRes, scoresRes, resultsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('subscriptions').select('*, charities(name)').eq('user_id', user.id).single(),
    supabase.from('scores').select('*').eq('user_id', user.id).order('score_date', { ascending: false }).limit(5),
    supabase.from('draw_results').select('*, draws(month, year)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
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
