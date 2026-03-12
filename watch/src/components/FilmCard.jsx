import { RiEyeLine, RiInformationLine } from 'react-icons/ri';

export default function FilmCard({ film, onSelect, isWatched }) {
  return (
    <div
      onClick={() => onSelect(film)}
      style={{
        display: 'flex',
        backgroundColor: '#F5E6BE',
        border: '2px solid #8B4513',
        boxShadow: '2px 2px 0px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        minHeight: 110
      }}
    >
      {/* Perforation strip */}
      <div style={{
        width: 12, background: '#1a0a05',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', padding: '2px 0'
      }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ width: 6, height: 8, background: '#F5E6BE', opacity: 0.3 }} />
        ))}
      </div>

      {/* Poster */}
      <div style={{ position: 'relative', width: 75, flexShrink: 0 }}>
        {film.poster ? (
          <img src={film.poster} alt={film.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#8B4513', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontSize: 24 }}>🎬</div>
        )}
        {isWatched && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(26,10,5,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#D4AF37', fontSize: 24
          }}>
            <RiEyeLine />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
          <h3 style={{
            color: '#2C1810', fontSize: 14, fontWeight: 800, margin: 0,
            lineHeight: 1.1, fontFamily: 'Georgia, serif'
          }}>
            {film.title} <span style={{ fontWeight: 400, fontSize: 11, color: '#8B4513' }}>({film.year})</span>
            {film.mediaType === 'tv' && <span style={{ marginLeft: 6, fontSize: 9, padding: '1px 5px', background: '#8B4513', color: '#F5E6BE', fontWeight: 700, letterSpacing: 0.5, verticalAlign: 'middle' }}>TV</span>}
          </h3>
          {isWatched && (
            <span style={{
              backgroundColor: '#2C1810', color: '#D4AF37', fontSize: 9,
              padding: '1px 6px', border: '1px solid #D4AF37', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap'
            }}>Seen</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, color: '#8B4513', fontWeight: 600 }}>
            {film.addedBy} • {film.addedDate}
          </span>
        </div>

        {film.genres?.length > 0 && (
          <div style={{ fontSize: 10, color: '#8B4513', fontStyle: 'italic' }}>
            {film.genres.slice(0, 3).join(' · ')}
          </div>
        )}

        {film.rating && (
          <div style={{ fontSize: 11, color: '#2C1810', fontWeight: 700 }}>
            ★ {film.rating}/10
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', gap: 6, paddingTop: 4 }}>
          <button
            onClick={e => { e.stopPropagation(); onSelect(film); }}
            style={{
              flex: 1,
              backgroundColor: '#2C1810', color: '#F5E6BE', border: 'none',
              padding: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
            }}
          >
            <RiInformationLine /> Details
          </button>
        </div>
      </div>

      {/* Ticket punch hole */}
      <div style={{
        position: 'absolute', top: '50%', right: -6, transform: 'translateY(-50%)',
        width: 12, height: 12, background: '#1a0a0a', borderRadius: '50%', border: '2px solid #8B4513'
      }} />
    </div>
  );
}
