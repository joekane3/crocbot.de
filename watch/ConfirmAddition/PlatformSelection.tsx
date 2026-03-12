import { RiTv2Line } from 'react-icons/ri';

export default function PlatformSelection() {
  const selectedPlatforms = ["Netflix"];

  return (
    <>
      <section
        style={{
          marginBottom: '32px'
        }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <RiTv2Line color="#D4AF37" size={20} />
          <h3 style={{
            color: '#D4AF37',
            fontSize: '14px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: 0
          }}>
            Available On
          </h3>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px'
          }}>

          {selectedPlatforms.map((platform, idx) =>
          <div
            key={idx}
            style={{
              backgroundColor: '#2C1810',
              border: '2px solid #8B4513',
              padding: '8px 16px',
              color: '#D4AF37',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>

              <div style={{ width: '6px', height: '6px', backgroundColor: '#D4AF37', borderRadius: '50%' }} />
              {platform}
            </div>
          )}
          <button
            onClick={() => console.log('Edit platforms')}
            style={{
              backgroundColor: 'transparent',
              border: '2px dashed #8B4513',
              padding: '8px 16px',
              color: '#8B4513',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}>

            + Add/Edit
          </button>
        </div>
      </section>
    </>);

}