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

  const handleToggle = (platform: string) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [platform]: !prev[platform as keyof typeof prev]
    }));
  };

  const platforms = Object.keys(selectedPlatforms);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
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
          width: '100%',
          maxWidth: '320px',
          boxShadow: '6px 6px 0px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
        <h2
          style={{
            color: '#D4AF37',
            fontSize: '18px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            textAlign: 'center',
            margin: 0,
            borderBottom: '1px solid #8B4513',
            paddingBottom: '12px'
          }}>
          Streaming Platforms
        </h2>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {platforms.map((platform) =>
          <label
            key={platform}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 700,
              color: '#D4AF37',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              <input
              type="checkbox"
              checked={selectedPlatforms[platform as keyof typeof selectedPlatforms]}
              onChange={() => handleToggle(platform)}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer',
                accentColor: '#D4AF37'
              }} />

              {platform}
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
            marginTop: '8px'
          }}>
          Save Preferences
        </button>
      </div>
    </div>);

}
