'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Plus, Edit2, Trash2, Save, X, Info } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Score } from '@/types'

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [scoreVal, setScoreVal] = useState('')
  const [dateVal, setDateVal] = useState('')
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUserId(user.id); fetchScores(user.id) }
    })
  }, [])

  const fetchScores = async (uid: string) => {
    setLoading(true)
    const { data } = await supabase.from('scores').select('*').eq('user_id', uid).order('score_date', { ascending: false })
    setScores(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    const s = parseInt(scoreVal)
    if (isNaN(s) || s < 1 || s > 45) { toast.error('Score must be between 1 and 45'); return }
    setSaving(true)
    if (editId) {
      const { error } = await supabase.from('scores').update({ score: s, score_date: dateVal, updated_at: new Date().toISOString() }).eq('id', editId)
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success('Score updated')
    } else {
      const existing = scores.find(sc => sc.score_date === dateVal)
      if (existing) { toast.error('A score for this date already exists.'); setSaving(false); return }
      const { error } = await supabase.from('scores').insert({ user_id: userId, score: s, score_date: dateVal })
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success('Score added')
    }
    setShowForm(false); setEditId(null); setScoreVal(''); setDateVal('')
    fetchScores(userId)
    setSaving(false)
  }

  const handleEdit = (score: Score) => {
    setEditId(score.id); setScoreVal(String(score.score)); setDateVal(score.score_date); setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!userId || !confirm('Delete this score?')) return
    const { error } = await supabase.from('scores').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success('Score deleted')
    fetchScores(userId)
  }

  const resetForm = () => { setShowForm(false); setEditId(null); setScoreVal(''); setDateVal('') }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={24} style={{ color: 'var(--primary-light)' }} /> My Scores
            </h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>Enter your Stableford scores (1–45). Only your latest 5 are kept.</p>
          </div>
          {!showForm && (
            <button id="add-score-btn" onClick={() => setShowForm(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
              <Plus size={16} /> Add Score
            </button>
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
        <Info size={16} style={{ color: 'var(--primary-light)', flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)', lineHeight: 1.6 }}>
          You can have up to <strong style={{ color: 'var(--foreground)' }}>5 scores</strong>. A 6th entry auto-removes the oldest. <strong style={{ color: 'var(--foreground)' }}>One score per date</strong> — edit or delete existing entries to change them.
        </p>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>{editId ? 'Edit Score' : 'Add New Score'}</h2>
              <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-muted)' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 140px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: '0.4rem' }}>Score (1–45)</label>
                <input id="score-input" type="number" min={1} max={45} value={scoreVal} onChange={e => setScoreVal(e.target.value)} required placeholder="e.g. 28" className="input" />
              </div>
              <div style={{ flex: '1 1 180px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: '0.4rem' }}>Date Played</label>
                <input id="score-date" type="date" value={dateVal} onChange={e => setDateVal(e.target.value)} required max={new Date().toISOString().split('T')[0]} className="input" />
              </div>
              <button id="score-save" type="submit" disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem', opacity: saving ? 0.7 : 1, whiteSpace: 'nowrap' }}>
                <Save size={15} /> {saving ? 'Saving…' : editId ? 'Update' : 'Save Score'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Your Scores ({scores.length}/5)</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '100px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ width: `${(scores.length / 5) * 100}%`, height: '100%', background: 'var(--gradient-primary)', borderRadius: '3px', transition: 'width 0.5s ease' }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>{scores.length}/5</span>
          </div>
        </div>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading…</div>
        ) : scores.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--foreground-muted)' }}>
            <Target size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>No scores yet. Add your first Stableford score!</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>#</th><th>Date</th><th>Score</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {scores.map((score, i) => (
                <tr key={score.id}>
                  <td style={{ color: 'var(--foreground-subtle)', fontSize: '0.8rem' }}>{i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{formatDate(score.score_date)}</td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><div className="draw-ball" style={{ width: '38px', height: '38px', fontSize: '0.9rem' }}>{score.score}</div><span style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>pts</span></div></td>
                  <td>{i === 0 ? <span className="badge badge-success">Latest</span> : <span className="badge badge-muted">Active</span>}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleEdit(score)} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '7px', padding: '0.4rem 0.75rem', cursor: 'pointer', color: 'var(--primary-light)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Edit2 size={13} /> Edit</button>
                      <button onClick={() => handleDelete(score.id)} style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '7px', padding: '0.4rem 0.75rem', cursor: 'pointer', color: '#fb7185', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Trash2 size={13} /> Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  )
}
