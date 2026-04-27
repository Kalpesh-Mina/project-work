'use client'

import { motion } from 'framer-motion'
import { BarChart2, Users, CreditCard, Trophy, Heart, Zap } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5 } }) }

interface Props {
  users: { created_at: string; role: string }[]
  subscriptions: { plan: string; status: string; charity_percentage: number }[]
  draws: { month: number; year: number; status: string }[]
  results: { prize_amount: number; match_type: number; payment_status: string }[]
  totalCharityDonated: number
}

export default function AdminReportsClient({ users, subscriptions, draws, results, totalCharityDonated }: Props) {
  const activeMonthly = subscriptions.filter(s => s.status === 'active' && s.plan === 'monthly').length
  const activeYearly = subscriptions.filter(s => s.status === 'active' && s.plan === 'yearly').length
  const totalActive = subscriptions.filter(s => s.status === 'active').length
  const totalPrizePaid = results.filter(r => r.payment_status === 'paid').reduce((s, r) => s + r.prize_amount, 0)
  const totalPrizeAll = results.reduce((s, r) => s + r.prize_amount, 0)
  const publishedDraws = draws.filter(d => d.status === 'published' || d.status === 'completed').length

  const matchBreakdown = [3, 4, 5].map(m => ({
    match: m,
    count: results.filter(r => r.match_type === m).length,
    amount: results.filter(r => r.match_type === m).reduce((s, r) => s + r.prize_amount, 0),
  }))

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 size={24} style={{ color: 'var(--primary-light)' }} /> Reports &amp; Analytics
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>Platform-wide statistics and financial overview.</p>
      </motion.div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'primary' },
          { label: 'Active Subscribers', value: totalActive, icon: CreditCard, color: 'accent' },
          { label: 'Total Draws Run', value: draws.length, icon: Zap, color: 'gold' },
          { label: 'Published Draws', value: publishedDraws, icon: Zap, color: 'primary' },
          { label: 'Total Prize Pool', value: `£${totalPrizeAll.toFixed(2)}`, icon: Trophy, color: 'gold' },
          { label: 'Prizes Paid', value: `£${totalPrizePaid.toFixed(2)}`, icon: Trophy, color: 'accent' },
          { label: 'Charity Donated', value: `£${totalCharityDonated.toFixed(2)}`, icon: Heart, color: 'rose' },
          { label: 'Winners', value: results.length, icon: Trophy, color: 'muted' },
        ].map((s, i) => {
          const colorMap: Record<string, { bg: string; fg: string }> = {
            primary: { bg: 'rgba(99,102,241,0.12)', fg: 'var(--primary-light)' },
            accent: { bg: 'rgba(16,185,129,0.12)', fg: 'var(--accent-light)' },
            gold: { bg: 'rgba(245,158,11,0.12)', fg: 'var(--gold-light)' },
            rose: { bg: 'rgba(244,63,94,0.12)', fg: '#fb7185' },
            muted: { bg: 'rgba(100,116,139,0.12)', fg: 'var(--foreground-muted)' },
          }
          const c = colorMap[s.color]
          return (
            <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" animate="visible" className="stat-card">
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', background: c.bg }}>
                <s.icon size={18} style={{ color: c.fg }} />
              </div>
              <div style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--foreground-muted)', marginTop: '0.25rem' }}>{s.label}</div>
            </motion.div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Subscription breakdown */}
        <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible" className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={16} style={{ color: 'var(--primary-light)' }} /> Subscription Breakdown
          </h2>
          {[
            { label: 'Monthly Active', value: activeMonthly, color: 'var(--primary-light)', pct: totalActive ? (activeMonthly / totalActive) * 100 : 0 },
            { label: 'Yearly Active', value: activeYearly, color: 'var(--accent-light)', pct: totalActive ? (activeYearly / totalActive) * 100 : 0 },
            { label: 'Cancelled', value: subscriptions.filter(s => s.status === 'cancelled').length, color: '#fb7185', pct: subscriptions.length ? (subscriptions.filter(s => s.status === 'cancelled').length / subscriptions.length) * 100 : 0 },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{item.label}</span>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{item.value}</span>
              </div>
              <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '3px', transition: 'width 0.8s ease' }} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Draw prize breakdown */}
        <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible" className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={16} style={{ color: 'var(--gold-light)' }} /> Prize Match Statistics
          </h2>
          {matchBreakdown.map(m => (
            <div key={m.match} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className={`badge ${m.match === 5 ? 'badge-gold' : m.match === 4 ? 'badge-primary' : 'badge-muted'}`}>{m.match}-Match</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{m.count} winner{m.count !== 1 ? 's' : ''}</span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--gold-light)', fontSize: '0.9rem' }}>£{m.amount.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.875rem 0 0' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Total Distributed</span>
            <span style={{ fontWeight: 800, color: 'var(--gold-light)', fontFamily: 'var(--font-outfit)', fontSize: '1.1rem' }}>£{totalPrizeAll.toFixed(2)}</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
