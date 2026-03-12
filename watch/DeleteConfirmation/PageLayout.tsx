import { useState } from 'react';
import DeleteHeader from './DeleteHeader';
import FilmIdentity from './FilmIdentity';
import ActionBox from './ActionBox';
import BottomNav from './BottomNav';
import PlatformsManager from './PlatformsManager';

export default function PageLayout() {
  const [showPlatformsManager, setShowPlatformsManager] = useState(false);

  return (
    <div
      style={{
        width: '430px',
        margin: '0 auto',
        minHeight: '932px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#2C1810',
        color: '#D4AF37',
        fontFamily: '"Baskerville", serif',
        position: 'relative',
        paddingBottom: '80px' }}>

      {/* Decorative Art Deco Background Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23D4AF37' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          zIndex: 0
        }} />


      <main
        style={{ flex: 1, zIndex: 1, display: 'flex', flexDirection: 'column' }}>

        <DeleteHeader />
        <FilmIdentity />
        <ActionBox />
      </main>

      {showPlatformsManager &&
      <PlatformsManager onClose={() => setShowPlatformsManager(false)} />
      }

      <BottomNav
        activeTab="watchlist"
        onPlatformsClick={() => setShowPlatformsManager(true)} />

    </div>);

}
