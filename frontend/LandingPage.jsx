import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ✅ NEW — stagger container for headline words
const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 }
  }
};

const word = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function LandingPage({ onInitialize }) {
  // ✅ NEW — fetch real index stats from /health to show on landing
  const [indexSize, setIndexSize] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then(res => res.json())
      .then(data => setIndexSize(data.index_size))
      .catch(() => setIndexSize(null));
  }, []);

  const headlineA = "The meme search engine".split(" ");
  const headlineB = "that actually gets the joke.".split(" ");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 flex flex-col items-center justify-center min-h-screen px-8 relative"
    >
      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">

        {/* ✅ NEW — staggered word-by-word headline animation */}
        <div>
          <motion.h2
            className="text-5xl md:text-7xl font-thin tracking-tighter text-gold/90 leading-tight mb-6"
            variants={sentence}
            initial="hidden"
            animate="visible"
          >
            {headlineA.map((w, i) => (
              <motion.span key={i} variants={word} className="inline-block mr-[0.25em]">
                {w}
              </motion.span>
            ))}
            <br />
            {headlineB.map((w, i) => (
              <motion.span
                key={i}
                variants={word}
                className="inline-block mr-[0.25em] font-semibold text-gold"
              >
                {w}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="text-lg md:text-xl text-gold/50 font-light max-w-2xl mx-auto leading-relaxed"
        >
          Built because scrolling endlessly through folders looking for that one meme
          <br />
          from months ago felt like a personal defeat.
          <br />
          <br />
          Event Horizon doesn't look for filenames or perfect keywords.
          <br />
          It maps images into a universe of meaning, where similar ideas naturally find each other.
          <br />
          <br />
          Describe what you remember.
          <br />
          The vector space handles the rest.
        </motion.p>

        {/* ✅ NEW — live index stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="flex items-center justify-center gap-8"
        >
          <div className="text-center">
            <div className="text-gold text-xl font-mono font-light">
              {indexSize ? indexSize.toLocaleString() : '—'}
            </div>
            <div className="text-gold/20 text-[9px] uppercase tracking-widest font-mono mt-1">
              vectors indexed
            </div>
          </div>
          <div className="w-px h-8 bg-gold/10" />
          <div className="text-center">
            <div className="text-gold text-xl font-mono font-light">512</div>
            <div className="text-gold/20 text-[9px] uppercase tracking-widest font-mono mt-1">
              dimensions
            </div>
          </div>
          <div className="w-px h-8 bg-gold/10" />
          <div className="text-center">
            <div className="text-gold text-xl font-mono font-light">CLIP</div>
            <div className="text-gold/20 text-[9px] uppercase tracking-widest font-mono mt-1">
              embedding model
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
          className="text-sm md:text-base text-gold/40 font-mono max-w-2xl mx-auto leading-relaxed mt-6"
        >
          No folders. No tags. No "meme_final_final_REAL.png".
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
          className="pt-8"
        >
          <button
            onClick={onInitialize}
            className="group relative px-8 py-4 bg-transparent border border-gold/30
                       hover:border-gold text-gold uppercase tracking-[0.3em] text-sm
                       overflow-hidden transition-all duration-500 focus:outline-none
                       focus:ring-1 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            <div className="absolute inset-0 bg-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            <span className="relative z-10 flex items-center gap-3">
              Initialize Vector Search
              <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">→</span>
            </span>
          </button>

          {/* ✅ NEW — keyboard shortcut hint below CTA */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-4 text-gold/15 text-[9px] uppercase tracking-widest font-mono"
          >
            or press{' '}
            <kbd className="border border-gold/15 px-1.5 py-0.5 rounded text-[8px] text-gold/20">
              Ctrl+K
            </kbd>
          </motion.p>
        </motion.div>

      </div>

      {/* ✅ NEW — subtle scroll/pulse indicator at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-gold/20" />
        <div className="w-1 h-1 rounded-full bg-gold/20 animate-pulse" />
      </motion.div>
    </motion.div>
  );
}