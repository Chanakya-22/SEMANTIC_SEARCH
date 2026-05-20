import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { id: '/', label: 'Terminal Gateway' },
    { id: '/search', label: 'Event Horizon' },
    { id: '/dashboard', label: 'Vector Space' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg
                   bg-black/40 border border-gold/20 text-gold/50
                   hover:text-gold hover:border-gold/40 transition-all"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <div className="w-5 h-px bg-current mb-1.5"></div>
        <div className="w-5 h-px bg-current mb-1.5"></div>
        <div className="w-5 h-px bg-current"></div>
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`
          fixed top-0 left-0 h-screen w-64 border-r border-gold/10
          bg-space/60 backdrop-blur-xl z-50 flex flex-col justify-between p-8
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div>
          {/* ✅ "Event Horizon" heading is now a home link */}
          <Link
            to="/"
            className="block mb-16 group"
            onClick={() => setSidebarOpen(false)}
          >
            <h1 className="text-gold font-bold tracking-[0.4em] uppercase text-sm mb-1 opacity-90
                           group-hover:opacity-100 transition-opacity">
              Event Horizon
            </h1>
            <div className="text-[10px] text-gold/40 tracking-widest uppercase font-mono">
              Build 0.9.2 // Multimodal
            </div>
          </Link>

          <nav className="flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.id}
                onClick={() => setSidebarOpen(false)}
                className={`text-left text-xs uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-4 group ${
                  isActive(item.id) ? 'text-gold' : 'text-gold/30 hover:text-gold/70'
                }`}
              >
                <div className={`h-[1px] transition-all duration-500 bg-gold ${
                  isActive(item.id) ? 'w-6 opacity-100' : 'w-0 opacity-0 group-hover:w-3 group-hover:opacity-50'
                }`} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-gold/10 pt-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5">
              <span className="text-gold text-xs font-mono">CH</span>
            </div>
            <div>
              <div className="text-gold text-xs uppercase tracking-widest">Chanakya</div>
              <div className="text-gold/40 text-[10px] font-mono tracking-widest">Sys_Admin</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-gold/40 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
            Engine Online
          </div>
          {/* ✅ GitHub link in sidebar footer */}
          <a
            href="https://github.com/Chanakya-22/random_vibe"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 text-[10px] font-mono text-gold/20
                       hover:text-gold/50 uppercase tracking-widest transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
        </div>
      </motion.div>
    </>
  );
}