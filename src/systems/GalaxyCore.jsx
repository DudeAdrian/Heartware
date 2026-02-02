import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 5000;
const GALAXY_RADIUS = 10;
const SPIRAL_ARMS = 3;
const SPIRAL_TURNS = 2;

export function GalaxyCore({ textFormationProgress = 0, textDissolveProgress = 0, textParticles = [] }) {
  const meshRef = useRef();
  const pulseRef = useRef(0);
  
  // Generate galaxy particle positions using Fibonacci spiral
  const { positions, colors, originalPositions, spiralIndices } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const origPos = new Float32Array(PARTICLE_COUNT * 3);
    const spiralIdx = new Int32Array(PARTICLE_COUNT);
    
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Fibonacci sphere distribution for core
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      
      // Spiral galaxy transformation
      const armIndex = i % SPIRAL_ARMS;
      const armOffset = (armIndex / SPIRAL_ARMS) * Math.PI * 2;
      const distanceFromCenter = Math.pow(i / PARTICLE_COUNT, 0.7) * GALAXY_RADIUS;
      
      // Spiral curve
      const spiralAngle = distanceFromCenter * 0.5 * SPIRAL_TURNS + armOffset;
      
      // Elliptical distribution
      const x = Math.cos(spiralAngle) * distanceFromCenter * (0.8 + Math.random() * 0.4);
      const z = Math.sin(spiralAngle) * distanceFromCenter * 0.6 * (0.8 + Math.random() * 0.4);
      const yPos = (Math.random() - 0.5) * distanceFromCenter * 0.2;
      
      const idx = i * 3;
      pos[idx] = x;
      pos[idx + 1] = yPos;
      pos[idx + 2] = z;
      
      origPos[idx] = x;
      origPos[idx + 1] = yPos;
      origPos[idx + 2] = z;
      
      spiralIdx[i] = armIndex;
      
      // Color gradient: core white-hot → mid purple → edge blue
      const distRatio = distanceFromCenter / GALAXY_RADIUS;
      if (distRatio < 0.2) {
        // Core: white-hot
        col[idx] = 1;
        col[idx + 1] = 1;
        col[idx + 2] = 1;
      } else if (distRatio < 0.6) {
        // Mid: purple
        const t = (distRatio - 0.2) / 0.4;
        col[idx] = 0.615 * (1 - t) + 0.227 * t;
        col[idx + 1] = 0.302 * (1 - t) + 0.047 * t;
        col[idx + 2] = 0.867 * (1 - t) + 0.639 * t;
      } else {
        // Edge: deep blue
        col[idx] = 0.227;
        col[idx + 1] = 0.047;
        col[idx + 2] = 0.639;
      }
    }
    
    return { positions: pos, colors: col, originalPositions: origPos, spiralIndices: spiralIdx };
  }, []);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positions = meshRef.current.geometry.attributes.position.array;
    
    // Gentle rotation
    meshRef.current.rotation.y += 0.001;
    
    // Breathing pulse
    pulseRef.current = Math.sin(time * 0.5) * 0.02 + 1;
    meshRef.current.scale.setScalar(pulseRef.current);
    
    // Text formation animation
    if (textFormationProgress > 0 && textParticles.length > 0) {
      for (let i = 0; i < Math.min(textParticles.length, PARTICLE_COUNT); i++) {
        const tp = textParticles[i];
        if (!tp) continue;
        
        const idx = i * 3;
        const t = textFormationProgress;
        
        // Bezier curve interpolation: Galaxy → Top-center
        const startX = originalPositions[idx];
        const startY = originalPositions[idx + 1];
        const startZ = originalPositions[idx + 2];
        
        // Control point: up and forward
        const cpX = startX * 0.3;
        const cpY = 5;
        const cpZ = startZ * 0.3 + 5;
        
        // Target: text position
        const endX = tp.x;
        const endY = tp.y;
        const endZ = tp.z;
        
        // Quadratic bezier
        const invT = 1 - t;
        positions[idx] = invT * invT * startX + 2 * invT * t * cpX + t * t * endX;
        positions[idx + 1] = invT * invT * startY + 2 * invT * t * cpY + t * t * endY;
        positions[idx + 2] = invT * invT * startZ + 2 * invT * t * cpZ + t * t * endZ;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Text dissolve animation (return to galaxy)
    if (textDissolveProgress > 0 && textParticles.length > 0) {
      for (let i = 0; i < Math.min(textParticles.length, PARTICLE_COUNT); i++) {
        const tp = textParticles[i];
        if (!tp) continue;
        
        const idx = i * 3;
        const t = textDissolveProgress;
        
        // Bezier: Text position → Right → Galaxy center
        const startX = tp.x;
        const startY = tp.y;
        const startZ = tp.z;
        
        // Control point: sweep to right then back
        const cpX = 8;
        const cpY = 2;
        const cpZ = 5;
        
        // Target: original galaxy position
        const endX = originalPositions[idx];
        const endY = originalPositions[idx + 1];
        const endZ = originalPositions[idx + 2];
        
        const invT = 1 - t;
        positions[idx] = invT * invT * startX + 2 * invT * t * cpX + t * t * endX;
        positions[idx + 1] = invT * invT * startY + 2 * invT * t * cpY + t * t * endY;
        positions[idx + 2] = invT * invT * startZ + 2 * invT * t * cpZ + t * t * endZ;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
