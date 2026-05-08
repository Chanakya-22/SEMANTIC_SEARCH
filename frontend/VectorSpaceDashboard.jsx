import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function VectorSpaceDashboard() {
  // Generate mock vector data for the visualization
  const dataPoints = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      cluster: Math.floor(Math.random() * 4),
      vibe: ["Chaos", "Triumph", "Despair", "Confusion"][Math.floor(Math.random() * 4)]
    }));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-screen flex flex-col items-center justify-center p-12 relative"
    >
      <div className="absolute top-12 left-12">
        <h2 className="text-3xl font-thin tracking-widest text-gold opacity-90 uppercase">Vector Telemetry</h2>
        <p className="text-gold/40 text-xs tracking-[0.3em] uppercase mt-2">2D Projection of 512-Dimensional Space</p>
      </div>

      <div className="w-full max-w-5xl aspect-video border border-gold/20 bg-space/40 backdrop-blur-md relative overflow-hidden group">
        {/* Radar Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gold/50 shadow-[0_0_20px_rgba(248,200,105,0.8)] animate-[scan_4s_linear_infinite]" />
        
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(248,200,105,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(248,200,105,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Vector Points */}
        {dataPoints.map((point) => (
          <div
            key={point.id}
            className="absolute w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-crosshair transition-transform hover:scale-[3] group/point"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              backgroundColor: point.cluster === 0 ? '#f8c869' : 'rgba(248,200,105,0.3)',
              boxShadow: point.cluster === 0 ? '0 0 10px #f8c869' : 'none'
            }}
          >
            <div className="absolute left-4 top-0 opacity-0 group-hover/point:opacity-100 transition-opacity whitespace-nowrap text-[10px] text-gold tracking-widest bg-space px-2 py-1 border border-gold/30">
              [Cluster: {point.vibe}]
            </div>
          </div>
        ))}
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