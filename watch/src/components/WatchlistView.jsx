import MarqueeStats from './MarqueeStats';
import FilmCard from './FilmCard';

export default function WatchlistView({ films, loading, onSelect, onRefresh, title, emptyText, isWatched }) {
  return (
    <>
      <MarqueeStats
        total={films.length}
        watched={isWatched ? films.length : 0}
        pending={isWatched ? 0 : films.length}
        title={title}
      />
      <section style={{ padding: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ color: '#D4AF37', fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: 1 }}>
            {title.toUpperCase()}
          </h2>
        </div>

        {loading && (
          <p style={{ textAlign: 'center', color: '#8B4513', padding: 40 }}>Loading...</p>
        )}

        {!loading && films.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
            <p style={{ color: '#8B4513', fontSize: 14, letterSpacing: 1 }}>{emptyText}</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {films.map(film => (
            <FilmCard key={film.id} film={film} onSelect={onSelect} isWatched={isWatched} />
          ))}
        </div>

        <div style={{ marginTop: 32, textAlign: 'center', opacity: 0.2, color: '#D4AF37' }}>
          <div style={{ fontSize: 18, letterSpacing: 8 }}>🐊 🎬 🐊 🎬 🐊</div>
          <p style={{ fontSize: 9, marginTop: 8, letterSpacing: 1, fontWeight: 700 }}>
            LOCAL NETWORK BROADCAST • EST. 2026
          </p>
        </div>
      </section>
    </>
  );
}
