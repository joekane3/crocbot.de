import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import BottomNav from './components/BottomNav';
import WatchlistView from './components/WatchlistView';
import AddFilmView from './components/AddFilmView';
import FilmDetailView from './components/FilmDetailView';
import UserPicker from './components/UserPicker';

export default function App() {
  const [tab, setTab] = useState('watchlist'); // watchlist | add | watched
  const [films, setFilms] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [user, setUser] = useState(() => localStorage.getItem('watchUser') || null);
  const [loading, setLoading] = useState(false);

  const loadFilms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getFilms();
      setFilms(data);
    } catch (e) {
      console.error('Failed to load films:', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadFilms(); }, [loadFilms]);

  const handleSelectUser = (name) => {
    localStorage.setItem('watchUser', name);
    setUser(name);
  };

  if (!user) return <UserPicker onSelect={handleSelectUser} />;

  if (selectedFilm) {
    return (
      <div style={shellStyle}>
        <div style={innerStyle}>
          <FilmDetailView
            film={selectedFilm}
            onBack={() => { setSelectedFilm(null); loadFilms(); }}
            user={user}
          />
        </div>
      </div>
    );
  }

  const unwatched = films.filter(f => !f.watched);
  const watched = films.filter(f => f.watched);

  return (
    <div style={shellStyle}>
      <div style={innerStyle}>
        {tab === 'watchlist' && (
          <WatchlistView
            films={unwatched}
            allFilms={films}
            loading={loading}
            onSelect={setSelectedFilm}
            onRefresh={loadFilms}
            title="Watchlist"
            emptyText="No films yet — add one!"
          />
        )}
        {tab === 'add' && (
          <AddFilmView
            user={user}
            onAdded={() => { setTab('watchlist'); loadFilms(); }}
          />
        )}
        {tab === 'watched' && (
          <WatchlistView
            films={watched}
            allFilms={films}
            loading={loading}
            onSelect={setSelectedFilm}
            onRefresh={loadFilms}
            title="Watched"
            emptyText="Nothing watched yet."
            isWatched
          />
        )}
        <BottomNav active={tab} onNavigate={setTab} user={user} onSwitchUser={() => { localStorage.removeItem('watchUser'); setUser(null); }} />
      </div>
    </div>
  );
}

const shellStyle = {
  minHeight: '100vh',
  background: '#0a0505',
  display: 'flex',
  justifyContent: 'center'
};

const innerStyle = {
  width: '100%',
  maxWidth: '430px',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#1a0a0a',
  backgroundImage: 'radial-gradient(circle at 50% 50%, #2c1810 0%, #1a0a0a 100%)',
  position: 'relative',
  fontFamily: "'Playfair Display', Georgia, serif",
  color: '#F5E6BE',
  paddingBottom: '88px'
};
