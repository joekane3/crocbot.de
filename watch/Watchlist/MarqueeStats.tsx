import { useState, useEffect } from 'react';
import { RiMovie2Line, RiUser6Line, RiCheckDoubleLine } from 'react-icons/ri';

export default function MarqueeStats() {
  const [lightsOn, setLightsOn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLightsOn((prev) => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const stats = [
  { label: 'TOTAL', value: '5', icon: <RiMovie2Line /> },
  { label: 'WATCHED', value: '2', icon: <RiCheckDoubleLine /> },
  { label: 'PENDING', value: '3', icon: <RiUser6Line /> }];

  return (
    <>
      <section
        style={{
          padding: '24px 20px',
          backgroundColor: '#2C1810',
          borderBottom: '4px solid #8B4513',
          position: 'relative'
        }}>

        {/* Lights border simulation */}
        <div style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
          right: '4px',
          bottom: '4px',
          border: '2px solid #D4AF37',
          pointerEvents: 'none'
        }} />

        <div style={{
          backgroundColor: '#4A0404',
          border: '2px solid #D4AF37',
          padding: '16px',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 6px 6px 0px rgba(0,0,0,0.4)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '12px',
            letterSpacing: '4px',
            color: '#D4AF37',
            marginBottom: '12px',
            fontWeight: 800,
            textTransform: 'uppercase'
          }}>
            Now Showing &bull; Feature Presentations
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            gap: '12px'
          }}>
            {stats.map((stat, idx) =>
            <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                color: lightsOn ? '#D4AF37' : '#8B4513',
                fontSize: '20px',
                transition: 'color 0.3s ease'
              }}>
                  {stat.icon}
                </div>
                <div style={{
                fontSize: '24px',
                fontWeight: 900,
                color: '#F5E6BE',
                textShadow: '0 0 8px rgba(212, 175, 55, 0.4)'
              }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '10px', color: '#D4AF37', letterSpacing: '1px' }}>
                  {stat.label}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decorative Eye */}
        <div style={{
          position: 'absolute',
          bottom: '-10px',
          right: '25px',
          width: '30px',
          height: '20px',
          background: '#163316',
          borderRadius: '50% 50% 0 0',
          border: '2px solid #8B4513',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ width: '8px', height: '8px', background: '#D4AF37', borderRadius: '50%' }} />
        </div>
      </section>
    </>);

}