import { createAdminClient } from '@/lib/supabase/server'
import AdminCharitiesClient from './AdminCharitiesClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Charities | Admin' }

export default async function AdminCharitiesPage() {
  const adminSupabase = await createAdminClient()

  const { data: charities } = await adminSupabase.from('charities').select('*').order('created_at', { ascending: false })
  return <AdminCharitiesClient charities={charities || []} />
}
