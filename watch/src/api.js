const BASE = '/api';

async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  getFilms: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/films${q ? '?' + q : ''}`);
  },
  searchFilm: (query, addedBy) =>
    request('/films', { method: 'POST', body: { query, addedBy } }),
  confirmFilm: (tmdbId, addedBy, mediaType) =>
    request('/films/confirm', { method: 'POST', body: { tmdbId, addedBy, mediaType } }),
  updateFilm: (id, updates) =>
    request(`/films/${id}`, { method: 'PATCH', body: updates }),
  deleteFilm: (id) =>
    request(`/films/${id}`, { method: 'DELETE' }),
  refreshFilm: (id) =>
    request(`/films/${id}/refresh`, { method: 'POST' })
};
