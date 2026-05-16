import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SearchInterface({ setResults, setIsSearching, isSearching }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  // ✅ NEW — search history state, persisted in localStorage
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vibeSearchHistory') || '[]');
    } catch { return []; }
  });

  const suggestions = [
    "The 3 AM debugging delusion",
    "Imposter syndrome hitting hard",
    "Unearned confidence",
    "Deploying to production on a Friday"
  ];

  const executeSearch = async (searchQuery) => {
    if (!searchQuery.trim() || isSearching) return;

    setIsSearching(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();

      // ✅ NEW — save to search history on success
      setRecentSearches(prev => {
        const updated = [searchQuery, ...prev.filter(q => q !== searchQuery)].slice(0, 5);
        localStorage.setItem('vibeSearchHistory', JSON.stringify(updated));
        return updated;
      });

      setTimeout(() => {
        setResults(data.results);
        setIsSearching(false);
      }, 800);

    } catch (err) {
      console.error("Search failed:", err);
      setError("Search Engine is Offline. Make sure the backend server is running.");
      setIsSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch(query);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl flex flex-col items-center justify-center px-8"
    >
      <h1 className="text-4xl md:text-6xl font-thin tracking-tighter mb-16 text-gold opacity-80">
        VIBE / HORIZON
      </h1>

      <form onSubmit={handleSubmit} className="w-full relative flex items-center group">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setError(null); }}
          disabled={isSearching}
          placeholder="Describe a highly specific feeling..."
          className="w-full bg-transparent border-b border-gold/30 text-gold text-2xl py-4 pr-16 focus:outline-none focus:border-gold placeholder:text-gold/20 font-light transition-colors text-ellipsis overflow-hidden whitespace-nowrap"
        />
        <button 
          type="submit"
          disabled={isSearching}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-gold/30 hover:text-gold transition-colors p-4"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </form>

      {error && (
        <p className="mt-6 text-red-400/70 text-xs tracking-widest text-center uppercase">
          ⚠ {error}
        </p>
      )}

      {/* ✅ NEW — recent searches, shown only when history exists */}
      {recentSearches.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="w-full text-center text-[9px] text-gold/20 uppercase tracking-widest mb-1">
            Recent
          </span>
          {recentSearches.map((q, i) => (
            <button
              key={i}
              onClick={() => { setQuery(q); executeSearch(q); }}
              disabled={isSearching}
              className="text-[9px] px-3 py-1 rounded-full border border-gold/10 text-gold/30
                         hover:text-gold/60 hover:border-gold/30 transition-all duration-200
                         tracking-widest uppercase"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Suggestion Pills */}
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setQuery(suggestion);
              executeSearch(suggestion);
            }}
            disabled={isSearching}
            className="px-5 py-2.5 rounded-full border border-gold/20 text-gold/60 text-[10px] uppercase tracking-widest hover:border-gold/60 hover:text-gold transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gold/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
            <span className="relative z-10">{suggestion}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}