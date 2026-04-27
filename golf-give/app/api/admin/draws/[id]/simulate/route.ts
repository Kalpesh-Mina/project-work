import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createAdminClient()

  const { data: draw } = await supabase.from('draws').select('*, prize_pools(*)').eq('id', id).single()
  if (!draw) return NextResponse.json({ error: 'Draw not found' }, { status: 404 })

  const { data: results } = await supabase.from('draw_results').select('match_type, prize_amount').eq('draw_id', id)

  type ResultRow = { match_type: number; prize_amount: number }
  const simulation = {
    fiveMatch: results?.filter((r: ResultRow) => r.match_type === 5).length || 0,
    fourMatch: results?.filter((r: ResultRow) => r.match_type === 4).length || 0,
    threeMatch: results?.filter((r: ResultRow) => r.match_type === 3).length || 0,
    totalWinners: results?.length || 0,
    totalPrize: results?.reduce((s: number, r: ResultRow) => s + r.prize_amount, 0) || 0,
  }

  await supabase.from('draws').update({ status: 'simulation', simulation_results: simulation }).eq('id', id)

  return NextResponse.json({ winners: simulation.totalWinners, simulation })
}
