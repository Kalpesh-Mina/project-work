'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Heart, Save, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Subscription, Charity } from '@/types'

interface Props {
  subscription: (Subscription & { charities?: Charity | null }) | null
  charities: Charity[]
  userId: string
}

export default function CharitySettingsClient({ subscription, charities, userId }: Props) {
  const [selectedCharity, setSelectedCharity] = useState(subscription?.selected_charity_id || '')
  const [charityPct, setCharityPct] = useState(subscription?.charity_percentage || 10)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const handleSave = async () => {
    if (!subscription) { toast.error('No active subscription found'); return }
    setSaving(true)
    const { error } = await supabase.from('subscriptions').update({
      selected_charity_id: selectedCharity || null,
      charity_percentage: charityPct,
      updated_at: new Date().toISOString()
    }).eq('id', subscription.id)
    if (error) { toast.error(error.message); setSaving(false); return }
    toast.success('Charity preferences saved!')
    setSaving(false)
  }

  const monthlyFee = subscription?.plan === 'yearly' ? 19999 / 12 : 1999
  const charityAmount = (monthlyFee * charityPct / 100) / 100

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Heart size={24} style={{ color: 'var(--accent-light)' }} /> My Charity
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>Choose which charity receives a portion of your subscription every month.</p>
      </motion.div>

      {!subscription ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--foreground-muted)' }}>
          <Heart size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>You need an active subscription to configure charity donations.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Contribution slider */}
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

            <button id="charity-save" onClick={handleSave} disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem', fontSize: '1rem', opacity: saving ? 0.7 : 1 }}>
              <Save size={17} /> {saving ? 'Saving…' : 'Save Preferences'}
            </button>
          </div>

          {/* Current summary */}
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
      )}
    </div>
  )
}
