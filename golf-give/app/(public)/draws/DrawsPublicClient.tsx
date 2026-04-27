'use client'

import { motion } from 'framer-motion'
import { Zap, Trophy, Users } from 'lucide-react'
import { getMonthName } from '@/lib/utils'
import Link from 'next/link'
import type { Draw, PrizePool } from '@/types'

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5 } }) }

export default function DrawsPublicClient({ draws }: { draws: (Draw & { prize_pools?: PrizePool | null })[] }) {
  return (
    <div style={{ paddingTop: '90px' }}>
      <section style={{ padding: '4rem 0 3rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(99,102,241,0.06) 100%)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-gold" style={{ marginBottom: '1rem', display: 'inline-flex' }}><Trophy size={12} style={{ marginRight: '0.35rem' }} /> Monthly Prize Draws</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', marginBottom: '1rem' }}>Draw <span className="gradient-text-gold">Results</span></h1>
            <p style={{ color: 'var(--foreground-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>All published draw results are shown below. Subscribe to participate in future draws.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {draws.length === 0 ? (
            <div className="glass-card" style={{ padding: '5rem', textAlign: 'center', color: 'var(--foreground-muted)' }}>
              <Zap size={56} style={{ opacity: 0.15, marginBottom: '1rem' }} />
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No draws published yet.</p>
              <p style={{ fontSize: '0.9rem' }}>Check back after our first monthly draw!</p>
              <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', padding: '0.75rem 1.75rem' }}>
                <Trophy size={16} /> Subscribe to Participate
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {draws.map((draw, i) => {
                const pool = draw.prize_pools as PrizePool | null
                return (
                  <motion.div key={draw.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{getMonthName(draw.month)} {draw.year}</h2>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>{draw.algorithm_type}</span>
                          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Published</span>
                        </div>
                      </div>
                      {pool && (
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold-light)', lineHeight: 1 }}>
                            £{pool.total_pool?.toFixed(2)}
                          </p>
                          <p style={{ fontSize: '0.72rem', color: 'var(--foreground-subtle)', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
                            <Users size={11} /> {pool.active_subscriber_count} members
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Draw numbers */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <p style={{ fontSize: '0.72rem', color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.6rem' }}>Drawn Numbers</p>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {draw.draw_numbers?.map((n, ni) => (
                          <div key={ni} className="draw-ball" style={{ width: '40px', height: '40px', fontSize: '0.875rem' }}>{n}</div>
                        ))}
                      </div>
                    </div>

                    {pool && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        {[
                          { label: '5-Match', value: `£${pool.five_match_pool?.toFixed(2)}`, color: 'gold' },
                          { label: '4-Match', value: `£${pool.four_match_pool?.toFixed(2)}`, color: 'primary' },
                          { label: '3-Match', value: `£${pool.three_match_pool?.toFixed(2)}`, color: 'accent' },
                        ].map(t => (
                          <div key={t.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '0.6rem 0.5rem', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.65rem', color: 'var(--foreground-subtle)', marginBottom: '0.2rem' }}>{t.label}</p>
                            <p style={{ fontWeight: 700, fontSize: '0.8rem', color: t.color === 'gold' ? 'var(--gold-light)' : t.color === 'primary' ? 'var(--primary-light)' : 'var(--accent-light)' }}>{t.value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {draw.jackpot_carried_forward && (
                      <div className="badge badge-gold" style={{ display: 'inline-flex', marginTop: '0.875rem' }}>🔄 Jackpot rolled to next month</div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
