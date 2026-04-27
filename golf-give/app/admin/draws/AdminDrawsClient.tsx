'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Play, Eye, CheckCircle, AlertTriangle, Plus } from 'lucide-react'
import { getMonthName } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Draw, PrizePool } from '@/types'

const MONTHLY_CONTRIBUTION = 5 // £5 per subscriber per month

interface Props {
  draws: (Draw & { prize_pools?: PrizePool | null })[]
  activeSubscriberCount: number
}

export default function AdminDrawsClient({ draws, activeSubscriberCount }: Props) {
  const [creating, setCreating] = useState(false)
  const [algorithm, setAlgorithm] = useState<'random' | 'algorithmic'>('random')
  const [simulating, setSimulating] = useState<string | null>(null)
  const [publishing, setPublishing] = useState<string | null>(null)
  const [newDrawResult, setNewDrawResult] = useState<number[] | null>(null)

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  const estimatedPool = activeSubscriberCount * MONTHLY_CONTRIBUTION

  const handleCreateDraw = async () => {
    setCreating(true)
    try {
      const res = await fetch('/api/admin/draws/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: currentMonth, year: currentYear, algorithmType: algorithm }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed to create draw'); return }
      setNewDrawResult(data.drawNumbers)
      toast.success(`Draw created! Numbers: ${data.drawNumbers.join(', ')}`)
      setTimeout(() => window.location.reload(), 1500)
    } catch { toast.error('Network error') } finally { setCreating(false) }
  }

  const handleSimulate = async (drawId: string) => {
    setSimulating(drawId)
    try {
      const res = await fetch(`/api/admin/draws/${drawId}/simulate`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Simulation failed'); return }
      toast.success(`Simulation: ${data.winners} winner(s) found`)
      setTimeout(() => window.location.reload(), 1000)
    } catch { toast.error('Network error') } finally { setSimulating(null) }
  }

  const handlePublish = async (drawId: string) => {
    if (!confirm('Publish this draw? This will notify all winners and cannot be undone.')) return
    setPublishing(drawId)
    try {
      const res = await fetch(`/api/admin/draws/${drawId}/publish`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Publish failed'); return }
      toast.success('Draw published successfully!')
      setTimeout(() => window.location.reload(), 1000)
    } catch { toast.error('Network error') } finally { setPublishing(null) }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={24} style={{ color: 'var(--gold-light)' }} /> Draw Management
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>Create, simulate, and publish monthly draws.</p>
      </motion.div>

      {/* Create draw panel */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', border: '1px solid rgba(245,158,11,0.2)' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} style={{ color: 'var(--gold-light)' }} /> Create {getMonthName(currentMonth)} {currentYear} Draw
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Active Subscribers', value: activeSubscriberCount },
            { label: 'Estimated Pool', value: `£${estimatedPool.toFixed(2)}` },
            { label: '5-Match Pool (40%)', value: `£${(estimatedPool * 0.4).toFixed(2)}` },
            { label: '4-Match Pool (35%)', value: `£${(estimatedPool * 0.35).toFixed(2)}` },
            { label: '3-Match Pool (25%)', value: `£${(estimatedPool * 0.25).toFixed(2)}` },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(245,158,11,0.06)', borderRadius: '10px', padding: '0.875rem 1rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)', marginBottom: '0.2rem' }}>{s.label}</p>
              <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-light)' }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: '0.4rem' }}>Algorithm</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['random', 'algorithmic'] as const).map(a => (
                <button key={a} id={`algo-${a}`} onClick={() => setAlgorithm(a)} style={{
                  padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
                  borderColor: algorithm === a ? 'var(--gold)' : 'var(--border)',
                  background: algorithm === a ? 'rgba(245,158,11,0.1)' : 'transparent',
                  color: algorithm === a ? 'var(--gold-light)' : 'var(--foreground-muted)'
                }}>{a.charAt(0).toUpperCase() + a.slice(1)}</button>
              ))}
            </div>
          </div>
          <button id="create-draw-btn" onClick={handleCreateDraw} disabled={creating} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: creating ? 0.7 : 1, marginTop: '1.1rem' }}>
            <Zap size={16} /> {creating ? 'Creating…' : 'Run Draw'}
          </button>
        </div>

        {newDrawResult && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(245,158,11,0.08)', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.25)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)', marginBottom: '0.75rem' }}>Draw numbers generated:</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {newDrawResult.map((n, i) => <div key={i} className="draw-ball draw-ball-gold" style={{ width: '42px', height: '42px' }}>{n}</div>)}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Draws history */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>All Draws ({draws.length})</h2>
        </div>
        {draws.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--foreground-muted)' }}><Zap size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} /><p>No draws yet.</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: '750px' }}>
              <thead>
                <tr><th>Month</th><th>Numbers</th><th>Algorithm</th><th>Pool</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {draws.map(draw => (
                  <tr key={draw.id}>
                    <td style={{ fontWeight: 600 }}>{getMonthName(draw.month)} {draw.year}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {draw.draw_numbers?.length > 0
                          ? draw.draw_numbers.map((n, i) => <div key={i} style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>{n}</div>)
                          : <span style={{ color: 'var(--foreground-subtle)', fontSize: '0.8rem' }}>—</span>}
                      </div>
                    </td>
                    <td><span className="badge badge-muted">{draw.algorithm_type}</span></td>
                    <td style={{ color: 'var(--gold-light)', fontWeight: 700 }}>£{(draw.prize_pools as PrizePool)?.total_pool?.toFixed(2) || '—'}</td>
                    <td><span className={`badge ${draw.status === 'published' || draw.status === 'completed' ? 'badge-success' : draw.status === 'simulation' ? 'badge-primary' : 'badge-muted'}`}>{draw.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {draw.status === 'pending' && (
                          <button onClick={() => handleSimulate(draw.id)} disabled={simulating === draw.id} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '7px', padding: '0.35rem 0.75rem', cursor: 'pointer', color: 'var(--primary-light)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: simulating === draw.id ? 0.7 : 1 }}>
                            <Eye size={12} /> {simulating === draw.id ? '…' : 'Simulate'}
                          </button>
                        )}
                        {(draw.status === 'pending' || draw.status === 'simulation') && (
                          <button onClick={() => handlePublish(draw.id)} disabled={publishing === draw.id} style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '7px', padding: '0.35rem 0.75rem', cursor: 'pointer', color: 'var(--gold-light)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: publishing === draw.id ? 0.7 : 1 }}>
                            <CheckCircle size={12} /> {publishing === draw.id ? '…' : 'Publish'}
                          </button>
                        )}
                        {(draw.status === 'published' || draw.status === 'completed') && (
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}><CheckCircle size={11} style={{ marginRight: '0.25rem' }} /> Published</span>
                        )}
                        {draw.jackpot_carried_forward && <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>Jackpot rolled</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
