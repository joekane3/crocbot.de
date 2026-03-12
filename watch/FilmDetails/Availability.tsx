import { RiExternalLinkLine, RiTv2Line } from 'react-icons/ri';

export default function Availability() {
  const platforms = [
  { name: "HBO Max", color: "#5822b4" },
  { name: "Amazon Prime Video", color: "#00a8e1" }];

  return (
    <>
      <section
        style={{
          padding: '0 20px 40px',
          backgroundColor: '#2C1810'
        }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <RiTv2Line color="#D4AF37" size={20} />
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              textTransform: 'uppercase',
              color: '#D4AF37',
              letterSpacing: '2px',
              fontWeight: 900
            }}>

            Available At
          </h3>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>

          {platforms.map((platform, idx) =>
          <div
            key={platform.name}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                backgroundColor: '#1a0a0a',
                border: '2px solid #8B4513',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
                cursor: 'pointer'
              }}
            onClick={() => console.log(`Opening ${platform.name}`)}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '4px', height: '24px', backgroundColor: '#D4AF37' }} />
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>{platform.name}</span>
              </div>
              <RiExternalLinkLine color="#D4AF37" size={20} />
            </div>
          )}
        </div>
      </section>
    </>);

}
