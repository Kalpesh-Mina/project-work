'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: '£19.99', period: '/month', badge: null },
  { id: 'yearly', label: 'Yearly', price: '£199.99', period: '/year', badge: 'Save 17%' },
]

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly')
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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, plan } },
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }
    toast.success('Account created! Redirecting to dashboard…')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--gradient-hero)', padding: '2rem 1rem'
    }}>
      <div style={{ position: 'fixed', top: '20%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '15%', left: '8%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '520px', position: 'relative', zIndex: 1 }}>
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
            {step === 1 ? 'Choose your plan' : 'Create your account'}
          </h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>
            {step === 1 ? 'Play, win and give back every month' : 'Fill in your details to get started'}
          </p>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700,
                  background: step >= s ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.05)',
                  border: step >= s ? 'none' : '1px solid var(--border)',
                  color: step >= s ? 'white' : 'var(--foreground-subtle)'
                }}>
                  {step > s ? <Check size={14} /> : s}
                </div>
                {s < 2 && <div style={{ width: '40px', height: '2px', background: step > s ? 'var(--primary)' : 'var(--border)' }} />}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2.25rem' }}>
          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {PLANS.map(p => (
                <button
                  key={p.id}
                  id={`plan-${p.id}`}
                  onClick={() => setPlan(p.id as 'monthly' | 'yearly')}
                  style={{
                    background: plan === p.id ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                    border: plan === p.id ? '2px solid var(--primary)' : '2px solid var(--border)',
                    borderRadius: '14px', padding: '1.25rem 1.5rem', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'all 0.2s', textAlign: 'left', color: 'var(--foreground)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 700, fontSize: '1rem' }}>{p.label}</span>
                      {p.badge && <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{p.badge}</span>}
                    </div>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>Includes draw entry + charity giving</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.5rem', fontWeight: 800 }}>{p.price}</span>
                    <span style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem' }}>{p.period}</span>
                  </div>
                </button>
              ))}

              <div style={{ background: 'rgba(99,102,241,0.06)', borderRadius: '10px', padding: '0.875rem 1rem', marginTop: '0.5rem' }}>
                {['Monthly draw entry included', 'Min. 10% to your chosen charity', 'Cancel anytime', 'Stripe-secured payments'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>
                    <Check size={13} style={{ color: 'var(--accent)' }} /> {f}
                  </div>
                ))}
              </div>

              <button id="plan-continue" onClick={() => setStep(2)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem', marginTop: '0.5rem' }}>
                Continue <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--foreground-muted)' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-subtle)' }} />
                  <input id="signup-name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Smith" className="input" style={{ paddingLeft: '2.5rem' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--foreground-muted)' }}>Email address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-subtle)' }} />
                  <input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="input" style={{ paddingLeft: '2.5rem' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--foreground-muted)' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-subtle)' }} />
                  <input id="signup-password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 8 characters" minLength={8} className="input" style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-subtle)' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ background: 'rgba(99,102,241,0.06)', borderRadius: '10px', padding: '0.875rem 1rem', fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>
                Selected: <strong style={{ color: 'var(--primary-light)' }}>{plan === 'monthly' ? 'Monthly Plan — £19.99/month' : 'Yearly Plan — £199.99/year'}</strong>
                <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '0.5rem', textDecoration: 'underline' }}>Change</button>
              </div>

              <button id="signup-submit" type="submit" disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating account…' : (<>Create Account <ArrowRight size={16} /></>)}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
