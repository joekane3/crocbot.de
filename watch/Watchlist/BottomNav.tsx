import { HiFilm, HiHome, HiEye } from 'react-icons/hi2';
import { RiSettings4Line } from 'react-icons/ri';

interface BottomNavProps {
  activeTab: string;
  onPlatformsClick?: () => void;
}

export default function BottomNav({ activeTab, onPlatformsClick }: BottomNavProps) {
  const normalizedActive = activeTab.toLowerCase();

  const tabs = [
  { name: 'Watchlist', icon: HiFilm, key: 'watchlist' },
  { name: 'Watched', icon: HiEye, key: 'watched' },
  { name: 'Platforms', icon: RiSettings4Line, key: 'platforms' },
  { name: 'Home', icon: HiHome, key: 'home' }];

  const handleTabClick = (tabKey: string) => {
    if (tabKey === 'platforms' && onPlatformsClick) {
      onPlatformsClick();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        zIndex: 100,
        backgroundColor: '#1a1a1a',
        borderTop: '3px solid #D4AF37',
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '80px',
        paddingBottom: '8px'
      }}>

      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.key === normalizedActive;

        return (
          <div
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              padding: '8px 12px',
              transition: 'all 0.2s ease',
              borderBottom: isActive ? '3px solid #D4AF37' : '3px solid transparent',
              flex: 1
            }}>

            <Icon
              size={24}
              style={{
                color: isActive ? '#D4AF37' : '#666',
                transition: 'color 0.2s ease'
              }} />

            <span
              style={{
                fontSize: '10px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#D4AF37' : '#888',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontFamily: 'Georgia, serif',
                transition: 'color 0.2s ease'
              }}>
              {tab.name}
            </span>
          </div>);

      })}
    </div>);

}
