import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminCharitiesClient from './AdminCharitiesClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Charities | Admin' }

export default async function AdminCharitiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminSupabase = await createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: charities } = await adminSupabase.from('charities').select('*').order('created_at', { ascending: false })
  return <AdminCharitiesClient charities={charities || []} />
}
