import React, { useState } from 'react'; // ✅ CHANGED — added useState
import { motion } from 'framer-motion';

export default function AppShell({ currentView, setCurrentView }) {

  // ✅ NEW — mobile sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Terminal Gateway' },
    { id: 'search', label: 'Event Horizon' },
    { id: 'dashboard', label: 'Vector Space // WIP' }
  ];

  return (
    <>
      {/* ✅ NEW — hamburger button, only visible on mobile (hidden on md+) */}
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

      {/* ✅ NEW — dark overlay behind sidebar on mobile, closes on tap */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ CHANGED — sidebar now slides in/out on mobile, always visible on desktop */}
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
          <div className="mb-16">
            <h1 className="text-gold font-bold tracking-[0.4em] uppercase text-sm mb-1 opacity-90">
              Event Horizon
            </h1>
            <div className="text-[10px] text-gold/40 tracking-widest uppercase font-mono">
              Build 0.9.1 // Multimodal
            </div>
          </div>

          <nav className="flex flex-col gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false); // ✅ NEW — close sidebar on nav click (mobile)
                }}
                className={`text-left text-xs uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-4 group ${
                  currentView === item.id ? 'text-gold' : 'text-gold/30 hover:text-gold/70'
                }`}
              >
                <div className={`h-[1px] transition-all duration-500 bg-gold ${
                  currentView === item.id ? 'w-6 opacity-100' : 'w-0 opacity-0 group-hover:w-3 group-hover:opacity-50'
                }`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mock User Details — unchanged */}
        <div className="border-t border-gold/10 pt-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5 overflow-hidden">
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
        </div>
      </motion.div>
    </>
  );
}