'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react'
import { getMonthName, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Verification {
  id: string
  screenshot_url: string
  status: string
  admin_notes: string | null
  submitted_at: string
  profiles?: { full_name: string | null; email: string } | null
  draw_results?: { prize_amount: number; match_type: number; draws?: { month: number; year: number } | null } | null
}

interface Result {
  id: string
  prize_amount: number
  match_type: number
  payment_status: string
  profiles?: { full_name: string | null; email: string } | null
  draws?: { month: number; year: number } | null
}

interface Props { verifications: Verification[]; results: Result[] }

export default function AdminWinnersClient({ verifications, results }: Props) {
  const [tab, setTab] = useState<'verifications' | 'results'>('verifications')
  const [processing, setProcessing] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const handleVerify = async (id: string, action: 'approved' | 'rejected') => {
    setProcessing(id)
    try {
      const res = await fetch(`/api/admin/verifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action, adminNotes: notes[id] || '' }),
      })
      if (!res.ok) { toast.error('Action failed'); return }
      toast.success(`Verification ${action}`)
      setTimeout(() => window.location.reload(), 800)
    } catch { toast.error('Network error') } finally { setProcessing(null) }
  }

  const handleMarkPaid = async (resultId: string) => {
    setProcessing(resultId)
    try {
      const res = await fetch(`/api/admin/results/${resultId}/pay`, { method: 'PATCH' })
      if (!res.ok) { toast.error('Failed to update'); return }
      toast.success('Marked as paid')
      setTimeout(() => window.location.reload(), 800)
    } catch { toast.error('Network error') } finally { setProcessing(null) }
  }

  const pending = verifications.filter(v => v.status === 'pending')

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={24} style={{ color: 'var(--gold-light)' }} /> Winners Management
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>Review verification submissions and manage prize payouts.</p>
      </motion.div>

      {pending.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '10px', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Clock size={18} style={{ color: 'var(--gold-light)', flexShrink: 0 }} />
          <p style={{ fontSize: '0.875rem', color: 'var(--foreground-muted)' }}>
            <strong style={{ color: 'var(--gold-light)' }}>{pending.length} verification{pending.length > 1 ? 's' : ''}</strong> pending review
          </p>
        </motion.div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['verifications', 'results'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '0.6rem 1.25rem', borderRadius: '9px', border: '1px solid', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s',
            borderColor: tab === t ? 'var(--gold)' : 'var(--border)',
            background: tab === t ? 'rgba(245,158,11,0.1)' : 'transparent',
            color: tab === t ? 'var(--gold-light)' : 'var(--foreground-muted)'
          }}>
            {t === 'verifications' ? `Verifications (${verifications.length})` : `All Winners (${results.length})`}
          </button>
        ))}
      </div>

      {tab === 'verifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {verifications.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--foreground-muted)' }}>
              <CheckCircle size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} /><p>No verification submissions yet.</p>
            </div>
          ) : verifications.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card" style={{ padding: '1.5rem', border: v.status === 'pending' ? '1px solid rgba(245,158,11,0.3)' : '1px solid var(--border)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{v.profiles?.full_name || v.profiles?.email}</p>
                  <p style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>{v.profiles?.email}</p>
                  <p style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {v.draw_results?.draws ? `${getMonthName(v.draw_results.draws.month)} ${v.draw_results.draws.year}` : ''} · {v.draw_results?.match_type}-Match · £{v.draw_results?.prize_amount?.toFixed(2)}
                  </p>
                  <p style={{ color: 'var(--foreground-subtle)', fontSize: '0.75rem', marginTop: '0.2rem' }}>Submitted {formatDate(v.submitted_at)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span className={`badge ${v.status === 'approved' ? 'badge-success' : v.status === 'rejected' ? 'badge-danger' : 'badge-gold'}`}>
                    {v.status === 'pending' ? '⏳ Pending' : v.status === 'approved' ? '✓ Approved' : '✕ Rejected'}
                  </span>
                  <a href={v.screenshot_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none' }}>
                    <ExternalLink size={13} /> View Screenshot
                  </a>
                </div>
              </div>
              {v.status === 'pending' && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <textarea
                    placeholder="Admin notes (optional)…"
                    value={notes[v.id] || ''}
                    onChange={e => setNotes(prev => ({ ...prev, [v.id]: e.target.value }))}
                    className="input" style={{ marginBottom: '0.75rem', minHeight: '70px', resize: 'vertical', fontSize: '0.85rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => handleVerify(v.id, 'approved')} disabled={processing === v.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', borderRadius: '9px', border: 'none', cursor: 'pointer', background: 'rgba(16,185,129,0.15)', color: 'var(--accent-light)', fontWeight: 600, fontSize: '0.875rem', opacity: processing === v.id ? 0.7 : 1 }}>
                      <CheckCircle size={15} /> Approve
                    </button>
                    <button onClick={() => handleVerify(v.id, 'rejected')} disabled={processing === v.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', borderRadius: '9px', border: 'none', cursor: 'pointer', background: 'rgba(244,63,94,0.1)', color: '#fb7185', fontWeight: 600, fontSize: '0.875rem', opacity: processing === v.id ? 0.7 : 1 }}>
                      <XCircle size={15} /> Reject
                    </button>
                  </div>
                </div>
              )}
              {v.admin_notes && <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--foreground-muted)', fontStyle: 'italic' }}>Notes: {v.admin_notes}</p>}
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'results' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: '700px' }}>
              <thead>
                <tr><th>Winner</th><th>Draw</th><th>Match</th><th>Prize</th><th>Payment</th><th>Action</th></tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id}>
                    <td>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.profiles?.full_name || '—'}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>{r.profiles?.email}</p>
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>{r.draws ? `${getMonthName(r.draws.month)} ${r.draws.year}` : '—'}</td>
                    <td><span className={`badge ${r.match_type === 5 ? 'badge-gold' : r.match_type === 4 ? 'badge-primary' : 'badge-muted'}`}>{r.match_type}-Match</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--gold-light)' }}>£{r.prize_amount.toFixed(2)}</td>
                    <td><span className={`badge ${r.payment_status === 'paid' ? 'badge-success' : r.payment_status === 'rejected' ? 'badge-danger' : 'badge-muted'}`}>{r.payment_status}</span></td>
                    <td>
                      {(r.payment_status === 'pending' || r.payment_status === 'verified') && (
                        <button onClick={() => handleMarkPaid(r.id)} disabled={processing === r.id} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '7px', padding: '0.35rem 0.75rem', cursor: 'pointer', color: 'var(--accent-light)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: processing === r.id ? 0.7 : 1 }}>
                          <CheckCircle size={12} /> Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}
