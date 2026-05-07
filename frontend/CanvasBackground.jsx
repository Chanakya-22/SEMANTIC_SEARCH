import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField({ isSearching, isWarping }) {
  const ref = useRef();
  
  const positions = useMemo(() => {
    const positions = new Float32Array(6000 * 3);
    for (let i = 0; i < 6000; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.cbrt(Math.random()) * 25; 
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi) - 10; 
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 15;
    ref.current.rotation.y -= delta / 20;

    // Camera Dynamics
    if (isWarping) {
      // Violent acceleration for the landing page transition
      state.camera.position.z -= delta * 35;
      ref.current.rotation.z += delta * 8;
    } else if (isSearching) {
      // Standard acceleration while awaiting API results
      state.camera.position.z -= delta * 15;
      ref.current.rotation.z += delta * 2;
    } else {
      // Smooth return to base
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5, 0.05);
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#f8c869" size={0.04} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

export default function CanvasBackground({ isSearching, isWarping }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ParticleField isSearching={isSearching} isWarping={isWarping} />
    </Canvas>
  );
}