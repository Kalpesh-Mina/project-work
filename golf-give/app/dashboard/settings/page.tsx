'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Settings, User, Bell, Save, Key } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [changingPw, setChangingPw] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      setName(data?.full_name || '')
      setLoading(false)
    })
  }, [])

  const handleSaveName = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profiles').update({ full_name: name, updated_at: new Date().toISOString() }).eq('id', user.id)
    if (error) { toast.error(error.message) } else { toast.success('Name updated!') }
    setSaving(false)
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setChangingPw(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) { toast.error(error.message) } else { toast.success('Password updated!'); setNewPassword('') }
    setChangingPw(false)
  }

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading…</div>

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={24} style={{ color: 'var(--primary-light)' }} /> Account Settings
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>Manage your profile and account preferences.</p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
        {/* Profile */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} style={{ color: 'var(--primary-light)' }} /> Profile
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: '0.4rem' }}>Full Name</label>
              <input id="settings-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="input" />
            </div>
            <button id="save-name" onClick={handleSaveName} disabled={saving} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem', opacity: saving ? 0.7 : 1, width: 'fit-content' }}>
              <Save size={15} /> {saving ? 'Saving…' : 'Save Name'}
            </button>
          </div>
        </motion.div>

        {/* Password */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="glass-card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={16} style={{ color: 'var(--primary-light)' }} /> Change Password
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: '0.4rem' }}>New Password</label>
              <input id="settings-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min. 8 characters" minLength={8} className="input" />
            </div>
            <button id="save-password" onClick={handleChangePassword} disabled={changingPw} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem', opacity: changingPw ? 0.7 : 1, width: 'fit-content' }}>
              <Key size={15} /> {changingPw ? 'Updating…' : 'Change Password'}
            </button>
          </div>
        </motion.div>

        {/* Notifications placeholder */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={16} style={{ color: 'var(--primary-light)' }} /> Notifications
          </h2>
          {[
            { label: 'Draw results published', desc: 'Get notified when monthly draw results are out' },
            { label: 'Win notification', desc: 'Alert when you win a prize' },
            { label: 'Subscription renewal', desc: 'Reminder before your subscription renews' },
          ].map(n => (
            <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{n.label}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--foreground-muted)', marginTop: '0.1rem' }}>{n.desc}</p>
              </div>
              <div style={{ width: '42px', height: '24px', borderRadius: '12px', background: 'var(--gradient-primary)', cursor: 'pointer', position: 'relative' }}>
                <div style={{ position: 'absolute', right: '3px', top: '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white' }} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
