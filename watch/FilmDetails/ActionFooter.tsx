import { useState } from 'react';
import { RiCheckLine, RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';

export default function ActionFooter() {
  const [watched, setWatched] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      <section
        style={{
          padding: '40px 20px',
          backgroundColor: '#1a0a0a',
          borderTop: '2px solid #8B4513'
        }}>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>

          <button
            onClick={() => setWatched(!watched)}
            style={{
              backgroundColor: watched ? '#2C1810' : '#D4AF37',
              color: watched ? '#D4AF37' : '#1a1a1a',
              border: '2px solid #8B4513',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: '6px 6px 0px rgba(0,0,0,0.4)',
              transition: 'all 0.2s'
            }}>

            {watched ?
            <>
                <RiCheckLine size={24} />
                MARKED AS WATCHED
              </> :

            <>
                <RiEyeLine size={24} />
                MARK AS WATCHED
              </>
            }
          </button>

          <button
            onClick={() => setIsDeleting(true)}
            style={{
              backgroundColor: isDeleting ? '#8B0000' : 'transparent',
              color: isDeleting ? '#ffffff' : '#D4AF37',
              border: '2px solid #8B4513',
              padding: '16px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}>

            <RiDeleteBin6Line size={18} />
            {isDeleting ? 'ARE YOU SURE?' : 'DELETE FROM LIST'}
          </button>

          {isDeleting &&
          <button
            onClick={() => setIsDeleting(false)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#999',
              fontSize: '12px',
              textDecoration: 'underline',
              cursor: 'pointer',
              textAlign: 'center'
            }}>

              Cancel Deletion
            </button>
          }
        </div>

        <div
          style={{
            marginTop: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: 0.3
          }}>

          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#2C1810', marginLeft: '-30px', border: '2px solid #8B4513' }} />
          <div style={{ flex: 1, borderTop: '2px dashed #8B4513', margin: '0 10px' }} />
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#2C1810', marginRight: '-30px', border: '2px solid #8B4513' }} />
        </div>
      </section>
    </>);

}
