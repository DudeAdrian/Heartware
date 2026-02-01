import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useAI } from '../../context/AIContext';

// Helper: Color palette for spiral arms
const PALETTE = {
  core: new THREE.Color(0xffffff),
  inner: new THREE.Color(0xff69b4),
  mid: new THREE.Color(0x9370db),
  outer: new THREE.Color(0x4169e1)
};

function generateGalaxyData(count = 50000) {
  const data = [];
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
}

function createParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.2, 'rgba(255,220,255,0.6)');
  grad.addColorStop(0.5, 'rgba(200,100,255,0.2)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

const GalaxyVisualization = ({ className }) => {
  const mountRef = useRef();
  const galaxyRef = useRef();
  const { isListening, isProcessing, isSpeaking, startListening } = useAI();
  // Animation state
  const timeRef = useRef(0);
  const formationRef = useRef(0);
  const spiralSpeedRef = useRef(0.08);
  // AI state refs for animation
  const aiStateRef = useRef({ isListening, isProcessing, isSpeaking });
  useEffect(() => {
    aiStateRef.current = { isListening, isProcessing, isSpeaking };
  }, [isListening, isProcessing, isSpeaking]);

  // Responsive resize
  const handleResize = useCallback((renderer, camera) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }, []);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000208);
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 25, 35);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.border = '2px solid #00f';
    renderer.domElement.style.zIndex = '100';
    renderer.domElement.style.background = '#000208';
    mountRef.current.appendChild(renderer.domElement);
    console.log('Galaxy canvas mounted:', renderer.domElement);

    // Galaxy data
    const particleData = generateGalaxyData();
    const count = particleData.length;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const p = particleData[i];
      positions[i3] = p.sx;
      positions[i3 + 1] = p.sy;
      positions[i3 + 2] = p.sz;
      const c = PALETTE[p.type];
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
      sizes[i] = p.type === 'core' ? 0.6 : p.type === 'inner' ? 0.35 : 0.18;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    const material = new THREE.PointsMaterial({
      size: 0.35,
      map: createParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
    galaxyRef.current = { mesh, geometry, material, particleData };

    // Animation loop
    let running = true;
    function animate() {
      if (!running) return;
      timeRef.current += 0.016;
      formationRef.current = Math.min(1, timeRef.current / 25);
      const { isProcessing, isListening, isSpeaking } = aiStateRef.current;
      let contraction = 1;
      if (isListening) contraction = 0.5;
      else if (isSpeaking) contraction = 1.3;
      else contraction = 1;
      spiralSpeedRef.current = isProcessing ? 0.25 : isListening ? 0.15 : isSpeaking ? 0.18 : 0.08;
      const rotation = timeRef.current * spiralSpeedRef.current;
      const pulse = contraction * (1 + Math.sin(timeRef.current * 2) * (isListening ? 0.18 : 0.1));
      const pos = geometry.attributes.position.array;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const p = particleData[i];
        const orbitAngle = p.gangle + rotation * (20 / (p.gr + 2));
        const r = p.gr * pulse;
        let tx = r * Math.cos(orbitAngle);
        let ty = p.gy + Math.sin(timeRef.current + p.phase) * 0.3;
        let tz = r * Math.sin(orbitAngle) * 0.7;
        let t = formationRef.current;
        if (t < 0.3) t = t * t * 3;
        else if (t < 0.7) t = 0.27 + (t - 0.3) * 1.5;
        else t = 0.87 + (t - 0.7) * 0.43;
        const blend = t * t * (3 - 2 * t);
        const x = p.sx * (1 - blend) + tx * blend;
        const y = p.sy * (1 - blend) + ty * blend;
        const z = p.sz * (1 - blend) + tz * blend;
        pos[i3] += (x - pos[i3]) * 0.05;
        pos[i3 + 1] += (y - pos[i3 + 1]) * 0.05;
        pos[i3 + 2] += (z - pos[i3 + 2]) * 0.05;
      }
      geometry.attributes.position.needsUpdate = true;
      const camAngle = timeRef.current * 0.02;
      camera.position.x = Math.sin(camAngle) * 5;
      camera.position.z = 35 + Math.cos(camAngle) * 5;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
    console.log('Galaxy animation loop started');

    const resizeHandler = () => handleResize(renderer, camera);
    window.addEventListener('resize', resizeHandler);

    return () => {
      running = false;
      window.removeEventListener('resize', resizeHandler);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mountRef.current && renderer.domElement)
        mountRef.current.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line
  }, [handleResize]);

  // Click to start listening
  const handleClick = useCallback(() => {
    if (!isListening && !isProcessing && !isSpeaking) startListening();
  }, [isListening, isProcessing, isSpeaking, startListening]);

  // Fallback: check if canvas is mounted
  const [canvasMounted, setCanvasMounted] = React.useState(false);
  useEffect(() => {
    if (mountRef.current && mountRef.current.children.length > 0) {
      setCanvasMounted(true);
    } else {
      setCanvasMounted(false);
    }
  });

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 w-full h-full min-h-screen min-w-full bg-[#000208] z-[100] border-4 border-blue-500 ${className || ''}`}
      aria-label="SOFIE Galactic Core"
    >
      {/* Debug overlay always visible */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: 16,
        background: 'rgba(0,0,0,0.85)',
        color: '#00f',
        padding: '12px 18px',
        borderRadius: '8px',
        zIndex: 200,
        fontSize: '1rem',
        fontWeight: 'bold',
        pointerEvents: 'none',
        maxWidth: '400px',
      }}>
        <div>GalaxyVisualization Debug</div>
        <div>Canvas Mounted: {String(canvasMounted)}</div>
        <div>AI State: {JSON.stringify(aiStateRef.current)}</div>
        <div>Backend: {aiStateRef.current?.backendConnected ? 'Connected' : 'Disconnected'}</div>
      </div>
      {/* Always show AI presence and textbox overlay */}
      <div style={{
        position: 'absolute',
        bottom: 48,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.92)',
        color: '#fff',
        padding: '24px 32px',
        borderRadius: '16px',
        zIndex: 300,
        fontSize: '1.3rem',
        fontWeight: 'bold',
        minWidth: '420px',
        boxShadow: '0 0 32px #00f8',
        textAlign: 'center',
        border: '2px solid #00f',
      }}>
        <div style={{marginBottom: '12px', fontSize: '1.5rem', color: '#00f'}}>SOFIE AI Presence</div>
        {aiStateRef.current?.backendConnected
          ? <>
              <div>Say "Sofie" to activate listening.</div>
              <input type="text" placeholder="Type your message..." style={{width: '90%', padding: '12px', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid #00f', marginTop: '16px'}} />
              <div style={{marginTop: '18px', color: aiStateRef.current?.isListening ? '#0f0' : '#fff'}}>
                {aiStateRef.current?.isListening ? 'Listening...' : 'Idle'}
              </div>
            </>
          : <div style={{color: '#f00', fontWeight: 'bold', fontSize: '1.2rem'}}>
              AI backend disconnected.<br />
              Please start the AI server at <span style={{color:'#0ff'}}>ws://localhost:9200/ws</span>.<br />
              No AI features available.
            </div>
        }
      </div>
      {!canvasMounted && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-red-400 px-8 py-6 rounded shadow-lg text-lg font-bold z-50">
          Galaxy animation failed to mount. Please check your browser and GPU settings.
        </div>
      )}
    </div>
  );
};

export default GalaxyVisualization;
