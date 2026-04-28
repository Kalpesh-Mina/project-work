'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const PERKS = [
  'Enter monthly prize draws',
  'Track your Stableford scores',
  'Support your chosen charity',
  'Cancel anytime — no lock-in',
]

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 1. Create account
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    // 2. Sign in immediately so session is active
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      toast.success('Account created! Please log in.')
      router.push('/login')
      return
    }

    // 3. Go to dashboard — user can subscribe from there
    toast.success('Account created! Welcome to Golf & Give 🎉')
    router.push('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--gradient-hero)', padding: '2rem 1rem'
    }}>
      <div style={{ position: 'fixed', top: '20%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '15%', left: '8%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={24} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 800, fontSize: '1.5rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Golf &amp; Give
            </span>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Create your account
          </h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>
            Join Golf &amp; Give — play, win, and give back every month.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2.25rem' }}>
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--foreground-muted)' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-subtle)' }} />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="John Smith"
                  className="input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--foreground-muted)' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-subtle)' }} />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--foreground-muted)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-subtle)' }} />
                <input
                  id="signup-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Min. 8 characters"
                  minLength={8}
                  className="input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-subtle)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Perks */}
            <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '10px', padding: '0.875rem 1rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>What you get</p>
              {PERKS.map(perk => (
                <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>
                  <CheckCircle size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} /> {perk}
                </div>
              ))}
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creating account…' : (<>Create Account <ArrowRight size={16} /></>)}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', color: 'var(--foreground-subtle)', fontSize: '0.8rem' }}>
          Free to create an account · Subscribe from your dashboard · Stripe-secured
        </p>
      </div>
    </div>
  )
}
