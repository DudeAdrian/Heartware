// SofieParticleHead.js
// Pure Three.js particle head formation for Sofie onboarding
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SofieParticleHead() {
  const canvasRef = useRef();

  useEffect(() => {
    let animationStarted = false;
    if (!canvasRef.current) {
      document.body.style.background = '#ffb6e6';
      const fallback = document.createElement('div');
      fallback.innerText = 'Canvas not attached. Please check your browser.';
      fallback.style.position = 'fixed';
      fallback.style.top = '40%';
      fallback.style.left = '50%';
      fallback.style.transform = 'translate(-50%, -50%)';
      fallback.style.background = '#fff0fa';
      fallback.style.color = '#d9008d';
      fallback.style.padding = '2rem 3rem';
      fallback.style.fontSize = '2rem';
      fallback.style.zIndex = 9999;
      document.body.appendChild(fallback);
      return;
    }
    if (!window.WebGLRenderingContext) {
      const fallback = document.createElement('div');
      fallback.innerText = 'WebGL not supported. Please use a modern browser.';
      fallback.style.position = 'fixed';
      fallback.style.top = '40%';
      fallback.style.left = '50%';
      fallback.style.transform = 'translate(-50%, -50%)';
      fallback.style.background = '#fff0fa';
      fallback.style.color = '#d9008d';
      fallback.style.padding = '2rem 3rem';
      fallback.style.fontSize = '2rem';
      fallback.style.zIndex = 9999;
      document.body.appendChild(fallback);
      return;
    }
    // === SCENE SETUP ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a23); // fallback background
    const camera = new THREE.PerspectiveCamera(
      60, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.position.z = 120;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });
    renderer.setClearColor(0x0a0a23, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // === PARAMETERS ===
    const PARTICLE_COUNT = 1800; // more for smoothness
    const FORMATION_SPEED = 0.035; // natural speed
    const FLOAT_AMPLITUDE = 8.0;

    // === GEOMETRY ===
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const targets = new Float32Array(PARTICLE_COUNT * 3);

    // === RANDOM START POSITIONS FROM EDGES ===
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Randomly pick an edge: 0=top, 1=bottom, 2=left, 3=right
      const edge = Math.floor(Math.random() * 4);
      let x, y, z;
      if (edge === 0) { // top
        x = (Math.random() - 0.5) * 400;
        y = 200;
        z = (Math.random() - 0.5) * 400;
      } else if (edge === 1) { // bottom
        x = (Math.random() - 0.5) * 400;
        y = -200;
        z = (Math.random() - 0.5) * 400;
      } else if (edge === 2) { // left
        x = -200;
        y = (Math.random() - 0.5) * 400;
        z = (Math.random() - 0.5) * 400;
      } else { // right
        x = 200;
        y = (Math.random() - 0.5) * 400;
        z = (Math.random() - 0.5) * 400;
      }
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    // === HEAD SHAPE TARGET (female face silhouette) ===
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spherical coordinates
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      // Female head: softer jaw, higher cheekbones, smaller chin, fuller lips
      let r = 50;
      // Chin/jaw taper
      if (phi > Math.PI * 0.8) r *= 0.7; // chin
      else if (phi > Math.PI * 0.65) r *= 0.85; // jaw
      // Cheekbones
      if (phi > Math.PI * 0.45 && phi < Math.PI * 0.65) r *= 1.08;
      // Forehead
      if (phi < Math.PI * 0.25) r *= 0.92;
      // Nose bridge
      if (phi > Math.PI * 0.35 && phi < Math.PI * 0.45) r *= 0.95;
      // Lips
      if (phi > Math.PI * 0.7 && Math.abs(theta - Math.PI) < 0.3) r *= 1.12;
      // Add a little noise for organic look
      r += Math.random() * 1.5 - 0.75;
      targets[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      targets[i * 3 + 1] = r * Math.cos(phi) + 32;
      targets[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    console.log('Particle head targets created.');

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));


    // === MATERIAL ===
    // Pink and silver gradient for sand effect
    const colors = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = i / PARTICLE_COUNT;
      // Interpolate between pink and silver
      const pink = [1.0, 0.7, 0.9];
      const silver = [0.85, 0.85, 0.92];
      const r = pink[0] * (1 - t) + silver[0] * t;
      const g = pink[1] * (1 - t) + silver[1] * t;
      const b = pink[2] * (1 - t) + silver[2] * t;
      colors.push(r, g, b);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 4.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Remove debug overlays, sphere, and grid

    // === ANIMATION LOOP ===
    function animate(time) {
      animationStarted = true;
      requestAnimationFrame(animate);
      const pos = geometry.attributes.position.array;
      let forming = false;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        // Animate from random to target (head)
        const dx = targets[ix]     - pos[ix];
        const dy = targets[ix + 1] - pos[ix + 1];
        const dz = targets[ix + 2] - pos[ix + 2];
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1 || Math.abs(dz) > 0.1) forming = true;
        pos[ix]     += dx * FORMATION_SPEED;
        pos[ix + 1] += dy * FORMATION_SPEED;
        pos[ix + 2] += dz * FORMATION_SPEED;
        // Sand-like shimmer
        pos[ix + 1] += Math.sin(time * 0.002 + i) * 0.3;
        pos[ix]     += Math.cos(time * 0.002 + i) * 0.12;
      }
      geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = Math.sin(time * 0.0002) * 0.15;
      particles.position.y = Math.sin(time * 0.001) * FLOAT_AMPLITUDE + 32;
      renderer.render(scene, camera);
      if (time % 1000 < 20) console.log('ANIMATION FRAME RUNNING');
    }
    animate();
    setTimeout(() => {
      if (!animationStarted) {
        const fallback = document.createElement('div');
        fallback.innerText = 'Animation loop did not start. Please check browser GPU/WebGL settings.';
        fallback.style.position = 'fixed';
        fallback.style.top = '50%';
        fallback.style.left = '50%';
        fallback.style.transform = 'translate(-50%, -50%)';
        fallback.style.background = '#fff0fa';
        fallback.style.color = '#d9008d';
        fallback.style.padding = '2rem 3rem';
        fallback.style.fontSize = '2rem';
        fallback.style.zIndex = 9999;
        document.body.appendChild(fallback);
        console.error('Animation loop did not start.');
      }
    }, 2000);

    // === RESIZE ===
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', minHeight: '100vh', background: '#0a0a23', display: 'block', position: 'absolute', top: 0, left: 0, zIndex: 1, border: '3px solid #ffb6e6' }} />
  );
}
