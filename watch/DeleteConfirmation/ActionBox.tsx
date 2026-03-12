import { useState } from 'react';
import { HiTrash, HiXMark } from 'react-icons/hi2';

export default function ActionBox() {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
  };

  return (
    <>
      <section
        style={{
          padding: '40px 32px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>

        <div
          style={{
            border: '2px solid #8B4513',
            backgroundColor: '#FFFDD0',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>

          {/* Ticket Stub Holes */}
          <div style={{ position: 'absolute', top: '50%', left: '-12px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#2C1810', transform: 'translateY(-50%)', border: '2px solid #8B4513' }} />
          <div style={{ position: 'absolute', top: '50%', right: '-12px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#2C1810', transform: 'translateY(-50%)', border: '2px solid #8B4513' }} />

          <p
            style={{
              color: '#4A0404',
              fontWeight: 900,
              fontSize: '18px',
              textTransform: 'uppercase',
              marginBottom: '12px',
              letterSpacing: '1px'
            }}>

            Curtain Call?
          </p>

          <p
            style={{
              color: '#2C1810',
              fontSize: '15px',
              lineHeight: '1.5',
              marginBottom: '32px',
              fontStyle: 'italic'
            }}>

            "This film will be permanently removed from the watchlist. This action cannot be undone."
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>

            <button
              onClick={handleDelete}
              data-flow-nav="forward"
              style={{
                backgroundColor: '#D4AF37',
                color: '#1a1a1a',
                border: '2px solid #8B4513',
                padding: '16px',
                fontSize: '14px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                opacity: isDeleting ? 0.7 : 1
              }}>

              <HiTrash size={18} />
              {isDeleting ? 'Removing...' : 'Delete From List'}
            </button>

            <button
              onClick={() => {}}
              style={{
                backgroundColor: '#2C1810',
                color: '#D4AF37',
                border: '2px solid #8B4513',
                padding: '16px',
                fontSize: '14px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>

              <HiXMark size={18} />
              Keep On List
            </button>
          </div>
        </div>
      </section>
    </>);

}