import { useState } from 'react';
import { FaPenNib } from 'react-icons/fa';

export default function EntryInput() {
  const [description, setDescription] = useState("");

  return (
    <>
      <section
        style={{
          position: 'relative',
          marginBottom: '32px'
        }}>

        <div
          style={{
            backgroundColor: '#fffbeb',
            padding: '32px 24px',
            border: '1px solid #D4AF37',
            boxShadow: '12px 12px 0px #2C1810, 0 10px 25px rgba(0,0,0,0.4)',
            minHeight: '280px',
            display: 'flex',
            flexDirection: 'column',
            backgroundImage: 'linear-gradient(rgba(212, 175, 55, 0.05) 1px, transparent 1px)',
            backgroundSize: '100% 32px'
          }}>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              opacity: 0.6
            }}>

            <FaPenNib size={12} color="#8B4513" />
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 700,
                color: '#8B4513'
              }}>

              Script Log #1024
            </span>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you want to add, and we'll do the rest..."
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '20px',
              lineHeight: '32px',
              color: '#1a1a1a',
              fontFamily: "'Courier Prime', 'Courier', monospace",
              resize: 'none',
              padding: 0,
              width: '100%',
              height: '100%'
            }} />

        </div>

        {/* Decorative corner accents */}
        <div
          style={{
            position: 'absolute',
            top: '-5px',
            left: '-5px',
            width: '20px',
            height: '20px',
            borderTop: '2px solid #D4AF37',
            borderLeft: '2px solid #D4AF37'
          }} />

        <div
          style={{
            position: 'absolute',
            bottom: '-5px',
            right: '-5px',
            width: '20px',
            height: '20px',
            borderBottom: '2px solid #D4AF37',
            borderRight: '2px solid #D4AF37'
          }} />

      </section>
    </>);

}
