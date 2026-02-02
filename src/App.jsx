import { useState, useCallback } from 'react';
import GalaxyScene from './components/GalaxyScene';
import { streamConsciousness, captureVoice, speakText } from './core/SofieCore';
// Import your actual Terratone component
import GlassmorphicToneGenerator from './terratone/src/GlassmorphicToneGenerator';

function App() {
  const [aiText, setAiText] = useState('');
  const [userText, setUserText] = useState('');
  const [status, setStatus] = useState('idle');
  const [showTerratone, setShowTerratone] = useState(false);

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
      async (fullText) => {
        setStatus('speaking');
        // CRITICAL FIX: Actually speak the text
        await speakText(fullText);
        setTimeout(() => { 
          setStatus('idle'); 
          setAiText(''); 
        }, 2000);
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
      {/* SOFIE Banner */}
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
          {aiText || 'Awaiting your voice...'}
        </div>
      </div>

      {/* Galaxy */}
      <div style={{ flex: 1, position: 'relative' }}>
        <GalaxyScene status={status} />
      </div>

      {/* Terratone Toggle Button */}
      <button 
        onClick={() => setShowTerratone(!showTerratone)}
        style={{
          position: 'fixed',
          bottom: '140px',
          right: '30px',
          zIndex: 100,
          padding: '12px 24px',
          background: showTerratone ? '#a855f7' : 'rgba(0,0,0,0.8)',
          color: 'white',
          border: '2px solid #a855f7',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: showTerratone ? '0 0 30px rgba(168,85,247,0.5)' : '0 0 20px rgba(0,0,0,0.5)'
        }}
      >
        {showTerratone ? '✕ Close Tones' : '∞ Terratone'}
      </button>

      {/* Terratone Panel - Your actual working component */}
      {showTerratone && (
        <div style={{
          position: 'fixed',
          bottom: '190px',
          right: '30px',
          width: '400px',
          height: '600px',
          background: 'rgba(10,10,20,0.95)',
          border: '1px solid rgba(147,51,234,0.5)',
          borderRadius: '20px',
          zIndex: 101,
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 50px rgba(0,0,0,0.9)'
        }}>
          <GlassmorphicToneGenerator />
        </div>
      )}

      {/* Bottom Controls */}
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
        <div style={{ 
          color: '#3b82f6', 
          fontSize: '12px',
          maxWidth: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
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
            cursor: status === 'idle' ? 'pointer' : 'wait',
            boxShadow: status === 'idle' ? '0 0 30px rgba(168,85,247,0.3)' : 'none'
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