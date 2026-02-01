import React from 'react';
import { useAI } from '../context/AIContext';

const statusMap = {
  disconnected: { color: 'bg-red-500', text: 'Disconnected' },
  connecting: { color: 'bg-yellow-400', text: 'Connecting...' },
  connected: { color: 'bg-green-500', text: 'Connected' },
};

const aiStateText = (isListening, isProcessing, isSpeaking) => {
  if (isListening) return 'Sofie is listening...';
  if (isProcessing) return 'Sofie is thinking...';
  if (isSpeaking) return 'Sofie says:';
  return 'Sofie is idle.';
};

const AIOverlay = () => {
  const {
    isListening,
    isProcessing,
    isSpeaking,
    currentText,
    connectionStatus,
    stopSpeaking,
  } = useAI();
  const status = statusMap[connectionStatus] || statusMap.disconnected;

  return (
    <div className="pointer-events-none select-none absolute inset-0 flex flex-col justify-between z-20">
      <div className="flex items-center p-4">
        <span className={`w-3 h-3 rounded-full mr-2 ${status.color}`}></span>
        <span className="text-white text-sm font-medium drop-shadow">{status.text}</span>
      </div>
      <div className="flex flex-col items-center mb-16">
        {(isListening || isProcessing || isSpeaking) && (
          <div className="bg-black/70 rounded-xl px-6 py-4 max-w-2xl shadow-lg flex flex-col items-center animate-fade-in">
            <span className="text-cyan-300 text-base font-semibold mb-2">
              {aiStateText(isListening, isProcessing, isSpeaking)}
            </span>
            {isSpeaking && (
              <div className="text-white text-lg font-mono transition-all duration-300 animate-fade-in">
                {currentText.split(' ').map((word, i) => (
                  <span key={i} className="inline-block opacity-90 animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>{word} </span>
                ))}
              </div>
            )}
            {isSpeaking && (
              <button
                className="mt-4 px-4 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 transition pointer-events-auto"
                onClick={stopSpeaking}
              >
                Skip
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIOverlay;
