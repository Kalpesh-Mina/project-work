import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DrawsClient from './DrawsClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Draws | Golf & Give' }

export default async function DrawsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminSupabase = await createAdminClient()
  const [drawsRes, entriesRes, resultsRes] = await Promise.all([
    adminSupabase.from('draws').select('*, prize_pools(*)').in('status', ['published', 'completed']).order('year', { ascending: false }).order('month', { ascending: false }),
    adminSupabase.from('draw_entries').select('draw_id').eq('user_id', user.id),
    adminSupabase.from('draw_results').select('*, draws(month, year)').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  return (
    <DrawsClient
      draws={drawsRes.data || []}
      userEntries={(entriesRes.data || []).map((e: { draw_id: string }) => e.draw_id)}
      results={resultsRes.data || []}
    />
  )
}
