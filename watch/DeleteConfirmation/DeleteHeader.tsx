import { HiArrowLeft } from 'react-icons/hi2';

export default function DeleteHeader() {
  return (
    <>
      <header
        style={{
          padding: '40px 32px 24px',
          textAlign: 'center',
          position: 'relative'
        }}>

        <button
          data-flow-nav="backward"
          onClick={() => {}}
          style={{
            position: 'absolute',
            left: '24px',
            top: '44px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#D4AF37',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px'
          }}>

          <HiArrowLeft size={24} />
        </button>

        <div
          style={{
            display: 'inline-block',
            border: '2px solid #8B4513',
            padding: '4px 12px',
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '16px',
            backgroundColor: '#4A0404'
          }}>

          CINEWATCH WATCHLIST
        </div>

        <h1
          style={{
            fontSize: '36px',
            fontWeight: 900,
            color: '#D4AF37',
            margin: 0,
            lineHeight: 1,
            textTransform: 'uppercase',
            fontFamily: '"Playfair Display", serif',
            letterSpacing: '-1px'
          }}>

          Final Reel
        </h1>
        <div
          style={{
            height: '2px',
            width: '60px',
            backgroundColor: '#D4AF37',
            margin: '12px auto'
          }} />

        <p
          style={{
            fontSize: '14px',
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>

          Removal Confirmation
        </p>
      </header>
    </>);

}