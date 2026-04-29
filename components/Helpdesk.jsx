'use client';
import { useState } from 'react';

// ─── Fictional helpdesk tickets ───
const STARTER_TICKETS = [
  { id: 'HD-001', cat: 'IT Support', subject: 'Cannot access student email on mobile',
    desc: 'Student email on iPhone keeps requesting password every day.',
    status: 'resolved', priority: 'medium', date: '2025-09-03',
    response: 'Remove and re-add the account using the Microsoft Outlook app.' },
  { id: 'HD-002', cat: 'Facilities', subject: 'Broken locker in Block B changing room',
    desc: "Locker 14 has a broken door hinge — won't close properly.",
    status: 'in-progress', priority: 'low', date: '2025-09-05', response: null },
  { id: 'HD-003', cat: 'Academic', subject: 'Assignment submission portal not working',
    desc: 'Getting a 500 error when submitting CA1 on Moodle.',
    status: 'resolved', priority: 'high', date: '2025-09-07',
    response: 'Portal issue resolved. Clear your browser cache and try again.' },
];

const STATUS_STYLE = { resolved: 'bg-green-100 text-green-800', 'in-progress': 'bg-yellow-100 text-yellow-800', open: 'bg-gray-100 text-gray-600' };
const PRI_STYLE    = { high: 'bg-red-100 text-red-700', medium: 'bg-orange-100 text-orange-700', low: 'bg-gray-100 text-gray-600' };
const CATS         = ['IT Support', 'Facilities', 'Academic', 'Other'];

export default function Helpdesk() {
  const [tickets, setTickets] = useState(STARTER_TICKETS);
  const [subject, setSubject] = useState('');
  const [desc, setDesc]       = useState('');
  const [cat, setCat]         = useState('IT Support');
  const [errors, setErrors]   = useState({});
  const [success, setSuccess] = useState('');

  function submit(e) {
    e.preventDefault();
    const err = {};
    if (!subject.trim()) err.subject = 'Subject is required.';
    if (!desc.trim())    err.desc    = 'Description is required.';
    setErrors(err);
    if (Object.keys(err).length) return;

    const ref = 'HD-2025-' + (Math.floor(Math.random() * 9000) + 1000);
    setTickets((p) => [{ id: ref, cat, subject: subject.trim(), desc: desc.trim(), status: 'open', priority: 'medium', date: new Date().toISOString().split('T')[0], response: null }, ...p]);
    setSubject(''); setDesc(''); setCat('IT Support'); setErrors({});
    setSuccess(`✅ Ticket submitted! Reference: ${ref}. We'll respond within 2 working days.`);
    setTimeout(() => setSuccess(''), 8000);
  }

  function fmtDate(iso) { return new Date(iso + 'T00:00:00').toLocaleDateString('en-IE'); }

  return (
    <section aria-labelledby="hd-heading">
      <h2 id="hd-heading" className="text-2xl font-bold text-navy mb-4" style={{ fontFamily: 'Outfit' }}>Helpdesk</h2>

      {/* Submit form */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-semibold text-navy mb-3">Submit a Ticket</h3>
        {success && <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 text-sm text-green-800" role="status">{success}</div>}
        <div className="space-y-3">
          <div>
            <label htmlFor="hd-cat" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select id="hd-cat" value={cat} onChange={(e) => setCat(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/50">
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="hd-subj" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input id="hd-subj" type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/50 ${errors.subject ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'}`}
              placeholder="Brief summary of the issue" />
            {errors.subject && <p className="text-xs text-red-500 mt-1" role="alert">{errors.subject}</p>}
          </div>
          <div>
            <label htmlFor="hd-desc" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="hd-desc" rows="3" value={desc} onChange={(e) => setDesc(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/50 ${errors.desc ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'}`}
              placeholder="Describe the issue in detail" />
            {errors.desc && <p className="text-xs text-red-500 mt-1" role="alert">{errors.desc}</p>}
          </div>
          <button type="button" onClick={submit} className="w-full bg-navy text-white font-semibold py-2.5 rounded-lg hover:bg-navy-light transition-colors">Submit Ticket</button>
        </div>
      </div>

      {/* Ticket list */}
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Your Tickets</h3>
      <div className="space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-navy text-sm">{t.subject}</h4>
              <div className="flex gap-1.5 shrink-0">
                <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full ${PRI_STYLE[t.priority]}`}>{t.priority}</span>
                <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[t.status]}`}>{t.status}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{t.desc}</p>
            {t.response && <div className="bg-blue-50 rounded-lg p-2.5 text-sm text-blue-800 mb-2"><strong>Response:</strong> {t.response}</div>}
            <p className="text-xs text-gray-400">📋 {t.cat} · Submitted: {fmtDate(t.date)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
