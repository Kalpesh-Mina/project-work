'use client'

import Link from 'next/link'
import { Trophy, Heart, Share2, Globe, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--background-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Trophy size={20} color="white" />
              </div>
              <span style={{
                fontFamily: 'var(--font-outfit)', fontWeight: 800, fontSize: '1.2rem',
                background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>
                Golf &amp; Give
              </span>
            </div>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '220px' }}>
              Play golf. Enter draws. Support the charities you love. Every score counts for good.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              {[Share2, Globe, Mail].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(99,102,241,0.1)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--foreground-muted)', transition: 'all 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.2)'; e.currentTarget.style.color = 'var(--primary-light)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = 'var(--foreground-muted)' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-outfit)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Platform</h4>
            {[
              { href: '/how-it-works', label: 'How It Works' },
              { href: '/draws', label: 'Monthly Draws' },
              { href: '/charities', label: 'Charities' },
              { href: '/pricing', label: 'Pricing' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                display: 'block', marginBottom: '0.6rem', textDecoration: 'none',
                color: 'var(--foreground-muted)', fontSize: '0.9rem', transition: 'color 0.2s'
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-light)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--foreground-muted)')}
              >{link.label}</Link>
            ))}
          </div>

          {/* Account */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-outfit)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Account</h4>
            {[
              { href: '/signup', label: 'Create Account' },
              { href: '/login', label: 'Sign In' },
              { href: '/dashboard', label: 'My Dashboard' },
              { href: '/dashboard/scores', label: 'My Scores' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                display: 'block', marginBottom: '0.6rem', textDecoration: 'none',
                color: 'var(--foreground-muted)', fontSize: '0.9rem', transition: 'color 0.2s'
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-light)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--foreground-muted)')}
              >{link.label}</Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-outfit)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Legal</h4>
            {[
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
              { href: '/cookies', label: 'Cookie Policy' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                display: 'block', marginBottom: '0.6rem', textDecoration: 'none',
                color: 'var(--foreground-muted)', fontSize: '0.9rem', transition: 'color 0.2s'
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-light)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--foreground-muted)')}
              >{link.label}</Link>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <p style={{ color: 'var(--foreground-subtle)', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} Golf &amp; Give. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground-subtle)', fontSize: '0.85rem' }}>
            <span>Made with</span>
            <Heart size={14} style={{ color: 'var(--rose)' }} />
            <span>for the golf community</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
