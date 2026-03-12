import { FaFilm, FaCalendarAlt, FaUser } from 'react-icons/fa';

export default function TicketSummary() {
  const filmData = {
    name: "Oppenheimer",
    year: "2023",
    addedBy: "Joe",
    description: "Christopher Nolan's epic biography of the father of the atomic bomb.",
    runtime: "180 min",
    rating: "8.4/10"
  };

  return (
    <>
      <section
        style={{
          backgroundColor: '#D4AF37',
          padding: '2px',
          border: '2px solid #8B4513',
          boxShadow: '6px 6px 0px rgba(0,0,0,0.4)',
          marginBottom: '24px',
          position: 'relative'
        }}>

        {/* Perforated Edge Top */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'absolute',
          top: '-10px',
          left: '20px',
          right: '20px'
        }}>
          {[...Array(8)].map((_, i) =>
          <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#1a0a0a' }} />
          )}
        </div>

        <div
          style={{
            backgroundColor: '#fffbeb',
            padding: '24px',
            border: '1px dashed #8B4513'
          }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#8B4513', textTransform: 'uppercase' }}>Admit One</span>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#8B4513', textTransform: 'uppercase' }}>Section: Network</span>
          </div>

          <h2
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#1a1a1a',
              margin: '0 0 8px 0',
              lineHeight: 1.1,
              textTransform: 'uppercase'
            }}>

            {filmData.name}
          </h2>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaCalendarAlt size={12} color="#8B4513" />
              <span style={{ fontSize: '14px', color: '#2C1810', fontWeight: 600 }}>{filmData.year}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaFilm size={12} color="#8B4513" />
              <span style={{ fontSize: '14px', color: '#2C1810', fontWeight: 600 }}>{filmData.runtime}</span>
            </div>
          </div>

          <p
            style={{
              fontSize: '15px',
              color: '#2C1810',
              lineHeight: 1.5,
              margin: '0 0 20px 0',
              fontStyle: 'italic',
              borderLeft: '2px solid #D4AF37',
              paddingLeft: '12px'
            }}>

            "{filmData.description}"
          </p>

          <div
            style={{
              borderTop: '1px solid #e5e5e5',
              paddingTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src="https://api.dicebear.com/7.x/initials/svg?seed=Joe&backgroundColor=D4AF37"
                alt="Joe"
                style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #8B4513' }} />

              <div>
                <span style={{ fontSize: '10px', display: 'block', color: '#666', textTransform: 'uppercase' }}>Recommended By</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a' }}>{filmData.addedBy}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '10px', display: 'block', color: '#666', textTransform: 'uppercase' }}>Rating</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#8B4513' }}>{filmData.rating}</span>
            </div>
          </div>
        </div>

        {/* Perforated Edge Bottom */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'absolute',
          bottom: '-10px',
          left: '20px',
          right: '20px'
        }}>
          {[...Array(8)].map((_, i) =>
          <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#1a0a0a' }} />
          )}
        </div>
      </section>
    </>);

}