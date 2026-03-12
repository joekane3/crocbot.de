import { useState } from 'react';

export default function ConfirmationDialog() {
  const [watchedStatus, setWatchedStatus] = useState(true);

  return (
    <>
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>

        <div
          style={{
            backgroundColor: '#f5f5dc',
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px)',
            backgroundSize: '100% 2px',
            padding: '32px 24px',
            border: '2px solid #8B4513',
            position: 'relative',
            boxShadow: '6px 6px 0px rgba(0,0,0,0.4)',
            textAlign: 'center'
          }}>

          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 20px'
          }}>
            {[...Array(8)].map((_, i) =>
            <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2C1810' }} />
            )}
          </div>

          <h3
            style={{
              fontSize: '28px',
              color: '#2C1810',
              fontWeight: 900,
              textTransform: 'uppercase',
              margin: '0 0 16px 0',
              letterSpacing: '-1px'
            }}>
            Mark as Watched?
          </h3>

          <p
            style={{
              fontSize: '16px',
              color: '#5D2E17',
              lineHeight: '1.5',
              margin: '0 0 24px 0'
            }}>
            This will update the status of this feature presentation in the community archive.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: 'rgba(139, 69, 19, 0.05)',
              border: '1px dashed #8B4513'
            }}>

            <span style={{ fontSize: '14px', fontWeight: 700, color: '#2C1810', textTransform: 'uppercase' }}>Status:</span>
            <div
              onClick={() => setWatchedStatus(!watchedStatus)}
              style={{
                width: '60px',
                height: '32px',
                backgroundColor: watchedStatus ? '#D4AF37' : '#1a1a1a',
                border: '2px solid #8B4513',
                padding: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center'
              }}>

              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: watchedStatus ? '#1a1a1a' : '#D4AF37',
                transform: watchedStatus ? 'translateX(28px)' : 'translateX(0)',
                transition: 'transform 0.2s',
                boxShadow: '2px 2px 0px rgba(0,0,0,0.15)'
              }} />
            </div>
            <span style={{
              fontSize: '14px',
              fontWeight: 800,
              color: watchedStatus ? '#8B4513' : '#666',
              minWidth: '60px',
              textAlign: 'left'
            }}>
              {watchedStatus ? 'SEEN' : 'TO WATCH'}
            </span>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 20px'
          }}>
            {[...Array(8)].map((_, i) =>
            <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2C1810' }} />
            )}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '8px'
          }}>

          <button
            onClick={() => console.log('Confirmed')}
            style={{
              backgroundColor: '#D4AF37',
              color: '#1a1a1a',
              border: '2px solid #8B4513',
              padding: '18px',
              fontSize: '18px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              cursor: 'pointer',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
            Confirm Status Update
          </button>

          <button
            onClick={() => console.log('Cancelled')}
            style={{
              backgroundColor: '#2C1810',
              color: '#D4AF37',
              border: '2px solid #8B4513',
              padding: '14px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              boxShadow: '2px 2px 0px rgba(0,0,0,0.3)',
              opacity: 0.9
            }}>
            Return to Details
          </button>
        </div>
      </section>
    </>);

}
