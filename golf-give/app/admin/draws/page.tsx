import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDrawsClient from './AdminDrawsClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Draws | Admin' }

export default async function AdminDrawsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminSupabase = await createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const [drawsRes, activeSubsRes] = await Promise.all([
    adminSupabase.from('draws').select('*, prize_pools(*)').order('year', { ascending: false }).order('month', { ascending: false }),
    adminSupabase.from('subscriptions').select('id', { count: 'exact' }).eq('status', 'active'),
  ])

  return <AdminDrawsClient draws={drawsRes.data || []} activeSubscriberCount={activeSubsRes.count || 0} />
}
