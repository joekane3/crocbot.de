import { useState } from 'react';
import { RiClapperboardFill } from 'react-icons/ri';

export default function FinalizeActions() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <>
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>

        <button
          onClick={handleProcess}
          disabled={isProcessing}
          style={{
            backgroundColor: '#D4AF37',
            color: '#1a0a0a',
            border: '2px solid #8B4513',
            padding: '20px',
            fontSize: '16px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '6px 6px 0px rgba(0,0,0,0.5)',
            transition: 'all 0.1s',
            opacity: isProcessing ? 0.8 : 1,
            outline: 'none'
          }}>

          {isProcessing ?
          <>
              Consulting Archives...
            </> :

          <>
              Identify Film <RiClapperboardFill size={18} />
            </>
          }
        </button>

        <p
          style={{
            textAlign: 'center',
            color: '#8B4513',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 600,
            fontStyle: 'italic',
            opacity: 0.8
          }}>

          Just name it, describe the plot, or drop a quote.
        </p>
      </section>
    </>);

}
