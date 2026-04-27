'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Shield, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Profile, Subscription } from '@/types'

type UserWithSub = Profile & { subscriptions?: Pick<Subscription, 'plan' | 'status' | 'current_period_end' | 'charity_percentage'>[] }

export default function AdminUsersClient({ users }: { users: UserWithSub[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'admin'>('all')

  const filtered = users.filter(u => {
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase())
    const sub = u.subscriptions?.[0]
    if (filter === 'all') return matchSearch
    if (filter === 'admin') return matchSearch && u.role === 'admin'
    if (filter === 'active') return matchSearch && sub?.status === 'active'
    if (filter === 'inactive') return matchSearch && (!sub || sub.status !== 'active')
    return matchSearch
  })

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={24} style={{ color: 'var(--primary-light)' }} /> User Management
        </h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>{users.length} total users registered</p>
      </motion.div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: '1 1 250px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-subtle)' }} />
          <input id="user-search" type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" className="input" style={{ paddingLeft: '2.4rem' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['all', 'active', 'inactive', 'admin'] as const).map(f => (
            <button key={f} id={`user-filter-${f}`} onClick={() => setFilter(f)} style={{
              padding: '0.6rem 1rem', borderRadius: '9px', border: '1px solid', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
              borderColor: filter === f ? 'var(--primary)' : 'var(--border)',
              background: filter === f ? 'rgba(99,102,241,0.1)' : 'transparent',
              color: filter === f ? 'var(--primary-light)' : 'var(--foreground-muted)'
            }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>Showing {filtered.length} of {users.length} users</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--foreground-muted)' }}><Users size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} /><p>No users found.</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: '700px' }}>
              <thead>
                <tr><th>User</th><th>Role</th><th>Subscription</th><th>Status</th><th>Charity %</th><th>Renewal</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const sub = u.subscriptions?.[0]
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                            {u.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.full_name || 'No name'}</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--foreground-muted)' }}>{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        {u.role === 'admin'
                          ? <span className="badge badge-gold"><Shield size={11} style={{ marginRight: '0.25rem' }} />Admin</span>
                          : <span className="badge badge-muted"><User size={11} style={{ marginRight: '0.25rem' }} />Subscriber</span>
                        }
                      </td>
                      <td>{sub ? <span className="badge badge-primary">{sub.plan}</span> : <span className="badge badge-muted">None</span>}</td>
                      <td>
                        <span className={`badge ${sub?.status === 'active' ? 'badge-success' : sub?.status === 'cancelled' ? 'badge-danger' : 'badge-muted'}`}>
                          {sub?.status || 'No sub'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--accent-light)', fontWeight: 600 }}>{sub?.charity_percentage ? `${sub.charity_percentage}%` : '—'}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{sub?.current_period_end ? formatDate(sub.current_period_end) : '—'}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{formatDate(u.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
