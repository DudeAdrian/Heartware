import React, { useState, useCallback } from 'react';
import GalaxyScene from './components/GalaxyScene';
import { useSofieCore } from './core/SofieCore';
import TerratoneModal from './components/TerratoneModal';

export default function App() {
  const [showTerratone, setShowTerratone] = useState(false);
  const { speak, listening, transcript, response, toggleListening } = useSofieCore();

  const handleInteraction = useCallback(() => {
    if (listening) {
      toggleListening();
    } else {
      toggleListening();
    }
  }, [listening, toggleListening]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#000', // Forces black background
      overflow: 'hidden',
      position: 'relative',
      margin: 0,
      padding: 0
    }}>
      {/* Galaxy is Active Component - Must be visible */}
      <GalaxyScene isActive={listening} />
      
      {/* UI Layer */}
      <div style={{
        position: 'absolute',
        top: 24,
        left: 24,
        color: 'rgba(255,255,255,0.6)',
        fontFamily: 'monospace',
        fontSize: '11px',
        letterSpacing: '2px',
        pointerEvents: 'none',
        zIndex: 10,
        lineHeight: 1.6
      }}>
        TERRACARE INTELLIGENCE LAYER v2.0.1<br/>
        SOFIE COGNITIVE CORE: {listening ? 'LISTENING' : 'STANDBY'}<br/>
        HEARTWARE: {listening ? 'EXPANDED' : 'SYNCED'}
      </div>

      {/* Floating Bubble */}
      <button
        onClick={handleInteraction}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#FF1493',
          border: '2px solid rgba(255,255,255,0.3)',
          cursor: 'pointer',
          zIndex: 100,
          outline: 'none',
          animation: listening 
            ? 'pulse-glow 2s ease-in-out infinite, float 6s ease-in-out infinite' 
            : 'float 6s ease-in-out infinite',
          boxShadow: listening 
            ? '0 0 80px #FF1493, 0 0 120px rgba(255,20,147,0.6)' 
            : '0 0 40px rgba(255,20,147,0.4)',
          transition: 'box-shadow 0.5s ease'
        }}
      />

      {/* Text Display */}
      <div style={{
        position: 'absolute',
        bottom: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '600px',
        textAlign: 'center',
        zIndex: 50,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        {transcript && (
          <div style={{ 
            color: 'rgba(255,255,255,0.4)', 
            fontSize: '14px',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.5px',
            fontStyle: 'italic'
          }}>
            "{transcript}"
          </div>
        )}
        
        {response && (
          <div style={{ 
            color: 'rgba(255,255,255,0.95)', 
            fontSize: '18px', 
            lineHeight: 1.6,
            fontFamily: 'system-ui, sans-serif',
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            background: 'rgba(0,0,0,0.6)',
            padding: '24px 32px',
            borderRadius: '16px',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.15)',
            maxWidth: '100%',
            wordWrap: 'break-word'
          }}>
            {response}
          </div>
        )}
      </div>

      {/* Terratone */}
      <button
        onClick={() => setShowTerratone(true)}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          padding: '12px 24px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.7)',
          borderRadius: '24px',
          cursor: 'pointer',
          fontSize: '11px',
          letterSpacing: '2px',
          fontFamily: 'monospace',
          zIndex: 100
        }}
      >
        TERRATONE
      </button>
      
      {showTerratone && <TerratoneModal onClose={() => setShowTerratone(false)} />}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 80px #FF1493, 0 0 120px rgba(255,20,147,0.6); }
          50% { box-shadow: 0 0 100px #FF1493, 0 0 150px rgba(255,20,147,0.8); }
        }
        
        body, html { 
          margin: 0; 
          padding: 0;
          overflow: hidden; 
          background: #000;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}