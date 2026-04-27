export default function Loading() {
  return (
    <div style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} .skel{background:rgba(99,102,241,0.08);border-radius:8px;}`}</style>
      <div className="skel" style={{ height: '28px', width: '160px', marginBottom: '1.5rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[1,2,3,4].map(i => <div key={i} className="skel" style={{ height: '100px', borderRadius: '16px' }} />)}
      </div>
      <div className="skel" style={{ height: '260px', borderRadius: '16px' }} />
    </div>
  )
}
