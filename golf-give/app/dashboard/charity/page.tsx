import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CharitySettingsClient from './CharitySettingsClient'

export const metadata = { title: 'My Charity | Golf & Give' }

export default async function CharitySettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [subRes, charitiesRes] = await Promise.all([
    supabase.from('subscriptions').select('*, charities(*)').eq('user_id', user.id).single(),
    supabase.from('charities').select('*').eq('is_active', true).order('is_featured', { ascending: false }),
  ])

  return <CharitySettingsClient subscription={subRes.data} charities={charitiesRes.data || []} userId={user.id} />
}
