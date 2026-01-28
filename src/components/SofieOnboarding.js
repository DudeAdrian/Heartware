// SofieOnboarding.js
// Persistent, multi-turn, context-aware Sofie chat for Heartware app
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SofieParticleHead from './SofieParticleHead';
import { sendSofiePrompt } from '../services/SofieLlamaService';

export default function SofieOnboarding() {
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "sofie",
      text: "Welcome! I'm Sofie, your sentient guide. Ask me anything about your wellness journey or available experiences."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // True multi-turn Sofie AI response (never hands off, always prompts for next input)
  const handleChatSubmit = async (e) => {
    if (e.key === "Enter" && chatInput.trim() && !loading) {
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
        const reply = result.choices ? result.choices[0]?.message?.content : (result.error || "Sofie is unavailable. Please try again later.");
        setChatHistory(prev => [...prev, { sender: "sofie", text: reply }]);
      } catch (err) {
        setError("Sofie is unavailable. Please try again later.");
        setChatHistory(prev => [...prev, { sender: "sofie", text: "Sofie is unavailable. Please try again later." }]);
      } finally {
        setChatInput("");
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "linear-gradient(90deg, #ffb6e6 0%, #d9008d 60%, #0a0a23 100%)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ marginBottom: "2.5rem", zIndex: 2 }}>
        <SofieParticleHead />
      </div>
      <div style={{ marginBottom: "1.5rem", padding: "1.2rem 3.5rem", fontSize: "2.2rem", fontFamily: "Bebas Neue, Banner, Arial, sans-serif", borderRadius: "3rem", background: "linear-gradient(90deg, #ffb6e6 0%, #d9008d 100%)", color: "#2a2a2a", border: "none", boxShadow: "0 2px 32px #ffb6e6", fontWeight: 700, letterSpacing: "0.08em", whiteSpace: "nowrap", textAlign: "center" }}>
        Welcome to <span style={{ color: '#d9008d' }}>S.O.F.I.E Systems Heartware</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.97)", color: "#d9008d", padding: "2rem 2.5rem", borderRadius: "2rem", fontSize: "1.15rem", fontWeight: 500, boxShadow: "0 2px 32px #ffb6e6", zIndex: 9999, minWidth: "340px", maxWidth: "480px", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
        <div style={{ marginBottom: "1.2rem", fontWeight: 700, fontSize: "1.3rem" }}>Sofie (AI)</div>
        <div style={{ width: "100%", minHeight: "80px", marginBottom: "1rem", maxHeight: "180px", overflowY: "auto" }}>
          {chatHistory.map((msg, idx) => (
            <div key={idx} style={{ textAlign: msg.sender === "sofie" ? "left" : "right", marginBottom: "0.5rem" }}>
              <span style={{ color: msg.sender === "sofie" ? "#d9008d" : "#222", fontWeight: msg.sender === "sofie" ? 700 : 500 }}>{msg.sender === "sofie" ? "Sofie: " : "You: "}</span>
              {msg.text}
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Type your question..."
          style={{ width: "100%", padding: "0.7rem", borderRadius: "1rem", border: "1px solid #ffb6e6", marginBottom: "1rem", fontSize: "1rem" }}
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          onKeyDown={handleChatSubmit}
          disabled={loading}
          autoFocus
        />
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 2px 32px #ffb6e6; }
          50% { box-shadow: 0 2px 64px #d9008d; }
          100% { box-shadow: 0 2px 32px #ffb6e6; }
        }
      `}</style>
    </div>
  );
}
