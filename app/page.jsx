'use client';
import { useState } from 'react';
import Timetable from '@/components/Timetable';
import Canteen from '@/components/Canteen';
import Reminders from '@/components/Reminders';
import MealRecommender from '@/components/MealRecommender';

const TABS = [
  { id: 'timetable',   label: '📅 Timetable' },
  { id: 'canteen',     label: '🍽 Canteen' },
  { id: 'reminders',   label: '🔔 Reminders' },
  { id: 'recommender', label: '🤖 ML Recommender' },
];

export default function HomePage() {
  const [tab, setTab] = useState('timetable');

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-extrabold text-navy mb-1" style={{ fontFamily: 'Outfit' }}>
        Welcome to Campus Companion
      </h1>
      <p className="text-gray-500 mb-6">Your all-in-one student hub — timetable, food, reminders, and more.</p>

      {/* Tab bar */}
      <div role="tablist" aria-label="Main sections" className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6">
        {TABS.map((t) => (
          <button key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'bg-navy text-white shadow-md' : 'text-gray-500 hover:text-navy hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {TABS.map((t) => (
        <div key={t.id} id={`panel-${t.id}`} role="tabpanel" aria-labelledby={`tab-${t.id}`} hidden={tab !== t.id}>
          {t.id === 'timetable' && <Timetable />}
          {t.id === 'canteen'     && <Canteen />}
          {t.id === 'reminders'   && <Reminders />}
          {t.id === 'recommender' && <MealRecommender />}
        </div>
      ))}
    </>
  );
}
