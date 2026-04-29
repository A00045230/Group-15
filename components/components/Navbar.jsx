'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/campus/', label: 'Campus' },
  ];

  const isActive = (href) => path === href || path === href.replace(/\/$/, '');

  return (
    <nav className="bg-navy text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold text-xl tracking-tight hover:text-gold transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
          🎓 Campus Companion
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(l.href) ? 'bg-white/15 text-gold' : 'hover:bg-white/10'}`}
                aria-current={isActive(l.href) ? 'page' : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-lg hover:bg-white/10" onClick={() => setOpen(!open)}
          aria-expanded={open} aria-label="Toggle menu">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden border-t border-white/10 px-4 pb-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${isActive(l.href) ? 'bg-white/15 text-gold' : 'hover:bg-white/10'}`}
                aria-current={isActive(l.href) ? 'page' : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
