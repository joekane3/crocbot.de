import { useState } from 'react';
import { RiMovie2Line } from 'react-icons/ri';

const btnStyle = {
  background: '#2C1810',
  border: '2px solid #D4AF37',
  color: '#D4AF37',
  padding: '20px 32px',
  fontSize: 20,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: "'Playfair Display', Georgia, serif",
  letterSpacing: 2,
  boxShadow: '4px 4px 0px rgba(0,0,0,0.4)',
  transition: 'all 0.15s',
};

export default function UserPicker({ onSelect }) {
  const [showOther, setShowOther] = useState(false);
  const [otherName, setOtherName] = useState('');

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Playfair Display', Georgia, serif"
    }}>
      <div style={{ textAlign: 'center', padding: '40px 24px' }}>
        <RiMovie2Line size={48} color="#D4AF37" style={{ marginBottom: 16 }} />
        <h1 style={{
          color: '#D4AF37',
          fontSize: '32px',
          fontWeight: 900,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: 8,
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
        }}>
          Kane Watchlist
        </h1>
        <div style={{ height: 2, width: 80, background: '#8B4513', margin: '16px auto 32px' }} />
        <p style={{ color: '#8B4513', fontSize: 14, marginBottom: 32, letterSpacing: 1 }}>WHO'S WATCHING?</p>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Joe', 'Kali'].map(name => (
            <button key={name} onClick={() => onSelect(name)} style={btnStyle}
              onMouseDown={e => e.currentTarget.style.transform = 'translate(2px, 2px)'}
              onMouseUp={e => e.currentTarget.style.transform = ''}>
              {name}
            </button>
          ))}
          <button onClick={() => setShowOther(true)} style={{...btnStyle, padding: '20px 24px', fontSize: 16, border: '2px solid #8B4513', color: '#8B4513'}}>
            Other
          </button>
        </div>
        {showOther && (
          <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
            <input
              type="text" value={otherName} onChange={e => setOtherName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && otherName.trim() && onSelect(otherName.trim())}
              placeholder="Your name" autoFocus
              style={{
                background: '#2C1810', border: '2px solid #8B4513', color: '#F5E6BE',
                padding: '12px 16px', fontSize: 16, fontFamily: "'Playfair Display', Georgia, serif",
                outline: 'none', width: 160
              }}
            />
            <button onClick={() => otherName.trim() && onSelect(otherName.trim())}
              style={{...btnStyle, padding: '12px 20px', fontSize: 14}}>
              Go
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
