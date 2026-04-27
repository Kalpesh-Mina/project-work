import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminUsersClient from './AdminUsersClient'

export const metadata = { title: 'Users | Admin' }

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: users } = await supabase
    .from('profiles')
    .select('*, subscriptions(plan, status, current_period_end, charity_percentage)')
    .order('created_at', { ascending: false })

  return <AdminUsersClient users={users || []} />
}
