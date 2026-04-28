import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CharitySettingsClient from './CharitySettingsClient'

export const metadata = { title: 'My Charity | Golf & Give' }

export default async function CharitySettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Use service-role client to bypass RLS for reliable data access
  const adminSupabase = await createAdminClient()
  const [subRes, charitiesRes] = await Promise.all([
    adminSupabase.from('subscriptions').select('*, charities(*)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    adminSupabase.from('charities').select('*').eq('is_active', true).order('is_featured', { ascending: false }),
  ])

  return <CharitySettingsClient subscription={subRes.data} charities={charitiesRes.data || []} userId={user.id} />
}
