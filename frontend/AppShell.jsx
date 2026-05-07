import React from 'react';
import { motion } from 'framer-motion';

export default function AppShell({ currentView, setCurrentView }) {
  const navItems = [
    { id: 'landing', label: 'Terminal Gateway' },
    { id: 'search', label: 'Event Horizon' },
    { id: 'dashboard', label: 'Vector Space // WIP' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 h-screen w-64 border-r border-gold/10 bg-space/60 backdrop-blur-xl z-50 flex flex-col justify-between p-8"
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
              onClick={() => setCurrentView(item.id)}
              disabled={item.id === 'dashboard'} // Disable WIP dashboard for now
              className={`text-left text-xs uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-4 group ${
                currentView === item.id ? 'text-gold' : 'text-gold/30 hover:text-gold/70'
              } ${item.id === 'dashboard' ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <div className={`h-[1px] transition-all duration-500 bg-gold ${
                currentView === item.id ? 'w-6 opacity-100' : 'w-0 opacity-0 group-hover:w-3 group-hover:opacity-50'
              }`} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mock User Details */}
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
  );
}