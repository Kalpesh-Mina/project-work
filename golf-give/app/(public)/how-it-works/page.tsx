'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Target, Zap, Trophy, Heart, CheckCircle, ArrowRight, ChevronDown } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
}

const STEPS = [
  { icon: Shield, color: 'primary', step: '01', title: 'Choose a Plan & Subscribe', desc: 'Select either a Monthly (£19.99) or Yearly (£199.99) subscription. Payment is handled securely via Stripe. Once subscribed, you get immediate access to the full platform.' },
  { icon: Heart, color: 'accent', step: '02', title: 'Pick Your Charity', desc: 'Browse our 15+ verified partner charities and select the one you wish to support. At least 10% of your subscription goes directly to your chosen charity each month — you can increase this at any time.' },
  { icon: Target, color: 'primary', step: '03', title: 'Enter Your Golf Scores', desc: 'After each round, log your Stableford score (1–45 points) along with the date played. We always keep your latest 5 scores. No duplicate dates — you can edit or delete any entry.' },
  { icon: Zap, color: 'gold', step: '04', title: 'Monthly Draw Day', desc: 'Once per month, 5 numbers between 1 and 45 are drawn. We support two draw modes: a standard random draw, or an algorithmic draw weighted by the most frequent scores across all players.' },
  { icon: Trophy, color: 'gold', step: '05', title: 'Match Numbers & Win', desc: 'If any of your 5 scores match 3, 4, or all 5 drawn numbers, you win a share of the prize pool. Prizes are split equally among all winners in the same tier.' },
  { icon: CheckCircle, color: 'accent', step: '06', title: 'Claim Your Prize', desc: 'Winners are notified and asked to upload a screenshot of their scores as proof. Our admin team reviews submissions and marks approved payouts as paid.' },
]

const FAQS = [
  { q: 'How is the prize pool calculated?', a: 'A fixed portion of every subscription fee contributes to the prize pool. The pool is divided: 40% goes to 5-number match (jackpot), 35% to 4-number match, and 25% to 3-number match.' },
  { q: 'What happens if nobody wins the jackpot?', a: 'If no subscriber matches all 5 drawn numbers, the entire jackpot (40% pool) rolls forward and is added to the following month\'s 5-match pool — making it even bigger.' },
  { q: 'Can I enter the same score twice?', a: 'No. Each date can only have one score entry. If you made a mistake, you can edit or delete the existing entry for that date.' },
  { q: 'How much goes to charity?', a: 'At minimum 10% of your subscription fee is donated to your chosen charity each month. You can increase this percentage from your dashboard at any time.' },
  { q: 'What is the Stableford scoring system?', a: 'Stableford is a golf scoring format where you earn points based on your score relative to par on each hole. The score range for entry on this platform is 1–45 points.' },
  { q: 'When are draws held?', a: 'Draws are run monthly by our admin team. Results are published on the platform, and all winners are notified immediately after publishing.' },
]

export default function HowItWorksPage() {
  return (
    <div style={{ paddingTop: '90px' }}>
      {/* Hero */}
      <section style={{ padding: '4rem 0 3rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(16,185,129,0.05) 100%)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="badge badge-primary" style={{ marginBottom: '1rem', display: 'inline-flex' }}>Complete Guide</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', marginBottom: '1rem' }}>
              How <span className="gradient-text">Golf &amp; Give</span> Works
            </h1>
            <p style={{ color: 'var(--foreground-muted)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7, fontSize: '1.05rem' }}>
              Everything you need to know — from subscribing to claiming your winnings while supporting a cause you care about.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            {STEPS.map((step, i) => (
              <motion.div key={step.step} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="glass-card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: step.color === 'gold' ? 'rgba(245,158,11,0.12)' : step.color === 'accent' ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.12)',
                  }}>
                    <step.icon size={26} style={{ color: step.color === 'gold' ? 'var(--gold-light)' : step.color === 'accent' ? 'var(--accent-light)' : 'var(--primary-light)' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--foreground-subtle)', letterSpacing: '0.1em' }}>STEP {step.step}</span>
                  </div>
                  <h2 style={{ fontSize: '1.15rem', marginBottom: '0.6rem' }}>{step.title}</h2>
                  <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize pool table */}
      <section className="section" style={{ background: 'var(--background-secondary)' }}>
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: '0.75rem' }}>Prize Pool Distribution</h2>
            <p style={{ color: 'var(--foreground-muted)', maxWidth: '480px', margin: '0 auto' }}>The prize pool is automatically calculated from active subscriber contributions each month.</p>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card" style={{ overflow: 'hidden', maxWidth: '700px', margin: '0 auto' }}>
            <table className="data-table">
              <thead><tr><th>Match Type</th><th>Pool Share</th><th>Jackpot Rollover?</th><th>Example (100 members)</th></tr></thead>
              <tbody>
                {[
                  { match: '5 Numbers', share: '40%', rollover: 'Yes', example: '£200' },
                  { match: '4 Numbers', share: '35%', rollover: 'No', example: '£175' },
                  { match: '3 Numbers', share: '25%', rollover: 'No', example: '£125' },
                ].map(row => (
                  <tr key={row.match}>
                    <td style={{ fontWeight: 600 }}>{row.match}</td>
                    <td><span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--gold-light)' }}>{row.share}</span></td>
                    <td>{row.rollover === 'Yes' ? <span className="badge badge-gold">🔄 Yes</span> : <span className="badge badge-muted">No</span>}</td>
                    <td style={{ color: 'var(--accent-light)', fontWeight: 700 }}>{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '0.875rem 1rem', background: 'rgba(99,102,241,0.04)', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>
              * Example based on 100 active members each contributing £5/month to the prize pool. Prizes split equally among winners in the same tier.
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: '0.5rem' }}>Frequently Asked Questions</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
            {FAQS.map((faq, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <ChevronDown size={16} style={{ color: 'var(--primary-light)', flexShrink: 0, marginTop: '2px' }} /> {faq.q}
                </h3>
                <p style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(16,185,129,0.06) 100%)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '1rem' }}>Ready to Get Started?</h2>
            <p style={{ color: 'var(--foreground-muted)', marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem' }}>Join Golf &amp; Give today and play for purpose every single month.</p>
            <Link href="/signup" className="btn-gold" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}>
              <Trophy size={20} /> Subscribe Now <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
