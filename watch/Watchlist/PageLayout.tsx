import { useState } from 'react';
import MarqueeStats from './MarqueeStats';
import Watchlist from './Watchlist';
import BottomNav from './BottomNav';
import PlatformsManager from './PlatformsManager';

export default function PageLayout() {
  const [showPlatformsManager, setShowPlatformsManager] = useState(false);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '430px',
        margin: '0 auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1a0a05',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #2c1810 0%, #1a0a05 100%)',
        paddingBottom: '80px',
        color: '#F5E6BE',
        fontFamily: 'Georgia, serif',
        position: 'relative' }}>

      <MarqueeStats />

      <main
        style={{ flex: 1, overflowY: 'auto' }}>
        <Watchlist />
      </main>

      {showPlatformsManager &&
      <PlatformsManager onClose={() => setShowPlatformsManager(false)} />
      }

      <BottomNav
        activeTab={showPlatformsManager ? 'platforms' : 'watchlist'}
        onPlatformsClick={() => setShowPlatformsManager(true)} />

    </div>);

}
