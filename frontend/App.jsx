import React, { useState } from 'react';
import { ReactLenis } from 'lenis/react';
import CanvasBackground from "./CanvasBackground";
import SearchInterface from "./SearchInterface";
import ResultsParallax from "./ResultsParallax";

function App() {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <ReactLenis root>
      <div className="relative w-full min-h-screen bg-space text-gold font-sans">
        {/* 3D WebGL Background Layer */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <CanvasBackground isSearching={isSearching} />
        </div>

        {/* Main Interface Content */}
        <div className="relative z-10 flex flex-col items-center min-h-screen">
          <SearchInterface 
            setResults={setResults} 
            setIsSearching={setIsSearching} 
          />
          <ResultsParallax results={results} />
        </div>
      </div>
    </ReactLenis>
  );
}

export default App;