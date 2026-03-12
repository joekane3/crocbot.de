import { RiUserSharedLine, RiCalendarLine, RiInformationLine } from 'react-icons/ri';

export default function FilmDetails() {
  return (
    <>
      <section
        style={{
          padding: '40px 20px',
          backgroundColor: '#2C1810',
          position: 'relative',
          overflow: 'hidden'
        }}>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '20px',
            right: '20px',
            height: '2px',
            background: 'repeating-linear-gradient(90deg, #D4AF37, #D4AF37 10px, transparent 10px, transparent 20px)'
          }} />


        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '32px'
          }}>

          <div
            style={{
              padding: '12px',
              border: '2px solid #8B4513',
              backgroundColor: '#1a0a0a',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.3)'
            }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <RiUserSharedLine color="#D4AF37" />
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#D4AF37', letterSpacing: '1px' }}>Nominated By</span>
            </div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '14px' }}>Marcus Chen</p>
          </div>

          <div
            style={{
              padding: '12px',
              border: '2px solid #8B4513',
              backgroundColor: '#1a0a0a',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.3)'
            }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <RiCalendarLine color="#D4AF37" />
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#D4AF37', letterSpacing: '1px' }}>Date Added</span>
            </div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '14px' }}>2024-01-15</p>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <RiInformationLine color="#D4AF37" size={20} />
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                textTransform: 'uppercase',
                color: '#D4AF37',
                letterSpacing: '2px',
                fontWeight: 900
              }}>

              The Feature Story
            </h3>
          </div>
          <div
            style={{
              padding: '20px',
              border: '2px solid #8B4513',
              backgroundColor: '#3d1d11',
              color: '#f5e6d3',
              fontSize: '16px',
              lineHeight: '1.6',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
              position: 'relative'
            }}>

            A visually stunning sci-fi masterpiece exploring identity and humanity. Set thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.
          </div>
        </div>
      </section>
    </>);

}
