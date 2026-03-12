import { HiFilm, HiPlus, HiEye } from 'react-icons/hi2';
import { RiSettings4Line } from 'react-icons/ri';

interface BottomNavProps {
  activeTab: string;
  onPlatformsClick?: () => void;
}

const tabs = [
{ id: 'watchlist', name: 'Watchlist', icon: HiFilm },
{ id: 'add', name: 'Add', icon: HiPlus },
{ id: 'watched', name: 'Watched', icon: HiEye },
{ id: 'platforms', name: 'Platforms', icon: RiSettings4Line }];

export default function BottomNav({ activeTab, onPlatformsClick }: BottomNavProps) {
  const normalizedActive = activeTab.toLowerCase();

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
        boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '80px',
        paddingBottom: '12px'
      }}>

      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === normalizedActive;

        return (
          <div
            key={tab.id}
            onClick={() => {
              if (tab.id === 'platforms' && onPlatformsClick) {
                onPlatformsClick();
              }
            }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                padding: '10px 14px',
                borderBottom: isActive ? '3px solid #D4AF37' : '3px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                flex: 1
              }}>

            <Icon
              size={24}
              style={{
                  color: isActive ? '#D4AF37' : '#444',
                  filter: isActive ? 'drop-shadow(0 0 5px rgba(212, 175, 55, 0.5))' : 'none'
                }} />

            <span
              style={{
                  fontSize: '9px',
                  fontWeight: isActive ? '800' : '500',
                  color: isActive ? '#D4AF37' : '#666',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontFamily: 'Georgia, serif'
                }}>
              {tab.name}
            </span>
          </div>);

      })}
    </div>);

}
