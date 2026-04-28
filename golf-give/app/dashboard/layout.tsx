'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Trophy, LayoutDashboard, Target, Heart, Zap, Award,
  Settings, LogOut, Menu, X, Shield, ChevronRight
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/scores', label: 'My Scores', icon: Target },
  { href: '/dashboard/draws', label: 'Draws', icon: Zap },
  { href: '/dashboard/charity', label: 'My Charity', icon: Heart },
  { href: '/dashboard/winnings', label: 'Winnings', icon: Award },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: authData } = await supabase.auth.getUser()
      const userId = authData.user?.id
      if (!userId) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      if (profile?.role === 'admin') setIsAdmin(true)
    }
    checkAdmin()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const Sidebar = () => (
    <div style={{
      width: '240px', height: '100vh', position: 'fixed', left: 0, top: 0,
      background: 'var(--background-secondary)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column', zIndex: 40
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Golf &amp; Give
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.75rem', marginBottom: '0.5rem' }}>Member Area</p>
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.875rem', borderRadius: '10px', textDecoration: 'none',
                background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: active ? 'var(--primary-light)' : 'var(--foreground-muted)',
                fontSize: '0.875rem', fontWeight: active ? 600 : 400,
                borderLeft: active ? '2px solid var(--primary)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <item.icon size={17} />
              {item.label}
              {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
        {isAdmin && (
          <Link href="/admin" style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.65rem 0.875rem', borderRadius: '10px', textDecoration: 'none',
            color: 'var(--gold-light)', fontSize: '0.875rem', marginBottom: '0.25rem',
            transition: 'background 0.2s'
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Shield size={17} /> Admin Panel
          </Link>
        )}
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
          padding: '0.65rem 0.875rem', borderRadius: '10px', background: 'transparent',
          border: 'none', cursor: 'pointer', color: 'var(--rose)', fontSize: '0.875rem', transition: 'background 0.2s'
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(244,63,94,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:block" style={{ width: '240px', flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '60px',
        background: 'var(--background-secondary)', borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1rem', zIndex: 50
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={15} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 800, fontSize: '1rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Golf &amp; Give</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer' }}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden" style={{ position: 'fixed', inset: 0, zIndex: 45 }}>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '260px', zIndex: 50 }}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <main style={{ flex: 1, padding: '2rem', paddingTop: '4.5rem', background: 'var(--background)', minHeight: '100vh' }} className="lg:pt-8">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
