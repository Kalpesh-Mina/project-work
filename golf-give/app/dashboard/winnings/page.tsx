import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WinningsClient from './WinningsClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Winnings | Golf & Give' }

export default async function WinningsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: results } = await supabase
    .from('draw_results')
    .select('*, draws(month, year), winner_verifications(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <WinningsClient results={results || []} userId={user.id} />
}
