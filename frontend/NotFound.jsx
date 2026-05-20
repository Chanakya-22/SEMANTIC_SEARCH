import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex flex-col items-center justify-center min-h-screen px-8 text-center"
    >
      <div className="text-[80px] font-thin text-gold/10 tracking-widest leading-none mb-8">
        404
      </div>
      <h1 className="text-xl font-thin tracking-[0.4em] text-gold/60 uppercase mb-4">
        Signal Lost
      </h1>
      <p className="text-gold/30 text-xs tracking-widest uppercase mb-12 font-mono">
        This frequency does not exist in the vector space
      </p>
      <Link
        to="/"
        className="px-8 py-3 border border-gold/20 text-gold/50 text-xs tracking-widest
                   uppercase hover:border-gold/60 hover:text-gold transition-all duration-300"
      >
        Return to Origin
      </Link>
    </motion.div>
  );
}