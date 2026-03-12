export default function FilmContext() {
  return (
    <>
      <section
        style={{
          marginBottom: '32px',
          textAlign: 'center'
        }}>

        <div
          style={{
            borderTop: '2px solid #D4AF37',
            borderBottom: '2px solid #D4AF37',
            padding: '12px 0',
            marginBottom: '24px',
            position: 'relative'
          }}>

          <span
            style={{
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#D4AF37',
              display: 'block'
            }}>

            CINEWATCH WATCHLIST
          </span>
        </div>

        <div
          style={{
            width: '180px',
            height: '260px',
            margin: '0 auto 20px',
            backgroundColor: '#1a1a1a',
            border: '2px solid #8B4513',
            boxShadow: '6px 6px 0px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>

          {/* Film Strip Side Decorations */}
          <div style={{ position: 'absolute', left: '0', top: '0', bottom: '0', width: '20px', background: 'repeating-linear-gradient(#000, #000 10px, #222 10px, #222 20px)', borderRight: '1px solid #333' }} />
          <div style={{ position: 'absolute', right: '0', top: '0', bottom: '0', width: '20px', background: 'repeating-linear-gradient(#000, #000 10px, #222 10px, #222 20px)', borderLeft: '1px solid #333' }} />

          <div style={{ textAlign: 'center', padding: '0 30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0', color: '#ffffff' }}>Blade Runner 2049</h2>
            <p style={{ fontSize: '14px', margin: 0, color: '#D4AF37', letterSpacing: '2px' }}>2017</p>
          </div>
        </div>

        <div style={{ color: '#D4AF37', fontSize: '14px', fontStyle: 'italic' }}>
          Added by <span style={{ fontWeight: 700 }}>Marcus Chen</span> &bull; Jan 15, 2024
        </div>
      </section>
    </>);

}