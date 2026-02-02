import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GalaxyScene({ status }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const frameIdRef = useRef(null);
  const particleDataRef = useRef([]);
  const timeRef = useRef(0);
  const speedRef = useRef(0.08);

  useEffect(() => {
    if (status === 'thinking') speedRef.current = 0.25;
    else if (status === 'speaking') speedRef.current = 0.15;
    else speedRef.current = 0.08;
  }, [status]);

  useEffect(() => {
    if (!mountRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000208);
    
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0, 25, 35);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const count = 50000;
    const data = [];
    
    for(let i = 0; i < count; i++) {
      const arm = i % 3;
      const armAngle = (arm / 3) * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.7) * 20;
      const twist = r * 0.4;
      const angle = armAngle + twist + (Math.random()-0.5)*0.8;
      const thickness = r < 4 ? 2.5 : 0.8;
      
      const scatterR = 80 + Math.random() * 50;
      const scatterTheta = Math.random() * Math.PI * 2;
      const scatterPhi = Math.acos(2*Math.random()-1);
      
      data.push({
        gx: r * Math.cos(angle),
        gy: (Math.random()-0.5) * thickness,
        gz: r * Math.sin(angle) * 0.7,
        gr: r,
        gangle: angle,
        sx: scatterR * Math.sin(scatterPhi) * Math.cos(scatterTheta),
        sy: scatterR * Math.sin(scatterPhi) * Math.sin(scatterTheta),
        sz: scatterR * Math.cos(scatterPhi),
        type: r < 3 ? 'core' : r < 8 ? 'inner' : r < 14 ? 'mid' : 'outer',
        phase: Math.random() * Math.PI * 2
      });
    }
    particleDataRef.current = data;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128,128,0,128,128,128);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.2, 'rgba(255,220,255,0.6)');
    grad.addColorStop(0.5, 'rgba(200,100,255,0.2)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,256,256);
    
    const palette = {
      core: new THREE.Color(0xffffff),
      inner: new THREE.Color(0xff69b4),
      mid: new THREE.Color(0x9370db),
      outer: new THREE.Color(0x4169e1)
    };
    
    for(let i = 0; i < count; i++) {
      const i3 = i * 3;
      const p = data[i];
      positions[i3] = p.sx;
      positions[i3+1] = p.sy;
      positions[i3+2] = p.sz;
      
      const c = palette[p.type];
      colors[i3] = c.r;
      colors[i3+1] = c.g;
      colors[i3+2] = c.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.35,
      map: new THREE.CanvasTexture(canvas),
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
    
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      timeRef.current += 0.016;
      
      const t = timeRef.current;
      const pos = mesh.geometry.attributes.position.array;
      const pData = particleDataRef.current;
      const formation = Math.min(1, t / 25);
      const rotation = t * speedRef.current;
      const pulse = 1 + Math.sin(t * 2) * 0.1;
      
      for(let i = 0; i < count; i++) {
        const i3 = i * 3;
        const p = pData[i];
        
        const orbitAngle = p.gangle + rotation * (20 / (p.gr + 2));
        const r = p.gr * pulse;
        
        let tx = r * Math.cos(orbitAngle);
        let ty = p.gy + Math.sin(t + p.phase) * 0.3;
        let tz = r * Math.sin(orbitAngle) * 0.7;
        
        if ((status === 'thinking' || status === 'speaking') && i < 3000) {
          ty += 15 + Math.sin(t * 2 + p.phase) * 5;
        }
        
        let blend;
        if(formation < 0.3) blend = formation * formation * 3;
        else if(formation < 0.7) blend = 0.27 + (formation - 0.3) * 1.5;
        else blend = 0.87 + (formation - 0.7) * 0.43;
        blend = blend * blend * (3 - 2*blend);
        
        pos[i3] += (p.sx * (1-blend) + tx * blend - pos[i3]) * 0.05;
        pos[i3+1] += (p.sy * (1-blend) + ty * blend - pos[i3+1]) * 0.05;
        pos[i3+2] += (p.sz * (1-blend) + tz * blend - pos[i3+2]) * 0.05;
      }
      
      mesh.geometry.attributes.position.needsUpdate = true;
      camera.position.x = Math.sin(t * 0.02) * 5;
      camera.position.z = 35 + Math.cos(t * 0.02) * 5;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [status]);

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      background: '#000208', 
      overflow: 'hidden',
      zIndex: 0 
    }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}