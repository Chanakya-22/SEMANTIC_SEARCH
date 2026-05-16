import React, { useState, useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import { AnimatePresence } from 'framer-motion';
import CanvasBackground from './CanvasBackground';
import AppShell from './AppShell';
import LandingPage from './LandingPage';
import SearchInterface from './SearchInterface';
import ResultsOverlay from './ResultsOverlay';
import VectorSpaceDashboard from './VectorSpaceDashboard.jsx';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [isWarping, setIsWarping] = useState(false);
  const timeoutRefs = useRef([]);

  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Global Keyboard Shortcuts (Ctrl+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape key clears results and returns to search void
      if (e.key === 'Escape') {
        setResults([]);
        setCurrentView('search');
      }
      // Ctrl+K (or Cmd+K) instantly opens the search view
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setResults([]);
        setCurrentView('search');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const handleInitialization = () => {
    setIsWarping(true);
    const t1 = setTimeout(() => {
      setCurrentView('search');
      const t2 = setTimeout(() => setIsWarping(false), 500);
      timeoutRefs.current.push(t2);
    }, 1200);
    timeoutRefs.current.push(t1);
  };

  const resetSearch = () => setResults([]);

  // Extract the confidence of the top result to feed the reactive canvas
  const topConfidence = results.length > 0 ? results[0].score : 0;

  return (
    <ReactLenis root>
      <div className="relative w-full min-h-screen bg-space text-gold font-sans overflow-hidden">
        
        {/* Reactive Canvas Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <CanvasBackground 
            isSearching={isSearching} 
            isWarping={isWarping} 
            confidence={topConfidence} 
          />
        </div>

        <AppShell currentView={currentView} setCurrentView={setCurrentView} />

        <div className="relative z-10 pl-64 flex flex-col items-center justify-center min-h-screen">
          <AnimatePresence mode="wait">
            
            {currentView === 'landing' && (
              <LandingPage key="landing" onInitialize={handleInitialization} />
            )}

            {currentView === 'dashboard' && (
              <VectorSpaceDashboard key="dashboard" />
            )}

            {currentView === 'search' && (
              <div key="search-container" className="w-full flex items-center justify-center relative min-h-screen">
                <AnimatePresence mode="wait">
                  {results.length === 0 ? (
                    <SearchInterface 
                      key="search-interface"
                      setResults={setResults} 
                      setIsSearching={setIsSearching}
                      isSearching={isSearching}
                    />
                  ) : (
                    <ResultsOverlay 
                      key="results-overlay"
                      results={results} 
                      resetSearch={resetSearch}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </ReactLenis>
  );
}

export default App;