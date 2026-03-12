import ReviewMarquee from './ReviewMarquee';
import TicketSummary from './TicketSummary';
import PlatformSelection from './PlatformSelection';
import FinalizeActions from './FinalizeActions';
import BottomNav from '../FilmDetails/BottomNav';

export default function PageLayout() {
  return (
    <div
      style={{
        width: '430px',
        minHeight: '932px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1a0a0a',
        paddingBottom: '70px',
        fontFamily: "'Playfair Display', 'Georgia', serif",
        position: 'relative' }}>

      {/* Decorative Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          pointerEvents: 'none',
          backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} />


      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px'
        }}>

        <ReviewMarquee />
        <TicketSummary />
        <PlatformSelection />
        <FinalizeActions />
      </main>

      <BottomNav activeTab="add" />
</div>);

}