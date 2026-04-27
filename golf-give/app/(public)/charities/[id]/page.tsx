import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Heart, Calendar, MapPin, ExternalLink, ArrowLeft } from 'lucide-react'

export default async function CharityProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: charity } = await supabase.from('charities').select('*').eq('id', id).single()
  if (!charity) return notFound()

  return (
    <div style={{ paddingTop: '90px', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <Link href="/charities" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--foreground-muted)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Charities
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
          <div>
            {/* Hero image */}
            <div style={{ height: '280px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(16,185,129,0.1) 100%)', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {charity.image_url ? <img src={charity.image_url} alt={charity.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Heart size={64} style={{ color: 'rgba(99,102,241,0.3)' }} />}
            </div>

            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{charity.name}</h1>
            <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
              {charity.long_description || charity.description}
            </p>

            {/* Events */}
            {charity.events && charity.events.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Upcoming Events</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {charity.events.map((ev: { name: string; date: string; location: string; description: string }, i: number) => (
                    <div key={i} className="glass-card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{ev.name}</h3>
                          <p style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{ev.description}</p>
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>
                              <Calendar size={13} /> {new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>
                              <MapPin size={13} /> {ev.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Support This Charity</h3>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Choose this charity when you subscribe and at least 10% of your subscription will be donated monthly.
              </p>
              <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Heart size={16} /> Subscribe &amp; Give
              </Link>
              {charity.website_url && (
                <a href={charity.website_url} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  Visit Website <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
