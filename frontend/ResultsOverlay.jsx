import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResultsOverlay({ results, resetSearch }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!results || results.length === 0) return null;

  const currentItem = results[activeIndex];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 1 }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center px-12"
    >
      {/* Back Button */}
      <button 
        onClick={resetSearch}
        className="absolute top-12 left-12 text-gold/40 hover:text-gold tracking-widest text-xs uppercase transition-colors flex items-center gap-3 group z-30"
      >
        <span className="group-hover:-translate-x-2 transition-transform duration-500">←</span> 
        Return to Void
      </button>

      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-16 relative z-20">
        
        {/* Left Side: Cinematic Image Reveal */}
        <div className="w-full md:w-1/2 relative flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm"
            >
              {/* Backlight Glow */}
              <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full scale-110"></div>
              <img 
                src={currentItem.image_url} 
                alt="Vibe Match" 
                className="relative z-10 w-full h-auto object-contain border border-gold/10 shadow-[0_0_50px_rgba(248,200,105,0.05)]" 
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Typography & Controls */}
        <div className="w-full md:w-1/2 flex flex-col space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-gold/40 text-[10px] tracking-[0.4em] uppercase">
              <span>Match 0{activeIndex + 1}</span>
              <span className="w-8 h-[1px] bg-gold/20"></span>
              <span>{(currentItem.score * 100).toFixed(1)}% Confidence</span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.p
                key={`text-${activeIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-2xl md:text-4xl font-light italic leading-tight text-gold/90 border-l-2 border-gold/30 pl-6 py-2"
              >
                "{currentItem.vibe_text}"
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Slider Pagination Dots */}
          <div className="flex gap-4 pt-8">
            {results.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1 transition-all duration-500 rounded-full ${
                  activeIndex === idx 
                    ? 'w-12 bg-gold shadow-[0_0_10px_rgba(248,200,105,0.8)]' 
                    : 'w-4 bg-gold/20 hover:bg-gold/50'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}