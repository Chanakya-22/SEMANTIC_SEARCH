import React from 'react';
import { motion } from 'framer-motion';

export default function ResultsParallax({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 pb-40">
      <motion.h2 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="text-2xl md:text-3xl font-bold uppercase tracking-[0.3em] mb-24 text-center border-b border-gold/20 pb-8"
      >
        Semantic Echoes Detected
      </motion.h2>
      
      <div className="flex flex-col gap-32">
        {results.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24`}
          >
            <div className="w-full md:w-1/2 relative group">
              <div className="absolute inset-0 bg-gold/10 blur-2xl group-hover:bg-gold/20 transition-all duration-700"></div>
              <img src={item.image_url} alt={`Meme match ${index}`} className="relative z-10 w-full h-auto object-contain border border-gold/10 shadow-2xl" />
            </div>
            
            <div className="w-full md:w-1/2 space-y-6">
              <h3 className="text-xl opacity-50 uppercase tracking-widest">Match 0{index + 1}</h3>
              <p className="text-xl md:text-2xl leading-relaxed italic border-l-2 border-gold/30 pl-6">
                "{item.vibe_text.substring(0, 150)}..."
              </p>
              <div className="text-sm uppercase tracking-[0.2em] opacity-80 pt-4">Confidence: {(item.score * 100).toFixed(1)}%</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}