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
  { id: 'amazon', name: 'Amazon Prime' },
  { id: 'wow', name: 'WOW' },
  { id: 'netflix', name: 'Netflix' },
  { id: 'disney', name: 'Disney Plus' },
  { id: 'cinema', name: 'Cinema' }];

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev]
    }));
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '430px',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 200,
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
            maxWidth: '340px'
          }}>

          <h2
            style={{
              color: '#D4AF37',
              fontSize: '18px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '24px',
              textAlign: 'center',
              borderBottom: '1px solid #8B4513',
              paddingBottom: '12px'
            }}>

            Streaming Preferences
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginBottom: '32px'
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
                onChange={() => togglePlatform(platform.id)}
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

                  {platform.name}
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
              boxShadow: '4px 4px 0px rgba(0,0,0,0.3)'
            }}>

            Save Preferences
          </button>
        </div>
      </div>
    </>);

}
