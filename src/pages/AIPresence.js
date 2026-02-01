import React, { useState, useEffect } from 'react';
import GalaxyVisualization from '../components/GalaxyCore/GalaxyVisualization';
import AIOverlay from '../components/AIOverlay';
import { useAI } from '../context/AIContext';

const AIPresence = ({ onShowDashboard }) => {
  const {
    isSpeaking,
    isProcessing,
    isListening,
    currentText,
    sendToAI,
    stopSpeaking,
    connectionStatus,
    conversationHistory,
  } = useAI();
  const [input, setInput] = useState('');
  const [galaxyMounted, setGalaxyMounted] = useState(false);
  const [overlayMounted, setOverlayMounted] = useState(false);

  // Listen for user intent to show dashboard in conversation
  useEffect(() => {
    const lastMsg = conversationHistory[conversationHistory.length - 1]?.text?.toLowerCase() || '';
    if (lastMsg.includes('dashboard') || lastMsg.includes('wellness page')) {
      onShowDashboard();
    }
  }, [conversationHistory, onShowDashboard]);

  // Debug: check if GalaxyVisualization and AIOverlay are mounting
  useEffect(() => {
    setGalaxyMounted(true);
    setOverlayMounted(true);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendToAI(input);
      setInput('');
    }
  };

  return (
    <div className="relative w-screen h-screen bg-[#000208] overflow-hidden">
      <GalaxyVisualization />
      <AIOverlay />
      {/* Connection status and listening indicator */}
      {connectionStatus !== 'connected' && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-red-900/80 text-red-200 px-6 py-3 rounded shadow-lg text-base font-bold">
          AI backend is disconnected. Please start the AI server at ws://localhost:9200/ws.
        </div>
      )}
      {isListening && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-50 bg-cyan-900/80 text-cyan-200 px-6 py-3 rounded shadow-lg text-base font-bold animate-pulse">
          Listening for your question...
        </div>
      )}
      {/* Debug overlay */}
      <div className="absolute top-2 left-2 z-50 bg-black/80 text-green-400 px-4 py-2 rounded shadow-lg text-xs">
        <div>Galaxy Mounted: {galaxyMounted ? 'YES' : 'NO'}</div>
        <div>AIOverlay Mounted: {overlayMounted ? 'YES' : 'NO'}</div>
        <div>AI State: {isListening ? 'Listening' : isProcessing ? 'Processing' : isSpeaking ? 'Speaking' : 'Idle'}</div>
        <div>Connection: {connectionStatus}</div>
        <div>CurrentText: {currentText}</div>
      </div>
      {/* Chat input centered at bottom */}
      <form
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex w-full max-w-xl px-4"
        onSubmit={handleSend}
        autoComplete="off"
      >
        <input
          className="flex-1 rounded-l-lg px-4 py-3 text-lg bg-black/70 text-white border-none outline-none focus:ring-2 focus:ring-cyan-400"
          type="text"
          placeholder={connectionStatus === 'connected' ? 'Type your question for Sofie...' : 'Connecting to AI...' }
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={connectionStatus !== 'connected' || isProcessing || isSpeaking}
        />
        <button
          type="submit"
          className="rounded-r-lg px-6 py-3 bg-cyan-600 text-white font-bold text-lg hover:bg-cyan-700 transition disabled:opacity-50"
          disabled={connectionStatus !== 'connected' || isProcessing || isSpeaking || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AIPresence;
