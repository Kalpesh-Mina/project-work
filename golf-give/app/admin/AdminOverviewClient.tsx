'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, CreditCard, Heart, Trophy, Clock, Zap, ChevronRight, TrendingUp, AlertTriangle } from 'lucide-react'
import { getMonthName } from '@/lib/utils'
import type { Draw } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = { hidden: { opacity: 0, y: 16 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5 } }) }

interface Props {
  totalUsers: number
  activeSubscribers: number
  totalCharities: number
  totalPrizePool: number
  pendingVerifications: number
  recentDraws: Draw[]
}

export default function AdminOverviewClient({ totalUsers, activeSubscribers, totalCharities, totalPrizePool, pendingVerifications, recentDraws }: Props) {
  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'primary', href: '/admin/users' },
    { label: 'Active Subscribers', value: activeSubscribers, icon: CreditCard, color: 'accent', href: '/admin/users' },
    { label: 'Partner Charities', value: totalCharities, icon: Heart, color: 'rose', href: '/admin/charities' },
    { label: 'Total Prize Pool', value: `£${totalPrizePool.toFixed(2)}`, icon: Trophy, color: 'gold', href: '/admin/draws' },
    { label: 'Pending Verifications', value: pendingVerifications, icon: Clock, color: pendingVerifications > 0 ? 'danger' : 'muted', href: '/admin/winners' },
  ]

  const colorMap: Record<string, { bg: string; fg: string }> = {
    primary: { bg: 'rgba(99,102,241,0.12)', fg: 'var(--primary-light)' },
    accent: { bg: 'rgba(16,185,129,0.12)', fg: 'var(--accent-light)' },
    rose: { bg: 'rgba(244,63,94,0.12)', fg: '#fb7185' },
    gold: { bg: 'rgba(245,158,11,0.12)', fg: 'var(--gold-light)' },
    danger: { bg: 'rgba(244,63,94,0.12)', fg: '#fb7185' },
    muted: { bg: 'rgba(100,116,139,0.12)', fg: 'var(--foreground-muted)' },
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Admin Overview</h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>Platform health at a glance.</p>
      </motion.div>

      {/* Stat grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map((s, i) => {
          const c = colorMap[s.color]
          return (
            <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" animate="visible">
              <Link href={s.href} className="stat-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.bg }}>
                    <s.icon size={18} style={{ color: c.fg }} />
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--foreground-subtle)' }} />
                </div>
                <div style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.6rem', fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', marginTop: '0.25rem' }}>{s.label}</div>
                {s.label === 'Pending Verifications' && pendingVerifications > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
                    <AlertTriangle size={12} style={{ color: '#fb7185' }} />
                    <span style={{ fontSize: '0.75rem', color: '#fb7185' }}>Needs review</span>
                  </div>
                )}
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Quick actions */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={16} style={{ color: 'var(--gold-light)' }} /> Quick Actions
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {[
            { href: '/admin/draws', label: '🎲 Run New Draw', style: 'gold' },
            { href: '/admin/users', label: '👥 Manage Users', style: 'primary' },
            { href: '/admin/winners', label: '✅ Review Verifications', style: 'accent' },
            { href: '/admin/charities', label: '💚 Add Charity', style: 'muted' },
            { href: '/admin/reports', label: '📊 View Reports', style: 'muted' },
          ].map(a => (
            <Link key={a.href} href={a.href} style={{
              padding: '0.6rem 1.1rem', borderRadius: '9px', textDecoration: 'none',
              fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s',
              background: a.style === 'gold' ? 'rgba(245,158,11,0.12)' : a.style === 'primary' ? 'rgba(99,102,241,0.12)' : a.style === 'accent' ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
              color: a.style === 'gold' ? 'var(--gold-light)' : a.style === 'primary' ? 'var(--primary-light)' : a.style === 'accent' ? 'var(--accent-light)' : 'var(--foreground-muted)',
              border: '1px solid',
              borderColor: a.style === 'gold' ? 'rgba(245,158,11,0.25)' : a.style === 'primary' ? 'rgba(99,102,241,0.25)' : a.style === 'accent' ? 'rgba(16,185,129,0.25)' : 'var(--border)',
            }}>
              {a.label}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent draws */}
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={16} style={{ color: 'var(--gold-light)' }} /> Recent Draws
          </h2>
          <Link href="/admin/draws" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Manage Draws <ChevronRight size={13} />
          </Link>
        </div>
        {recentDraws.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--foreground-muted)' }}>No draws yet.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Month</th><th>Algorithm</th><th>Draw Numbers</th><th>Status</th><th>Jackpot</th></tr>
            </thead>
            <tbody>
              {recentDraws.map(draw => (
                <tr key={draw.id}>
                  <td style={{ fontWeight: 600 }}>{getMonthName(draw.month)} {draw.year}</td>
                  <td><span className="badge badge-muted">{draw.algorithm_type}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {draw.draw_numbers?.map((n, i) => (
                        <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>{n}</div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${draw.status === 'published' || draw.status === 'completed' ? 'badge-success' : draw.status === 'simulation' ? 'badge-primary' : 'badge-muted'}`}>
                      {draw.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--gold-light)', fontWeight: 700 }}>£{draw.jackpot_amount?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  )
}
