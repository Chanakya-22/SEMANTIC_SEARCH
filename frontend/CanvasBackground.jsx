import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField({ isSearching, isWarping, confidence }) {
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
    // Reactive Physics: If confidence is high (> 80%), speed up the ambient rotation
    const baseSpeed = confidence > 0.8 ? 5 : 15;
    
    ref.current.rotation.x -= delta / baseSpeed;
    ref.current.rotation.y -= delta / (baseSpeed + 5);

    if (isWarping) {
      state.camera.position.z -= delta * 35;
      ref.current.rotation.z += delta * 8;
    } else if (isSearching) {
      state.camera.position.z -= delta * 15;
      ref.current.rotation.z += delta * 2;
    } else {
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5, 0.05);
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      {/* Dynamic color intensity based on confidence */}
      <PointMaterial 
        transparent 
        color={confidence > 0.8 ? "#ffffff" : "#f8c869"} 
        size={confidence > 0.8 ? 0.06 : 0.04} 
        sizeAttenuation={true} 
        depthWrite={false} 
      />
    </Points>
  );
}

export default function CanvasBackground({ isSearching, isWarping, confidence }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ParticleField isSearching={isSearching} isWarping={isWarping} confidence={confidence} />
    </Canvas>
  );
}