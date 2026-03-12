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
const PPLX_KEY = process.env.PPLX_API_KEY;

async function askPerplexity(query) {
  if (!PPLX_KEY) return [];
  try {
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${PPLX_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: 'You are a film and TV recommendation engine. Given a description, return ONLY a JSON array of up to 8 specific film or TV show titles that match. Format: [{"title":"...","year":2000,"type":"movie"},{"title":"...","year":2020,"type":"tv"}]. No explanation, just the JSON array.' },
          { role: 'user', content: query }
        ],
        max_tokens: 500
      })
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    // Extract JSON array from response
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return [];
    return JSON.parse(match[0]);
  } catch (e) {
    console.error('Perplexity error:', e.message);
    return [];
  }
}

async function perplexitySearch(query) {
  const suggestions = await askPerplexity(query);
  const results = [];
  for (const s of suggestions.slice(0, 8)) {
    try {
      const type = s.type === 'tv' ? 'tv' : 'movie';
      const endpoint = type === 'tv' ? '/search/tv' : '/search/movie';
      const search = await tmdbFetch(`${endpoint}?query=${encodeURIComponent(s.title)}${s.year ? `&year=${s.year}` : ''}`);
      const top = search.results?.[0];
      if (top) {
        results.push({
          tmdbId: top.id,
          mediaType: type,
          title: top.title || top.name,
          year: (top.release_date || top.first_air_date) ? parseInt(top.release_date || top.first_air_date) : null,
          poster: top.poster_path ? `https://image.tmdb.org/t/p/w500${top.poster_path}` : null,
          overview: top.overview
        });
      }
    } catch (e) { /* skip failed lookups */ }
  }
  return results;
}

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

// Genre mapping for natural language queries
const GENRE_MAP = {
  movie: {
    action:28, adventure:12, animation:16, comedy:35, crime:80, documentary:99,
    drama:18, family:10751, fantasy:14, history:36, horror:27, music:10402,
    mystery:9648, romance:10749, scifi:878, 'sci-fi':878, 'science fiction':878,
    thriller:53, war:10752, western:37, gangster:80, mafia:80, heist:80,
    spy:53, superhero:28, zombie:27, slasher:27, romantic:10749, funny:35,
    scary:27, sad:18, emotional:18, kids:10751, children:10751, cartoon:16,
    anime:16, musical:10402, biographical:36, biopic:36, sports:18, noir:80
  },
  tv: {
    action:10759, adventure:10759, animation:16, comedy:35, crime:80, documentary:99,
    drama:18, family:10751, fantasy:10765, kids:10762, mystery:9648, news:10763,
    reality:10764, scifi:10765, 'sci-fi':10765, 'science fiction':10765,
    soap:10766, talk:10767, war:10768, western:37, funny:35, scary:9648,
    thriller:80, gangster:80, mafia:80
  }
};

const DESCRIPTIVE_WORDS = /\b(about|with|film|movie|show|series|something|anything|like|similar|genre|set in|based on|involving|featuring|starring)\b/i;
const DECADE_RE = /\b(in the |from the )?(\d{2})s\b/i;
const YEAR_RANGE_RE = /\b(19|20)\d{2}\s*[-–]\s*(19|20)\d{2}\b/;
const SINGLE_YEAR_RE = /\b(19|20)\d{2}\b/;

function isDescriptiveQuery(query) {
  return DESCRIPTIVE_WORDS.test(query) || DECADE_RE.test(query);
}

function extractGenreIds(query, type = 'movie') {
  const map = GENRE_MAP[type];
  const ids = new Set();
  const lower = query.toLowerCase();
  for (const [word, id] of Object.entries(map)) {
    if (lower.includes(word)) ids.add(id);
  }
  return [...ids];
}

function extractYearRange(query) {
  const decadeMatch = query.match(DECADE_RE);
  if (decadeMatch) {
    const short = parseInt(decadeMatch[2]);
    const base = short >= 30 ? 1900 + short : 2000 + short;
    return { gte: `${base}-01-01`, lte: `${base + 9}-12-31` };
  }
  const rangeMatch = query.match(YEAR_RANGE_RE);
  if (rangeMatch) {
    return { gte: `${rangeMatch[0].split(/[-–]/)[0].trim()}-01-01`, lte: `${rangeMatch[0].split(/[-–]/)[1].trim()}-12-31` };
  }
  const yearMatch = query.match(SINGLE_YEAR_RE);
  if (yearMatch) {
    const y = parseInt(yearMatch[0]);
    return { gte: `${y}-01-01`, lte: `${y}-12-31` };
  }
  return null;
}

async function discoverSearch(query, type = 'movie') {
  const genreIds = extractGenreIds(query, type);
  const years = extractYearRange(query);
  const dateField = type === 'tv' ? 'first_air_date' : 'primary_release_date';

  let params = `sort_by=vote_count.desc&vote_average.gte=6&vote_count.gte=100`;
  if (genreIds.length) params += `&with_genres=${genreIds.join(',')}`;
  if (years) {
    params += `&${dateField}.gte=${years.gte}&${dateField}.lte=${years.lte}`;
  }

  // Also try keyword search for more specific terms
  const stopWords = new Set(['about','with','film','movie','show','series','something','anything','like','similar','the','a','an','in','on','from','set','based','involving','featuring','starring','genre','funny','scary','sad','good','great','best','classic']);
  const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w) && !GENRE_MAP[type][w]);

  let keywordIds = [];
  if (keywords.length > 0) {
    try {
      const kw = await tmdbFetch(`/search/keyword?query=${encodeURIComponent(keywords.join(' '))}`);
      keywordIds = (kw.results || []).slice(0, 3).map(k => k.id);
    } catch (e) { /* ignore */ }
  }
  if (keywordIds.length) params += `&with_keywords=${keywordIds.join('|')}`;

  const endpoint = type === 'tv' ? '/discover/tv' : '/discover/movie';
  return tmdbFetch(`${endpoint}?${params}`);
}

// POST /api/films — search movies AND TV shows
app.post('/api/films', async (req, res) => {
  try {
    const { query, addedBy } = req.body;
    if (!query) return res.status(400).json({ error: 'query required' });

    let results = [];

    if (isDescriptiveQuery(query)) {
      // Perplexity first for descriptive queries — it understands natural language
      const aiResults = await perplexitySearch(query);
      results = [...aiResults];

      // Supplement with TMDB discover if Perplexity gave few results
      if (results.length < 4) {
        const [movieResults, tvResults] = await Promise.all([
          discoverSearch(query, 'movie').catch(() => ({ results: [] })),
          discoverSearch(query, 'tv').catch(() => ({ results: [] }))
        ]);

        const movies = (movieResults.results || []).slice(0, 4).map(r => ({
          tmdbId: r.id, mediaType: 'movie', title: r.title,
          year: r.release_date ? parseInt(r.release_date) : null,
          poster: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : null,
          overview: r.overview
        }));
        const tvs = (tvResults.results || []).slice(0, 2).map(r => ({
          tmdbId: r.id, mediaType: 'tv', title: r.name,
          year: r.first_air_date ? parseInt(r.first_air_date) : null,
          poster: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : null,
          overview: r.overview
        }));

        const seen = new Set(results.map(r => `${r.mediaType}:${r.tmdbId}`));
        results.push(...[...movies, ...tvs].filter(r => !seen.has(`${r.mediaType}:${r.tmdbId}`)));
      }
    } else {
      // Direct title search
      const search = await tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}`);
      results = (search.results || [])
        .filter(r => r.media_type === 'movie' || r.media_type === 'tv')
        .slice(0, 8)
        .map(r => ({
          tmdbId: r.id, mediaType: r.media_type, title: r.title || r.name,
          year: (r.release_date || r.first_air_date) ? parseInt(r.release_date || r.first_air_date) : null,
          poster: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : null,
          overview: r.overview
        }));
    }

    // Fallback to Perplexity AI for title searches with poor results too
    if (results.length < 2 && !isDescriptiveQuery(query)) {
      const aiResults = await perplexitySearch(query);
      const seen = new Set(results.map(r => `${r.mediaType}:${r.tmdbId}`));
      results.push(...aiResults.filter(r => !seen.has(`${r.mediaType}:${r.tmdbId}`)));
    }

    if (!results.length) return res.status(404).json({ error: 'Nothing found' });
    res.json({ results: results.slice(0, 10), addedBy });
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
