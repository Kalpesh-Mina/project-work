'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Trophy, Heart, Zap, Star, Users, TrendingUp, Shield, ChevronRight } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } }),
}

const HOW_IT_WORKS = [
  { step: '01', icon: Shield, title: 'Subscribe', desc: 'Choose a monthly or yearly plan. A portion of your fee goes to the prize pool and your chosen charity.' },
  { step: '02', icon: TrendingUp, title: 'Enter Scores', desc: 'Submit your Stableford scores (1–45) after each round. We track your latest 5 scores automatically.' },
  { step: '03', icon: Zap, title: 'Monthly Draw', desc: 'Every month, 5 numbers are drawn. Match 3, 4, or all 5 of your scores to win your share of the prize pool.' },
  { step: '04', icon: Heart, title: 'Give Back', desc: 'At least 10% of your subscription goes directly to your chosen charity — automatically, every month.' },
]

const PRIZES = [
  { match: '5 Numbers', share: '40%', label: 'Jackpot', color: 'gold', rollover: true },
  { match: '4 Numbers', share: '35%', label: 'Major Prize', color: 'primary', rollover: false },
  { match: '3 Numbers', share: '25%', label: 'Standard Prize', color: 'accent', rollover: false },
]

const STATS = [
  { value: '£50K+', label: 'Prize Pool Monthly', icon: Trophy },
  { value: '2,400+', label: 'Active Members', icon: Users },
  { value: '£8K+', label: 'Donated to Charities', icon: Heart },
  { value: '15+', label: 'Partner Charities', icon: Star },
]

export default function HomePage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'var(--gradient-hero)', position: 'relative', overflow: 'hidden'
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '5%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'center' }}>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              >
                <span className="badge badge-primary" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
                  <Star size={12} style={{ marginRight: '0.35rem' }} /> Monthly Draws · Charity Impact · Golf Performance
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem', fontFamily: 'var(--font-outfit)' }}
              >
                Play Golf.<br />
                <span className="gradient-text">Win Big.</span><br />
                <span style={{ color: 'var(--accent-light)' }}>Give Back.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
                style={{ fontSize: '1.15rem', color: 'var(--foreground-muted)', maxWidth: '520px', marginBottom: '2.5rem', lineHeight: 1.8 }}
              >
                The first golf platform that combines performance tracking, monthly prize draws, and charitable giving — all in one subscription.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}
              >
                <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', fontSize: '1rem' }}>
                  Start Playing <ArrowRight size={18} />
                </Link>
                <Link href="/how-it-works" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  How It Works <ChevronRight size={16} />
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '2.5rem' }}
              >
                {['Stripe Secured', 'Instant Signup', 'Cancel Anytime'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--foreground-muted)', fontSize: '0.85rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
                    {t}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:block animate-float"
              style={{ flexShrink: 0 }}
            >
              <div className="glass-card animate-pulse-glow" style={{ padding: '2rem', width: '320px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div className="draw-ball draw-ball-gold">7</div>
                  <div className="draw-ball">14</div>
                  <div className="draw-ball">22</div>
                  <div className="draw-ball">31</div>
                  <div className="draw-ball">38</div>
                </div>
                <p style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>April 2025 Draw</p>
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '0.5rem' }}>
                  <p style={{ color: 'var(--accent-light)', fontWeight: 700, fontSize: '1.1rem' }}>🎉 Jackpot Winner!</p>
                  <p style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem' }}>5 numbers matched · £12,400</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>Charity donated</span>
                  <span style={{ color: 'var(--accent-light)', fontWeight: 700, fontSize: '0.85rem' }}>£2,180</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: 'var(--background-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                style={{ textAlign: 'center', padding: '1rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(99,102,241,0.12)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <stat.icon size={20} style={{ color: 'var(--primary-light)' }} />
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '2rem', fontWeight: 800, color: 'var(--foreground)', lineHeight: 1 }}>{stat.value}</p>
                <p style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section">
        <div className="container">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <span className="badge badge-primary" style={{ marginBottom: '1rem', display: 'inline-flex' }}>Simple &amp; Transparent</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', marginBottom: '1rem' }}>How <span className="gradient-text">Golf &amp; Give</span> Works</h2>
            <p style={{ color: 'var(--foreground-muted)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
              Four simple steps from signing up to winning prizes while making a difference.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="glass-card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{
                  position: 'absolute', top: '-10px', right: '-10px',
                  fontFamily: 'var(--font-outfit)', fontSize: '5rem', fontWeight: 900,
                  color: 'rgba(99,102,241,0.06)', lineHeight: 1, pointerEvents: 'none'
                }}>
                  {item.step}
                </div>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'var(--gradient-primary)', marginBottom: '1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <item.icon size={22} color="white" />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIZE POOL ── */}
      <section className="section" style={{ background: 'var(--background-secondary)' }}>
        <div className="container">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <span className="badge badge-gold" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <Trophy size={12} style={{ marginRight: '0.35rem' }} /> Prize Pool Structure
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', marginBottom: '1rem' }}>
              Win Real <span className="gradient-text-gold">Cash Prizes</span>
            </h2>
            <p style={{ color: 'var(--foreground-muted)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
              Every month the prize pool grows with your subscriptions. Match enough numbers and claim your share.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
            {PRIZES.map((prize, i) => (
              <motion.div
                key={prize.match} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="glass-card" style={{
                  padding: '2rem', textAlign: 'center',
                  border: prize.color === 'gold' ? '1px solid rgba(245,158,11,0.3)' : '1px solid var(--border)'
                }}
              >
                {prize.color === 'gold' && (
                  <div className="badge badge-gold" style={{ display: 'inline-flex', marginBottom: '1rem' }}>⭐ Jackpot</div>
                )}
                <div style={{
                  fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-outfit)',
                  background: prize.color === 'gold' ? 'var(--gradient-gold)' : prize.color === 'accent' ? 'var(--gradient-green)' : 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  marginBottom: '0.25rem'
                }}>
                  {prize.share}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{prize.match}</h3>
                <p style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{prize.label}</p>
                {prize.rollover && (
                  <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '0.5rem', fontSize: '0.8rem', color: 'var(--gold-light)' }}>
                    🔄 Jackpot rolls over if unclaimed
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHARITY ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <span className="badge badge-success" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
                <Heart size={12} style={{ marginRight: '0.35rem' }} /> Charitable Impact
              </span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '1.25rem' }}>
                Your Subscription <span style={{ color: 'var(--accent-light)' }}>Gives Back</span>
              </h2>
              <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                At least 10% of every subscription goes to the charity you choose. You can increase your contribution at any time, or make a standalone donation directly.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {['Choose from 15+ verified charities', 'Minimum 10% — increase any time', 'Real-time contribution dashboard', 'Direct donations also available'].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 700 }}>✓</span>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/charities" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                Browse Charities <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              custom={1} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {[
                { name: 'Golf for Good Foundation', donated: '£3,200', members: 340, color: 'primary' },
                { name: 'Youth Sports Initiative', donated: '£2,100', members: 220, color: 'accent' },
                { name: 'Mental Health Through Sport', donated: '£1,450', members: 156, color: 'gold' },
              ].map(c => (
                <div key={c.name} className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
                      background: c.color === 'primary' ? 'rgba(99,102,241,0.15)' : c.color === 'accent' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Heart size={18} style={{ color: c.color === 'primary' ? 'var(--primary-light)' : c.color === 'accent' ? 'var(--accent-light)' : 'var(--gold-light)' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</p>
                      <p style={{ color: 'var(--foreground-subtle)', fontSize: '0.8rem' }}>{c.members} supporters</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, color: 'var(--accent-light)', fontSize: '1rem' }}>{c.donated}</p>
                    <p style={{ color: 'var(--foreground-subtle)', fontSize: '0.75rem' }}>this month</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: '6rem 0',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.08) 50%, rgba(16,185,129,0.08) 100%)',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', marginBottom: '1.25rem' }}>
              Ready to Play, Win, and <span className="gradient-text">Give Back?</span>
            </h2>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '1.1rem', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              Join thousands of golfers making every round matter. Subscribe today and enter your first monthly draw.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/signup" className="btn-gold" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                <Trophy size={20} /> Subscribe Now
              </Link>
              <Link href="/how-it-works" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1.05rem' }}>
                Learn More
              </Link>
            </div>
            <p style={{ color: 'var(--foreground-subtle)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
              No long commitments · Cancel anytime · Stripe-secured payments
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
