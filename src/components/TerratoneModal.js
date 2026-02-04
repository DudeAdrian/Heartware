/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  TERRATONE MODAL - FREQUENCY GENERATOR                                    ║
 * ║  Phase 5 Enhancement: Ledger Session Anchoring                            ║
 * ║                                                                           ║
 * ║  PRESERVED: Manual toggle, Galaxy background integration                  ║
 * ║  ADDED: Session anchoring to Terracare Ledger                             ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { CONTRACTS, SYSTEM_HASHES } from '../web3/contracts';

const FREQUENCIES = [
  { hz: 528, name: 'Love & DNA Repair', emoji: '💚', color: '#00FF88' },
  { hz: 432, name: 'Natural Harmony', emoji: '🎵', color: '#4ECDC4' },
  { hz: 639, name: 'Connection & Heart', emoji: '❤️', color: '#FF1493' },
  { hz: 741, name: 'Expression & Intuition', emoji: '🔮', color: '#9370DB' },
  { hz: 852, name: 'Spiritual Order', emoji: '✨', color: '#FFD93D' },
];

export default function TerratoneModal({ onClose }) {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  
  // Session state
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState(FREQUENCIES[0]);
  const [sessionStart, setSessionStart] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [lastSessionHash, setLastSessionHash] = useState(null);
  
  // Audio context ref
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const intervalRef = useRef(null);

  // Format duration for display
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start audio playback
  const startPlayback = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = selectedFreq.hz;
    
    gain.gain.value = 0.1; // Low volume for safety
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    oscillatorRef.current = osc;
    gainNodeRef.current = gain;

    // Fade in
    gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.5);
  }, [selectedFreq]);

  // Stop audio playback
  const stopPlayback = useCallback(() => {
    if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
      // Fade out
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.5);
      setTimeout(() => {
        oscillatorRef.current?.stop();
        oscillatorRef.current?.disconnect();
        gainNodeRef.current?.disconnect();
      }, 500);
    }
  }, []);

  // Toggle playback
  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback();
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    } else {
      startPlayback();
      setIsPlaying(true);
      setSessionStart(Date.now());
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
  };

  // Change frequency while playing
  useEffect(() => {
    if (isPlaying && oscillatorRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(
        selectedFreq.hz, 
        audioContextRef.current.currentTime
      );
    }
  }, [selectedFreq, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
      clearInterval(intervalRef.current);
      audioContextRef.current?.close();
    };
  }, [stopPlayback]);

  // Anchor session to Ledger
  const anchorSession = async () => {
    if (!isConnected || sessionDuration < 10) return;
    
    setIsAnchoring(true);
    
    try {
      // Generate session hash
      const sessionHash = `0x${Buffer.from(
        `${address}-${sessionStart}-${selectedFreq.hz}`
      ).toString('hex').padEnd(64, '0').slice(0, 64)}`;
      
      await writeContract({
        address: CONTRACTS.TerratoneAdapter.address,
        abi: CONTRACTS.TerratoneAdapter.abi,
        functionName: 'logSession',
        args: [sessionDuration, selectedFreq.hz, sessionHash],
      });
      
      setLastSessionHash(sessionHash);
      
      // Dispatch event for Galaxy visualization
      window.dispatchEvent(new CustomEvent('heartware-session-anchored', {
        detail: { 
          frequency: selectedFreq.hz, 
          duration: sessionDuration,
          hash: sessionHash,
        },
      }));
    } catch (err) {
      console.error('Failed to anchor session:', err);
    } finally {
      setIsAnchoring(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(26,26,46,0.95) 0%, rgba(22,33,62,0.95) 100%)',
        padding: '40px',
        borderRadius: '24px',
        border: `1px solid ${isPlaying ? selectedFreq.color : '#FF1493'}`,
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center',
        color: 'white',
        boxShadow: isPlaying ? `0 0 60px ${selectedFreq.color}30` : '0 0 40px rgba(255,20,147,0.2)',
        transition: 'all 0.3s ease',
      }}>
        {/* Header */}
        <h2 style={{ 
          color: isPlaying ? selectedFreq.color : '#FF1493', 
          marginBottom: '8px',
          fontSize: '24px',
        }}>
          🎵 Terratone Generator
        </h2>
        <p style={{ opacity: 0.6, marginBottom: '30px', fontSize: '13px' }}>
          Solfeggio frequency healing protocols
        </p>

        {/* Frequency Selection */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
          marginBottom: '30px',
        }}>
          {FREQUENCIES.map((freq) => (
            <button
              key={freq.hz}
              onClick={() => !isPlaying && setSelectedFreq(freq)}
              disabled={isPlaying}
              style={{
                background: selectedFreq.hz === freq.hz 
                  ? `${freq.color}30` 
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${selectedFreq.hz === freq.hz ? freq.color : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px',
                padding: '12px 4px',
                cursor: isPlaying ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isPlaying && selectedFreq.hz !== freq.hz ? 0.3 : 1,
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>{freq.emoji}</div>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 'bold',
                color: selectedFreq.hz === freq.hz ? freq.color : 'white',
              }}>
                {freq.hz}Hz
              </div>
            </button>
          ))}
        </div>

        {/* Selected Frequency Info */}
        <div style={{
          background: `${selectedFreq.color}10`,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>{selectedFreq.emoji}</div>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
            {selectedFreq.name}
          </div>
          <div style={{ fontSize: '14px', color: selectedFreq.color }}>
            {selectedFreq.hz} Hz
          </div>
        </div>

        {/* Session Timer */}
        {isPlaying && (
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
          }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
              Session Duration
            </div>
            <div style={{ 
              fontSize: '36px', 
              fontFamily: 'monospace',
              color: selectedFreq.color,
              fontWeight: 'bold',
            }}>
              {formatDuration(sessionDuration)}
            </div>
          </div>
        )}

        {/* Play Button */}
        <button
          onClick={togglePlayback}
          style={{
            width: '100%',
            background: isPlaying ? 'rgba(255,0,0,0.2)' : selectedFreq.color,
            border: isPlaying ? '1px solid rgba(255,0,0,0.5)' : 'none',
            padding: '16px',
            borderRadius: '14px',
            color: isPlaying ? '#FF6B6B' : 'white',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '20px' }}>{isPlaying ? '⏹' : '▶️'}</span>
          {isPlaying ? 'Stop Session' : 'Begin Frequency Session'}
        </button>

        {/* Anchor Session Button (Phase 5 Addition) */}
        {sessionDuration >= 10 && (
          <button
            onClick={anchorSession}
            disabled={isAnchoring || isPending || !isConnected}
            style={{
              width: '100%',
              background: lastSessionHash ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.1)',
              border: `1px solid ${lastSessionHash ? '#00FF88' : 'rgba(255,255,255,0.2)'}`,
              padding: '14px',
              borderRadius: '14px',
              color: lastSessionHash ? '#00FF88' : 'white',
              cursor: (isAnchoring || isPending || !isConnected) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              marginBottom: '16px',
              opacity: (isAnchoring || isPending) ? 0.5 : 1,
            }}
          >
            {isAnchoring || isPending ? (
              <span>🔗 Anchoring to Ledger...</span>
            ) : lastSessionHash ? (
              <span>✓ Anchored on Ledger</span>
            ) : (
              <span>🔗 Anchor Session to Ledger</span>
            )}
          </button>
        )}

        {/* Ledger Status */}
        {isConnected && sessionDuration >= 10 && !lastSessionHash && (
          <p style={{ 
            margin: '0 0 16px 0', 
            fontSize: '11px', 
            color: 'rgba(255,255,255,0.4)',
          }}>
            This {selectedFreq.hz}Hz session will be part of your permanent health record
          </p>
        )}

        {/* Close Button */}
        <button
          onClick={() => {
            if (isPlaying) togglePlayback();
            onClose();
          }}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '12px 24px',
            borderRadius: '20px',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
