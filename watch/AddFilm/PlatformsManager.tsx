import { useState } from 'react';

interface PlatformsManagerProps {
  onClose: () => void;
}

export default function PlatformsManager({ onClose }: PlatformsManagerProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    amazon: true,
    wow: true,
    netflix: true,
    disney: true,
    cinema: true
  });

  const platforms = [
  { id: 'amazon', label: 'Amazon Prime' },
  { id: 'wow', label: 'WOW' },
  { id: 'netflix', label: 'Netflix' },
  { id: 'disney', label: 'Disney Plus' },
  { id: 'cinema', label: 'Cinema' }];

  const handleToggle = (id: string) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev]
    }));
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>

        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#2C1810',
            border: '2px solid #8B4513',
            padding: '24px',
            width: '100%',
            maxWidth: '320px',
            boxShadow: '6px 6px 0px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>

          <h2
            style={{
              fontSize: '18px',
              fontWeight: 900,
              color: '#D4AF37',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              margin: '0 0 8px 0',
              textAlign: 'center',
              fontFamily: "'Playfair Display', serif"
            }}>

            Streaming Platforms
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>

            {platforms.map((platform) =>
            <label
              key={platform.id}
              style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}>

                <input
                type="checkbox"
                checked={selectedPlatforms[platform.id as keyof typeof selectedPlatforms]}
                onChange={() => handleToggle(platform.id)}
                style={{
                  width: '18px',
                  height: '18px',
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

                  {platform.label}
                </span>
              </label>
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
        </div>
      </div>
    </>);

}
