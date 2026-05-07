import React, { useState } from 'react';
import { ReactLenis } from 'lenis/react';
import { AnimatePresence } from 'framer-motion';
import CanvasBackground from './CanvasBackground';
import SearchInterface from './SearchInterface';
import ResultsParallax from './ResultsParallax';
import AppShell from './AppShell';
import LandingPage from './LandingPage';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'search'
  const [isWarping, setIsWarping] = useState(false); // Controls the violent 3D transition
  
  // Search Engine State
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // The cinematic transition function
  const handleInitialization = () => {
    setIsWarping(true);
    // Let the warp tunnel effect play for 1.2 seconds, then switch the UI to search
    setTimeout(() => {
      setCurrentView('search');
      // Taper off the warp speed smoothly
      setTimeout(() => setIsWarping(false), 500);
    }, 1200);
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
        <div className="relative z-10 pl-64 flex flex-col items-center min-h-screen">
          <AnimatePresence mode="wait">
            
            {currentView === 'landing' && (
              <LandingPage key="landing" onInitialize={handleInitialization} />
            )}

            {currentView === 'search' && (
              <div key="search" className="w-full flex flex-col items-center">
                <SearchInterface 
                  setResults={setResults} 
                  setIsSearching={setIsSearching} 
                />
                {/* Note: Phase 2 will overhaul this scroll component! */}
                <ResultsParallax results={results} />
              </div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </ReactLenis>
  );
}

export default App;