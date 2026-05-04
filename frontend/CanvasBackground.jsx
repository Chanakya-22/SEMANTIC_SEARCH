import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField({ isSearching }) {
  const ref = useRef();
  
  // Generate random floating particles simulating deep space
  const sphere = useMemo(() => {
    const positions = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;     // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15; // z
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
      
      // Z-axis camera acceleration triggering a warp sequence on search
      const targetZ = isSearching ? 4 : 0;
      ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, targetZ, 0.05);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#f8c869" size={0.015} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

export default function CanvasBackground({ isSearching }) {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <ParticleField isSearching={isSearching} />
    </Canvas>
  );
}