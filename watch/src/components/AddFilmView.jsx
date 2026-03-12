import { useState } from 'react';
import { RiSparkling2Fill, RiClapperboardFill } from 'react-icons/ri';
import { FaPenNib } from 'react-icons/fa';
import { HiCheck, HiArrowLeft } from 'react-icons/hi2';
import { api } from '../api';

export default function AddFilmView({ user, onAdded }) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [confirming, setConfirming] = useState(null); // selected result
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    try {
      const data = await api.searchFilm(query, user);
      setResults(data.results);
    } catch (e) {
      setError(e.message);
    }
    setSearching(false);
  };

  const handleConfirm = async (result) => {
    setSaving(true);
    setError(null);
    try {
      await api.confirmFilm(result.tmdbId, user, result.mediaType);
      onAdded();
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  // Confirm screen
  if (confirming) {
    return (
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', zIndex: 1 }}>
        {/* Decorative bg */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, pointerEvents: 'none', backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <section style={{ textAlign: 'center', marginBottom: 24, paddingTop: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: 1, textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
            Confirm Entry
          </h1>
          <div style={{ height: 4, width: 60, background: '#8B4513', margin: '8px auto' }} />
        </section>

        {/* Ticket */}
        <section style={{
          backgroundColor: '#D4AF37', padding: 2, border: '2px solid #8B4513',
          boxShadow: '6px 6px 0px rgba(0,0,0,0.4)', marginBottom: 24, position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: -10, left: 20, right: 20 }}>
            {[...Array(8)].map((_, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#1a0a0a' }} />)}
          </div>
          <div style={{ backgroundColor: '#fffbeb', padding: 24, border: '1px dashed #8B4513' }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              {confirming.poster && (
                <img src={confirming.poster} alt="" style={{ width: 80, height: 120, objectFit: 'cover', border: '2px solid #8B4513' }} />
              )}
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px', textTransform: 'uppercase', lineHeight: 1.1 }}>
                  {confirming.title}
                </h2>
                <div style={{ fontSize: 14, color: '#8B4513', fontWeight: 600, marginBottom: 8 }}>{confirming.year}</div>
                <p style={{ fontSize: 13, color: '#2C1810', lineHeight: 1.4, fontStyle: 'italic' }}>
                  {confirming.overview?.slice(0, 200)}{confirming.overview?.length > 200 ? '…' : ''}
                </p>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#666' }}>Added by <strong>{user}</strong></span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: -10, left: 20, right: 20 }}>
            {[...Array(8)].map((_, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#1a0a0a' }} />)}
          </div>
        </section>

        {error && <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: 16 }}>{error}</p>}

        <button
          onClick={() => handleConfirm(confirming)}
          disabled={saving}
          style={{
            backgroundColor: '#D4AF37', color: '#1a1a1a', border: '2px solid #8B4513',
            padding: 18, fontSize: 18, fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: 2, cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 12, boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
            opacity: saving ? 0.7 : 1, marginBottom: 16
          }}
        >
          {saving ? 'Saving...' : <><HiCheck size={20} /> Confirm & Save</>}
        </button>

        <button
          onClick={() => setConfirming(null)}
          style={{
            backgroundColor: '#2C1810', color: '#D4AF37', border: '2px solid #8B4513',
            padding: 14, fontSize: 14, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: 1, cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8, boxShadow: '2px 2px 0px rgba(0,0,0,0.15)'
          }}
        >
          <HiArrowLeft size={16} /> Back to Results
        </button>
      </main>
    );
  }

  // Search results
  if (results) {
    return (
      <main style={{ flex: 1, padding: '24px', zIndex: 1 }}>
        <section style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ color: '#D4AF37', fontSize: 18, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase' }}>
            Select a Match
          </h2>
          <div style={{ height: 2, width: 60, background: '#8B4513', margin: '8px auto' }} />
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {results.map(r => (
            <div
              key={r.tmdbId}
              onClick={() => setConfirming(r)}
              style={{
                display: 'flex', gap: 12, padding: 12,
                backgroundColor: '#F5E6BE', border: '2px solid #8B4513',
                cursor: 'pointer', boxShadow: '2px 2px 0px rgba(0,0,0,0.2)'
              }}
            >
              {r.poster ? (
                <img src={r.poster} alt="" style={{ width: 50, height: 75, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 50, height: 75, background: '#8B4513', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>🎬</div>
              )}
              <div>
                <h3 style={{ color: '#2C1810', fontSize: 14, fontWeight: 800, margin: 0, fontFamily: 'Georgia, serif' }}>
                  {r.title} <span style={{ fontWeight: 400, fontSize: 11, color: '#8B4513' }}>({r.year})</span>
                  {r.mediaType === 'tv' && <span style={{ marginLeft: 6, fontSize: 9, padding: '1px 5px', background: '#8B4513', color: '#F5E6BE', fontWeight: 700, letterSpacing: 0.5, verticalAlign: 'middle' }}>TV</span>}
                </h3>
                <p style={{ fontSize: 11, color: '#8B4513', marginTop: 4, lineHeight: 1.3 }}>
                  {r.overview?.slice(0, 100)}{r.overview?.length > 100 ? '…' : ''}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => { setResults(null); setQuery(''); }}
          style={{
            backgroundColor: '#2C1810', color: '#D4AF37', border: '2px solid #8B4513',
            padding: 14, fontSize: 14, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: 1, cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8, width: '100%'
          }}
        >
          <HiArrowLeft size={16} /> New Search
        </button>
      </main>
    );
  }

  // Search input
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px', zIndex: 1, justifyContent: 'center' }}>
      {/* Decorative bg */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.08, pointerEvents: 'none', backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 150px #000000' }} />

      <section style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 48, height: 48, borderRadius: '50%', border: '1px solid #D4AF37',
          marginBottom: 20, boxShadow: '0 0 15px rgba(212,175,55,0.2)'
        }}>
          <RiSparkling2Fill color="#D4AF37" size={24} />
        </div>
        <h1 style={{
          fontSize: 32, fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase',
          margin: 0, letterSpacing: 3, textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          fontFamily: "'Playfair Display', serif"
        }}>Now Casting</h1>
        <div style={{ height: 1, width: 100, backgroundColor: '#8B4513', margin: '16px auto', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, backgroundColor: '#D4AF37', borderRadius: '50%' }} />
        </div>
      </section>

      <section style={{ position: 'relative', marginBottom: 32 }}>
        <div style={{
          backgroundColor: '#fffbeb', padding: '32px 24px', border: '1px solid #D4AF37',
          boxShadow: '12px 12px 0px #2C1810, 0 10px 25px rgba(0,0,0,0.4)',
          minHeight: 200, display: 'flex', flexDirection: 'column',
          backgroundImage: 'linear-gradient(rgba(212,175,55,0.05) 1px, transparent 1px)', backgroundSize: '100% 32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, opacity: 0.6 }}>
            <FaPenNib size={12} color="#8B4513" />
            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, color: '#8B4513' }}>
              Script Log
            </span>
          </div>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(); } }}
            placeholder="Describe what you want to add..."
            style={{
              flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none',
              fontSize: 20, lineHeight: '32px', color: '#1a1a1a',
              fontFamily: "'Courier Prime', Courier, monospace", resize: 'none',
              padding: 0, width: '100%', minHeight: 120
            }}
          />
        </div>
        <div style={{ position: 'absolute', top: -5, left: -5, width: 20, height: 20, borderTop: '2px solid #D4AF37', borderLeft: '2px solid #D4AF37' }} />
        <div style={{ position: 'absolute', bottom: -5, right: -5, width: 20, height: 20, borderBottom: '2px solid #D4AF37', borderRight: '2px solid #D4AF37' }} />
      </section>

      {error && <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: 16 }}>{error}</p>}

      <button
        onClick={handleSearch}
        disabled={searching || !query.trim()}
        style={{
          backgroundColor: '#D4AF37', color: '#1a0a0a', border: '2px solid #8B4513',
          padding: 20, fontSize: 16, fontWeight: 900, textTransform: 'uppercase',
          letterSpacing: 2, cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 12, boxShadow: '6px 6px 0px rgba(0,0,0,0.5)',
          opacity: (searching || !query.trim()) ? 0.7 : 1
        }}
      >
        {searching ? 'Consulting Archives...' : <>Search <RiClapperboardFill size={18} /></>}
      </button>

      <p style={{ textAlign: 'center', color: '#8B4513', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, fontStyle: 'italic', opacity: 0.8, marginTop: 20 }}>
        Just name it, describe the plot, or drop a quote.
      </p>
    </main>
  );
}
