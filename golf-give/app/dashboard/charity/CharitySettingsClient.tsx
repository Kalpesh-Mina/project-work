'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, Save, Star, Lock, Trophy, ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Subscription, Charity } from '@/types'

interface Props {
  subscription: (Subscription & { charities?: Charity | null }) | null
  charities: Charity[]
  userId: string
}

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: '£19.99', period: '/month' },
  { id: 'yearly', label: 'Yearly', price: '£199.99', period: '/year', badge: 'Save 17%' },
]

function SubscribeGate() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, charityId: '', charityPercentage: 10 }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Could not start checkout')
        setLoading(false)
      }
    } catch {
      toast.error('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Heart size={24} style={{ color: 'var(--accent-light)' }} /> My Charity
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>Choose which charity receives a portion of your subscription every month.</p>
      </motion.div>

      {/* Locked state */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {/* Blurred preview of charities behind a gate */}
        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Blurred charity cards preview */}
          <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.45 }}>
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Select a Charity</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { name: 'Golf for Good Foundation', desc: 'Supporting young golfers from underprivileged backgrounds…' },
                  { name: 'Youth Sports Initiative', desc: 'Enabling access to sport for children in deprived areas…' },
                  { name: 'Mental Health Through Sport', desc: 'Using sport as a tool for mental wellness and recovery…' },
                  { name: 'Cancer Research UK Golf', desc: 'Raising funds through the golfing community for cancer…' },
                ].map(c => (
                  <div key={c.name} style={{
                    background: 'rgba(255,255,255,0.02)', border: '2px solid var(--border)',
                    borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem'
                  }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Heart size={18} style={{ color: 'var(--primary-light)' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</p>
                      <p style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem', marginTop: '0.1rem' }}>{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lock overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.85) 40%, rgba(10,10,15,0.98) 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
            padding: '2.5rem 1.5rem 2rem'
          }}>
            {/* Lock icon */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))',
              border: '1px solid rgba(99,102,241,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 0 40px rgba(99,102,241,0.2)'
            }}>
              <Lock size={28} style={{ color: 'var(--primary-light)' }} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.4rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>
              Subscribe to Choose Your Charity
            </h2>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem', textAlign: 'center', maxWidth: '380px', lineHeight: 1.6, marginBottom: '2rem' }}>
              An active subscription lets you pick a charity and automatically donate a portion of your fee every month.
            </p>

            {/* Perks */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
              {['15+ verified charities', 'Min. 10% donated monthly', 'Change anytime'].map(perk => (
                <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>
                  <CheckCircle size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} /> {perk}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan selection + subscribe CTA (outside the blurred area) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-card"
          style={{ padding: '1.75rem', marginTop: '1rem', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Trophy size={18} style={{ color: 'var(--gold-light)' }} />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Choose a plan to unlock charities</span>
          </div>

          {/* Plan selector */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {PLANS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p.id as 'monthly' | 'yearly')}
                style={{
                  flex: 1, minWidth: '140px',
                  background: selectedPlan === p.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                  border: selectedPlan === p.id ? '2px solid var(--primary)' : '2px solid var(--border)',
                  borderRadius: '12px', padding: '0.875rem 1rem', cursor: 'pointer',
                  textAlign: 'left', color: 'var(--foreground)', transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 700, fontSize: '0.9rem' }}>{p.label}</span>
                  {'badge' in p && p.badge && (
                    <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>{p.badge}</span>
                  )}
                </div>
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.2rem', fontWeight: 800 }}>{p.price}</span>
                <span style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>{p.period}</span>
              </button>
            ))}
          </div>

          <button
            id="charity-subscribe-btn"
            onClick={handleSubscribe}
            disabled={loading}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', width: '100%', justifyContent: 'center', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
          >
            <Trophy size={17} />
            {loading ? 'Redirecting to payment…' : `Subscribe & Choose Charity — ${selectedPlan === 'monthly' ? '£19.99/mo' : '£199.99/yr'}`}
            {!loading && <ArrowRight size={16} />}
          </button>

          <p style={{ textAlign: 'center', marginTop: '0.875rem', color: 'var(--foreground-subtle)', fontSize: '0.8rem' }}>
            Stripe-secured · Cancel anytime · Min. 10% goes to your charity
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function CharitySettingsClient({ subscription, charities, userId }: Props) {
  const [selectedCharity, setSelectedCharity] = useState(subscription?.selected_charity_id || '')
  const [charityPct, setCharityPct] = useState(subscription?.charity_percentage || 10)
  const [saving, setSaving] = useState(false)

  // No subscription → show premium locked gate
  if (!subscription || subscription.status !== 'active') {
    return <SubscribeGate />
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/subscriptions/charity', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          charityId: selectedCharity || null,
          charityPercentage: charityPct,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to save preferences')
        return
      }
      toast.success('Charity preferences saved!')
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const monthlyFee = subscription.plan === 'yearly' ? 19999 / 12 : 1999
  const charityAmount = (monthlyFee * charityPct / 100) / 100

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Heart size={24} style={{ color: 'var(--accent-light)' }} /> My Charity
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>Choose which charity receives a portion of your subscription every month.</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', alignItems: 'start' }} className="lg:grid-cols-[2fr_1fr]">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Contribution percentage slider */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Contribution Percentage</h2>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--foreground-muted)' }}>Charity percentage</label>
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-light)' }}>{charityPct}%</span>
              </div>
              <input
                id="charity-pct-slider"
                type="range"
                min={10} max={100} step={5}
                value={charityPct}
                onChange={e => setCharityPct(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)', height: '6px', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--foreground-subtle)', marginTop: '0.35rem' }}>
                <span>10% (minimum)</span><span>100%</span>
              </div>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem' }}>Monthly donation amount</span>
              <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-light)' }}>£{charityAmount.toFixed(2)}</span>
            </div>
          </motion.div>

          {/* Charity selection */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Select a Charity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {charities.map(charity => (
                <button
                  key={charity.id}
                  id={`charity-select-${charity.id}`}
                  onClick={() => setSelectedCharity(charity.id)}
                  style={{
                    background: selectedCharity === charity.id ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)',
                    border: selectedCharity === charity.id ? '2px solid var(--accent)' : '2px solid var(--border)',
                    borderRadius: '12px', padding: '1rem 1.25rem', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s', color: 'var(--foreground)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                      background: selectedCharity === charity.id ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Heart size={18} style={{ color: selectedCharity === charity.id ? 'var(--accent-light)' : 'var(--primary-light)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{charity.name}</span>
                        {charity.is_featured && <Star size={13} style={{ color: 'var(--gold-light)' }} />}
                      </div>
                      <p style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem', marginTop: '0.15rem', lineHeight: 1.4 }}>{charity.description?.slice(0, 80)}…</p>
                    </div>
                    {selectedCharity === charity.id && (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          <button
            id="charity-save"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem', fontSize: '1rem', opacity: saving ? 0.7 : 1 }}
          >
            <Save size={17} /> {saving ? 'Saving…' : 'Save Preferences'}
          </button>
        </div>

        {/* Current summary sidebar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Settings</h3>
            {[
              { label: 'Selected Charity', value: subscription.charities?.name || 'None selected' },
              { label: 'Contribution', value: `${subscription.charity_percentage}%` },
              { label: 'Monthly Donation', value: `£${((monthlyFee * subscription.charity_percentage / 100) / 100).toFixed(2)}` },
              { label: 'Plan', value: subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{item.label}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
