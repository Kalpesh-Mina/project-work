import { createAdminClient } from '@/lib/supabase/server'
import AdminDrawsClient from './AdminDrawsClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Draws | Admin' }

export default async function AdminDrawsPage() {
  const adminSupabase = await createAdminClient()

  const [drawsRes, activeSubsRes] = await Promise.all([
    adminSupabase.from('draws').select('*, prize_pools(*)').order('year', { ascending: false }).order('month', { ascending: false }),
    adminSupabase.from('subscriptions').select('id', { count: 'exact' }).eq('status', 'active'),
  ])

  return <AdminDrawsClient draws={drawsRes.data || []} activeSubscriberCount={activeSubsRes.count || 0} />
}
