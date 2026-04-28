import { createAdminClient } from '@/lib/supabase/server'
import AdminUsersClient from './AdminUsersClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Users | Admin' }

export default async function AdminUsersPage() {
  const adminSupabase = await createAdminClient()

  const { data: users } = await adminSupabase
    .from('profiles')
    .select('*, subscriptions(plan, status, current_period_end, charity_percentage)')
    .order('created_at', { ascending: false })

  return <AdminUsersClient users={users || []} />
}
