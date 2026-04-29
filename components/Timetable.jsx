'use client';
import { useState } from 'react';

// ─── Fictional timetable data ───
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const TIMETABLE = {
  Mon: [
    { time: '09:00–10:00', module: 'Nature of Enterprise Computing', code: 'COMP2401', room: 'Lecture Hall 1', lecturer: 'Dr. A. Murphy', type: 'Lecture' },
    { time: '11:00–12:00', module: 'Data Structures & Algorithms',   code: 'COMP2201', room: 'Lab 2B',         lecturer: 'Ms. C. Walsh',   type: 'Lab' },
    { time: '14:00–15:00', module: 'Mathematics for Computing',      code: 'MATH2101', room: 'Room 204',       lecturer: "Dr. B. O'Brien", type: 'Lecture' },
  ],
  Tue: [
    { time: '09:00–11:00', module: 'Web Development Fundamentals',   code: 'COMP2301', room: 'Lab 1A',         lecturer: 'Mr. D. Brennan', type: 'Lab' },
    { time: '13:00–14:00', module: 'Nature of Enterprise Computing', code: 'COMP2401', room: 'Seminar Room 3', lecturer: 'Dr. A. Murphy',  type: 'Tutorial' },
  ],
  Wed: [
    { time: '10:00–11:00', module: 'Data Structures & Algorithms', code: 'COMP2201', room: 'Lecture Hall 2', lecturer: 'Ms. C. Walsh', type: 'Lecture' },
    { time: '14:00–15:00', module: 'Professional Development',     code: 'PROF2101', room: 'Room 105',       lecturer: 'Ms. E. Ryan',  type: 'Workshop' },
  ],
  Thu: [
    { time: '09:00–10:00', module: 'Mathematics for Computing',    code: 'MATH2101', room: 'Room 204',  lecturer: "Dr. B. O'Brien", type: 'Lecture' },
    { time: '11:00–13:00', module: 'Web Development Fundamentals', code: 'COMP2301', room: 'Lab 1A',    lecturer: 'Mr. D. Brennan', type: 'Lab' },
  ],
  Fri: [
    { time: '10:00–11:00', module: 'Professional Development',      code: 'PROF2101', room: 'Lecture Hall 1', lecturer: 'Ms. E. Ryan',  type: 'Lecture' },
    { time: '13:00–14:00', module: 'Data Structures & Algorithms',  code: 'COMP2201', room: 'Seminar Room 2', lecturer: 'Ms. C. Walsh', type: 'Tutorial' },
  ],
};

const TYPE_STYLE = {
  Lecture:  'bg-blue-100 text-blue-800',
  Lab:      'bg-green-100 text-green-800',
  Tutorial: 'bg-yellow-100 text-yellow-800',
  Workshop: 'bg-purple-100 text-purple-800',
};

export default function Timetable() {
  const [day, setDay] = useState('Mon');
  const classes = TIMETABLE[day] || [];

  return (
    <section aria-labelledby="tt-heading">
      <h2 id="tt-heading" className="text-2xl font-bold text-navy mb-4" style={{ fontFamily: 'Outfit' }}>Weekly Timetable</h2>

      {/* Day buttons */}
      <div className="flex gap-2 mb-5 flex-wrap" role="group" aria-label="Select day">
        {DAYS.map((d) => (
          <button key={d} onClick={() => setDay(d)} aria-pressed={day === d}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${day === d ? 'bg-navy text-white shadow-md' : 'bg-white text-navy border border-gray-200 hover:border-navy/30'}`}>
            {d}
          </button>
        ))}
      </div>

      {/* Classes */}
      {classes.length === 0 ? (
        <div className="bg-white rounded-xl p-6 text-center text-gray-400">🎉 No classes today!</div>
      ) : (
        <div className="space-y-3">
          {classes.map((c, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-navy">{c.module}</h3>
                  <p className="text-sm text-gray-500">{c.code}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${TYPE_STYLE[c.type]}`}>{c.type}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-gray-600">
                <span>🕐 {c.time}</span>
                <span>📍 {c.room}</span>
                <span>👤 {c.lecturer}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

