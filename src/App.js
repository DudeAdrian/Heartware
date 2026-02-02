import { useState, useCallback } from 'react';
import GalaxyScene from './components/GalaxyScene';
import { streamConsciousness, captureVoice } from './core/SofieCore';

function App() {
  const [aiText, setAiText] = useState('');
  const [userText, setUserText] = useState('');
  const [status, setStatus] = useState('idle');

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
    
    await streamConsciousness(
      user,
      (txt) => setAiText(txt),
      () => {
        setStatus('speaking');
        // Auto-return to idle after 3 seconds of completion
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
      {/* TOP BANNER */}
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

      {/* GALAXY - Persistent */}
      <div style={{ flex: 1, position: 'relative' }}>
        <GalaxyScene status={status} />
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
              ? 'linear-gradient(45deg, #ff69b4, #9333ea)' 
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