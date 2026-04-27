import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateRandomDraw, generateAlgorithmicDraw, matchEntries, calculatePrizePools, calculatePrizePerWinner } from '@/lib/draw-engine'

export async function POST(req: NextRequest) {
  const supabase = await createAdminClient()
  const { month, year, algorithmType } = await req.json()

  // Prevent duplicate draws
  const { data: existing } = await supabase.from('draws').select('id').eq('month', month).eq('year', year).single()
  if (existing) return NextResponse.json({ error: `Draw for ${month}/${year} already exists` }, { status: 400 })

  // Fetch all active subscribers' scores
  const { data: activeSubs } = await supabase.from('subscriptions').select('user_id').eq('status', 'active')
  const userIds = (activeSubs || []).map(s => s.user_id)

  const { data: scores } = await supabase.from('scores').select('user_id, score, score_date').in('user_id', userIds)

  // Build entries per user (latest 5 scores)
  const entriesMap: Record<string, number[]> = {}
  for (const score of scores || []) {
    if (!entriesMap[score.user_id]) entriesMap[score.user_id] = []
    if (entriesMap[score.user_id].length < 5) entriesMap[score.user_id].push(score.score)
  }
  const entries = Object.entries(entriesMap).map(([userId, sc]) => ({ userId, scores: sc }))

  // Generate draw numbers
  const drawNumbers = algorithmType === 'algorithmic'
    ? generateAlgorithmicDraw(entries)
    : generateRandomDraw()

  // Get previous jackpot rollover
  const { data: prevDraw } = await supabase.from('draws').select('jackpot_amount, jackpot_carried_forward').eq('jackpot_carried_forward', true).order('year', { ascending: false }).order('month', { ascending: false }).limit(1).single()
  const jackpotRollover = prevDraw?.jackpot_amount || 0

  // Calculate prize pool
  const MONTHLY_CONTRIBUTION_PENCE = 500
  const totalPool = (userIds.length * MONTHLY_CONTRIBUTION_PENCE) / 100
  const { fiveMatchPool, fourMatchPool, threeMatchPool } = calculatePrizePools(totalPool, jackpotRollover / 100)

  // Match entries
  const matchResults = matchEntries(drawNumbers, entries)
  const fiveWinners = matchResults.filter(r => r.matchType === 5)
  const fourWinners = matchResults.filter(r => r.matchType === 4)
  const threeWinners = matchResults.filter(r => r.matchType === 3)

  const jackpotCarried = fiveWinners.length === 0

  // Create draw
  const { data: draw, error: drawError } = await supabase.from('draws').insert({
    month, year,
    status: 'pending',
    draw_numbers: drawNumbers,
    algorithm_type: algorithmType,
    jackpot_amount: jackpotCarried ? fiveMatchPool * 100 : 0,
    jackpot_carried_forward: jackpotCarried,
  }).select().single()

  if (drawError) return NextResponse.json({ error: drawError.message }, { status: 500 })

  // Create prize pool record
  await supabase.from('prize_pools').insert({
    draw_id: draw.id,
    total_pool: totalPool,
    five_match_pool: fiveMatchPool,
    four_match_pool: fourMatchPool,
    three_match_pool: threeMatchPool,
    jackpot_rollover: jackpotRollover / 100,
    active_subscriber_count: userIds.length,
  })

  // Create draw entries
  if (entries.length > 0) {
    await supabase.from('draw_entries').insert(
      entries.map(e => ({ draw_id: draw.id, user_id: e.userId, scores_snapshot: e.scores.map(s => ({ score: s })) }))
    )
  }

  // Create draw results
  const resultRows = [
    ...fiveWinners.map(w => ({ draw_id: draw.id, user_id: w.userId, match_type: 5, matched_numbers: w.matchedNumbers, prize_amount: calculatePrizePerWinner(fiveMatchPool, fiveWinners.length) })),
    ...fourWinners.map(w => ({ draw_id: draw.id, user_id: w.userId, match_type: 4, matched_numbers: w.matchedNumbers, prize_amount: calculatePrizePerWinner(fourMatchPool, fourWinners.length) })),
    ...threeWinners.map(w => ({ draw_id: draw.id, user_id: w.userId, match_type: 3, matched_numbers: w.matchedNumbers, prize_amount: calculatePrizePerWinner(threeMatchPool, threeWinners.length) })),
  ]

  if (resultRows.length > 0) {
    await supabase.from('draw_results').insert(resultRows)
  }

  return NextResponse.json({
    drawId: draw.id,
    drawNumbers,
    winners: matchResults.length,
    fiveMatch: fiveWinners.length,
    fourMatch: fourWinners.length,
    threeMatch: threeWinners.length,
    jackpotCarried,
  })
}
