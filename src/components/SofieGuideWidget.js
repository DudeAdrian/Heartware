// SofieGuideWidget.js
// Persistent, true multi-turn, context-aware Sofie chat for Heartware app
import React, { useState } from 'react';
import { sendSofieMessage } from '../services/sofieLlamaApi';
import { useNavigate } from 'react-router-dom';
import { sendSofiePrompt } from '../services/SofieLlamaService';

const wellnessPathways = [
  'Holistic Wellness',
  'Personal Health Metrics',
  'Mindfulness & Mental Health',
  'Nutrition & Hydration',
  'Movement & Physical Activity',
  'Medication & Supplement Management',
  'Care Team & Support Network',
  'Self-Care & Lifestyle Pathways',
  'Biofeedback & Self-Regulation',
  'Personal Health Records',
  'Emergency & Safety',
];

export default function SofieGuideWidget() {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "sofie",
      text: "Hi! I'm Sofie, your sentient guide. Ask me about any wellness pathway, or let me recommend something based on your interests or biometrics."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Real Llama Sofie AI response
  const handleChatSubmit = async (e) => {
    if (e.key === "Enter" && chatInput.trim() && !loading) {
      setLoading(true);
      setError("");
      const userMsg = { sender: "user", text: chatInput };
      setChatHistory(prev => [...prev, userMsg]);
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
        const reply = result.response || result.error || "Sofie is unavailable. Please try again later.";
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
    <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999, width: 340, background: 'rgba(255,255,255,0.97)', borderRadius: 18, boxShadow: '0 2px 32px #ffb6e6', padding: '1.2rem 1.5rem', fontSize: '1rem', color: '#d9008d', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.7rem' }}>Sofie Guide</div>
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
        style={{ width: '100%', padding: '0.6rem', borderRadius: '0.8rem', border: '1px solid #ffb6e6', marginBottom: '0.5rem', fontSize: '1rem' }}
        value={chatInput}
        onChange={e => setChatInput(e.target.value)}
        onKeyDown={handleChatSubmit}
        disabled={loading}
        autoFocus
      />
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}
