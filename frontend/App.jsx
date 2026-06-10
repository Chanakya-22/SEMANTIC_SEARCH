import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { AnimatePresence } from 'framer-motion';
import CanvasBackground from './CanvasBackground';
import AppShell from './AppShell';
import LandingPage from './LandingPage';
import SearchInterface from './SearchInterface';
import ResultsOverlay from './ResultsOverlay';
import VectorSpaceDashboard from './VectorSpaceDashboard.jsx';
import NotFound from './NotFound.jsx';
import ScrollToTop from './ScrollToTop.jsx';

function App() {
  const [isWarping, setIsWarping] = useState(false);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Ctrl+K → go to search, Escape → clear results
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setResults([]);
        navigate('/search');
      }
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setResults([]);
        navigate('/search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, [navigate]);

  // Clear results when navigating away from /search
  useEffect(() => {
    if (location.pathname !== '/search') {
      setResults([]);
    }
  }, [location.pathname]);

  const handleInitialization = () => {
    setIsWarping(true);
    const t1 = setTimeout(() => {
      navigate('/search');
      const t2 = setTimeout(() => setIsWarping(false), 500);
      timeoutRefs.current.push(t2);
    }, 1200);
    timeoutRefs.current.push(t1);
  };

  const resetSearch = () => setResults([]);
  const topConfidence = results.length > 0 ? results[0].score : 0;

  return (
    <ReactLenis root>
      <ScrollToTop />
      <div className="relative w-full min-h-screen bg-space text-gold font-sans overflow-hidden">

        <div className="fixed inset-0 z-0 pointer-events-none">
          <CanvasBackground
            isSearching={isSearching}
            isWarping={isWarping}
            confidence={topConfidence}
          />
        </div>

        <AppShell />

        <div className="relative z-10 md:pl-64 pt-14 md:pt-0 flex flex-col items-center justify-center min-h-screen">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

              <Route path="/" element={
                <LandingPage key="landing" onInitialize={handleInitialization} />
              } />

              <Route path="/search" element={
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
              } />

              <Route path="/dashboard" element={
                <VectorSpaceDashboard key="dashboard" />
              } />

              <Route path="*" element={<NotFound />} />

            </Routes>
          </AnimatePresence>
        </div>

      </div>
    </ReactLenis>
  );
}

export default App;