import { createClient } from '@/lib/supabase/server'
import CharitiesClient from './CharitiesClient'

export const metadata = {
  title: 'Charities | Golf & Give',
  description: 'Browse our partner charities and discover who you can support through your Golf & Give subscription.',
}

export default async function CharitiesPage() {
  const supabase = await createClient()
  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })

  return <CharitiesClient charities={charities || []} />
}
