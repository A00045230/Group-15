'use client';
import { useState } from 'react';

// ─── Fictional campus locations ───
const CATEGORIES = ['All', 'Academic', 'Study', 'Food', 'Sport', 'Health', 'Social'];
const LOCATIONS = [
  { id: 'l1', name: 'Main Building', category: 'Academic', accessible: true,
    desc: 'Lecture theatres, seminar rooms, administration, and student services.',
    hours: '07:30 – 22:00 (Mon–Fri), 09:00 – 17:00 (Sat)', floors: 'Ground – 3rd floor',
    rooms: ['Lecture Hall 1 & 2', 'Seminar Rooms 1–5', 'Administration Office', 'Student Services'],
    features: ['Lifts', 'Accessible toilets', 'Hearing loops in lecture halls'] },
  { id: 'l2', name: 'Tech Building', category: 'Academic', accessible: true,
    desc: 'Computer labs, Innovation Lab, and engineering workshops.',
    hours: '08:00 – 21:00 (Mon–Fri)', floors: 'Ground – 2nd floor',
    rooms: ['Lab 1A', 'Lab 1B', 'Lab 2A', 'Lab 2B', 'Innovation Lab'],
    features: ['Lifts', 'Accessible toilets', '24/7 card access to Lab 1A'] },
  { id: 'l3', name: 'Library', category: 'Study', accessible: true,
    desc: 'Three floors of study space, print/digital resources, group study rooms.',
    hours: '08:00 – 23:00 (Mon–Thu), 08:00 – 20:00 (Fri), 10:00 – 18:00 (Sat–Sun)', floors: 'Ground – 2nd floor',
    rooms: ['Silent Study (1st floor)', 'Group Study Rooms 1–6', 'Print Collections', 'Help Desk'],
    features: ['Lifts', 'Accessible desks', 'Screen readers at help desk'] },
  { id: 'l4', name: 'Block B — Canteen & Services', category: 'Food', accessible: true,
    desc: 'Main student canteen, campus shop, printing, and Student Union office.',
    hours: '08:00 – 16:30 (Mon–Fri)', floors: 'Ground floor',
    rooms: ['Canteen', 'Campus Shop', 'Printing & Copying', 'Student Union Office'],
    features: ['Step-free access', 'Accessible seating'] },
  { id: 'l5', name: 'Sports Centre', category: 'Sport', accessible: true,
    desc: 'Gym, swimming pool, sports halls, and physiotherapy room.',
    hours: '07:00 – 22:00 (Mon–Fri), 09:00 – 20:00 (Sat–Sun)', floors: 'Ground – 1st floor',
    rooms: ['Gym', 'Swimming Pool', 'Sports Hall A & B', 'Physiotherapy Room'],
    features: ['Accessible changing room', 'Pool hoist', 'Hearing loop at reception'] },
  { id: 'l6', name: 'Health & Wellbeing Centre', category: 'Health', accessible: true,
    desc: 'GP surgery, counselling, mental health support, and campus nurse.',
    hours: '09:00 – 17:00 (Mon–Fri) — appointments recommended', floors: 'Ground floor, Main Building Annex',
    rooms: ['GP Surgery', 'Counselling Rooms 1–3', "Nurse's Office"],
    features: ['Step-free access', 'Private waiting area on request'] },
  { id: 'l7', name: 'Student Bar & Social Space', category: 'Social', accessible: true,
    desc: 'Main social hub — bar, lounge, and event space (capacity 200).',
    hours: '12:00 – 23:30 (Mon–Fri), 14:00 – 23:30 (Sat)', floors: 'Ground floor, Block D',
    rooms: ['Bar', 'Lounge', 'Event Space'],
    features: ['Step-free access', 'Accessible toilet'] },
];

export default function Locations() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [openId, setOpenId] = useState(null);

  const q = search.toLowerCase();
  const shown = LOCATIONS.filter((l) => {
    if (cat !== 'All' && l.category !== cat) return false;
    if (q && !l.name.toLowerCase().includes(q) && !l.desc.toLowerCase().includes(q) && !l.rooms.some((r) => r.toLowerCase().includes(q))) return false;
    return true;
  });

  return (
    <section aria-labelledby="loc-heading">
      <h2 id="loc-heading" className="text-2xl font-bold text-navy mb-4" style={{ fontFamily: 'Outfit' }}>Campus Locations</h2>

      {/* Search */}
      <label htmlFor="loc-search" className="sr-only">Search locations</label>
      <input id="loc-search" type="search" placeholder="Search buildings, rooms…" value={search} onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-navy/50" />

      {/* Category pills */}
      <div className="flex gap-2 mb-4 flex-wrap" role="group" aria-label="Filter by category">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${cat === c ? 'bg-navy text-white' : 'bg-white text-navy border border-gray-200 hover:border-navy/30'}`}>
            {c}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-3">{shown.length} location{shown.length !== 1 ? 's' : ''} found</p>

      {/* Accordion */}
      <div className="space-y-2">
        {shown.map((l) => {
          const open = openId === l.id;
          return (
            <div key={l.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <button onClick={() => setOpenId(open ? null : l.id)} aria-expanded={open} aria-controls={`acc-${l.id}`}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-navy text-sm">
                  {l.name}
                  {l.accessible && <span className="ml-2 bg-blue-50 text-blue-700 text-[0.65rem] font-bold px-2 py-0.5 rounded-full">♿ Accessible</span>}
                </span>
                <span className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">▼</span>
              </button>
              <div id={`acc-${l.id}`} className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[500px] px-4 pb-4' : 'max-h-0'}`}>
                <p className="text-sm text-gray-600 mb-3 pt-1">{l.desc}</p>
                <dl className="space-y-2 text-sm">
                  <div><dt className="font-semibold text-navy text-xs uppercase tracking-wider">Hours</dt><dd className="text-gray-600 mt-0.5">{l.hours}</dd></div>
                  <div><dt className="font-semibold text-navy text-xs uppercase tracking-wider">Floors</dt><dd className="text-gray-600 mt-0.5">{l.floors}</dd></div>
                  <div><dt className="font-semibold text-navy text-xs uppercase tracking-wider">Rooms</dt><dd className="text-gray-600 mt-0.5"><ul className="list-disc list-inside">{l.rooms.map((r) => <li key={r}>{r}</li>)}</ul></dd></div>
                  <div><dt className="font-semibold text-navy text-xs uppercase tracking-wider">Accessibility</dt><dd className="text-gray-600 mt-0.5"><ul className="list-disc list-inside">{l.features.map((f) => <li key={f}>{f}</li>)}</ul></dd></div>
                </dl>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
