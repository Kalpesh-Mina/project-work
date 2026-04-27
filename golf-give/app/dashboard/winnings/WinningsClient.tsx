'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Award, Trophy, Upload, CheckCircle, XCircle, Clock } from 'lucide-react'
import { getMonthName, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { DrawResult, WinnerVerification } from '@/types'

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }) }

interface Props {
  results: (DrawResult & { draws?: { month: number; year: number } | null; winner_verifications?: WinnerVerification[] })[]
  userId: string
}

function VerificationBadge({ status }: { status: string }) {
  const map: Record<string, { className: string; icon: React.ReactNode; label: string }> = {
    pending: { className: 'badge-muted', icon: <Clock size={11} />, label: 'Under Review' },
    approved: { className: 'badge-success', icon: <CheckCircle size={11} />, label: 'Approved' },
    rejected: { className: 'badge-danger', icon: <XCircle size={11} />, label: 'Rejected' },
  }
  const s = map[status] || map.pending
  return <span className={`badge ${s.className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>{s.icon} {s.label}</span>
}

export default function WinningsClient({ results, userId }: Props) {
  const [uploading, setUploading] = useState<string | null>(null)
  const [fileMap, setFileMap] = useState<Record<string, File | null>>({})
  const supabase = createClient()

  const totalWon = results.filter(r => r.payment_status === 'paid').reduce((s, r) => s + r.prize_amount, 0)
  const pending = results.filter(r => r.payment_status === 'pending' || r.payment_status === 'verified')

  const handleFileChange = (resultId: string, file: File | null) => {
    setFileMap(prev => ({ ...prev, [resultId]: file }))
  }

  const handleUpload = async (result: DrawResult) => {
    const file = fileMap[result.id]
    if (!file) { toast.error('Please select a screenshot first'); return }
    setUploading(result.id)
    const path = `verifications/${userId}/${result.id}-${Date.now()}.${file.name.split('.').pop()}`
    const { error: uploadError } = await supabase.storage.from('verifications').upload(path, file)
    if (uploadError) { toast.error('Upload failed: ' + uploadError.message); setUploading(null); return }
    const { data: { publicUrl } } = supabase.storage.from('verifications').getPublicUrl(path)
    const { error: dbError } = await supabase.from('winner_verifications').insert({ draw_result_id: result.id, user_id: userId, screenshot_url: publicUrl })
    if (dbError) { toast.error(dbError.message); setUploading(null); return }
    toast.success('Verification submitted! Our team will review it shortly.')
    setUploading(null)
    window.location.reload()
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={24} style={{ color: 'var(--gold-light)' }} /> My Winnings
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>Track your draw winnings and submit verification documents.</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Won', value: `£${totalWon.toFixed(2)}`, icon: Trophy, color: 'gold' },
          { label: 'Pending Payout', value: pending.length, icon: Clock, color: 'primary' },
          { label: 'Total Wins', value: results.length, icon: Award, color: 'accent' },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" animate="visible" className="stat-card">
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', background: s.color === 'gold' ? 'rgba(245,158,11,0.12)' : s.color === 'primary' ? 'rgba(99,102,241,0.12)' : 'rgba(16,185,129,0.12)' }}>
              <s.icon size={18} style={{ color: s.color === 'gold' ? 'var(--gold-light)' : s.color === 'primary' ? 'var(--primary-light)' : 'var(--accent-light)' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.15rem' }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--foreground-muted)' }}>
          <Trophy size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>No winnings yet. Keep entering draws!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {results.map((result, i) => {
            const verification = result.winner_verifications?.[0]
            const needsVerification = !verification && (result.payment_status === 'pending' || result.payment_status === 'verified')
            return (
              <motion.div key={result.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card" style={{ padding: '1.5rem', border: result.match_type === 5 ? '1px solid rgba(245,158,11,0.4)' : '1px solid var(--border)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: needsVerification ? '1.25rem' : 0 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>
                        {result.draws ? `${getMonthName(result.draws.month)} ${result.draws.year}` : 'Draw'} — {result.match_type}-Number Match
                      </h2>
                      {result.match_type === 5 && <span className="badge badge-gold">🏆 Jackpot</span>}
                    </div>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                      Matched numbers: {result.matched_numbers?.join(', ')}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span className={`badge ${result.payment_status === 'paid' ? 'badge-success' : result.payment_status === 'rejected' ? 'badge-danger' : 'badge-muted'}`}>
                        Payment: {result.payment_status}
                      </span>
                      {verification && <VerificationBadge status={verification.status} />}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 900, color: 'var(--gold-light)', lineHeight: 1 }}>
                      £{result.prize_amount.toFixed(2)}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>prize amount</p>
                  </div>
                </div>

                {/* Upload verification */}
                {needsVerification && (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--foreground-muted)' }}>
                      📎 Submit Verification — Upload a screenshot of your scores from the golf platform
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <input id={`verify-upload-${result.id}`} type="file" accept="image/*" onChange={e => handleFileChange(result.id, e.target.files?.[0] || null)} className="input" style={{ flex: '1 1 200px', padding: '0.5rem', fontSize: '0.85rem' }} />
                      <button onClick={() => handleUpload(result)} disabled={uploading === result.id} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', fontSize: '0.875rem', opacity: uploading === result.id ? 0.7 : 1, whiteSpace: 'nowrap' }}>
                        <Upload size={15} /> {uploading === result.id ? 'Uploading…' : 'Submit'}
                      </button>
                    </div>
                  </div>
                )}

                {verification?.admin_notes && (
                  <div style={{ marginTop: '1rem', background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>
                    <strong style={{ color: '#fb7185' }}>Admin notes:</strong> {verification.admin_notes}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
