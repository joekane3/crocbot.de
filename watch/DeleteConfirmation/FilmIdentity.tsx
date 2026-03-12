import { RiFilmLine } from 'react-icons/ri';

export default function FilmIdentity() {
  const filmData = {
    name: "Blade Runner 2049",
    year: "2017",
    addedBy: "Marcus Chen",
    addedDate: "2024-01-15"
  };

  return (
    <>
      <section
        style={{
          padding: '0 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>

        <div
          style={{
            width: '100%',
            backgroundColor: '#4A0404',
            border: '2px solid #8B4513',
            padding: '24px',
            boxShadow: '6px 6px 0px rgba(0,0,0,0.4)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>

          {/* Decorative Corner Elements */}
          {[0, 90, 180, 270].map((rot) =>
          <div
            key={rot}
            style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              borderLeft: '2px solid #D4AF37',
              borderTop: '2px solid #D4AF37',
              top: rot < 180 ? '8px' : 'auto',
              bottom: rot >= 180 ? '8px' : 'auto',
              left: rot === 0 || rot === 270 ? '8px' : 'auto',
              right: rot === 90 || rot === 180 ? '8px' : 'auto',
              transform: `rotate(${rot}deg)`
            }} />

          )}

          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#2C1810',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              border: '1px solid #D4AF37'
            }}>

            <RiFilmLine size={24} color="#D4AF37" />
          </div>

          <h2
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#FFFDD0',
              margin: '0 0 8px 0',
              fontFamily: 'serif'
            }}>

            {filmData.name}
          </h2>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              fontSize: '12px',
              color: '#D4AF37',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>

            <span>{filmData.year}</span>
            <span>&bull;</span>
            <span style={{ color: '#999' }}>Added by {filmData.addedBy}</span>
          </div>
        </div>

        {/* Scaled Border Detail */}
        <div
          style={{
            width: 'calc(100% - 40px)',
            height: '8px',
            backgroundColor: '#8B4513',
            marginTop: '4px',
            opacity: 0.6,
            backgroundImage: `radial-gradient(#2C1810 2px, transparent 2px)`,
            backgroundSize: '8px 8px'
          }} />

      </section>
    </>);

}