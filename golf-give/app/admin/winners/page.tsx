import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminWinnersClient from './AdminWinnersClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Winners | Admin' }

export default async function AdminWinnersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminSupabase = await createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: verifications } = await adminSupabase
    .from('winner_verifications')
    .select('*, profiles(full_name, email), draw_results(prize_amount, match_type, draws(month, year))')
    .order('submitted_at', { ascending: false })

  const { data: results } = await adminSupabase
    .from('draw_results')
    .select('*, profiles(full_name, email), draws(month, year)')
    .order('created_at', { ascending: false })

  return <AdminWinnersClient verifications={verifications || []} results={results || []} />
}
