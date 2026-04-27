// Draw Engine — Golf & Give
// Supports random and algorithmic (weighted) draw generation

export interface DrawEntry {
  userId: string
  scores: number[]
}

export interface DrawResult {
  userId: string
  scores: number[]
  matchedNumbers: number[]
  matchType: 3 | 4 | 5 | null
}

/**
 * Generate 5 unique draw numbers (1-45) using random method
 */
export function generateRandomDraw(): number[] {
  const numbers: number[] = []
  while (numbers.length < 5) {
    const n = Math.floor(Math.random() * 45) + 1
    if (!numbers.includes(n)) numbers.push(n)
  }
  return numbers.sort((a, b) => a - b)
}

/**
 * Generate 5 draw numbers using weighted frequency of user scores.
 * Numbers that appear more frequently in user scores are more likely to be drawn.
 */
export function generateAlgorithmicDraw(entries: DrawEntry[]): number[] {
  // Build frequency map
  const freq: Record<number, number> = {}
  for (let i = 1; i <= 45; i++) freq[i] = 1 // base weight

  for (const entry of entries) {
    for (const score of entry.scores) {
      if (score >= 1 && score <= 45) {
        freq[score] = (freq[score] || 0) + 2 // boost frequent scores
      }
    }
  }

  // Weighted random selection
  const numbers: number[] = []
  while (numbers.length < 5) {
    const pool = Object.entries(freq)
      .filter(([num]) => !numbers.includes(Number(num)))
    const totalWeight = pool.reduce((sum, [, w]) => sum + w, 0)
    let rand = Math.random() * totalWeight
    for (const [num, weight] of pool) {
      rand -= weight
      if (rand <= 0) {
        numbers.push(Number(num))
        break
      }
    }
  }
  return numbers.sort((a, b) => a - b)
}

/**
 * Match each user's scores against the drawn numbers
 * Returns results only for users with 3+ matches
 */
export function matchEntries(
  drawNumbers: number[],
  entries: DrawEntry[]
): DrawResult[] {
  const results: DrawResult[] = []

  for (const entry of entries) {
    const matched = entry.scores.filter(s => drawNumbers.includes(s))
    const uniqueMatched = [...new Set(matched)]

    let matchType: 3 | 4 | 5 | null = null
    if (uniqueMatched.length >= 5) matchType = 5
    else if (uniqueMatched.length === 4) matchType = 4
    else if (uniqueMatched.length === 3) matchType = 3

    if (matchType) {
      results.push({
        userId: entry.userId,
        scores: entry.scores,
        matchedNumbers: uniqueMatched,
        matchType,
      })
    }
  }

  return results
}

/**
 * Calculate prize pool distribution
 */
export function calculatePrizePools(
  totalPool: number,
  jackpotRollover: number = 0
) {
  const fiveMatchPool = totalPool * 0.40 + jackpotRollover
  const fourMatchPool = totalPool * 0.35
  const threeMatchPool = totalPool * 0.25
  return { fiveMatchPool, fourMatchPool, threeMatchPool }
}

/**
 * Calculate individual prize per winner in a tier
 */
export function calculatePrizePerWinner(
  poolAmount: number,
  winnerCount: number
): number {
  if (winnerCount === 0) return 0
  return Number((poolAmount / winnerCount).toFixed(2))
}
