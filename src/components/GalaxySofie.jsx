/**
 * GalaxySofie.jsx
 * React-Three-Fiber galaxy visualization matching exact vanilla Three.js implementation
 * Original: SOFIE Galactic Core with scatter-to-formation animation
 */

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useAI } from '../context/AIContext';
import * as THREE from 'three';

/**
 * GalaxyCore - The particle system matching original vanilla implementation
 */
function GalaxyCore() {
  const { camera } = useThree();
  const pointsRef = useRef();
  const timeRef = useRef(0);
  const aiStateRef = useRef('forming');
  const spiralSpeedRef = useRef(0.08);
  
  // Generate galaxy data exactly like original
  const particleData = useMemo(() => {
    const data = [];
    const count = 50000;
    
    for (let i = 0; i < count; i++) {
      const arm = i % 3;
      const armAngle = (arm / 3) * Math.PI * 2;
      
      const r = Math.pow(Math.random(), 0.7) * 20;
      const twist = r * 0.4;
      const angle = armAngle + twist + (Math.random() - 0.5) * 0.8;
      
      const thickness = r < 4 ? 2.5 : 0.8;
      const y = (Math.random() - 0.5) * thickness;
      
      const x = r * Math.cos(angle);
      const z = r * Math.sin(angle) * 0.7;
      
      const scatterR = 80 + Math.random() * 50;
      const scatterTheta = Math.random() * Math.PI * 2;
      const scatterPhi = Math.acos(2 * Math.random() - 1);
      
      data.push({
        gx: x, gy: y, gz: z,
        gr: r, gangle: angle,
        
        sx: scatterR * Math.sin(scatterPhi) * Math.cos(scatterTheta),
        sy: scatterR * Math.sin(scatterPhi) * Math.sin(scatterTheta),
        sz: scatterR * Math.cos(scatterPhi),
        
        type: r < 3 ? 'core' : r < 8 ? 'inner' : r < 14 ? 'mid' : 'outer',
        phase: Math.random() * Math.PI * 2
      });
    }
    
    return data;
  }, []);
  
  // Create texture exactly like original
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.2, 'rgba(255,220,255,0.6)');
    grad.addColorStop(0.5, 'rgba(200,100,255,0.2)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);
  
  // Create geometry with initial scatter positions
  const [geometry, palette] = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = particleData.length;
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const palette = {
      core: new THREE.Color(0xffffff),
      inner: new THREE.Color(0xff69b4),
      mid: new THREE.Color(0x9370db),
      outer: new THREE.Color(0x4169e1)
    };
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const p = particleData[i];
      
      // Start in scattered positions
      positions[i3] = p.sx;
      positions[i3 + 1] = p.sy;
      positions[i3 + 2] = p.sz;
      
      const c = palette[p.type];
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
      
      sizes[i] = p.type === 'core' ? 0.6 : p.type === 'inner' ? 0.35 : 0.18;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return [geo, palette];
  }, [particleData]);
  
  // Awaken function (click handler)
  const awaken = () => {
    aiStateRef.current = 'active';
    spiralSpeedRef.current = 0.25;
  };
  
  // Set initial camera position
  useEffect(() => {
    camera.position.set(0, 25, 35);
    camera.lookAt(0, 0, 0);
    
    // Add click listener for awaken
    const handleClick = () => awaken();
    window.addEventListener('click', handleClick);
    
    return () => window.removeEventListener('click', handleClick);
  }, [camera]);
  
  // Animation loop matching original exactly
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    timeRef.current += delta;
    const time = timeRef.current;
    
    const pos = pointsRef.current.geometry.attributes.position.array;
    const count = pos.length / 3;
    
    const formation = Math.min(1, time / 25);
    const rotation = time * spiralSpeedRef.current;
    const pulse = 1 + Math.sin(time * 2) * 0.1;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const p = particleData[i];
      
      const orbitAngle = p.gangle + rotation * (20 / (p.gr + 2));
      const r = p.gr * pulse;
      
      let tx = r * Math.cos(orbitAngle);
      let ty = p.gy + Math.sin(time + p.phase) * 0.3;
      let tz = r * Math.sin(orbitAngle) * 0.7;
      
      // Easing function from original
      let t = formation;
      if (t < 0.3) {
        t = t * t * 3;
      } else if (t < 0.7) {
        t = 0.27 + (t - 0.3) * 1.5;
      } else {
        t = 0.87 + (t - 0.7) * 0.43;
      }
      
      const blend = t * t * (3 - 2 * t);
      
      const x = p.sx * (1 - blend) + tx * blend;
      const y = p.sy * (1 - blend) + ty * blend;
      const z = p.sz * (1 - blend) + tz * blend;
      
      pos[i3] += (x - pos[i3]) * 0.05;
      pos[i3 + 1] += (y - pos[i3 + 1]) * 0.05;
      pos[i3 + 2] += (z - pos[i3 + 2]) * 0.05;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Slow orbit camera movement
    const camAngle = time * 0.02;
    camera.position.x = Math.sin(camAngle) * 5;
    camera.position.z = 35 + Math.cos(camAngle) * 5;
    camera.lookAt(0, 0, 0);
  });
  
  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.35}
        map={texture}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Scene setup
 */
function Scene() {
  return (
    <>
      <color attach="background" args={[0x000208]} />
      <GalaxyCore />
    </>
  );
}

/**
 * StatusOverlay - Shows AI state from context
 */
function StatusOverlay() {
  const { sofieState, currentResponse } = useAI();
  
  return (
    <>
      {/* Response text overlay */}
      {currentResponse && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        max-w-2xl w-full px-6 z-10 pointer-events-none">
          <div className="backdrop-blur-xl bg-slate-900/40 border border-white/10 
                          rounded-2xl p-8 text-center shadow-2xl">
            <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed drop-shadow-lg">
              {currentResponse}
            </p>
          </div>
        </div>
      )}
      
      {/* Status indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 
                      flex gap-4 glassmorphic px-6 py-3 rounded-full z-20">
        {sofieState === 'listening' && <span className="text-rose-400 animate-pulse">● Listening</span>}
        {sofieState === 'processing' && <span className="text-amber-400 animate-spin">⟳ Thinking</span>}
        {sofieState === 'speaking' && <span className="text-violet-400">◉ Speaking</span>}
      </div>
    </>
  );
}

/**
 * Main GalaxySofie component
 */
export default function GalaxySofie() {
  return (
    <div className="w-full h-screen relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 25, 35], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        dpr={window.devicePixelRatio}
      >
        <Scene />
      </Canvas>
      
      <StatusOverlay />
    </div>
  );
}
