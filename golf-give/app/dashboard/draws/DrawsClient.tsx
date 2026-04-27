'use client'

import { motion } from 'framer-motion'
import { Zap, Trophy, Calendar, CheckCircle } from 'lucide-react'
import { getMonthName } from '@/lib/utils'
import type { Draw, DrawResult, PrizePool } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = { hidden: { opacity: 0, y: 16 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }) }

interface Props {
  draws: (Draw & { prize_pools?: PrizePool | null })[]
  userEntries: string[]
  results: (DrawResult & { draws?: { month: number; year: number } | null })[]
}

export default function DrawsClient({ draws, userEntries, results }: Props) {
  const winningsMap = new Map(results.map(r => [r.draw_id, r]))

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={24} style={{ color: 'var(--gold-light)' }} /> Monthly Draws
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>View published draw results and your participation history.</p>
      </motion.div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Draws Entered', value: userEntries.length, icon: Calendar, color: 'primary' },
          { label: 'Times Won', value: results.length, icon: Trophy, color: 'gold' },
          { label: 'Total Prizes', value: `£${results.reduce((s, r) => s + r.prize_amount, 0).toFixed(2)}`, icon: CheckCircle, color: 'accent' },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" animate="visible" className="stat-card">
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', background: s.color === 'primary' ? 'rgba(99,102,241,0.12)' : s.color === 'gold' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)' }}>
              <s.icon size={18} style={{ color: s.color === 'primary' ? 'var(--primary-light)' : s.color === 'gold' ? 'var(--gold-light)' : 'var(--accent-light)' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.15rem' }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Draws list */}
      {draws.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--foreground-muted)' }}>
          <Zap size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>No published draws yet. Check back after the monthly draw!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {draws.map((draw, i) => {
            const entered = userEntries.includes(draw.id)
            const win = winningsMap.get(draw.id)
            return (
              <motion.div key={draw.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card" style={{ padding: '1.5rem', border: win ? '1px solid rgba(245,158,11,0.4)' : '1px solid var(--border)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{getMonthName(draw.month)} {draw.year} Draw</h2>
                      {win && <span className="badge badge-gold"><Trophy size={11} style={{ marginRight: '0.25rem' }} /> Winner!</span>}
                      {entered && !win && <span className="badge badge-primary"><CheckCircle size={11} style={{ marginRight: '0.25rem' }} /> Entered</span>}
                      {!entered && <span className="badge badge-muted">Not entered</span>}
                    </div>

                    {/* Draw numbers */}
                    {draw.draw_numbers && draw.draw_numbers.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        {draw.draw_numbers.map((n, ni) => (
                          <div key={ni} className={`draw-ball ${win?.matched_numbers?.includes(n) ? 'draw-ball-gold' : ''}`} style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>{n}</div>
                        ))}
                      </div>
                    )}

                    {/* Win details */}
                    {win && (
                      <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '0.75rem 1rem', display: 'inline-flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div><p style={{ fontSize: '0.75rem', color: 'var(--foreground-subtle)', marginBottom: '0.15rem' }}>Match</p><p style={{ fontWeight: 700, color: 'var(--gold-light)' }}>{win.match_type} Numbers</p></div>
                        <div><p style={{ fontSize: '0.75rem', color: 'var(--foreground-subtle)', marginBottom: '0.15rem' }}>Prize</p><p style={{ fontWeight: 700, color: 'var(--gold-light)' }}>£{win.prize_amount.toFixed(2)}</p></div>
                        <div><p style={{ fontSize: '0.75rem', color: 'var(--foreground-subtle)', marginBottom: '0.15rem' }}>Status</p><span className={`badge ${win.payment_status === 'paid' ? 'badge-success' : win.payment_status === 'rejected' ? 'badge-danger' : 'badge-muted'}`}>{win.payment_status}</span></div>
                      </div>
                    )}
                  </div>

                  {/* Prize pool info */}
                  {draw.prize_pools && (
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--foreground-subtle)', marginBottom: '0.25rem' }}>Total Pool</p>
                      <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                        £{(draw.prize_pools as PrizePool).total_pool?.toFixed(2) || '0.00'}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--foreground-subtle)' }}>
                        {(draw.prize_pools as PrizePool).active_subscriber_count} subscribers
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
