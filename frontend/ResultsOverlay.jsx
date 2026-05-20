import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResultsOverlay({ results, resetSearch }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ NEW — keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % results.length);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + results.length) % results.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results.length]);

  // ✅ NEW — empty state when confidence threshold filters everything
  if (!results || results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center px-12"
      >
        <div className="text-gold/10 text-[60px] font-thin tracking-widest mb-6">∅</div>
        <p className="text-gold/40 text-sm tracking-[0.3em] uppercase font-mono mb-2">
          No vibe match found
        </p>
        <p className="text-gold/20 text-xs tracking-widest uppercase font-mono mb-12">
          The feeling exists beyond the index
        </p>
        <button
          onClick={resetSearch}
          className="px-8 py-3 border border-gold/20 text-gold/50 text-xs tracking-widest
                     uppercase hover:border-gold/60 hover:text-gold transition-all duration-300"
        >
          Try a different feeling
        </button>
      </motion.div>
    );
  }

  const currentItem = results[activeIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 1 }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center px-12"
    >
      {/* Back button */}
      <button
        onClick={resetSearch}
        className="absolute top-12 left-12 text-gold/40 hover:text-gold tracking-widest
                   text-xs uppercase transition-colors flex items-center gap-3 group z-30"
      >
        <span className="group-hover:-translate-x-2 transition-transform duration-500">←</span>
        Return to Void
      </button>

      {/* ✅ NEW — keyboard hint */}
      <div className="absolute top-12 right-12 text-gold/20 text-[9px] tracking-widest uppercase font-mono z-30 hidden md:flex items-center gap-2">
        <kbd className="border border-gold/20 px-1.5 py-0.5 rounded text-[8px]">←</kbd>
        <kbd className="border border-gold/20 px-1.5 py-0.5 rounded text-[8px]">→</kbd>
        <span>navigate</span>
      </div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-16 relative z-20">

        {/* Left — image */}
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
              <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full scale-110"></div>
              <img
                src={currentItem.image_url}
                alt="Vibe Match"
                className="relative z-10 w-full h-auto object-contain border border-gold/10 shadow-[0_0_50px_rgba(248,200,105,0.05)]"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right — text + controls */}
        <div className="w-full md:w-1/2 flex flex-col space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-gold/40 text-[10px] tracking-[0.4em] uppercase">
              <span>Match 0{activeIndex + 1} / 0{results.length}</span>
              <span className="w-8 h-[1px] bg-gold/20"></span>
              <span>{(currentItem.score * 100).toFixed(1)}% Confidence</span>
            </div>

            {/* ✅ NEW — confidence bar */}
            <div className="w-full h-px bg-gold/10 relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gold/40"
                initial={{ width: 0 }}
                animate={{ width: `${currentItem.score * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={`text-${activeIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-2xl md:text-4xl font-light italic leading-tight text-gold/90
                           border-l-2 border-gold/30 pl-6 py-2"
              >
                "{currentItem.vibe_text}"
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Pagination dots + ✅ NEW arrow buttons */}
          <div className="flex items-center gap-6 pt-8">
            {/* Prev button */}
            <button
              onClick={() => setActiveIndex(prev => (prev - 1 + results.length) % results.length)}
              disabled={results.length <= 1}
              className="text-gold/30 hover:text-gold transition-colors disabled:opacity-20 disabled:cursor-not-allowed text-lg"
              aria-label="Previous result"
            >
              ←
            </button>

            {/* Dots */}
            <div className="flex gap-4">
              {results.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to result ${idx + 1}`}
                  className={`h-1 transition-all duration-500 rounded-full ${
                    activeIndex === idx
                      ? 'w-12 bg-gold shadow-[0_0_10px_rgba(248,200,105,0.8)]'
                      : 'w-4 bg-gold/20 hover:bg-gold/50'
                  }`}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={() => setActiveIndex(prev => (prev + 1) % results.length)}
              disabled={results.length <= 1}
              className="text-gold/30 hover:text-gold transition-colors disabled:opacity-20 disabled:cursor-not-allowed text-lg"
              aria-label="Next result"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}