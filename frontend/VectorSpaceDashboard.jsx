import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function VectorSpaceDashboard() {
  const [points, setPoints] = useState([]);
  const [totalVectors, setTotalVectors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null); // ✅ NEW — for hover tooltip

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vectors`)
      .then(res => res.json())
      .then(data => {
        setPoints(data.points);
        setTotalVectors(data.total);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ✅ NEW — normalize raw PCA coords to 5–95% range so points
  // spread across the canvas instead of clumping in the center
  const normalizePoints = (rawPoints) => {
    if (rawPoints.length === 0) return [];
    const xs = rawPoints.map(p => p.x);
    const ys = rawPoints.map(p => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    return rawPoints.map((p, i) => ({
      ...p,
      id: i,
      px: ((p.x - minX) / (maxX - minX)) * 90 + 5, // 5–95%
      py: ((p.y - minY) / (maxY - minY)) * 90 + 5, // 5–95%
    }));
  };

  const normalizedPoints = normalizePoints(points);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-screen flex flex-col items-center justify-center p-12 relative"
    >
      <div className="absolute top-12 left-12">
        <h2 className="text-3xl font-thin tracking-widest text-gold opacity-90 uppercase">
          Vector Telemetry
        </h2>
        <p className="text-gold/40 text-xs tracking-[0.3em] uppercase mt-2">
          2D Projection of 512-Dimensional Space
        </p>
        {/* ✅ NEW — show real index size from API */}
        {!loading && (
          <p className="text-gold/20 text-[10px] tracking-[0.3em] uppercase mt-1 font-mono">
            {totalVectors.toLocaleString()} vectors indexed · {normalizedPoints.length} sampled
          </p>
        )}
      </div>

      <div className="w-full max-w-5xl aspect-video border border-gold/20 bg-space/40 backdrop-blur-md relative overflow-hidden group">
        
        {/* Radar Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gold/50 shadow-[0_0_20px_rgba(248,200,105,0.8)] animate-[scan_4s_linear_infinite]" />
        
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(248,200,105,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(248,200,105,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* ✅ NEW — loading state */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gold/30 text-xs tracking-[0.4em] uppercase font-mono animate-pulse">
              Mapping Vector Space...
            </p>
          </div>
        )}

        {/* ✅ CHANGED — now uses normalizedPoints instead of dataPoints
                        uses px/py for position instead of point.x/point.y
                        hover shows real label from your metadata */}
        {!loading && normalizedPoints.map((point) => (
          <div
            key={point.id}
            className="absolute w-1.5 h-1.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-crosshair transition-all duration-200 hover:scale-[4]"
            style={{
              left: `${point.px}%`,
              top: `${point.py}%`,
              backgroundColor: 'rgba(248,200,105,0.5)',
              boxShadow: hoveredPoint === point.id
                ? '0 0 12px rgba(248,200,105,0.9)'
                : '0 0 4px rgba(248,200,105,0.3)',
            }}
            onMouseEnter={() => setHoveredPoint(point.id)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {/* ✅ NEW — tooltip shows real label if available */}
            {hoveredPoint === point.id && point.label && (
              <div className="absolute left-4 top-0 z-10 whitespace-nowrap text-[10px] text-gold tracking-widest bg-black/80 px-2 py-1 border border-gold/30 pointer-events-none">
                {point.label}
              </div>
            )}
          </div>
        ))}

        {/* ✅ NEW — empty state if fetch worked but returned no points */}
        {!loading && normalizedPoints.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gold/20 text-xs tracking-[0.4em] uppercase font-mono">
              No vectors found — is the backend running?
            </p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(1000%); opacity: 0; }
        }
      `}} />
    </motion.div>
  );
}