import { useState } from 'react';
import HeroMarquee from './HeroMarquee';
import FilmDetails from './FilmDetails';
import Availability from './Availability';
import ActionFooter from './ActionFooter';
import BottomNav from './BottomNav';
import PlatformsManager from './PlatformsManager';

export default function PageLayout() {
  const [showPlatformsManager, setShowPlatformsManager] = useState(false);

  return (
    <div
      style={{
        width: '430px',
        minHeight: '932px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1a0a0a',
        color: '#ffffff',
        paddingBottom: '80px',
        fontFamily: '"Baskerville", "Georgia", serif',
        margin: '0 auto',
        position: 'relative' }}>

      <main
        style={{ flex: 1 }}>

        <HeroMarquee />
        <FilmDetails />
        <Availability />
        <ActionFooter />
      </main>

      {showPlatformsManager &&
      <PlatformsManager onClose={() => setShowPlatformsManager(false)} />
      }

      <BottomNav
        activeTab={showPlatformsManager ? 'platforms' : 'watchlist'}
        onPlatformsClick={() => setShowPlatformsManager(true)} />

    </div>);

}
