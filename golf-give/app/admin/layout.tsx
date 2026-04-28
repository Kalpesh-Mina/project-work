'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Users, Zap, Heart, Award, BarChart2, LogOut, Menu, X, LayoutDashboard, ChevronRight } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/draws', label: 'Draws', icon: Zap },
  { href: '/admin/charities', label: 'Charities', icon: Heart },
  { href: '/admin/winners', label: 'Winners', icon: Award },
  { href: '/admin/reports', label: 'Reports', icon: BarChart2 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const Sidebar = () => (
    <div style={{ width: '220px', height: '100vh', position: 'fixed', left: 0, top: 0, background: '#0d0d22', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', zIndex: 40 }}>
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '0.25rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'var(--gradient-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={16} color="#1a1a2e" />
          </div>
          <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 800, fontSize: '1rem', color: 'var(--foreground)' }}>Golf &amp; Give</span>
        </Link>
        <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>Admin Panel</span>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.625rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', overflowY: 'auto' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.625rem', marginBottom: '0.5rem' }}>Management</p>
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem',
              borderRadius: '9px', textDecoration: 'none',
              background: active ? 'rgba(245,158,11,0.12)' : 'transparent',
              color: active ? 'var(--gold-light)' : 'var(--foreground-muted)',
              fontSize: '0.85rem', fontWeight: active ? 600 : 400,
              borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent', transition: 'all 0.2s'
            }}>
              <item.icon size={15} />
              {item.label}
              {active && <ChevronRight size={12} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '0.625rem', borderTop: '1px solid var(--border-subtle)' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.75rem', borderRadius: '9px', textDecoration: 'none', color: 'var(--primary-light)', fontSize: '0.85rem', marginBottom: '0.25rem', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <LayoutDashboard size={15} /> User Dashboard
        </Link>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', width: '100%', padding: '0.6rem 0.75rem', borderRadius: '9px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--rose)', fontSize: '0.85rem', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(244,63,94,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="hidden lg:block" style={{ width: '220px', flexShrink: 0 }}><Sidebar /></div>
      <div className="lg:hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '56px', background: '#0d0d22', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', zIndex: 50 }}>
        <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 800, fontSize: '1rem' }}>Admin</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer' }}>{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden" style={{ position: 'fixed', inset: 0, zIndex: 45 }}>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '240px', zIndex: 50 }}><Sidebar /></div>
        </div>
      )}
      <main style={{ flex: 1, padding: '2rem', paddingTop: '4.5rem', minHeight: '100vh' }} className="lg:pt-8">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>{children}</div>
      </main>
    </div>
  )
}
