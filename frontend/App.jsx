import React, { useState, useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import { AnimatePresence } from 'framer-motion';
import CanvasBackground from './CanvasBackground';
import AppShell from './AppShell';
import LandingPage from './LandingPage';
import SearchInterface from './SearchInterface';
import ResultsOverlay from './ResultsOverlay'; // <--- We are renaming/replacing the Parallax file

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [isWarping, setIsWarping] = useState(false);
  const timeoutRefs = useRef([]);

  // Search Engine State
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Safely clear any pending timers if the component ever unmounts
  useEffect(() => {
    return () => {
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

  const resetSearch = () => {
    setResults([]); // Clearing the array triggers the AnimatePresence to bring the search bar back
  };

  return (
    <ReactLenis root>
      <div className="relative w-full min-h-screen bg-space text-gold font-sans overflow-hidden">
        
        {/* 3D WebGL Background Layer */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <CanvasBackground isSearching={isSearching} isWarping={isWarping} />
        </div>

        {/* Global App Shell (Sidebar) */}
        <AppShell currentView={currentView} setCurrentView={setCurrentView} />

        {/* Main Content Area (Offset by sidebar width) */}
        <div className="relative z-10 pl-64 flex flex-col items-center justify-center min-h-screen">
          <AnimatePresence mode="wait">
            
            {currentView === 'landing' && (
              <LandingPage key="landing" onInitialize={handleInitialization} />
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