import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DrawsPublicClient from './DrawsPublicClient'

export const metadata = { title: 'Monthly Draws | Golf & Give' }

export default async function DrawsPublicPage() {
  const supabase = await createClient()
  const { data: draws } = await supabase
    .from('draws')
    .select('*, prize_pools(*)')
    .in('status', ['published', 'completed'])
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .limit(12)

  return <DrawsPublicClient draws={draws || []} />
}
