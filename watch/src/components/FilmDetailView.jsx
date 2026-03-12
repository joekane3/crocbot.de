import { useState } from 'react';
import { RiArrowLeftSLine, RiUserSharedLine, RiCalendarLine, RiInformationLine, RiTv2Line, RiEyeLine, RiCheckLine, RiDeleteBin6Line, RiRefreshLine, RiExternalLinkLine } from 'react-icons/ri';
import { GiFlatStar } from 'react-icons/gi';
import { api } from '../api';

export default function FilmDetailView({ film: initialFilm, onBack }) {
  const [film, setFilm] = useState(initialFilm);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleWatch = async () => {
    const updated = await api.updateFilm(film.id, { watched: !film.watched });
    setFilm(updated);
  };

  const handleDelete = async () => {
    if (!deleting) { setDeleting(true); return; }
    await api.deleteFilm(film.id);
    onBack();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const updated = await api.refreshFilm(film.id);
      setFilm(updated);
    } catch (e) { console.error(e); }
    setRefreshing(false);
  };

  return (
    <div style={{
      width: '100%', maxWidth: 430, minHeight: '100vh', display: 'flex', flexDirection: 'column',
      backgroundColor: '#1a0a0a', color: '#ffffff', fontFamily: '"Playfair Display", Georgia, serif',
      margin: '0 auto'
    }}>
      {/* Hero */}
      <section style={{
        position: 'relative', padding: '24px 20px 40px',
        backgroundColor: '#4A0404', borderBottom: '4px solid #D4AF37',
        backgroundImage: film.backdrop
          ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${film.backdrop}")`
          : undefined,
        backgroundSize: 'cover', backgroundPosition: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '2px solid #D4AF37', margin: 8, pointerEvents: 'none' }} />

        <button onClick={onBack} style={{
          position: 'relative', zIndex: 10, background: '#2C1810', border: '2px solid #8B4513',
          color: '#D4AF37', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', marginBottom: 32, boxShadow: '2px 2px 0px rgba(0,0,0,0.3)'
        }}>
          <RiArrowLeftSLine size={24} />
        </button>

        <div style={{ position: 'relative', textAlign: 'center' }}>
          {film.genres?.[0] && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <span style={{
                backgroundColor: '#D4AF37', color: '#1a1a1a', padding: '4px 12px',
                fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2,
                border: '2px solid #8B4513', display: 'inline-flex', alignItems: 'center', gap: 6
              }}>
                <GiFlatStar size={16} /> {film.genres[0]}
              </span>
            </div>
          )}
          <h1 style={{
            fontSize: 36, fontWeight: 900, color: '#D4AF37', textTransform: 'uppercase',
            margin: '0 0 8px', textShadow: '3px 3px 0px #1a1a1a', lineHeight: 1
          }}>
            {film.title}
          </h1>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 12, color: '#fff',
            fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, flexWrap: 'wrap'
          }}>
            <span>{film.year}</span>
            {film.runtime && <><span>•</span><span>{film.runtime} MIN</span></>}
            {film.rating && <><span>•</span><span style={{ color: '#D4AF37' }}>★ {film.rating}/10</span></>}
          </div>
        </div>
      </section>

      {/* Details */}
      <section style={{ padding: '40px 20px', backgroundColor: '#2C1810', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 20, right: 20, height: 2, background: 'repeating-linear-gradient(90deg, #D4AF37, #D4AF37 10px, transparent 10px, transparent 20px)' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
          <div style={{ padding: 12, border: '2px solid #8B4513', backgroundColor: '#1a0a0a', boxShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <RiUserSharedLine color="#D4AF37" />
              <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#D4AF37', letterSpacing: 1 }}>Added By</span>
            </div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{film.addedBy}</p>
          </div>
          <div style={{ padding: 12, border: '2px solid #8B4513', backgroundColor: '#1a0a0a', boxShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <RiCalendarLine color="#D4AF37" />
              <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#D4AF37', letterSpacing: 1 }}>Date Added</span>
            </div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{film.addedDate}</p>
          </div>
        </div>

        {film.director && (
          <div style={{ marginBottom: 16, fontSize: 14, color: '#D4AF37' }}>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 4 }}>Director</span>
            <strong style={{ color: '#F5E6BE' }}>{film.director}</strong>
          </div>
        )}

        {film.cast?.length > 0 && (
          <div style={{ marginBottom: 24, fontSize: 13, color: '#F5E6BE' }}>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 4, color: '#D4AF37' }}>Cast</span>
            {film.cast.join(' · ')}
          </div>
        )}

        {film.synopsis && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <RiInformationLine color="#D4AF37" size={20} />
              <h3 style={{ margin: 0, fontSize: 18, textTransform: 'uppercase', color: '#D4AF37', letterSpacing: 2, fontWeight: 900 }}>
                The Feature Story
              </h3>
            </div>
            <div style={{
              padding: 20, border: '2px solid #8B4513', backgroundColor: '#3d1d11',
              color: '#f5e6d3', fontSize: 16, lineHeight: 1.6,
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
            }}>
              {film.synopsis}
            </div>
          </div>
        )}
      </section>

      {/* Streaming */}
      {film.streaming?.length > 0 && (
        <section style={{ padding: '0 20px 40px', backgroundColor: '#2C1810' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <RiTv2Line color="#D4AF37" size={20} />
            <h3 style={{ margin: 0, fontSize: 18, textTransform: 'uppercase', color: '#D4AF37', letterSpacing: 2, fontWeight: 900 }}>
              Available At
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {film.streaming.map((s, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', backgroundColor: '#1a0a0a', border: '2px solid #8B4513',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {s.logoPath && <img src={s.logoPath} alt="" style={{ width: 28, height: 28, borderRadius: 4 }} />}
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{s.provider}</span>
                    <span style={{ fontSize: 10, color: '#8B4513', marginLeft: 8, textTransform: 'uppercase' }}>{s.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Actions */}
      <section style={{ padding: '40px 20px', backgroundColor: '#1a0a0a', borderTop: '2px solid #8B4513' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button onClick={handleWatch} style={{
            backgroundColor: film.watched ? '#2C1810' : '#D4AF37',
            color: film.watched ? '#D4AF37' : '#1a1a1a',
            border: '2px solid #8B4513', padding: 16, fontSize: 16, fontWeight: 900,
            textTransform: 'uppercase', letterSpacing: 2, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            boxShadow: '6px 6px 0px rgba(0,0,0,0.4)'
          }}>
            {film.watched ? <><RiCheckLine size={24} /> Marked as Watched</> : <><RiEyeLine size={24} /> Mark as Watched</>}
          </button>

          <button onClick={handleRefresh} disabled={refreshing} style={{
            backgroundColor: '#2C1810', color: '#D4AF37', border: '2px solid #8B4513',
            padding: 14, fontSize: 14, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: 1, cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8, opacity: refreshing ? 0.6 : 1
          }}>
            <RiRefreshLine size={18} /> {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>

          <button onClick={handleDelete} style={{
            backgroundColor: deleting ? '#8B0000' : 'transparent',
            color: deleting ? '#fff' : '#D4AF37',
            border: '2px solid #8B4513', padding: 16, fontSize: 14, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            <RiDeleteBin6Line size={18} /> {deleting ? 'Are you sure?' : 'Delete from List'}
          </button>

          {deleting && (
            <button onClick={() => setDeleting(false)} style={{
              background: 'none', border: 'none', color: '#999', fontSize: 12,
              textDecoration: 'underline', cursor: 'pointer', textAlign: 'center'
            }}>Cancel</button>
          )}
        </div>

        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.3 }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#2C1810', marginLeft: -30, border: '2px solid #8B4513' }} />
          <div style={{ flex: 1, borderTop: '2px dashed #8B4513', margin: '0 10px' }} />
          <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#2C1810', marginRight: -30, border: '2px solid #8B4513' }} />
        </div>
      </section>
    </div>
  );
}
