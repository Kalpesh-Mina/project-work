export default function AdminLoading() {
  return (
    <div style={{ padding: '2rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .skel { background: rgba(99,102,241,0.08); border-radius: 8px; }
      `}</style>

      {/* Title */}
      <div className="skel" style={{ height: '32px', width: '200px', marginBottom: '0.5rem' }} />
      <div className="skel" style={{ height: '16px', width: '260px', marginBottom: '2rem' }} />

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="skel" style={{ height: '110px', borderRadius: '16px' }} />
        ))}
      </div>

      {/* Table */}
      <div className="skel" style={{ height: '320px', borderRadius: '16px' }} />
    </div>
  )
}
