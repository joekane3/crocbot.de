import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'watchlist.json');
const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

const app = express();
app.use(cors());
app.use(express.json());

// Serve production build
app.use(express.static(join(__dirname, '..', 'dist')));

function readDB() {
  return JSON.parse(readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

async function tmdbFetch(path) {
  if (!TMDB_KEY) throw new Error('TMDB_API_KEY not set');
  const url = `${TMDB_BASE}${path}${path.includes('?') ? '&' : '?'}api_key=${TMDB_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${await res.text()}`);
  return res.json();
}

async function enrichItem(tmdbId, mediaType = 'movie') {
  const base = mediaType === 'tv' ? '/tv' : '/movie';
  const [details, credits] = await Promise.all([
    tmdbFetch(`${base}/${tmdbId}?append_to_response=watch/providers`),
    tmdbFetch(`${base}/${tmdbId}/credits`)
  ]);

  const director = credits.crew?.find(c => c.job === 'Director')?.name || null;
  const cast = credits.cast?.slice(0, 5).map(c => c.name) || [];

  // Streaming for DE
  const deProviders = details['watch/providers']?.results?.DE;
  const streaming = [];
  const seen = new Set();
  for (const type of ['flatrate', 'rent', 'buy']) {
    for (const p of (deProviders?.[type] || [])) {
      if (!seen.has(p.provider_name)) {
        seen.add(p.provider_name);
        streaming.push({
          provider: p.provider_name,
          logoPath: `https://image.tmdb.org/t/p/w92${p.logo_path}`,
          type
        });
      }
    }
  }

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const runtime = mediaType === 'tv'
    ? (details.episode_run_time?.[0] || details.number_of_seasons && `${details.number_of_seasons} season${details.number_of_seasons > 1 ? 's' : ''}`)
    : details.runtime;

  return {
    title,
    year: releaseDate ? parseInt(releaseDate) : null,
    tmdbId: details.id,
    mediaType,
    poster: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : null,
    backdrop: details.backdrop_path ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}` : null,
    synopsis: details.overview || '',
    rating: details.vote_average ? Math.round(details.vote_average * 10) / 10 : null,
    runtime,
    seasons: mediaType === 'tv' ? details.number_of_seasons : null,
    episodes: mediaType === 'tv' ? details.number_of_episodes : null,
    genres: details.genres?.map(g => g.name) || [],
    director,
    cast,
    streaming
  };
}

// Keep backward compat
async function enrichFilm(tmdbId, mediaType) { return enrichItem(tmdbId, mediaType || 'movie'); }

// GET /api/films
app.get('/api/films', (req, res) => {
  const db = readDB();
  let films = db.films;
  if (req.query.watched !== undefined) {
    const w = req.query.watched === 'true';
    films = films.filter(f => f.watched === w);
  }
  if (req.query.genre) {
    films = films.filter(f => f.genres?.includes(req.query.genre));
  }
  res.json(films);
});

// POST /api/films — search movies AND TV shows
app.post('/api/films', async (req, res) => {
  try {
    const { query, addedBy } = req.body;
    if (!query) return res.status(400).json({ error: 'query required' });

    const search = await tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}`);
    const filtered = (search.results || []).filter(r => r.media_type === 'movie' || r.media_type === 'tv');
    if (!filtered.length) return res.status(404).json({ error: 'Nothing found' });

    const results = filtered.slice(0, 8).map(r => ({
      tmdbId: r.id,
      mediaType: r.media_type,
      title: r.title || r.name,
      year: (r.release_date || r.first_air_date) ? parseInt(r.release_date || r.first_air_date) : null,
      poster: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : null,
      overview: r.overview
    }));

    res.json({ results, addedBy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/films/confirm — confirm and add a specific TMDB film
app.post('/api/films/confirm', async (req, res) => {
  try {
    const { tmdbId, addedBy, mediaType } = req.body;
    if (!tmdbId) return res.status(400).json({ error: 'tmdbId required' });

    const db = readDB();
    // Check duplicate
    if (db.films.some(f => f.tmdbId === tmdbId && f.mediaType === (mediaType || 'movie'))) {
      return res.status(409).json({ error: 'Already in watchlist' });
    }

    const enriched = await enrichItem(tmdbId, mediaType || 'movie');
    const film = {
      id: randomUUID(),
      ...enriched,
      addedBy: addedBy || 'Joe',
      addedDate: new Date().toISOString().split('T')[0],
      watched: false,
      watchedDate: null
    };

    db.films.push(film);
    writeDB(db);
    res.status(201).json(film);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/films/:id
app.patch('/api/films/:id', (req, res) => {
  const db = readDB();
  const film = db.films.find(f => f.id === req.params.id);
  if (!film) return res.status(404).json({ error: 'Not found' });

  Object.assign(film, req.body);
  if (req.body.watched === true && !film.watchedDate) {
    film.watchedDate = new Date().toISOString().split('T')[0];
  }
  if (req.body.watched === false) {
    film.watchedDate = null;
  }

  writeDB(db);
  res.json(film);
});

// DELETE /api/films/:id
app.delete('/api/films/:id', (req, res) => {
  const db = readDB();
  const idx = db.films.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.films.splice(idx, 1);
  writeDB(db);
  res.json({ ok: true });
});

// POST /api/films/:id/refresh
app.post('/api/films/:id/refresh', async (req, res) => {
  try {
    const db = readDB();
    const film = db.films.find(f => f.id === req.params.id);
    if (!film) return res.status(404).json({ error: 'Not found' });

    const enriched = await enrichItem(film.tmdbId, film.mediaType || 'movie');
    Object.assign(film, enriched);
    writeDB(db);
    res.json(film);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

const PORT = 5562;
app.listen(PORT, () => console.log(`Watch API running on port ${PORT}`));
