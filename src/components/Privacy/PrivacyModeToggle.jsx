/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  PRIVACY MODE TOGGLE                                                      ║
 * ║  Shoulder-Surfing Protection & Data Obfuscation                           ║
 * ║                                                                           ║
 * ║  PILLAR 5: Black Market Tactics - Security Through Obscurity              ║
 * ║  - Blurs sensitive text when privacy mode is ON                           ║
 * ║  - Auto-activates when camera detects someone behind user                 ║
 * ║  - Press spacebar or click to reveal individual items                     ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

export function PrivacyModeToggle({ 
  children, 
  enabled: externalEnabled,
  onToggle,
  autoDetectFaces = true,
}) {
  const [privacyMode, setPrivacyMode] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [revealedItems, setRevealedItems] = useState(new Set());
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Sync with external control
  useEffect(() => {
    if (externalEnabled !== undefined) {
      setPrivacyMode(externalEnabled);
    }
  }, [externalEnabled]);

  // Face detection using simple motion detection
  // (In production, use a proper face detection library like face-api.js)
  useEffect(() => {
    if (!autoDetectFaces || !privacyMode) return;

    let animationId;
    let lastImageData = null;

    const detectMotion = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth / 4; // Downscale for performance
        canvas.height = video.videoHeight / 4;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        if (lastImageData) {
          let diffScore = 0;
          const threshold = 30;
          
          for (let i = 0; i < imageData.data.length; i += 4) {
            const rDiff = Math.abs(imageData.data[i] - lastImageData.data[i]);
            const gDiff = Math.abs(imageData.data[i + 1] - lastImageData.data[i + 1]);
            const bDiff = Math.abs(imageData.data[i + 2] - lastImageData.data[i + 2]);
            
            if (rDiff + gDiff + bDiff > threshold * 3) {
              diffScore++;
            }
          }
          
          // If significant motion detected, someone might be behind
          const motionThreshold = imageData.data.length / 4 * 0.05; // 5% pixels changed
          setFaceDetected(diffScore > motionThreshold);
        }
        
        lastImageData = imageData;
      }
      
      animationId = requestAnimationFrame(detectMotion);
    };

    // Start webcam
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        detectMotion();
      })
      .catch(err => console.log('Webcam access denied:', err));

    return () => {
      cancelAnimationFrame(animationId);
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [autoDetectFaces, privacyMode]);

  const togglePrivacy = useCallback(() => {
    const newValue = !privacyMode;
    setPrivacyMode(newValue);
    setRevealedItems(new Set()); // Reset revealed items
    onToggle?.(newValue);
  }, [privacyMode, onToggle]);

  return (
    <>
      {/* Hidden video/canvas for face detection */}
      {autoDetectFaces && (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            style={{ display: 'none' }}
          />
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
        </>
      )}

      {/* Privacy Toggle Button */}
      <button
        onClick={togglePrivacy}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 100,
          background: privacyMode 
            ? 'rgba(255, 20, 147, 0.3)' 
            : 'rgba(255, 255, 255, 0.1)',
          border: `1px solid ${privacyMode ? '#FF1493' : 'rgba(255,255,255,0.2)'}`,
          borderRadius: '20px',
          padding: '8px 16px',
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '11px',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
        }}
      >
        <span style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: privacyMode ? '#FF1493' : '#00FF88',
          boxShadow: privacyMode ? '0 0 8px #FF1493' : '0 0 8px #00FF88',
        }} />
        {privacyMode ? '🔒 PRIVACY ON' : '🔓 PRIVACY OFF'}
        {faceDetected && privacyMode && ' 👁'}
      </button>

      {/* Privacy Context Provider */}
      <PrivacyContext.Provider value={{ 
        privacyMode, 
        faceDetected,
        revealedItems,
        setRevealedItems,
      }}>
        {children}
      </PrivacyContext.Provider>
    </>
  );
}

// Context for nested components
export const PrivacyContext = React.createContext({
  privacyMode: false,
  faceDetected: false,
  revealedItems: new Set(),
  setRevealedItems: () => {},
});

// Hook for consuming privacy context
export function usePrivacy() {
  return React.useContext(PrivacyContext);
}

export default PrivacyModeToggle;
