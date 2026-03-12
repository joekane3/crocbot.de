import { useState } from 'react';
import { HiArrowLeft, HiCheck } from 'react-icons/hi2';

export default function FinalizeActions() {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
  };

  return (
    <>
      <section
        style={{
          marginTop: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>

        <button
          data-flow-nav="forward"
          onClick={handleConfirm}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
            transition: 'transform 0.1s'
          }}>

          {isConfirming ?
          <>Saving to List...</> :

          <>
              Confirm & Save <HiCheck size={20} />
            </>
          }
        </button>

        <button
          data-flow-nav="backward"
          onClick={() => console.log('Navigating back')}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '2px 2px 0px rgba(0,0,0,0.15)'
          }}>

          <HiArrowLeft size={16} /> Edit Film Details
        </button>

        <p style={{
          textAlign: 'center',
          color: '#8B4513',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginTop: '8px'
        }}>
          This entry will be visible to everyone on the local network.
        </p>
      </section>
    </>);

}