// SofieLlamaWelcome.js
// Sentient particle head entrance using react-three-fiber (Three.js)
import React, { Suspense, useRef } from 'react';
import SofieParticleHead from './SofieParticleHead';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { sendSofiePrompt } from '../services/SofieLlamaService';

export default function SofieLlamaWelcome() {
  const navigate = useNavigate();
  // Typewriter effect for banner text
  const bannerText = "S.O.F.I.E Systems Heartware — your individual journey into wellness";
  const [displayed, setDisplayed] = React.useState("");
  const [showParticles, setShowParticles] = React.useState(false);
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'radial-gradient(ellipse at center, #0a0a23 0%, #1a1a2e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <React.Fragment>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}>
          {showParticles ? <SofieParticleHead /> : <div style={{ width: '100vw', height: '100vh', background: '#0a0a23' }} />}
        </div>
        {wakeActive && !wakeDetected && (
          <div style={{
            position: 'absolute',
            top: '10vh',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,182,230,0.85)',
            color: '#2a2a2a',
            padding: '1rem 2rem',
            borderRadius: '2rem',
            fontSize: '1.3rem',
            fontWeight: 600,
            boxShadow: '0 2px 24px #ffb6e6',
          }}>
            Say "Sofie" to begin your journey
          </div>
        )}
        {showChat && (
          <div style={{
            position: 'absolute',
            top: '12vh',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.95)',
            color: '#2a2a2a',
            padding: '2.5rem 3.5rem',
            borderRadius: '2.5rem',
            fontSize: '1.25rem',
            fontWeight: 500,
            boxShadow: '0 2px 32px #ffb6e6',
            zIndex: 9999,
            minWidth: '340px',
            maxWidth: '480px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div style={{marginBottom:'1.2rem',fontWeight:700,fontSize:'1.5rem'}}>Sofie (Llama AI)</div>
            <div style={{ width: '100%', minHeight: 60, marginBottom: '0.7rem', maxHeight: 180, overflowY: 'auto' }}>
              {chatHistory.map((msg, idx) => (
                <div key={idx} style={{ textAlign: msg.sender === "sofie" ? "left" : "right", marginBottom: "0.4rem" }}>
                  <span style={{ color: msg.sender === "sofie" ? "#d9008d" : "#222", fontWeight: msg.sender === "sofie" ? 700 : 500 }}>{msg.sender === "sofie" ? "Sofie: " : "You: "}</span>
                  {msg.text}
                </div>
              ))}
              {loading && <div style={{ color: '#d9008d', fontStyle: 'italic' }}>Sofie is thinking...</div>}
            </div>
            <input
              type="text"
              placeholder="Type your question..."
              style={{ width: '100%', padding: '0.7rem', borderRadius: '1rem', border: '1px solid #ffb6e6', marginBottom: '1rem', fontSize: '1rem' }}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onBlur={() => setChatInput("")}
              onKeyDown={async e => {
                if (e.key === 'Enter' && chatInput.trim() && !loading) {
                  setChatInput(""); // Clear input immediately
                  setLoading(true);
                  setError("");
                  setChatHistory(prev => [...prev, { sender: "user", text: chatInput }]);
                  // Navigation bridging
                  const input = chatInput.toLowerCase();
                  if (input.includes("metrics")) {
                    navigate("/personal-health-metrics");
                  } else if (input.includes("nutrition")) {
                    navigate("/nutrition");
                  } else if (input.includes("holistic")) {
                    navigate("/holistic");
                  } else if (input.includes("mindfulness")) {
                    navigate("/mindfulness");
                  } else if (input.includes("movement")) {
                    navigate("/movement");
                  } else if (input.includes("care team")) {
                    navigate("/care-team");
                  } else if (input.includes("biofeedback")) {
                    navigate("/biofeedback");
                  } else if (input.includes("records")) {
                    navigate("/health-records");
                  } else if (input.includes("profile")) {
                    navigate("/profile");
                  } else if (input.includes("settings")) {
                    navigate("/settings");
                  }
                  // Real LLaMA backend response
                  try {
                    const context = chatHistory.map(m => ({ role: m.sender, content: m.text }));
                    const result = await sendSofiePrompt(chatInput, { context });
                    let reply = "";
                    if (result.choices && result.choices[0]?.message?.content) {
                      reply = result.choices[0].message.content;
                    } else if (result.error) {
                      reply = `Error: ${result.error}`;
                    } else {
                      reply = "Sofie is thinking, but the backend did not reply. Please check your server.";
                    }
                    setChatHistory(prev => [...prev, { sender: "sofie", text: reply }]);
                  } catch (err) {
                    setError("Sofie is unavailable. Please try again later.");
                    setChatHistory(prev => [...prev, { sender: "sofie", text: `Exception: ${err.message}` }]);
                  } finally {
                    setLoading(false);
                  }
                }
              }}
              disabled={loading}
              autoFocus
            />
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            <div style={{fontSize:'0.95rem',color:'#888'}}>After your first question, you'll be taken to the main tabs page.</div>
          </div>
        )}
        {wakeActive && (
          <div className="sofie-mic-indicator" style={{position:'absolute',top:20,right:20,background:'#fff0fa',color:'#d9008d',padding:'10px 18px',borderRadius:16,fontWeight:'bold',boxShadow:'0 0 12px #ffb6e6'}}>
            🎤 Listening for: <b>Sofie</b> {micActive ? '(active)' : '(paused)'}
          </div>
        )}
        {micError && (
          <div style={{position:'absolute',top:60,right:20,background:'#fff0fa',color:'#d9008d',padding:'10px 18px',borderRadius:16,fontWeight:'bold',boxShadow:'0 0 12px #ffb6e6'}}>
            {micError}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            bottom: '7vh',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '1.2rem 3.5rem',
            fontSize: '2rem',
            fontFamily: 'Bebas Neue, Banner, Arial, sans-serif',
            borderRadius: '3rem',
            background: 'linear-gradient(90deg, #ffb6e6 0%, #e0e0e0 100%)',
            color: '#2a2a2a',
            border: 'none',
            boxShadow: '0 2px 32px #ffb6e6',
            animation: 'pulse 2s infinite',
            letterSpacing: '0.08em',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            zIndex: 2,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/dashboard')}
          title="Go to Dashboard"
        >
          <span style={{
            display: 'inline-block',
            animation: 'scrollBanner 12s linear infinite',
          }}>{displayed}</span>
        </div>
        <style>{`
          @keyframes pulse {
            0% { box-shadow: 0 2px 32px #ffb6e6; }
            50% { box-shadow: 0 2px 64px #e0e0e0; }
            100% { box-shadow: 0 2px 32px #ffb6e6; }
          }
          @keyframes scrollBanner {
            0% { transform: translateX(0); }
            100% { transform: translateX(-30%); }
          }
        `}</style>
      </React.Fragment>
    </div>
  );
}
