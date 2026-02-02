import React, { useRef, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, CameraControls } from '@react-three/drei';
import * as THREE from 'three';
import { GalaxyCore } from '../systems/GalaxyCore';
import { ParticleText } from '../systems/ParticleText';

function Scene({ displayText, animationState, isListening, onVoiceStart, onVoiceEnd }) {
  const { camera, viewport } = useThree();
  const [formationProgress, setFormationProgress] = useState(0);
  const [dissolveProgress, setDissolveProgress] = useState(0);
  const [textParticles, setTextParticles] = useState([]);
  
  // Camera setup
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Subtle camera drift
    camera.position.x = Math.sin(time * 0.1) * 0.5;
    camera.position.y = Math.cos(time * 0.08) * 0.3 + 2;
    camera.lookAt(0, 0, 0);
  });
  
  // Generate text particle positions for galaxy to use
  const generateTextParticles = useCallback((text) => {
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
    
    const step = 6;
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const idx = (y * canvas.width + x) * 4;
        if (pixels[idx] > 128) {
          const nx = (x / canvas.width - 0.5) * 15;
          const ny = -(y / canvas.height - 0.5) * 4 + 3;
          const nz = (Math.random() - 0.5) * 3;
          particles.push({ x: nx, y: ny, z: nz });
        }
      }
    }
    
    return particles.slice(0, 2000);
  }, []);
  
  // Update animation states
  React.useEffect(() => {
    if (animationState === 'forming') {
      const particles = generateTextParticles(displayText);
      setTextParticles(particles);
      
      const duration = 1200;
      const start = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - start;
        const t = Math.min(elapsed / duration, 1);
        setFormationProgress(1 - Math.pow(1 - t, 3));
        if (t < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    } else if (animationState === 'dissolving') {
      const duration = 1500;
      const start = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - start;
        const t = Math.min(elapsed / duration, 1);
        setDissolveProgress(t < 0.5 
          ? 4 * t * t * t 
          : 1 - Math.pow(-2 * t + 2, 3) / 2);
        if (t < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    } else if (animationState === 'idle') {
      setFormationProgress(0);
      setDissolveProgress(0);
      setTextParticles([]);
    }
  }, [animationState, displayText, generateTextParticles]);
  
  return (
    <>
      {/* Background stars */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5}
      />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#9d4edd" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3a0ca3" />
      
      {/* Galaxy core */}
      <GalaxyCore 
        textFormationProgress={formationProgress}
        textDissolveProgress={dissolveProgress}
        textParticles={textParticles}
      />
      
      {/* Particle text overlay */}
      <ParticleText 
        text={displayText}
        animationState={animationState}
      />
      
      {/* Voice interaction zone */}
      <VoiceInteractionZone 
        isListening={isListening}
        onVoiceStart={onVoiceStart}
        onVoiceEnd={onVoiceEnd}
        viewport={viewport}
      />
    </>
  );
}

function VoiceInteractionZone({ isListening, onVoiceStart, onVoiceEnd, viewport }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Pulse animation when listening
    if (isListening) {
      const scale = 1 + Math.sin(time * 8) * 0.1;
      meshRef.current.scale.setScalar(scale);
    } else {
      meshRef.current.scale.setScalar(hovered ? 1.1 : 1);
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={[0, -viewport.height * 0.3, 2]}
      onPointerDown={onVoiceStart}
      onPointerUp={onVoiceEnd}
      onPointerLeave={() => {
        setHovered(false);
        onVoiceEnd();
      }}
      onPointerEnter={() => setHovered(true)}
    >
      <circleGeometry args={[1.5, 32]} />
      <meshBasicMaterial 
        color={isListening ? '#ff0040' : hovered ? '#9d4edd' : '#3a0ca3'} 
        transparent 
        opacity={0.3}
      />
    </mesh>
  );
}

export function GalaxyScene({ displayText, animationState, isListening, onVoiceStart, onVoiceEnd }) {
  return (
    <Canvas
      camera={{ position: [0, 2, 12], fov: 60 }}
      gl={{ 
        antialias: true, 
        alpha: false,
        powerPreference: 'high-performance'
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#000000']} />
      <Scene 
        displayText={displayText}
        animationState={animationState}
        isListening={isListening}
        onVoiceStart={onVoiceStart}
        onVoiceEnd={onVoiceEnd}
      />
    </Canvas>
  );
}
