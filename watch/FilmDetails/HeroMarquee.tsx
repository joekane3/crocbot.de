import { RiArrowLeftSLine } from 'react-icons/ri';
import { GiFlatStar } from 'react-icons/gi';

export default function HeroMarquee() {
  return (
    <>
      <section
        style={{
          position: 'relative',
          padding: '24px 20px 40px',
          backgroundColor: '#4A0404',
          borderBottom: '4px solid #D4AF37',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
        }}>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '2px solid #D4AF37',
            margin: '8px',
            pointerEvents: 'none'
          }} />


        <button
          onClick={() => console.log('Back to watchlist')}
          style={{
            position: 'relative',
            zIndex: 10,
            background: '#2C1810',
            border: '2px solid #8B4513',
            color: '#D4AF37',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginBottom: '32px',
            boxShadow: '2px 2px 0px rgba(0,0,0,0.3)'
          }}>

          <RiArrowLeftSLine size={24} />
        </button>

        <div
          style={{
            position: 'relative',
            textAlign: 'center'
          }}>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <span
              style={{
                backgroundColor: '#D4AF37',
                color: '#1a1a1a',
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                border: '2px solid #8B4513',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>

              <GiFlatStar size={16} />
              Sci-Fi Masterpiece
            </span>
          </div>

          <h1
            style={{
              fontSize: '42px',
              fontWeight: 900,
              color: '#D4AF37',
              textTransform: 'uppercase',
              margin: '0 0 8px',
              textShadow: '3px 3px 0px #1a1a1a, 6px 6px 0px rgba(0,0,0,0.2)',
              lineHeight: '1',
              fontFamily: 'serif'
            }}>

            Blade Runner 2049
          </h1>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>

            <span>2017</span>
            <span>&bull;</span>
            <span>163 MIN</span>
            <span>&bull;</span>
            <span style={{ color: '#D4AF37' }}>RATING 8.0/10</span>
          </div>
        </div>
      </section>
    </>);

}
