import { useState } from 'react';
import { RiDeleteBin7Line, RiEyeLine, RiInformationLine, RiAddLine } from 'react-icons/ri';

const FILMS = [
{
  id: 'film_1',
  name: "Blade Runner 2049",
  year: "2017",
  addedBy: "Marcus Chen",
  addedDate: "2024-01-15",
  watched: false,
  poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=300&fit=crop",
  color: '#c0aede'
},
{
  id: 'film_2',
  name: "The Grand Budapest Hotel",
  year: "2014",
  addedBy: "Sarah Williams",
  addedDate: "2024-01-18",
  watched: true,
  poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=200&h=300&fit=crop",
  color: '#d1d4f9'
},
{
  id: 'film_3',
  name: "Parasite",
  year: "2019",
  addedBy: "James Rodriguez",
  addedDate: "2024-01-20",
  watched: false,
  poster: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=200&h=300&fit=crop",
  color: '#b6e3f4'
},
{
  id: 'film_4',
  name: "Oppenheimer",
  year: "2023",
  addedBy: "Elena Vasquez",
  addedDate: "2024-01-22",
  watched: false,
  poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=300&fit=crop",
  color: '#f4b6b6'
},
{
  id: 'film_5',
  name: "Spirited Away",
  year: "2001",
  addedBy: "David Park",
  addedDate: "2024-01-25",
  watched: true,
  poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=200&h=300&fit=crop",
  color: '#f4e3b6'
}];

export default function Watchlist() {
  const [films, setFilms] = useState(FILMS);

  const toggleWatched = (id: string) => {
    setFilms(films.map((f) => f.id === id ? { ...f, watched: !f.watched } : f));
  };

  const deleteFilm = (id: string) => {
    setFilms(films.filter((f) => f.id !== id));
  };

  const addFilm = () => {
    console.log('Add film');
  };

  return (
    <>
      <section
        style={{ padding: '12px' }}>

        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2
            style={{ color: '#D4AF37', fontSize: '16px', fontWeight: 800, margin: 0, letterSpacing: '1px' }}>
            WATCHLIST
          </h2>
          <button
            onClick={addFilm}
            style={{
              backgroundColor: '#D4AF37',
              color: '#1a0a05',
              border: 'none',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
            <RiAddLine /> Add
          </button>
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {films.map((film, index) =>
          <div
            key={film.id}
            style={{
              display: 'flex',
              backgroundColor: '#F5E6BE',
              border: '2px solid #8B4513',
              boxShadow: '2px 2px 0px rgba(0,0,0,0.2)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              minHeight: '110px'
            }}>

              <div
              style={{
                width: '12px',
                background: '#1a0a05',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '2px 0'
              }}>
                {[1, 2, 3, 4].map((i) =>
              <div
                key={i}
                style={{ width: '6px', height: '8px', background: '#F5E6BE', opacity: 0.3 }} />
              )}
              </div>

              <div
              style={{ position: 'relative', width: '75px' }}>
                <img
                src={film.poster}
                alt={film.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {film.watched &&
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(26, 10, 5, 0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#D4AF37', fontSize: '24px'
                }}>
                    <RiEyeLine />
                  </div>
              }
              </div>

              <div
              style={{
                flex: 1,
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px' }}>
                  <h3
                  style={{
                    color: '#2C1810',
                    fontSize: '14px',
                    fontWeight: 800,
                    margin: 0,
                    lineHeight: 1.1,
                    fontFamily: 'Georgia, serif'
                  }}>
                    {film.name} <span style={{ fontWeight: 400, fontSize: '11px', color: '#8B4513' }}>({film.year})</span>
                  </h3>
                  {film.watched &&
                <span
                  style={{
                    backgroundColor: '#2C1810',
                    color: '#D4AF37',
                    fontSize: '9px',
                    padding: '1px 6px',
                    border: '1px solid #D4AF37',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap'
                  }}>
                      Seen
                    </span>
                }
                </div>

                <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${film.addedBy}&backgroundColor=${film.color.replace('#', '')}`}
                  alt={film.addedBy}
                  style={{ width: 16, height: 16, borderRadius: '50%' }} />
                  <span
                  style={{ fontSize: '10px', color: '#8B4513', fontWeight: 600 }}>
                    {film.addedBy} &bull; {film.addedDate}
                  </span>
                </div>

                <div
                style={{ marginTop: 'auto', display: 'flex', gap: '6px', paddingTop: '6px' }}>
                  <button
                  onClick={(e) => {e.stopPropagation();toggleWatched(film.id);}}
                  style={{
                    flex: 1,
                    backgroundColor: film.watched ? '#8B4513' : '#D4AF37',
                    color: film.watched ? '#F5E6BE' : '#1a1a1a',
                    border: 'none',
                    padding: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}>
                    <RiEyeLine /> {film.watched ? 'Rewatch' : 'Watched'}
                  </button>
                  <button
                  onClick={(e) => {e.stopPropagation();deleteFilm(film.id);}}
                  style={{
                    width: '36px',
                    backgroundColor: '#2C1810',
                    color: '#F5E6BE',
                    border: 'none',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}>
                    <RiDeleteBin7Line />
                  </button>
                  <button
                  onClick={(e) => {e.stopPropagation();}}
                  style={{
                    width: '36px',
                    backgroundColor: 'transparent',
                    color: '#2C1810',
                    border: '2px solid #2C1810',
                    padding: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}>
                    <RiInformationLine />
                  </button>
                </div>
              </div>

              <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '-6px',
                transform: 'translateY(-50%)',
                width: '12px',
                height: '12px',
                background: '#1a0a05',
                borderRadius: '50%',
                border: '2px solid #8B4513'
              }} />
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: '32px',
            textAlign: 'center',
            opacity: 0.2,
            color: '#D4AF37'
          }}>
          <div style={{ fontSize: '18px', letterSpacing: '8px' }}>
            🐊 🎬 🐊 🎬 🐊
          </div>
          <p style={{ fontSize: '9px', marginTop: '8px', letterSpacing: '1px', fontWeight: 700 }}>
            LOCAL NETWORK BROADCAST &bull; EST. 2024
          </p>
        </div>
      </section>
    </>);

}
