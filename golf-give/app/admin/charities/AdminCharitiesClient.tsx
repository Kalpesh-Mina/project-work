'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Plus, Edit2, Trash2, Star, Eye, EyeOff, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Charity } from '@/types'

const EMPTY: Partial<Charity> = { name: '', description: '', long_description: '', website_url: '', is_featured: false, is_active: true }

export default function AdminCharitiesClient({ charities: initial }: { charities: Charity[] }) {
  const [charities, setCharities] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Charity | null>(null)
  const [form, setForm] = useState<Partial<Charity>>(EMPTY)
  const [saving, setSaving] = useState(false)

  const refresh = async () => {
    const res = await fetch('/api/admin/charities')
    if (res.ok) setCharities(await res.json())
  }

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = (c: Charity) => { setEditing(c); setForm(c); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name?.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    const method = editing ? 'PATCH' : 'POST'
    const body = editing ? { ...form, id: editing.id } : form
    const res = await fetch('/api/admin/charities', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const json = await res.json()
    if (!res.ok) { toast.error(json.error || 'Failed'); setSaving(false); return }
    toast.success(editing ? 'Charity updated' : 'Charity created')
    closeForm(); await refresh(); setSaving(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const res = await fetch('/api/admin/charities', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    const json = await res.json()
    if (!res.ok) { toast.error(json.error || 'Failed'); return }
    toast.success('Charity deleted')
    await refresh()
  }

  const toggleActive = async (c: Charity) => {
    const res = await fetch('/api/admin/charities', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.id, is_active: !c.is_active }) })
    const json = await res.json()
    if (!res.ok) { toast.error(json.error || 'Failed'); return }
    toast.success(`Charity ${!c.is_active ? 'activated' : 'deactivated'}`)
    await refresh()
  }

  const toggleFeatured = async (c: Charity) => {
    const res = await fetch('/api/admin/charities', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.id, is_featured: !c.is_featured }) })
    const json = await res.json()
    if (!res.ok) { toast.error(json.error || 'Failed'); return }
    toast.success(`Charity ${!c.is_featured ? 'featured' : 'unfeatured'}`)
    await refresh()
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={24} style={{ color: 'var(--accent-light)' }} /> Charities
            </h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>{charities.length} total charities</p>
          </div>
          <button id="add-charity-btn" onClick={openCreate} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
            <Plus size={16} /> Add Charity
          </button>
        </div>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>{editing ? 'Edit Charity' : 'Add New Charity'}</h2>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-muted)' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: '0.4rem' }}>Charity Name *</label>
                <input type="text" value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="e.g. Golf for Good Foundation" className="input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: '0.4rem' }}>Short Description</label>
                <input type="text" value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="One line summary" className="input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: '0.4rem' }}>Website URL</label>
                <input type="url" value={form.website_url || ''} onChange={e => setForm(p => ({ ...p, website_url: e.target.value }))} placeholder="https://…" className="input" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: '0.4rem' }}>Full Description</label>
                <textarea value={form.long_description || ''} onChange={e => setForm(p => ({ ...p, long_description: e.target.value }))} placeholder="Detailed charity description…" className="input" style={{ minHeight: '100px', resize: 'vertical' }} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Active', key: 'is_active' as const },
                  { label: 'Featured / Spotlight', key: 'is_featured' as const },
                ].map(({ label, key }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--foreground-muted)' }}>
                    <input type="checkbox" checked={!!form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))} style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }} />
                    {label}
                  </label>
                ))}
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem' }}>
                <button type="submit" disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', opacity: saving ? 0.7 : 1 }}>
                  <Save size={15} /> {saving ? 'Saving…' : editing ? 'Update Charity' : 'Create Charity'}
                </button>
                <button type="button" onClick={closeForm} className="btn-secondary" style={{ padding: '0.65rem 1.25rem' }}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charities list */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card" style={{ overflow: 'hidden' }}>
        {charities.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--foreground-muted)' }}><Heart size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} /><p>No charities yet.</p></div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Charity</th><th>Featured</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {charities.map(c => (
                <tr key={c.id}>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.name}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--foreground-muted)', marginTop: '0.15rem' }}>{c.description?.slice(0, 60)}…</p>
                  </td>
                  <td>
                    <button onClick={() => toggleFeatured(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.is_featured ? 'var(--gold-light)' : 'var(--foreground-subtle)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                      <Star size={15} fill={c.is_featured ? 'currentColor' : 'none'} /> {c.is_featured ? 'Featured' : 'Not featured'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => toggleActive(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      {c.is_active ? <span className="badge badge-success"><Eye size={11} style={{ marginRight: '0.25rem' }} />Active</span> : <span className="badge badge-muted"><EyeOff size={11} style={{ marginRight: '0.25rem' }} />Inactive</span>}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(c)} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '7px', padding: '0.35rem 0.75rem', cursor: 'pointer', color: 'var(--primary-light)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Edit2 size={12} /> Edit</button>
                      <button onClick={() => handleDelete(c.id, c.name)} style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '7px', padding: '0.35rem 0.75rem', cursor: 'pointer', color: '#fb7185', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Trash2 size={12} /> Delete</button>
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
