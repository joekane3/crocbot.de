import { useState } from 'react';
import EntryHeader from './EntryHeader';
import EntryInput from './EntryInput';
import FinalizeActions from './FinalizeActions';
import BottomNav from '../FilmDetails/BottomNav';
import PlatformsManager from './PlatformsManager';

export default function PageLayout() {
  const [showPlatformsManager, setShowPlatformsManager] = useState(false);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '430px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1a0a0a',
        paddingBottom: '80px',
        fontFamily: "'Playfair Display', 'Georgia', serif",
        position: 'relative',
        margin: '0 auto' }}>

      {/* Decorative Art Deco Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.08,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 150px #000000'
        }} />

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '32px 24px',
          zIndex: 1,
          justifyContent: 'center'
        }}>

        <EntryHeader />
        <EntryInput />
        <FinalizeActions />
      </main>

      {showPlatformsManager &&
      <PlatformsManager onClose={() => setShowPlatformsManager(false)} />
      }

      <BottomNav
        activeTab="add"
        onPlatformsClick={() => setShowPlatformsManager(true)} />

    </div>);

}
