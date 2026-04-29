'use client';
import { useState } from 'react';

// ─── Fictional starter reminders ───
const STARTER = [
  { id: 1, title: 'Submit CA1 — Web Development',      date: '2025-09-20', priority: 'high',   done: false },
  { id: 2, title: 'Register for Career Fair',           date: '2025-09-15', priority: 'medium', done: false },
  { id: 3, title: 'CA3 group meeting — Library room 3', date: '2025-09-10', priority: 'high',   done: false },
  { id: 4, title: 'Book GP appointment',                date: '2025-09-12', priority: 'low',    done: true },
];

const PRI_STYLE = { high: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-800', low: 'bg-gray-100 text-gray-600' };

export default function Reminders() {
  const [items, setItems] = useState(STARTER);
  const [filter, setFilter] = useState('active');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [errors, setErrors] = useState({});

  const active = items.filter((r) => !r.done).length;
  const shown = items
    .filter((r) => (filter === 'active' ? !r.done : filter === 'done' ? r.done : true))
    .sort((a, b) => a.date.localeCompare(b.date));

  function toggle(id) { setItems((p) => p.map((r) => r.id === id ? { ...r, done: !r.done } : r)); }
  function remove(id) { setItems((p) => p.filter((r) => r.id !== id)); }

  function add(e) {
    e.preventDefault();
    const err = {};
    if (!title.trim()) err.title = 'Title is required.';
    if (!date) err.date = 'Date is required.';
    setErrors(err);
    if (Object.keys(err).length) return;
    setItems((p) => [...p, { id: Date.now(), title: title.trim(), date, priority, done: false }]);
    setTitle(''); setDate(''); setPriority('medium'); setErrors({});
    setFilter('active');
  }

  function fmtDate(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  return (
    <section aria-labelledby="rem-heading">
      <h2 id="rem-heading" className="text-2xl font-bold text-navy mb-1" style={{ fontFamily: 'Outfit' }}>Reminders</h2>
      <p className="text-sm text-gray-500 mb-4">
        {active > 0 ? `You have ${active} active reminder${active !== 1 ? 's' : ''}.` : '🎉 All caught up!'}
      </p>

      {/* Filter */}
      <div className="flex gap-2 mb-4" role="group" aria-label="Filter reminders">
        {['active', 'done', 'all'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-navy text-white' : 'bg-white text-navy border border-gray-200 hover:border-navy/30'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {shown.length === 0 ? (
        <p className="text-center text-gray-400 py-6">No reminders here.</p>
      ) : (
        <div className="space-y-2 mb-6">
          {shown.map((r) => (
            <div key={r.id} className={`flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100 ${r.done ? 'opacity-60' : ''}`}>
              <button onClick={() => toggle(r.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${r.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 hover:border-navy'}`}
                aria-label={`${r.done ? 'Undo' : 'Complete'}: ${r.title}`}>
                {r.done && <span className="text-xs font-bold">✓</span>}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${r.done ? 'line-through text-gray-400' : 'text-navy'}`}>{r.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">📅 {fmtDate(r.date)}</span>
                  <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full ${PRI_STYLE[r.priority]}`}>{r.priority}</span>
                </div>
              </div>
              <button onClick={() => remove(r.id)} className="text-gray-400 hover:text-red-500 p-1" aria-label={`Delete: ${r.title}`}>🗑</button>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-navy mb-3">Add a Reminder</h3>
        <form onSubmit={add} noValidate className="space-y-3">
          <div>
            <label htmlFor="r-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input id="r-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/50 ${errors.title ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'}`}
              placeholder="e.g. Submit CA3 report" />
            {errors.title && <p className="text-xs text-red-500 mt-1" role="alert">{errors.title}</p>}
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="r-date" className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
              <input id="r-date" type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/50 ${errors.date ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'}`} />
              {errors.date && <p className="text-xs text-red-500 mt-1" role="alert">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="r-pri" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select id="r-pri" value={priority} onChange={(e) => setPriority(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/50">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-navy text-white font-semibold py-2.5 rounded-lg hover:bg-navy-light transition-colors">
            Add Reminder
          </button>
        </form>
      </div>
    </section>
  );
}
