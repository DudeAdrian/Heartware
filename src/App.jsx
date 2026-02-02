import React, { useState, useCallback, useRef } from 'react';
import { GalaxyScene } from './components/GalaxyScene';
import { useSovereignVoice } from './hooks/useSovereignVoice';
import { streamResponse } from './core/SofieCore';

export default function App() {
  const [displayText, setDisplayText] = useState('');
  const [animationState, setAnimationState] = useState('idle'); // 'idle' | 'forming' | 'holding' | 'dissolving'
  const [isListening, setIsListening] = useState(false);
  const accumulatedTextRef = useRef('');

  const handleTranscript = useCallback(async (transcript) => {
    if (!transcript || animationState !== 'idle') return;
    
    setIsListening(false);
    setAnimationState('forming');
    accumulatedTextRef.current = '';
    
    try {
      await streamResponse(transcript, (word) => {
        accumulatedTextRef.current += word;
        setDisplayText(accumulatedTextRef.current);
      });
      
      // Hold the text for 8 seconds
      setAnimationState('holding');
      await new Promise(r => setTimeout(r, 8000));
      
      // Dissolve and return to galaxy
      setAnimationState('dissolving');
      await new Promise(r => setTimeout(r, 1500));
      
      setDisplayText('');
      setAnimationState('idle');
      
    } catch (err) {
      console.error('AI stream failed:', err);
      setAnimationState('idle');
    }
  }, [animationState]);

  const { startListening, stopListening, speaking } = useSovereignVoice({
    onTranscript: handleTranscript,
    onSpeechEnd: () => setIsListening(false)
  });

  const handleVoiceStart = useCallback(() => {
    if (animationState === 'idle') {
      setIsListening(true);
      startListening();
    }
  }, [animationState, startListening]);

  const handleVoiceEnd = useCallback(() => {
    setIsListening(false);
    stopListening();
  }, [stopListening]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <GalaxyScene
        displayText={displayText}
        animationState={animationState}
        isListening={isListening}
        onVoiceStart={handleVoiceStart}
        onVoiceEnd={handleVoiceEnd}
      />
      
      {/* Voice indicator */}
      {isListening && (
        <div style={{
          position: 'fixed',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#9d4edd',
          fontSize: 14,
          pointerEvents: 'none',
          zIndex: 100
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#ff0040',
            animation: 'pulse 1s ease-in-out infinite'
          }} />
          Listening...
        </div>
      )}
      
      {/* Speaking indicator */}
      {speaking && (
        <div style={{
          position: 'fixed',
          bottom: 40,
          right: 40,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#3a0ca3',
          animation: 'pulse 0.5s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 100
        }} />
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
