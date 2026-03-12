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

  const platforms = Object.keys(selectedPlatforms);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(26, 10, 5, 0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>

        <div
          style={{
            backgroundColor: '#2C1810',
            border: '2px solid #8B4513',
            padding: '24px',
            boxShadow: '6px 6px 0px rgba(0,0,0,0.4)',
            width: '100%',
            maxWidth: '360px',
            position: 'relative'
          }}>

          <h3
            style={{
              color: '#D4AF37',
              fontSize: '20px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textAlign: 'center',
              marginBottom: '24px',
              fontFamily: '"Playfair Display", serif'
            }}>

            Manage Platforms
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginBottom: '32px'
            }}>

            {platforms.map((name) =>
            <label
              key={name}
              style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}>

                <input
                type="checkbox"
                checked={selectedPlatforms[name as keyof typeof selectedPlatforms]}
                onChange={() => togglePlatform(name)}
                style={{
                    width: '20px',
                    height: '20px',
                    accentColor: '#D4AF37',
                    cursor: 'pointer'
                  }} />

                <span
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#D4AF37',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>

                  {name}
                </span>
              </label>
            )}
          </div>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              backgroundColor: '#D4AF37',
              color: '#1a0a05',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
              transition: 'transform 0.1s active'
            }}>

            Save Preferences
          </button>
        </div>
      </div>
    </>);

}
