import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ─── Helpers ────────────────────────────────────────────────
const API = '/api/events';
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const toLocal = d => {
  const dt = new Date(d);
  return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const fmtTime = d => new Date(d).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
const fmtDate = d => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
const isSameDay = (a, b) => a.toDateString() === b.toDateString();
const startOfWeek = d => { const dt = new Date(d); const day = dt.getDay(); const diff = (day === 0 ? -6 : 1) - day; dt.setDate(dt.getDate() + diff); dt.setHours(0,0,0,0); return dt; };
const addDays = (d, n) => { const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt; };

const COLORS = {
  proton: { bg: '#6D4AFF15', border: '#6D4AFF', text: '#6D4AFF' },
  local: { bg: '#0ea5e915', border: '#0ea5e9', text: '#0ea5e9' },
};

// ─── Styles ─────────────────────────────────────────────────
const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', system-ui, sans-serif; background: #0f1117; color: #e4e4e7; }
  
  .app { max-width: 1100px; margin: 0 auto; padding: 16px; }
  
  .header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
  .header h1 { font-size: 1.5rem; font-weight: 700; color: #fff; }
  .header h1 span { color: #6D4AFF; }
  
  .nav { display: flex; gap: 4px; background: #1a1b23; border-radius: 10px; padding: 4px; }
  .nav button { padding: 8px 16px; border: none; border-radius: 8px; background: transparent; color: #a1a1aa; cursor: pointer; font-family: inherit; font-size: 0.85rem; font-weight: 500; transition: all .15s; }
  .nav button.active { background: #6D4AFF; color: #fff; }
  .nav button:hover:not(.active) { color: #fff; }
  
  .controls { display: flex; align-items: center; gap: 12px; }
  .controls button { background: #1a1b23; border: 1px solid #2a2b35; color: #e4e4e7; border-radius: 8px; padding: 8px 14px; cursor: pointer; font-family: inherit; font-size: .85rem; transition: all .15s; }
  .controls button:hover { border-color: #6D4AFF; color: #fff; }
  .controls .period { font-size: 1rem; font-weight: 600; min-width: 200px; text-align: center; }
  .controls .today-btn { background: #6D4AFF22; border-color: #6D4AFF55; color: #6D4AFF; }
  
  .add-btn { background: #6D4AFF !important; border: none !important; color: #fff !important; font-weight: 600; }
  .add-btn:hover { opacity: .9; }
  
  /* Month grid */
  .month-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: #1a1b23; border-radius: 12px; overflow: hidden; border: 1px solid #2a2b35; }
  .day-header { padding: 10px 8px; text-align: center; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #71717a; background: #14151d; }
  .day-cell { min-height: 100px; background: #14151d; padding: 6px 8px; cursor: pointer; transition: background .1s; position: relative; }
  .day-cell:hover { background: #1a1b26; }
  .day-cell.other-month { opacity: 0.35; }
  .day-cell.today { background: #6D4AFF10; }
  .day-cell .date-num { font-size: 0.8rem; font-weight: 600; margin-bottom: 4px; }
  .day-cell.today .date-num { color: #6D4AFF; }
  .day-cell .evt { font-size: 0.7rem; padding: 2px 5px; border-radius: 4px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; border-left: 3px solid; }
  .day-cell .evt.proton { background: ${COLORS.proton.bg}; border-color: ${COLORS.proton.border}; color: ${COLORS.proton.text}; }
  .day-cell .evt.local { background: ${COLORS.local.bg}; border-color: ${COLORS.local.border}; color: ${COLORS.local.text}; }
  .day-cell .more { font-size: 0.65rem; color: #71717a; }
  
  /* Week grid */
  .week-grid { display: grid; grid-template-columns: 60px repeat(7, 1fr); background: #1a1b23; border-radius: 12px; overflow: hidden; border: 1px solid #2a2b35; }
  .week-header { display: contents; }
  .week-header > div { padding: 10px 6px; text-align: center; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #71717a; background: #14151d; border-bottom: 1px solid #2a2b35; }
  .week-header .today-col { color: #6D4AFF; }
  .week-body { display: contents; }
  .time-label { padding: 4px 8px; font-size: 0.7rem; color: #52525b; text-align: right; background: #14151d; border-right: 1px solid #2a2b35; min-height: 48px; display: flex; align-items: flex-start; justify-content: flex-end; }
  .week-cell { background: #14151d; border-bottom: 1px solid #1a1b23; border-right: 1px solid #1a1b2300; padding: 1px 3px; position: relative; min-height: 48px; cursor: pointer; }
  .week-cell:hover { background: #1a1b26; }
  .week-cell.today-col { background: #6D4AFF08; }
  .week-cell .evt { font-size: 0.65rem; padding: 2px 4px; border-radius: 3px; margin-bottom: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; border-left: 2px solid; }
  .week-cell .evt.proton { background: ${COLORS.proton.bg}; border-color: ${COLORS.proton.border}; color: ${COLORS.proton.text}; }
  .week-cell .evt.local { background: ${COLORS.local.bg}; border-color: ${COLORS.local.border}; color: ${COLORS.local.text}; }
  
  /* List view */
  .list-view { background: #14151d; border-radius: 12px; border: 1px solid #2a2b35; overflow: hidden; }
  .list-day { padding: 10px 16px; font-size: 0.8rem; font-weight: 600; background: #1a1b23; color: #a1a1aa; border-bottom: 1px solid #2a2b35; }
  .list-day.today { color: #6D4AFF; }
  .list-event { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #1a1b23; cursor: pointer; transition: background .1s; }
  .list-event:hover { background: #1a1b26; }
  .list-event .dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .list-event .dot.proton { background: #6D4AFF; }
  .list-event .dot.local { background: #0ea5e9; }
  .list-event .time-range { font-size: 0.8rem; color: #71717a; min-width: 100px; }
  .list-event .title { font-size: 0.9rem; font-weight: 500; }
  .list-event .location { font-size: 0.75rem; color: #71717a; }
  .list-event .badge { font-size: 0.6rem; padding: 2px 6px; border-radius: 4px; background: #6D4AFF22; color: #6D4AFF; margin-left: auto; flex-shrink: 0; }
  
  .empty { text-align: center; padding: 60px 20px; color: #52525b; }
  .empty .icon { font-size: 2.5rem; margin-bottom: 12px; }
  
  /* Modal */
  .modal-overlay { position: fixed; inset: 0; background: #000a; display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px; }
  .modal { background: #1a1b23; border-radius: 16px; border: 1px solid #2a2b35; width: 100%; max-width: 460px; padding: 24px; }
  .modal h2 { font-size: 1.1rem; margin-bottom: 16px; }
  .modal label { display: block; font-size: 0.8rem; color: #a1a1aa; margin-bottom: 4px; margin-top: 12px; }
  .modal input, .modal textarea { width: 100%; background: #14151d; border: 1px solid #2a2b35; border-radius: 8px; padding: 10px 12px; color: #e4e4e7; font-family: inherit; font-size: 0.9rem; outline: none; transition: border-color .15s; }
  .modal input:focus, .modal textarea:focus { border-color: #6D4AFF; }
  .modal textarea { resize: vertical; min-height: 60px; }
  .modal .check-row { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
  .modal .check-row input { width: auto; }
  .modal .actions { display: flex; gap: 8px; margin-top: 20px; justify-content: flex-end; }
  .modal .actions button { padding: 10px 20px; border-radius: 8px; border: none; font-family: inherit; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all .15s; }
  .modal .btn-cancel { background: #2a2b35; color: #a1a1aa; }
  .modal .btn-cancel:hover { color: #fff; }
  .modal .btn-save { background: #6D4AFF; color: #fff; }
  .modal .btn-save:hover { opacity: .9; }
  .modal .btn-delete { background: #dc262622; color: #ef4444; }
  .modal .btn-delete:hover { background: #dc262644; }
  .modal .readonly-badge { display: inline-block; background: #6D4AFF22; color: #6D4AFF; font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; margin-left: 8px; }
  
  .legend { display: flex; gap: 16px; margin-bottom: 16px; }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: #71717a; }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
`;

// ─── App ────────────────────────────────────────────────────
export default function App() {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('month');
  const [current, setCurrent] = useState(new Date());
  const [modal, setModal] = useState(null); // null | { mode: 'create'|'edit'|'view', event?, date? }
  const today = new Date();

  const fetchEvents = useCallback(async () => {
    try {
      const r = await fetch(API);
      setEvents(await r.json());
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  // Navigation
  const navigate = (dir) => {
    setCurrent(prev => {
      const d = new Date(prev);
      if (view === 'month') d.setMonth(d.getMonth() + dir);
      else d.setDate(d.getDate() + dir * 7);
      return d;
    });
  };
  const goToday = () => setCurrent(new Date());

  // ─── Month view data ───
  const monthData = useMemo(() => {
    const y = current.getFullYear(), m = current.getMonth();
    const first = new Date(y, m, 1);
    const startDay = (first.getDay() + 6) % 7; // Monday=0
    const start = addDays(first, -startDay);
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = addDays(start, i);
      cells.push({
        date: d,
        isCurrentMonth: d.getMonth() === m,
        isToday: isSameDay(d, today),
        events: events.filter(e => isSameDay(new Date(e.start), d))
          .sort((a, b) => new Date(a.start) - new Date(b.start)),
      });
    }
    return cells;
  }, [current, events]);

  // ─── Week view data ───
  const weekData = useMemo(() => {
    const ws = startOfWeek(current);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(ws, i);
      return {
        date: d,
        isToday: isSameDay(d, today),
        events: events.filter(e => isSameDay(new Date(e.start), d))
          .sort((a, b) => new Date(a.start) - new Date(b.start)),
      };
    });
    return { start: ws, days };
  }, [current, events]);

  // ─── List view data ───
  const listData = useMemo(() => {
    const y = current.getFullYear(), m = current.getMonth();
    const filtered = events
      .filter(e => { const d = new Date(e.start); return d.getFullYear() === y && d.getMonth() === m; })
      .sort((a, b) => new Date(a.start) - new Date(b.start));
    const grouped = {};
    filtered.forEach(e => {
      const key = new Date(e.start).toDateString();
      if (!grouped[key]) grouped[key] = { date: new Date(e.start), events: [] };
      grouped[key].events.push(e);
    });
    return Object.values(grouped);
  }, [current, events]);

  // ─── Handlers ───
  const openCreate = (date) => {
    const d = date || new Date();
    const start = new Date(d); start.setHours(10, 0, 0, 0);
    const end = new Date(d); end.setHours(11, 0, 0, 0);
    setModal({ mode: 'create', event: { title: '', description: '', location: '', start: toLocal(start), end: toLocal(end), allDay: false } });
  };
  const openEvent = (evt) => {
    if (evt.readonly) {
      setModal({ mode: 'view', event: evt });
    } else {
      setModal({ mode: 'edit', event: { ...evt, start: toLocal(evt.start), end: toLocal(evt.end) } });
    }
  };
  const saveEvent = async (evt) => {
    if (modal.mode === 'create') {
      await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(evt) });
    } else {
      await fetch(`${API}/${evt.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(evt) });
    }
    setModal(null);
    fetchEvents();
  };
  const deleteEvent = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    setModal(null);
    fetchEvents();
  };

  // ─── Period label ───
  const periodLabel = view === 'month'
    ? `${MONTHS[current.getMonth()]} ${current.getFullYear()}`
    : view === 'week'
      ? (() => { const ws = weekData.start; const we = addDays(ws, 6); return `${ws.getDate()} ${MONTHS[ws.getMonth()].slice(0,3)} – ${we.getDate()} ${MONTHS[we.getMonth()].slice(0,3)} ${we.getFullYear()}`; })()
      : `${MONTHS[current.getMonth()]} ${current.getFullYear()}`;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <h1>📅 Kane <span>Calendar</span></h1>
          <div className="nav">
            {['month','week','list'].map(v => (
              <button key={v} className={view===v?'active':''} onClick={() => setView(v)}>
                {v.charAt(0).toUpperCase()+v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="controls" style={{ marginBottom: 16 }}>
          <button onClick={() => navigate(-1)}>◀</button>
          <div className="period">{periodLabel}</div>
          <button onClick={() => navigate(1)}>▶</button>
          <button className="today-btn" onClick={goToday}>Today</button>
          <button className="add-btn" onClick={() => openCreate()}>+ New Event</button>
        </div>

        <div className="legend">
          <div className="legend-item"><div className="legend-dot" style={{background:'#6D4AFF'}}/>Proton Calendar</div>
          <div className="legend-item"><div className="legend-dot" style={{background:'#0ea5e9'}}/>Local</div>
        </div>

        {/* MONTH VIEW */}
        {view === 'month' && (
          <div className="month-grid">
            {DAYS.map(d => <div key={d} className="day-header">{d}</div>)}
            {monthData.map((cell, i) => (
              <div key={i} className={`day-cell ${cell.isCurrentMonth?'':'other-month'} ${cell.isToday?'today':''}`}
                   onClick={() => openCreate(cell.date)}>
                <div className="date-num">{cell.date.getDate()}</div>
                {cell.events.slice(0, 3).map(e => (
                  <div key={e.id} className={`evt ${e.source}`} onClick={ev => { ev.stopPropagation(); openEvent(e); }}>
                    {!e.allDay && fmtTime(e.start) + ' '}{e.title}
                  </div>
                ))}
                {cell.events.length > 3 && <div className="more">+{cell.events.length - 3} more</div>}
              </div>
            ))}
          </div>
        )}

        {/* WEEK VIEW */}
        {view === 'week' && (
          <div className="week-grid">
            <div className="week-header">
              <div></div>
              {weekData.days.map((d, i) => (
                <div key={i} className={d.isToday ? 'today-col' : ''}>
                  {DAYS[i]} {d.date.getDate()}
                </div>
              ))}
            </div>
            <div className="week-body">
              {Array.from({ length: 16 }, (_, h) => h + 6).map(hour => (
                <React.Fragment key={hour}>
                  <div className="time-label">{String(hour).padStart(2,'0')}:00</div>
                  {weekData.days.map((d, di) => {
                    const cellEvents = d.events.filter(e => {
                      if (e.allDay) return hour === 6;
                      return new Date(e.start).getHours() === hour;
                    });
                    return (
                      <div key={di} className={`week-cell ${d.isToday?'today-col':''}`}
                           onClick={() => { const dt = new Date(d.date); dt.setHours(hour); openCreate(dt); }}>
                        {cellEvents.map(e => (
                          <div key={e.id} className={`evt ${e.source}`} onClick={ev => { ev.stopPropagation(); openEvent(e); }}>
                            {!e.allDay && fmtTime(e.start) + ' '}{e.title}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <div className="list-view">
            {listData.length === 0 && (
              <div className="empty"><div className="icon">📭</div>No events this month</div>
            )}
            {listData.map(group => (
              <React.Fragment key={group.date.toDateString()}>
                <div className={`list-day ${isSameDay(group.date, today)?'today':''}`}>
                  {group.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                {group.events.map(e => (
                  <div key={e.id} className="list-event" onClick={() => openEvent(e)}>
                    <div className={`dot ${e.source}`} />
                    <div className="time-range">
                      {e.allDay ? 'All day' : `${fmtTime(e.start)} – ${fmtTime(e.end)}`}
                    </div>
                    <div>
                      <div className="title">{e.title}</div>
                      {e.location && <div className="location">📍 {e.location}</div>}
                    </div>
                    {e.readonly && <div className="badge">Proton</div>}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* MODAL */}
        {modal && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              {modal.mode === 'view' ? (
                <>
                  <h2>{modal.event.title} <span className="readonly-badge">Proton · read-only</span></h2>
                  {modal.event.location && <p style={{color:'#a1a1aa',fontSize:'.85rem',marginBottom:8}}>📍 {modal.event.location}</p>}
                  <p style={{fontSize:'.85rem',color:'#a1a1aa'}}>
                    {modal.event.allDay ? 'All day' : `${fmtTime(modal.event.start)} – ${fmtTime(modal.event.end)}`}
                    {' · '}{fmtDate(modal.event.start)}
                  </p>
                  {modal.event.description && <p style={{marginTop:12,fontSize:'.85rem',color:'#e4e4e7'}}>{modal.event.description}</p>}
                  <div className="actions"><button className="btn-cancel" onClick={() => setModal(null)}>Close</button></div>
                </>
              ) : (
                <EventForm
                  event={modal.event}
                  mode={modal.mode}
                  onSave={saveEvent}
                  onDelete={modal.mode === 'edit' ? () => deleteEvent(modal.event.id) : null}
                  onCancel={() => setModal(null)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function EventForm({ event, mode, onSave, onDelete, onCancel }) {
  const [form, setForm] = useState(event);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{mode === 'create' ? 'New Event' : 'Edit Event'}</h2>
      <label>Title</label>
      <input value={form.title} onChange={e => set('title', e.target.value)} autoFocus required />
      <label>Location</label>
      <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Optional" />
      <label>Description</label>
      <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Optional" />
      <div className="check-row">
        <input type="checkbox" id="allDay" checked={form.allDay} onChange={e => set('allDay', e.target.checked)} />
        <label htmlFor="allDay" style={{margin:0}}>All day</label>
      </div>
      <label>Start</label>
      <input type={form.allDay ? 'date' : 'datetime-local'} value={form.allDay ? form.start?.slice(0,10) : form.start} onChange={e => set('start', e.target.value)} required />
      <label>End</label>
      <input type={form.allDay ? 'date' : 'datetime-local'} value={form.allDay ? form.end?.slice(0,10) : form.end} onChange={e => set('end', e.target.value)} />
      <div className="actions">
        {onDelete && <button type="button" className="btn-delete" onClick={onDelete}>Delete</button>}
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-save">{mode === 'create' ? 'Create' : 'Save'}</button>
      </div>
    </form>
  );
}
