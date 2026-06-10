import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { id: '/', label: 'Terminal Gateway' },
    { id: '/search', label: 'Event Horizon' },
    { id: '/dashboard', label: 'Vector Space' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="fixed top-4 left-4 z-[60] flex items-center gap-3">
        <div className="rounded-[28px] border border-gold/20 bg-[#110a06]/95 backdrop-blur-xl px-4 py-3 shadow-[0_0_30px_rgba(249,207,72,0.15)]">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block">
            <div className="text-gold font-bold tracking-[0.35em] uppercase text-xs opacity-90 leading-none">
              Event Horizon
            </div>
            <div className="text-[9px] text-gold/40 tracking-widest uppercase font-mono">
              Build 0.9.2 // Multimodal
            </div>
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/20 bg-black/60 text-gold shadow-[0_0_22px_rgba(249,207,72,0.18)] transition hover:bg-black/80"
        >
          {menuOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          )}
        </button>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[50] bg-black/70"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[50] bg-black/70"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-24 left-4 z-[55] w-[min(340px,calc(100%-2rem))] rounded-[32px] border border-gold/20 bg-[#090604]/95 backdrop-blur-xl shadow-[0_0_60px_rgba(18,10,5,0.55)] p-5"
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <div className="text-gold text-[10px] uppercase tracking-[0.35em] font-mono">
                    Terminal Menu
                  </div>
                  <div className="text-gold/40 text-[9px] uppercase tracking-widest font-mono">
                    Premium sci-fi interface
                  </div>
                </div>
                <span className="inline-flex rounded-full bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-gold">
                  Live
                </span>
              </div>

              <nav className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.id}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-2xl border border-gold/10 bg-black/50 px-4 py-3 text-left text-xs uppercase tracking-[0.2em] transition duration-300 ${
                      isActive(item.id) ? 'text-gold shadow-[0_0_20px_rgba(249,207,72,0.18)]' : 'text-gold/40 hover:text-gold/70'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 border-t border-gold/10 pt-4 text-[10px] text-gold/40 uppercase tracking-widest font-mono">
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  Engine Online
                </div>
                <a
                  href="https://github.com/Chanakya-22/SEMANTIC_SEARCH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold/20 hover:text-gold/50 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  View on GitHub
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}