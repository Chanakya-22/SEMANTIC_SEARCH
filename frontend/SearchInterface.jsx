import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SearchInterface({ setResults, setIsSearching }) {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch('http://localhost:8000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      // Allow the 3D 'warp' to run for a moment before easing out
      setTimeout(() => setIsSearching(false), 1200); 
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen w-full px-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 text-center uppercase drop-shadow-[0_0_15px_rgba(248,200,105,0.3)]">
        Event Horizon
      </h1>
      <form onSubmit={handleSearch} className="w-full max-w-3xl relative mt-8">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe the vibe... e.g., 'how bro felt when the code compiled'"
          className="w-full bg-transparent border-b-2 border-gold/40 py-4 px-2 text-xl md:text-2xl text-gold placeholder-gold/30 focus:outline-none focus:border-gold transition-colors"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 uppercase tracking-widest text-sm font-bold opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_8px_rgba(248,200,105,0.8)] transition-all">
          Search
        </button>
      </form>
    </motion.div>
  );
}