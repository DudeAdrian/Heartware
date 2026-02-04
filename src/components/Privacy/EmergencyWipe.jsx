/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  EMERGENCY WIPE COMPONENT                                                 ║
 * ║  Instant Security Protocol Activation                                     ║
 * ║                                                                           ║
 * ║  PILLAR 5: Black Market Tactics - Poison Pill                             ║
 * ║  - Triple-press Escape to trigger                                         ║
 * ║  - Clears localStorage, session keys, disconnects wallet                  ║
 * ║  - Broadcasts "Sacred Revocation" to Ledger                               ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDisconnect } from 'wagmi';

const ESCAPE_PRESS_THRESHOLD = 3;
const ESCAPE_PRESS_WINDOW = 1000; // 1 second

export function EmergencyWipe({ onWipe }) {
  const { disconnect } = useDisconnect();
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const escapePresses = useRef([]);
  const wipeTimeoutRef = useRef(null);

  const performWipe = useCallback(async () => {
    console.log('[Heartware] 🚨 EMERGENCY WIPE INITIATED');
    
    // Clear all local storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear IndexedDB (if used)
    const databases = await window.indexedDB?.databases?.() || [];
    databases.forEach(db => {
      window.indexedDB.deleteDatabase(db.name);
    });
    
    // Disconnect wallet
    disconnect();
    
    // Broadcast revocation to Ledger
    window.dispatchEvent(new CustomEvent('heartware-sacred-revocation', {
      detail: { 
        timestamp: Date.now(),
        reason: 'Emergency wipe triggered',
      },
    }));
    
    // Call optional callback
    onWipe?.();
    
    // Reload page after brief delay
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }, [disconnect, onWipe]);

  const handleKeyDown = useCallback((e) => {
    if (e.key !== 'Escape') return;
    
    const now = Date.now();
    escapePresses.current = escapePresses.current.filter(
      time => now - time < ESCAPE_PRESS_WINDOW
    );
    escapePresses.current.push(now);
    
    if (escapePresses.current.length >= ESCAPE_PRESS_THRESHOLD) {
      // Reset and trigger countdown
      escapePresses.current = [];
      setIsActive(true);
      
      // Countdown before actual wipe
      let count = 3;
      setCountdown(count);
      
      wipeTimeoutRef.current = setInterval(() => {
        count--;
        setCountdown(count);
        
        if (count <= 0) {
          clearInterval(wipeTimeoutRef.current);
          performWipe();
        }
      }, 1000);
    }
  }, [performWipe]);

  // Cancel wipe
  const cancelWipe = useCallback(() => {
    clearInterval(wipeTimeoutRef.current);
    setIsActive(false);
    setCountdown(3);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(wipeTimeoutRef.current);
    };
  }, [handleKeyDown]);

  if (!isActive) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'monospace',
      }}
    >
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: '4px solid #FF1493',
          borderTopColor: 'transparent',
          animation: 'spin 1s linear infinite',
          marginBottom: '30px',
        }}
      />
      
      <h2 style={{ 
        color: '#FF1493', 
        margin: '0 0 20px 0',
        fontSize: '24px',
        textTransform: 'uppercase',
        letterSpacing: '4px',
      }}>
        ⚠ Sacred Revocation
      </h2>
      
      <p style={{ 
        opacity: 0.8, 
        marginBottom: '10px',
        fontSize: '14px',
      }}>
        Emergency wipe in {countdown} seconds...
      </p>
      
      <p style={{ 
        opacity: 0.5, 
        fontSize: '12px',
        marginBottom: '30px',
      }}>
        All session data will be purged
      </p>
      
      <button
        onClick={cancelWipe}
        style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: '12px',
          letterSpacing: '2px',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = '#FF1493';
          e.target.style.color = '#FF1493';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'rgba(255,255,255,0.3)';
          e.target.style.color = 'white';
        }}
      >
        ABORT WIPE
      </button>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default EmergencyWipe;
