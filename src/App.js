import { useState, useCallback, useEffect } from 'react';
import GalaxyScene from './components/GalaxyScene';
import { ToneIndicator } from './components/ToneIndicator';
import { streamConsciousness, captureVoice } from './core/SofieCore';
import { terratone } from './core/TerratoneBridge';

function App() {
  const [aiText, setAiText] = useState('');
  const [userText, setUserText] = useState('');
  const [status, setStatus] = useState('idle');
  const [freq, setFreq] = useState(432);

  // Start ambient tone on first user interaction
  useEffect(() => {
    const initAudio = () => {
      terratone.start('default');
      window.removeEventListener('click', initAudio);
    };
    window.addEventListener('click', initAudio);
    return () => window.removeEventListener('click', initAudio);
  }, []);

  // Sync Terratone with conversation state
  useEffect(() => {
    terratone.syncWithSofie(status);
    setFreq(terratone.currentFrequency);
  }, [status]);

  const handleTalk = useCallback(async () => {
    if (status !== 'idle') return;
    
    setStatus('listening');
    const user = await captureVoice();
    
    if (!user) { 
      setStatus('idle'); 
      return; 
    }

    setUserText(user);
    setStatus('thinking');
    setAiText('');
    
    // Analyze user message for tone selection
    const lowerUser = user.toLowerCase();
    if (lowerUser.includes('anxious') || lowerUser.includes('stress')) {
      terratone.transition('grounding'); // 174Hz for anxiety
    } else if (lowerUser.includes('love') || lowerUser.includes('heart')) {
      terratone.transition('love'); // 528Hz
    }
    
    await streamConsciousness(
      user,
      (txt) => {
        setAiText(txt);
        // Detect sentiment in streaming text for real-time tone adjustment
        if (txt.includes('breathe') || txt.includes('calm')) {
          terratone.transition('grounding', 1);
        }
      },
      () => {
        setStatus('speaking');
        setTimeout(() => { 
          setStatus('idle'); 
          setAiText(''); 
        }, 3000);
      },
      () => setStatus('idle')
    );
  }, [status]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#000',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* TOP BANNER - AI Response */}
      <div style={{
        height: '50px',
        background: 'rgba(0,0,0,0.9)',
        borderBottom: '2px solid #9333ea',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        zIndex: 100
      }}>
        <div style={{
          color: '#a855f7',
          fontWeight: 'bold',
          fontSize: '12px',
          marginRight: '15px',
          letterSpacing: '2px'
        }}>
          SOFIE
        </div>
        <div style={{
          flex: 1,
          color: 'white',
          fontSize: '16px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {aiText || (status === 'listening' ? 'Listening...' : 'Awaiting your voice...')}
        </div>
      </div>

      {/* GALAXY */}
      <div style={{ flex: 1, position: 'relative' }}>
        <GalaxyScene status={status} />
      </div>

      {/* TERRATONE INDICATOR */}
      <ToneIndicator frequency={freq} isPlaying={status !== 'idle'} />
      
      {/* Add manual tone controls (subtle) */}
      <div style={{
        position: 'fixed',
        bottom: '140px',
        left: '30px',
        display: 'flex',
        gap: '5px',
        zIndex: 100
      }}>
        {[432, 528, 639, 852].map(hz => (
          <button
            key={hz}
            onClick={() => {
              terratone.transition(hz === 432 ? 'default' : 
                                 hz === 528 ? 'love' : 
                                 hz === 639 ? 'connection' : 'intuition');
              setFreq(hz);
            }}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              border: freq === hz ? '2px solid #a855f7' : '1px solid rgba(255,255,255,0.2)',
              background: freq === hz ? 'rgba(168,85,247,0.3)' : 'rgba(0,0,0,0.5)',
              color: 'white',
              fontSize: '10px',
              cursor: 'pointer'
            }}
          >
            {hz}
          </button>
        ))}
      </div>

      {/* BOTTOM CONTROLS */}
      <div style={{
        height: '100px',
        background: 'rgba(0,0,0,0.95)',
        borderTop: '1px solid #9333ea',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        zIndex: 100
      }}>
        <div style={{ color: '#3b82f6', fontSize: '12px' }}>
          <strong>YOU:</strong> {userText || '...'}
        </div>

        <button 
          onClick={handleTalk}
          disabled={status !== 'idle'}
          style={{
            padding: '12px 40px',
            fontSize: '16px',
            background: status === 'idle' 
              ? 'linear-gradient(45deg, #ff69b4, #9336eb)' 
              : '#333',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: status === 'idle' ? 'pointer' : 'wait'
          }}
        >
          {status === 'listening' ? 'Listening...' :
           status === 'thinking' ? 'Processing...' :
           status === 'speaking' ? 'Speaking...' :
           'Talk to Sofie'}
        </button>
      </div>
    </div>
  );
}

export default App;