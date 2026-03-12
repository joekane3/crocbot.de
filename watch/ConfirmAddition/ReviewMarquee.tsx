import { HiSparkles } from 'react-icons/hi2';

export default function ReviewMarquee() {
  return (
    <>
      <section
        style={{
          textAlign: 'center',
          marginBottom: '32px',
          paddingTop: '20px'
        }}>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#2C1810',
            border: '2px solid #8B4513',
            padding: '4px 16px',
            marginBottom: '12px'
          }}>

          <HiSparkles style={{ color: '#D4AF37' }} />
          <span style={{
            color: '#D4AF37',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            Box Office Review
          </span>
          <HiSparkles style={{ color: '#D4AF37' }} />
        </div>

        <h1
          style={{
            fontSize: '36px',
            fontWeight: 900,
            color: '#D4AF37',
            textTransform: 'uppercase',
            margin: 0,
            letterSpacing: '1px',
            textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
            fontFamily: 'serif'
          }}>

          Confirm Entry
        </h1>
        <div style={{ height: '4px', width: '60px', backgroundColor: '#8B4513', margin: '8px auto' }} />
      </section>
    </>);

}