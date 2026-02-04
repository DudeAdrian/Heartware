/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  HEARTWARE v2.1 - FINAL ULTIMATUM IMPLEMENTATION                          ║
 * ║  Galaxy: ORIGINAL RESTORED FROM GIT                                       ║
 * ║  Wake Word: annyang.js library (proven)                                   ║
 * ║  Button: Big red toggle button (always works)                             ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import GalaxyScene from './components/GalaxyScene';
import { useSofieCore } from './core/SofieCore';
import { useAnnyangWakeWord } from './hooks/useAnnyangWakeWord';
import TerratoneModal from './components/TerratoneModal';
import { SovereignConnectButton } from './web3/TerracareProvider';
import { shortenAddress } from './web3/contracts';

export default function App() {
  const [showTerratone, setShowTerratone] = useState(false);
  const [showSovereignty, setShowSovereignty] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { sendMessage, response, isSpeaking } = useSofieCore();
  
  // annyang wake word + manual button
  const {
    isRecording,
    isSupported,
    transcript: voiceTranscript,
    error: voiceError,
    toggleRecording,
  } = useAnnyangWakeWord({
    onTranscript: (text) => {
      console.log('[App] Sending to AI:', text);
      sendMessage(text);
    },
  });

  const isActive = isRecording || isSpeaking;

  // Sovereignty Dashboard
  if (showSovereignty) {
    return (
      <div style={{
        width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.95)',
        position: 'fixed', top: 0, left: 0, zIndex: 200,
        overflowY: 'auto', color: 'white', padding: '20px'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ color: '#FF1493' }}>Sovereignty Dashboard</h2>
            <button onClick={() => setShowSovereignty(false)} style={{ 
              background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', 
              color: 'white', padding: '10px 20px', borderRadius: '20px'
            }}>Close</button>
          </div>
          
          {isConnected ? (
            <div style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid #00FF88', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontFamily: 'monospace' }}>{shortenAddress(address)}</div>
              <div style={{ color: '#00FF88', fontSize: '12px', marginTop: '8px' }}>● Connected</div>
            </div>
          ) : (
            <SovereignConnectButton />
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw', height: '100vh', background: '#000',
      overflow: 'hidden', position: 'relative', margin: 0, padding: 0
    }}>
      {/* ORIGINAL GALAXY - Restored from git 4a20295 */}
      <GalaxyScene isActive={isActive} />
      
      {/* TOP BAR */}
      <div style={{
        position: 'absolute', top: 24, left: 24, right: 24,
        display: 'flex', justifyContent: 'space-between', zIndex: 10,
      }}>
        <div style={{
          color: isRecording ? '#FF1493' : 'rgba(255,255,255,0.6)',
          fontFamily: 'monospace', fontSize: '11px', letterSpacing: '2px', lineHeight: 1.6
        }}>
          TERRACARE v2.1.0<br/>
          {isRecording ? '🔴 RECORDING' : isSpeaking ? '🟢 SPEAKING' : isSupported ? '⚪ SAY "SOFIE" OR CLICK' : '⚪ CLICK BUTTON TO TALK'}<br/>
          {voiceError && <span style={{ color: '#FF6B6B' }}>⚠️ {voiceError}</span>}
          {isConnected && <span style={{ color: '#00FF88' }}>● LEDGER CONNECTED</span>}
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <SovereignConnectButton />
          <button onClick={() => setShowSovereignty(true)} style={{ 
            background: 'rgba(255,20,147,0.2)', border: '1px solid rgba(255,20,147,0.4)', 
            color: 'white', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
            fontSize: '11px', fontFamily: 'monospace'
          }}>Sovereignty</button>
        </div>
      </div>

      {/* CENTER BUBBLE */}
      <div style={{
        position: 'absolute', left: '50%', top: '45%',
        transform: 'translate(-50%, -50%)',
        width: '80px', height: '80px', borderRadius: '50%',
        backgroundColor: isRecording ? '#FF1493' : 'rgba(255,20,147,0.3)',
        border: `3px solid ${isRecording ? '#FF1493' : 'rgba(255,255,255,0.3)'}`,
        zIndex: 100,
        animation: isActive ? 'pulse 1.5s infinite' : 'none',
        boxShadow: isRecording ? '0 0 60px #FF1493' : '0 0 30px rgba(255,20,147,0.3)',
        transition: 'all 0.3s ease',
      }} />

      {/* BIG RED BUTTON - TOGGLE (RELIABLE) */}
      <button
        onClick={toggleRecording}
        style={{
          position: 'absolute', left: '50%', top: '58%',
          transform: 'translateX(-50%)',
          padding: isRecording ? '24px 48px' : '20px 40px',
          background: isRecording ? '#FF1493' : 'rgba(255,20,147,0.2)',
          border: `4px solid ${isRecording ? '#FF1493' : 'rgba(255,255,255,0.3)'}`,
          color: 'white', borderRadius: '40px', cursor: 'pointer',
          fontSize: '16px', fontWeight: 'bold', letterSpacing: '3px',
          zIndex: 100,
          boxShadow: isRecording ? '0 0 50px #FF1493, 0 0 100px rgba(255,20,147,0.5)' : '0 0 20px rgba(255,20,147,0.2)',
          transition: 'all 0.2s ease',
          minWidth: '300px',
          textTransform: 'uppercase',
        }}
      >
        {isRecording ? '🔴 CLICK TO STOP' : '🎤 CLICK TO TALK'}
      </button>

      {/* WAKE WORD HINT */}
      {isSupported && !voiceError && (
        <div style={{
          position: 'absolute', left: '50%', top: '70%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,217,61,0.8)', fontSize: '12px',
          fontFamily: 'monospace', textAlign: 'center', zIndex: 100,
        }}>
          Or simply say "Sofie"
        </div>
      )}

      {/* VOICE TRANSCRIPT */}
      {(voiceTranscript || response) && (
        <div style={{
          position: 'absolute', bottom: '18%', left: '50%',
          transform: 'translateX(-50%)', width: '90%', maxWidth: '600px',
          textAlign: 'center', zIndex: 50,
          display: 'flex', flexDirection: 'column', gap: '16px'
        }}>
          {voiceTranscript && (
            <div style={{ 
              color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontStyle: 'italic'
            }}>
              "{voiceTranscript}"
            </div>
          )}
          
          {response && (
            <div style={{ 
              color: 'white', fontSize: '18px', lineHeight: 1.6,
              background: 'rgba(0,0,0,0.7)', padding: '24px 32px',
              borderRadius: '16px', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
              {response}
            </div>
          )}
        </div>
      )}

      {/* TEXT INPUT - RELIABLE FALLBACK */}
      <div style={{
        position: 'absolute', bottom: '80px', left: '50%',
        transform: 'translateX(-50%)', width: '90%', maxWidth: '400px',
        zIndex: 100, display: 'flex', gap: '8px',
      }}>
        <input
          type="text"
          placeholder="Type here and press Enter..."
          disabled={isRecording}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              console.log('[App] Text input:', e.target.value);
              sendMessage(e.target.value.trim());
              e.target.value = '';
            }
          }}
          style={{
            flex: 1, background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px', padding: '12px 16px',
            color: 'white', fontSize: '14px', outline: 'none',
            opacity: isRecording ? 0.5 : 1,
          }}
        />
      </div>

      {/* TERRATONE */}
      <button
        onClick={() => setShowTerratone(true)}
        style={{
          position: 'absolute', bottom: 24, right: 24,
          padding: '12px 24px', background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.7)', borderRadius: '24px',
          cursor: 'pointer', fontSize: '11px', letterSpacing: '2px',
          fontFamily: 'monospace', zIndex: 100
        }}
      >
        TERRATONE
      </button>
      
      {showTerratone && <TerratoneModal onClose={() => setShowTerratone(false)} />}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.8; }
        }
        body, html { 
          margin: 0; padding: 0; overflow: hidden; 
          background: #000; width: 100%; height: 100%;
        }
      `}</style>
    </div>
  );
}
