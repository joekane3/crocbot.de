import { useState } from 'react';

interface PlatformsManagerProps {
  onClose: () => void;
}

export default function PlatformsManager({ onClose }: PlatformsManagerProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    'Amazon Prime': true,
    'WOW': true,
    'Netflix': true,
    'Disney Plus': true,
    'Cinema': true
  });

  const togglePlatform = (name: string) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }));
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '24px'
      }}>
      <section
        style={{
          backgroundColor: '#2C1810',
          border: '2px solid #8B4513',
          padding: '24px',
          boxShadow: '6px 6px 0px rgba(0,0,0,0.4)',
          width: '100%',
          maxWidth: '360px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>

        <h2 style={{
          color: '#D4AF37',
          fontSize: '20px',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textAlign: 'center',
          margin: 0,
          borderBottom: '1px solid #8B4513',
          paddingBottom: '16px'
        }}>
          Manage Platforms
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(selectedPlatforms).map(([name, isSelected]) =>
          <div
            key={name}
            onClick={() => togglePlatform(name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}>

              <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #D4AF37',
              backgroundColor: isSelected ? '#D4AF37' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}>
                {isSelected && <span style={{ color: '#1a0a05', fontSize: '14px', fontWeight: 900 }}>✓</span>}
              </div>
              <label style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#D4AF37',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer'
            }}>
                {name}
              </label>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            backgroundColor: '#D4AF37',
            color: '#1a0a05',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
            marginTop: '8px'
          }}>

          Save Preferences
        </button>
      </section>
    </div>);

}
