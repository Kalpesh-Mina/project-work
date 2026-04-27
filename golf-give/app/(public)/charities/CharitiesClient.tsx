'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Search, Star, Calendar, MapPin, ExternalLink, ChevronRight } from 'lucide-react'
import type { Charity } from '@/types'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5 } }),
}

export default function CharitiesClient({ charities }: { charities: Charity[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'featured'>('all')

  const filtered = charities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description?.toLowerCase().includes(search.toLowerCase()))
    const matchesFilter = filter === 'all' || (filter === 'featured' && c.is_featured)
    return matchesSearch && matchesFilter
  })

  return (
    <div style={{ paddingTop: '90px', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{
        padding: '4rem 0 3rem',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(99,102,241,0.06) 100%)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center' }}>
            <span className="badge badge-success" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <Heart size={12} style={{ marginRight: '0.35rem' }} /> Our Partner Charities
            </span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', marginBottom: '1rem' }}>
              Choose the Cause <span style={{ color: 'var(--accent-light)' }}>You Care About</span>
            </h1>
            <p style={{ color: 'var(--foreground-muted)', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
              At least 10% of your subscription goes to your chosen charity every month. Browse our verified partners below.
            </p>

            {/* Search & filter */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
              <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-subtle)' }} />
                <input
                  id="charity-search"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search charities…"
                  className="input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['all', 'featured'] as const).map(f => (
                  <button
                    key={f}
                    id={`filter-${f}`}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid',
                      borderColor: filter === f ? 'var(--accent)' : 'var(--border)',
                      background: filter === f ? 'rgba(16,185,129,0.1)' : 'transparent',
                      color: filter === f ? 'var(--accent-light)' : 'var(--foreground-muted)',
                      cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: '0.4rem'
                    }}
                  >
                    {f === 'featured' && <Star size={13} />}
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Charities grid */}
      <section className="section">
        <div className="container">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--foreground-muted)' }}>
              <Heart size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>No charities found. Try adjusting your search.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {filtered.map((charity, i) => (
                <motion.div
                  key={charity.id}
                  custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="glass-card"
                  style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                >
                  {/* Image placeholder */}
                  <div style={{
                    height: '180px', background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(16,185,129,0.1) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                  }}>
                    {charity.image_url ? (
                      <img src={charity.image_url} alt={charity.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Heart size={48} style={{ color: 'rgba(99,102,241,0.4)' }} />
                    )}
                    {charity.is_featured && (
                      <div className="badge badge-gold" style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                        <Star size={11} style={{ marginRight: '0.25rem' }} /> Featured
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{charity.name}</h3>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, marginBottom: '1rem' }}>
                      {charity.description}
                    </p>

                    {/* Events preview */}
                    {charity.events && charity.events.length > 0 && (
                      <div style={{ background: 'rgba(99,102,241,0.06)', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Upcoming Events</p>
                        {charity.events.slice(0, 1).map((ev, ei) => (
                          <div key={ei} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>
                            <Calendar size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <p style={{ fontWeight: 600, color: 'var(--foreground)' }}>{ev.name}</p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
                                <MapPin size={11} />{ev.location}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <Link
                        href={`/charities/${charity.id}`}
                        style={{
                          flex: 1, textAlign: 'center', padding: '0.65rem', borderRadius: '10px',
                          background: 'rgba(99,102,241,0.1)', border: '1px solid var(--border)',
                          color: 'var(--primary-light)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        View Profile <ChevronRight size={14} />
                      </Link>
                      <Link
                        href="/signup"
                        style={{
                          flex: 1, textAlign: 'center', padding: '0.65rem', borderRadius: '10px',
                          background: 'var(--gradient-green)', border: 'none',
                          color: 'white', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Heart size={14} /> Support
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
