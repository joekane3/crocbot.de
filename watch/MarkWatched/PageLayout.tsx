import { useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import FilmContext from './FilmContext';
import BottomNav from './BottomNav';
import PlatformsManager from './PlatformsManager';

export default function PageLayout() {
  const [showPlatformsManager, setShowPlatformsManager] = useState(false);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#2C1810',
        backgroundImage: `radial-gradient(#3D2419 2px, transparent 2px)`,
        backgroundSize: '24px 24px',
        paddingBottom: '80px',
        fontFamily: '"Times New Roman", Times, serif',
        color: '#D4AF37'
      }}>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '40px 24px',
          maxWidth: '430px',
          margin: '0 auto',
          width: '100%'
        }}>

        <FilmContext />
        <ConfirmationDialog />
      </main>

      {showPlatformsManager &&
      <PlatformsManager onClose={() => setShowPlatformsManager(false)} />
      }

      <BottomNav
        activeTab={showPlatformsManager ? 'platforms' : 'watchlist'}
        onPlatformsClick={() => setShowPlatformsManager(true)} />

    </div>);

}
