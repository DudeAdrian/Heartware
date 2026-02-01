/**
 * AIStatusBar.jsx
 * Persistent bottom bar showing connection status and quick controls
 * Integrates with AIContext for real-time state display
 * 
 * Features:
 * - Connection indicator (red/yellow/green)
 * - "Talk to Sofie" button
 * - Interrupt button (visible when speaking)
 * - Biometric quick view
 * - Glassmorphic styling consistent with Heartware theme
 */

import React from 'react';
import { useAI } from '../context/AIContext';
import { GlassCard } from '../theme/GlassmorphismTheme';

/**
 * ConnectionIndicator - Shows bridge connection status
 */
function ConnectionIndicator({ status }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
      case 'authenticated':
        return {
          color: 'bg-emerald-400',
          pulse: false,
          label: 'Connected'
        };
      case 'connecting':
        return {
          color: 'bg-amber-400',
          pulse: true,
          label: 'Connecting...'
        };
      case 'connected':
        return {
          color: 'bg-yellow-400',
          pulse: true,
          label: 'Authenticating...'
        };
      default:
        return {
          color: 'bg-rose-400',
          pulse: true,
          label: 'Offline'
        };
    }
  };
  
  const config = getStatusConfig();
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
      <span className="text-xs text-slate-400 hidden sm:inline">{config.label}</span>
    </div>
  );
}

/**
 * SofieStateBadge - Shows current AI state
 */
function SofieStateBadge({ state }) {
  const getStateConfig = () => {
    switch (state) {
      case 'listening':
        return {
          icon: '🎤',
          text: 'Listening',
          className: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
        };
      case 'processing':
        return {
          icon: '⚡',
          text: 'Thinking',
          className: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        };
      case 'speaking':
        return {
          icon: '🔊',
          text: 'Speaking',
          className: 'bg-violet-500/20 text-violet-300 border-violet-500/30'
        };
      case 'entrainment':
        return {
          icon: '💫',
          text: 'Entraining',
          className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        };
      default:
        return {
          icon: '✨',
          text: 'Sofie',
          className: 'bg-slate-500/20 text-slate-300 border-slate-500/30'
        };
    }
  };
  
  const config = getStateConfig();
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <span className="mr-1">{config.icon}</span>
      <span className="hidden sm:inline">{config.text}</span>
    </span>
  );
}

/**
 * BiometricQuickView - Shows heart rate if available
 */
function BiometricQuickView({ biometrics }) {
  if (!biometrics?.pulseRate) {
    return null;
  }
  
  const getEmotionColor = (valence) => {
    switch (valence) {
      case 'anxious': return 'text-rose-400';
      case 'calm': return 'text-emerald-400';
      case 'focused': return 'text-sky-400';
      default: return 'text-slate-400';
    }
  };
  
  const heartRate = Math.round(biometrics.pulseRate);
  const isRecent = biometrics.timestamp && (Date.now() - biometrics.timestamp) < 30000;
  
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5">
      <span className={`text-xs ${isRecent ? 'animate-pulse' : ''}`}>♥</span>
      <span className="text-xs font-medium text-slate-300">{heartRate}</span>
      <span className="text-xs text-slate-500">BPM</span>
      {biometrics.emotionalValence && (
        <span className={`text-xs ${getEmotionColor(biometrics.emotionalValence)} hidden sm:inline`}>
          • {biometrics.emotionalValence}
        </span>
      )}
    </div>
  );
}

/**
 * TalkButton - Primary action button
 */
function TalkButton({ onClick, disabled, isListening }) {
  const handleClick = (e) => {
    console.log('[TalkButton] Clicked, disabled:', disabled, 'isListening:', isListening);
    onClick(e);
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
        transition-all duration-200 transform hover:scale-105 active:scale-95
        ${isListening 
          ? 'bg-rose-500/30 text-rose-200 border border-rose-500/50 animate-pulse' 
          : 'bg-gradient-to-r from-violet-500/30 to-purple-500/30 text-violet-100 border border-violet-500/30 hover:bg-violet-500/40'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {isListening ? (
        <>
          <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <span>Talk to Sofie</span>
        </>
      )}
    </button>
  );
}

/**
 * InterruptButton - Stop AI speaking
 */
function InterruptButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
                 bg-rose-500/30 text-rose-200 border border-rose-500/50
                 hover:bg-rose-500/50 transition-all duration-200
                 animate-in fade-in slide-in-from-bottom-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      <span>Interrupt</span>
    </button>
  );
}

/**
 * GalaxyLink - Quick link to full galaxy view
 */
function GalaxyLink() {
  const handleClick = () => {
    window.location.href = '/sofie';
  };
  
  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full text-slate-400 hover:text-violet-300 hover:bg-violet-500/10 
                 transition-colors"
      title="Open Galaxy View"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  );
}

/**
 * Main AIStatusBar component
 */
export default function AIStatusBar() {
  const {
    connectionStatus,
    sofieState,
    userBiometrics,
    isListening,
    canInterrupt,
    startListening,
    stopListening,
    abortSpeaking
  } = useAI();

  const handleTalkClick = async () => {
    console.log('[AIStatusBar] Button clicked, sofieState:', sofieState);
    
    if (isListening) {
      await stopListening();
    } else {
      try {
        await startListening();
      } catch (error) {
        console.error('[AIStatusBar] startListening failed:', error);
      }
    }
  };

  const isProcessing = sofieState === 'processing';
  const showInterrupt = canInterrupt || sofieState === 'speaking';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto">
        <GlassCard 
          blurAmount="lg" 
          opacity="cloud"
          className="pointer-events-auto"
        >
          <div className="flex items-center justify-between gap-4 py-2 px-4">
            {/* Left: Connection & State */}
            <div className="flex items-center gap-3">
              <ConnectionIndicator status={connectionStatus} />
              <div className="w-px h-4 bg-white/10 hidden sm:block" />
              <SofieStateBadge state={sofieState} />
            </div>

            {/* Center: Biometrics */}
            <div className="flex-1 flex justify-center">
              <BiometricQuickView biometrics={userBiometrics} />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <GalaxyLink />
              
              {showInterrupt && (
                <InterruptButton onClick={abortSpeaking} />
              )}
              
              <TalkButton 
                onClick={handleTalkClick}
                disabled={isProcessing}
                isListening={isListening}
              />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/**
 * Compact AIStatusBar for use in pages with existing content
 * Smaller footprint, fixed position
 */
export function AIStatusBarCompact() {
  const {
    connectionStatus,
    sofieState,
    isListening,
    canInterrupt,
    startListening,
    stopListening,
    abortSpeaking
  } = useAI();

  const handleTalkClick = async () => {
    console.log('[AIStatusBarCompact] Button clicked, state:', { isListening, sofieState });
    if (isListening) {
      await stopListening();
    } else {
      try {
        await startListening();
      } catch (error) {
        console.error('[AIStatusBarCompact] startListening failed:', error);
      }
    }
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'online': return 'bg-emerald-400';
      case 'connecting': return 'bg-amber-400';
      default: return 'bg-rose-400';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      {/* Connection dot */}
      <div className={`w-3 h-3 rounded-full ${getConnectionColor()} ${connectionStatus !== 'online' ? 'animate-pulse' : ''}`} />
      
      {/* Interrupt button */}
      {canInterrupt && (
        <button
          onClick={abortSpeaking}
          className="p-2 rounded-full bg-rose-500/30 text-rose-200 border border-rose-500/50
                     hover:bg-rose-500/50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      {/* Talk button */}
      <button
        onClick={handleTalkClick}
        disabled={sofieState === 'processing'}
        className={`
          p-3 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95
          ${isListening 
            ? 'bg-rose-500 text-white animate-pulse' 
            : 'bg-violet-500 text-white hover:bg-violet-600'
          }
          ${sofieState === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isListening ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>
    </div>
  );
}
