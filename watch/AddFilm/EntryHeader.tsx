import { RiSparkling2Fill } from 'react-icons/ri';

export default function EntryHeader() {
  return (
    <>
      <section
        style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: '1px solid #D4AF37',
            marginBottom: '20px',
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)'
          }}>

          <RiSparkling2Fill color="#D4AF37" size={24} />
        </div>

        <h1
          style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#D4AF37',
            textTransform: 'uppercase',
            margin: 0,
            letterSpacing: '3px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            fontFamily: "'Playfair Display', serif"
          }}>

          Now Casting
        </h1>

        <div
          style={{
            height: '1px',
            width: '100px',
            backgroundColor: '#8B4513',
            margin: '16px auto',
            position: 'relative'
          }}>

          <div
            style={{
              position: 'absolute',
              top: '-2px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '6px',
              backgroundColor: '#D4AF37',
              borderRadius: '50%'
            }} />

        </div>
      </section>
    </>);

}
