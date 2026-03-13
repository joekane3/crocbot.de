import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ICAL from 'ical.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 5563;

app.use(cors());
app.use(express.json());

// --- CalDAV (Radicale) config ---
const CALDAV_URL = process.env.CALDAV_URL || 'http://localhost:5232/kane/family/';
const CALDAV_USER = process.env.CALDAV_USER || 'kane';
const CALDAV_PASS = process.env.CALDAV_PASS || '85521';
const caldavAuth = 'Basic ' + Buffer.from(`${CALDAV_USER}:${CALDAV_PASS}`).toString('base64');

// --- Proton ICS (read-only overlay) ---
const PROTON_ICS_URL = process.env.PROTON_ICS_URL || '';
let icsCache = { events: [], fetchedAt: 0 };
const ICS_TTL = 5 * 60 * 1000;

async function fetchProtonICS() {
  if (!PROTON_ICS_URL) return [];
  if (Date.now() - icsCache.fetchedAt < ICS_TTL) return icsCache.events;
  try {
    const res = await fetch(PROTON_ICS_URL);
    const text = await res.text();
    const events = parseICS(text, 'proton');
    icsCache = { events, fetchedAt: Date.now() };
    return events;
  } catch (err) {
    console.error('Proton ICS fetch error:', err.message);
    return icsCache.events;
  }
}

function parseICS(text, source) {
  const jcal = ICAL.parse(text);
  const comp = new ICAL.Component(jcal);
  return comp.getAllSubcomponents('vevent').map(ve => {
    const e = new ICAL.Event(ve);
    return {
      id: source === 'proton' ? `proton-${e.uid}` : e.uid,
      title: e.summary || '(No title)',
      description: e.description || '',
      location: e.location || '',
      start: e.startDate?.toJSDate()?.toISOString() || null,
      end: e.endDate?.toJSDate()?.toISOString() || null,
      allDay: e.startDate?.isDate || false,
      source,
    };
  });
}

// --- Fetch all events from Radicale via CalDAV REPORT ---
async function fetchCalDAVEvents() {
  try {
    const res = await fetch(CALDAV_URL, {
      method: 'REPORT',
      headers: {
        'Authorization': caldavAuth,
        'Content-Type': 'application/xml; charset=utf-8',
        'Depth': '1',
      },
      body: `<?xml version="1.0" encoding="UTF-8"?>
<C:calendar-query xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:prop>
    <D:getetag/>
    <C:calendar-data/>
  </D:prop>
  <C:filter>
    <C:comp-filter name="VCALENDAR">
      <C:comp-filter name="VEVENT"/>
    </C:comp-filter>
  </C:filter>
</C:calendar-query>`,
    });
    const xml = await res.text();
    // Parse each calendar-data block
    const events = [];
    const regex = /<C:calendar-data[^>]*>([\s\S]*?)<\/C:calendar-data>/gi;
    let match;
    while ((match = regex.exec(xml)) !== null) {
      const icsText = match[1].replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
      try {
        events.push(...parseICS(icsText, 'local'));
      } catch {}
    }
    return events;
  } catch (err) {
    console.error('CalDAV fetch error:', err.message);
    return [];
  }
}

// --- API routes ---

// GET all events (CalDAV + Proton merged)
app.get('/api/events', async (req, res) => {
  const [local, proton] = await Promise.all([fetchCalDAVEvents(), fetchProtonICS()]);
  res.json([
    ...proton.map(e => ({ ...e, readonly: true })),
    ...local.map(e => ({ ...e, readonly: false })),
  ]);
});

// POST new event → write to Radicale
app.post('/api/events', async (req, res) => {
  const { title, description, location, start, end, allDay } = req.body;
  if (!title || !start) return res.status(400).json({ error: 'title and start required' });

  const uid = `crocbot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const dtFmt = (iso, isDate) => {
    const d = new Date(iso);
    if (isDate) return d.toISOString().replace(/[-:]/g, '').slice(0, 8);
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  };

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//crocbot//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    allDay ? `DTSTART;VALUE=DATE:${dtFmt(start, true)}` : `DTSTART:${dtFmt(start)}`,
    allDay ? `DTEND;VALUE=DATE:${dtFmt(end || start, true)}` : `DTEND:${dtFmt(end || start)}`,
    `SUMMARY:${title}`,
    description ? `DESCRIPTION:${description}` : null,
    location ? `LOCATION:${location}` : null,
    `DTSTAMP:${dtFmt(new Date().toISOString())}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');

  try {
    const r = await fetch(`${CALDAV_URL}${uid}.ics`, {
      method: 'PUT',
      headers: { 'Authorization': caldavAuth, 'Content-Type': 'text/calendar' },
      body: ics,
    });
    if (r.status >= 300) throw new Error(`CalDAV PUT ${r.status}`);
    res.status(201).json({ id: uid, title, start, end, allDay, source: 'local' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH event → update in Radicale
app.patch('/api/events/:id', async (req, res) => {
  const uid = req.params.id;
  // Fetch current event
  try {
    const r = await fetch(`${CALDAV_URL}${uid}.ics`, {
      headers: { 'Authorization': caldavAuth },
    });
    if (r.status === 404) return res.status(404).json({ error: 'not found' });
    let icsText = await r.text();

    // Simple field replacement
    const { title, description, location, start, end, allDay } = req.body;
    const dtFmt = (iso, isDate) => {
      const d = new Date(iso);
      if (isDate) return d.toISOString().replace(/[-:]/g, '').slice(0, 8);
      return d.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    };

    // Rebuild the VEVENT
    const jcal = ICAL.parse(icsText);
    const comp = new ICAL.Component(jcal);
    const vevent = comp.getFirstSubcomponent('vevent');
    if (!vevent) return res.status(500).json({ error: 'no VEVENT found' });

    const evt = new ICAL.Event(vevent);
    if (title !== undefined) vevent.updatePropertyWithValue('summary', title);
    if (description !== undefined) {
      if (vevent.hasProperty('description')) vevent.updatePropertyWithValue('description', description);
      else vevent.addPropertyWithValue('description', description);
    }
    if (location !== undefined) {
      if (vevent.hasProperty('location')) vevent.updatePropertyWithValue('location', location);
      else vevent.addPropertyWithValue('location', location);
    }
    if (start !== undefined) {
      const dt = ICAL.Time.fromJSDate(new Date(start), false);
      if (allDay) dt.isDate = true;
      vevent.updatePropertyWithValue('dtstart', dt);
    }
    if (end !== undefined) {
      const dt = ICAL.Time.fromJSDate(new Date(end), false);
      if (allDay) dt.isDate = true;
      vevent.updatePropertyWithValue('dtend', dt);
    }

    const updated = comp.toString();
    const pr = await fetch(`${CALDAV_URL}${uid}.ics`, {
      method: 'PUT',
      headers: { 'Authorization': caldavAuth, 'Content-Type': 'text/calendar' },
      body: updated,
    });
    if (pr.status >= 300) throw new Error(`CalDAV PUT ${pr.status}`);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const r = await fetch(`${CALDAV_URL}${req.params.id}.ics`, {
      method: 'DELETE',
      headers: { 'Authorization': caldavAuth },
    });
    if (r.status === 404) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static frontend in production
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('/{*path}', (req, res) => res.sendFile(path.join(distDir, 'index.html')));
}

app.listen(PORT, () => console.log(`Calendar API on :${PORT}`));
