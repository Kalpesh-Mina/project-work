export default function Loading() {
  return (
    <div style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} .skel{background:rgba(99,102,241,0.08);border-radius:8px;}`}</style>
      <div className="skel" style={{ height: '28px', width: '180px', marginBottom: '1.5rem' }} />
      <div className="skel" style={{ height: '320px', borderRadius: '16px' }} />
    </div>
  )
}
