import { useState, useEffect } from 'react';
import { RiMovie2Line, RiUser6Line, RiCheckDoubleLine } from 'react-icons/ri';

export default function MarqueeStats({ total, watched, pending, title }) {
  const [lightsOn, setLightsOn] = useState(true);
  useEffect(() => {
    const i = setInterval(() => setLightsOn(p => !p), 800);
    return () => clearInterval(i);
  }, []);

  const stats = [
    { label: 'TOTAL', value: total, icon: <RiMovie2Line /> },
    { label: 'WATCHED', value: watched, icon: <RiCheckDoubleLine /> },
    { label: 'PENDING', value: pending, icon: <RiUser6Line /> },
  ];

  return (
    <section style={{
      padding: '24px 20px',
      backgroundColor: '#2C1810',
      borderBottom: '4px solid #8B4513',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute', top: 4, left: 4, right: 4, bottom: 4,
        border: '2px solid #D4AF37', pointerEvents: 'none'
      }} />
      <div style={{
        backgroundColor: '#4A0404',
        border: '2px solid #D4AF37',
        padding: 16,
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 6px 6px 0px rgba(0,0,0,0.4)',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 12, letterSpacing: 4, color: '#D4AF37',
          marginBottom: 12, fontWeight: 800, textTransform: 'uppercase'
        }}>
          {title || 'Now Showing'} • Feature Presentations
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: 12 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ color: lightsOn ? '#D4AF37' : '#8B4513', fontSize: 20, transition: 'color 0.3s' }}>
                {s.icon}
              </div>
              <div style={{
                fontSize: 24, fontWeight: 900, color: '#F5E6BE',
                textShadow: '0 0 8px rgba(212,175,55,0.4)'
              }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#D4AF37', letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
