'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { Menu, X, Trophy, Heart, ChevronDown, LogOut, User, LayoutDashboard, Shield } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<{ email: string; role?: string } | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(async (res: { data: { user: SupabaseUser | null } }) => {
      const u = res.data.user
      if (u) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', u.id).single()
        setUser({ email: u.email!, role: profile?.role })
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange(async (event: string, session: Session | null) => {
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
        setUser({ email: session.user.email!, role: profile?.role })
      } else {
        setUser(null)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const navLinks = [
    { href: '/charities', label: 'Charities' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/draws', label: 'Draws' },
  ]

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.3s',
        background: scrolled ? 'rgba(13,13,34,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : 'none',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between" style={{ height: '70px' }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Trophy size={20} color="white" />
            </div>
            <span style={{
              fontFamily: 'var(--font-outfit)', fontWeight: 800, fontSize: '1.25rem',
              background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              Golf&nbsp;&amp;&nbsp;Give
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="nav-desktop" style={{ alignItems: 'center', gap: '2rem' }}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="animated-underline"
                style={{
                  textDecoration: 'none',
                  color: pathname === link.href ? 'var(--primary-light)' : 'var(--foreground-muted)',
                  fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="nav-right-desktop" style={{ alignItems: 'center', gap: '0.75rem' }}>
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2"
                  style={{
                    background: 'rgba(99,102,241,0.1)', border: '1px solid var(--border)',
                    borderRadius: '10px', padding: '0.5rem 1rem', color: 'var(--foreground)',
                    cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'white'
                  }}>
                    {user.email[0].toUpperCase()}
                  </div>
                  <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {dropdownOpen && (
                  <div
                    className="glass-card"
                    style={{
                      position: 'absolute', right: 0, top: '110%', minWidth: '200px',
                      padding: '0.5rem', zIndex: 100
                    }}
                  >
                    <Link href="/dashboard" onClick={() => setDropdownOpen(false)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.6rem 0.75rem', borderRadius: '8px', textDecoration: 'none',
                      color: 'var(--foreground)', fontSize: '0.9rem', transition: 'background 0.2s'
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.1)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.6rem 0.75rem', borderRadius: '8px', textDecoration: 'none',
                        color: 'var(--gold-light)', fontSize: '0.9rem', transition: 'background 0.2s'
                      }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.1)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Shield size={15} /> Admin Panel
                      </Link>
                    )}
                    <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.25rem 0' }} />
                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                      padding: '0.6rem 0.75rem', borderRadius: '8px',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: 'var(--rose)', fontSize: '0.9rem', transition: 'background 0.2s'
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(244,63,94,0.1)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', textDecoration: 'none' }}>
                  Sign In
                </Link>
                <Link href="/signup" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', textDecoration: 'none' }}>
                  Subscribe Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button - hidden on wide screens */}
          <button
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer', display: 'none' }}
            id="mobile-menu-btn"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="glass-card" style={{ margin: '0 0 1rem', padding: '1rem' }}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'block', padding: '0.75rem', textDecoration: 'none',
                  color: 'var(--foreground-muted)', borderRadius: '8px',
                  transition: 'background 0.2s'
                }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.5rem 0' }} />
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.75rem', textDecoration: 'none', color: 'var(--foreground)', borderRadius: '8px'
                }}>
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                <button onClick={handleLogout} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                  padding: '0.75rem', background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--rose)', borderRadius: '8px', fontSize: '1rem'
                }}>
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Link href="/login" className="btn-secondary" style={{ textAlign: 'center', textDecoration: 'none' }}>Sign In</Link>
                <Link href="/signup" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>Subscribe Now</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
