import { HiFilm, HiPlus, HiEye } from 'react-icons/hi2';

const tabs = [
  { id: 'watchlist', name: 'Watchlist', Icon: HiFilm },
  { id: 'add', name: 'Add', Icon: HiPlus },
  { id: 'watched', name: 'Watched', Icon: HiEye },
];

export default function BottomNav({ active, onNavigate, user, onSwitchUser }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      zIndex: 100,
      backgroundColor: '#1a1a1a',
      borderTop: '3px solid #D4AF37',
      boxShadow: '0 -4px 12px rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      height: '80px',
      paddingBottom: '8px'
    }}>
      {tabs.map(({ id, name, Icon }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            style={{
              background: 'none',
              border: 'none',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
              padding: '8px 0',
              borderBottom: isActive ? '3px solid #D4AF37' : '3px solid transparent',
            }}
          >
            <Icon size={24} style={{ color: isActive ? '#D4AF37' : '#666' }} />
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#D4AF37' : '#888',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              fontFamily: 'Georgia, serif'
            }}>{name}</span>
          </button>
        );
      })}
      <button
        onClick={onSwitchUser}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          cursor: 'pointer',
          padding: '8px 12px',
        }}
      >
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: '#D4AF37', color: '#1a0a0a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 900, fontFamily: 'Inter, sans-serif'
        }}>{user?.[0]}</div>
        <span style={{ fontSize: 10, color: '#888', fontFamily: 'Georgia, serif' }}>{user}</span>
      </button>
    </div>
  );
}
