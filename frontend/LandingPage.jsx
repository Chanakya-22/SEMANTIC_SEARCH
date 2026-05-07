import React from 'react';
import { motion } from 'framer-motion';

export default function LandingPage({ onInitialize }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 flex flex-col items-center justify-center min-h-screen px-8 relative"
    >
      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        
        {/* Animated Headline */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          <h2 className="text-5xl md:text-7xl font-thin tracking-tighter text-gold/90 leading-tight mb-6">
            Standard search engines index words.<br/>
            <span className="font-semibold text-gold">We index chaotic energy.</span>
          </h2>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-gold/50 font-light max-w-2xl mx-auto leading-relaxed"
        >
          A multimodal vector space built to translate abstract human sentiment into visual resonance. Stop typing keywords. Start searching by the exact feeling of watching your code compile successfully on the first try.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="pt-12"
        >
          <button 
            onClick={onInitialize}
            className="group relative px-8 py-4 bg-transparent border border-gold/30 hover:border-gold text-gold uppercase tracking-[0.3em] text-sm overflow-hidden transition-all duration-500"
          >
            {/* Glow Hover Effect */}
            <div className="absolute inset-0 bg-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            
            <span className="relative z-10 flex items-center gap-3">
              Initialize Vector Search
              <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">→</span>
            </span>
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
}