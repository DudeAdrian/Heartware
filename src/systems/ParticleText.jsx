import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLES_PER_LETTER = 150;
const TEXT_DEPTH = 2;

export function ParticleText({ text, animationState, onFormationComplete, onDissolveComplete }) {
  const groupRef = useRef();
  const [formationProgress, setFormationProgress] = useState(0);
  const [dissolveProgress, setDissolveProgress] = useState(0);
  const { viewport } = useThree();
  
  // Generate text particle positions
  const textParticles = useMemo(() => {
    if (!text) return [];
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 256;
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 80px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const particles = [];
    
    // Sample pixels to create particle positions
    const step = 4;
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const idx = (y * canvas.width + x) * 4;
        if (pixels[idx] > 128) {
          // Normalize to viewport coordinates
          const nx = (x / canvas.width - 0.5) * viewport.width * 0.8;
          const ny = -(y / canvas.height - 0.5) * viewport.height * 0.3 + 2;
          const nz = (Math.random() - 0.5) * TEXT_DEPTH;
          
          particles.push({ x: nx, y: ny, z: nz });
        }
      }
    }
    
    // Limit particles
    return particles.slice(0, 2000);
  }, [text, viewport]);
  
  // Animation states
  useEffect(() => {
    if (animationState === 'forming') {
      setFormationProgress(0);
      setDissolveProgress(0);
      
      const duration = 1000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing: ease-out-cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setFormationProgress(eased);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          onFormationComplete?.();
        }
      };
      
      requestAnimationFrame(animate);
    }
    
    if (animationState === 'dissolving') {
      const duration = 1500;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing: ease-in-out-cubic
        const eased = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        setDissolveProgress(eased);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          onDissolveComplete?.();
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [animationState, onFormationComplete, onDissolveComplete]);
  
  if (!text || textParticles.length === 0) return null;
  
  return (
    <group ref={groupRef}>
      <TextParticles 
        particles={textParticles} 
        formationProgress={formationProgress}
        dissolveProgress={dissolveProgress}
        visible={animationState !== 'idle'}
      />
    </group>
  );
}

function TextParticles({ particles, formationProgress, dissolveProgress, visible }) {
  const meshRef = useRef();
  const count = particles.length;
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      col[idx] = 0.9;
      col[idx + 1] = 0.9;
      col[idx + 2] = 1;
    }
    
    return { positions: pos, colors: col };
  }, [count]);
  
  useFrame(() => {
    if (!meshRef.current || !visible) return;
    
    const pos = meshRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const p = particles[i];
      
      // Subtle glow animation
      const time = Date.now() * 0.001;
      const glow = Math.sin(time + i * 0.1) * 0.1 + 0.9;
      
      pos[idx] = p.x + (Math.random() - 0.5) * 0.02 * glow;
      pos[idx + 1] = p.y + (Math.random() - 0.5) * 0.02 * glow;
      pos[idx + 2] = p.z;
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  if (!visible) return null;
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={Math.max(0, 1 - dissolveProgress * 0.5)}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
