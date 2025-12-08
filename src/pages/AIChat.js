import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../theme/GlassmorphismTheme';
import aiCompanion from '../services/AICompanionService';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to AI companion on mount
    aiCompanion.connect()
      .then(() => setIsConnected(true))
      .catch(() => setIsConnected(false));

    // Listen for AI messages
    const handleAIMessage = (event) => {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: event.detail.content,
        wisdom: event.detail.wisdom,
        heartSpace: event.detail.heartSpace,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    };

    window.addEventListener('ai-message', handleAIMessage);

    // Load conversation history
    const history = aiCompanion.getHistory(20);
    setMessages(history);

    return () => {
      window.removeEventListener('ai-message', handleAIMessage);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    await aiCompanion.sendMessage(inputMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: '🧘', label: 'Heart Space Meditation', action: () => aiCompanion.getHeartSpaceGuidance() },
    { icon: '📜', label: 'Ancient Wisdom', action: () => aiCompanion.getWisdomGuidance('healing') },
    { icon: '💭', label: 'Reflection Support', action: () => aiCompanion.getPsychologicalSupport('contemplative', 'seeking guidance') },
    { icon: '🌟', label: 'Health Insights', action: () => aiCompanion.getHealthInsights({ mood: 'balanced', energy: 'moderate' }) }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Companion
          </h1>
          <p className="text-gray-400">
            Heart-centered guidance through psychology and ancient wisdom
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-500'}`} />
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Offline Mode'}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {quickActions.map((action, index) => (
            <GlassCard
              key={index}
              className="p-3 cursor-pointer hover:scale-105 transition-transform text-center"
              onClick={() => {
                setIsTyping(true);
                action.action();
              }}
            >
              <div className="text-2xl mb-1">{action.icon}</div>
              <div className="text-xs text-gray-300">{action.label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Chat Messages */}
        <GlassCard className="h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-20">
                <div className="text-6xl mb-4">🌸</div>
                <p className="text-lg mb-2">Welcome to your AI Companion</p>
                <p className="text-sm">
                  I'm here to support your journey through psychology, heart-space healing,
                  and the timeless wisdom of antiquity.
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                      : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
                  }`}
                >
                  <div className="text-gray-200 whitespace-pre-wrap">{msg.content}</div>
                  
                  {msg.wisdom && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <div className="text-xs text-purple-300 mb-1">✨ Ancient Wisdom</div>
                      <div className="text-sm text-gray-300 italic">{msg.wisdom}</div>
                    </div>
                  )}
                  
                  {msg.heartSpace && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <div className="text-xs text-pink-300 mb-1">💖 Heart Space</div>
                      <div className="text-sm text-gray-300">{msg.heartSpace}</div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    {msg.timestamp?.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-blue-500/20 border border-blue-500/30 p-4 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex gap-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your heart..."
                className="flex-1 bg-gray-800/50 border border-gray-600 rounded-xl p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                rows="2"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Send
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AIChat;
