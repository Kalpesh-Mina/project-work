'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trophy, Target, Heart, Zap, Award, Clock, CheckCircle, AlertCircle, ChevronRight, TrendingUp } from 'lucide-react'
import { formatDate, getMonthName } from '@/lib/utils'
import type { Profile, Subscription, Score, DrawResult } from '@/types'
import toast from 'react-hot-toast'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { className: string; label: string }> = {
    active: { className: 'badge-success', label: '● Active' },
    inactive: { className: 'badge-muted', label: '○ Inactive' },
    cancelled: { className: 'badge-danger', label: '✕ Cancelled' },
    past_due: { className: 'badge-danger', label: '! Past Due' },
  }
  const s = map[status] || { className: 'badge-muted', label: status }
  return <span className={`badge ${s.className}`}>{s.label}</span>
}

interface Props {
  profile: Profile | null
  subscription: (Subscription & { charities?: { name: string } | null }) | null
  scores: Score[]
  results: (DrawResult & { draws?: { month: number; year: number } | null })[]
}

export default function DashboardOverviewClient({ profile, subscription, scores, results }: Props) {
  const isActive = subscription?.status === 'active'
  const totalWon = results.filter(r => r.payment_status === 'paid').reduce((s, r) => s + r.prize_amount, 0)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const handleSubscribe = async () => {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'monthly', charityId: '', charityPercentage: 10 }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Could not start checkout')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const stats = [
    {
      icon: CheckCircle, label: 'Subscription', value: subscription ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) : 'None',
      sub: subscription ? <StatusBadge status={subscription.status} /> : null,
      color: 'primary'
    },
    { icon: Target, label: 'Scores Entered', value: scores.length, sub: 'of 5 max', color: 'accent' },
    { icon: Zap, label: 'Draws Entered', value: results.length, sub: 'total draws', color: 'gold' },
    { icon: Award, label: 'Total Winnings', value: `£${totalWon.toFixed(2)}`, sub: 'lifetime', color: 'rose' },
  ]

  return (
    <div>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>
          Here&apos;s an overview of your Golf &amp; Give account.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map((s, i) => (
          <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" animate="visible" className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: s.color === 'primary' ? 'rgba(99,102,241,0.12)' : s.color === 'accent' ? 'rgba(16,185,129,0.12)' : s.color === 'gold' ? 'rgba(245,158,11,0.12)' : 'rgba(244,63,94,0.12)'
              }}>
                <s.icon size={18} style={{ color: s.color === 'primary' ? 'var(--primary-light)' : s.color === 'accent' ? 'var(--accent-light)' : s.color === 'gold' ? 'var(--gold-light)' : '#fb7185' }} />
              </div>
              <ChevronRight size={14} style={{ color: 'var(--foreground-subtle)' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.15rem' }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', marginBottom: '0.25rem' }}>{s.label}</div>
            {s.sub && <div style={{ fontSize: '0.75rem' }}>{typeof s.sub === 'string' ? <span style={{ color: 'var(--foreground-subtle)' }}>{s.sub}</span> : s.sub}</div>}
          </motion.div>
        ))}
      </div>

      {/* Subscription alert */}
      {!isActive && (
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
          style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <AlertCircle size={20} style={{ color: '#fb7185', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fb7185' }}>No active subscription</p>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>Subscribe to enter monthly draws and support your chosen charity.</p>
          </div>
          <button
            onClick={handleSubscribe}
            disabled={checkoutLoading}
            className="btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap', opacity: checkoutLoading ? 0.7 : 1 }}
          >
            {checkoutLoading ? 'Loading…' : 'Subscribe Now'}
          </button>
        </motion.div>
      )}

      {/* Subscription details */}
      {subscription && (
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Subscription Details</h2>
            <StatusBadge status={subscription.status} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Plan', value: subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) },
              { label: 'Renews', value: subscription.current_period_end ? formatDate(subscription.current_period_end) : 'N/A' },
              { label: 'Charity', value: (subscription as { charities?: { name: string } | null }).charities?.name || 'Not selected' },
              { label: 'Charity %', value: `${subscription.charity_percentage}%` },
            ].map(item => (
              <div key={item.label}>
                <p style={{ fontSize: '0.75rem', color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{item.label}</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent scores */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={16} style={{ color: 'var(--primary-light)' }} /> My Scores
            </h2>
            <Link href="/dashboard/scores" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Manage <ChevronRight size={13} />
            </Link>
          </div>
          {scores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--foreground-muted)' }}>
              <Target size={32} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.875rem' }}>No scores entered yet.</p>
              <Link href="/dashboard/scores" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Add Score</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {scores.map((score, i) => (
                <div key={score.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.875rem', background: 'rgba(99,102,241,0.05)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === 0 ? 'var(--accent)' : 'var(--border)' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{formatDate(score.score_date)}</span>
                  </div>
                  <div className="draw-ball" style={{ width: '34px', height: '34px', fontSize: '0.9rem' }}>{score.score}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent results */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={16} style={{ color: 'var(--gold-light)' }} /> Recent Wins
            </h2>
            <Link href="/dashboard/winnings" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ChevronRight size={13} />
            </Link>
          </div>
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--foreground-muted)' }}>
              <Trophy size={32} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.875rem' }}>No winnings yet — keep playing!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {results.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.875rem', background: 'rgba(245,158,11,0.05)', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.15)' }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {r.draws ? `${getMonthName(r.draws.month)} ${r.draws.year}` : 'Draw'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>{r.match_type}-Number Match</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, color: 'var(--gold-light)', fontSize: '0.95rem' }}>£{r.prize_amount.toFixed(2)}</p>
                    <span className={`badge ${r.payment_status === 'paid' ? 'badge-success' : r.payment_status === 'rejected' ? 'badge-danger' : 'badge-muted'}`} style={{ fontSize: '0.65rem' }}>
                      {r.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
