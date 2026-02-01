/**
 * AIContext.jsx
 * React Context for AI Presence System following RegionContext pattern
 * Integrates BridgeService, VoicePipeline, and BiometricAdapter
 * 
 * Provides: sofieState, userBiometrics, conversation state, and actions
 * Pattern: Clear value object, useAI hook, service integration (like RegionContext)
 */

import React, { createContext, useState, useEffect, useCallback, useContext, useRef } from 'react';
import BridgeService from '../services/BridgeService';
import VoicePipeline from '../services/VoicePipeline';
import BiometricAdapter from '../services/BiometricAdapter';
import { useSofie } from './SofieContext';

export const AIContext = createContext();

export default function AIProvider({ children }) {
  // Access SofieContext for error handling integration
  const { addError } = useSofie();
  
  // Sofie States (The AI Presence)
  const [sofieState, setSofieState] = useState('dormant'); // dormant, listening, processing, speaking, entrainment
  
  // User/Biometric States (The Mirror)
  const [userBiometrics, setUserBiometrics] = useState({
    pulseRate: null,
    breathPhase: null,
    emotionalValence: null, // 'anxious'|'calm'|'neutral'|'focused'
    timestamp: null,
    source: null,
    confidence: 0
  });
  
  // Conversation State
  const [currentResponse, setCurrentResponse] = useState(''); // Streaming text
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isListening, setIsListening] = useState(false); // VAD active
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  
  // Connection
  const [connectionStatus, setConnectionStatus] = useState('offline');
  
  // Refs for managing async operations
  const responseBufferRef = useRef('');
  const silenceTimeoutRef = useRef(null);
  const biometricIntervalRef = useRef(null);

  /**
   * Handle incoming bridge messages
   */
  const handleBridgeMessage = useCallback((msg) => {
    const { type, payload, timestamp, id } = msg;
    
    switch (type) {
      case 'stream_chunk':
        responseBufferRef.current += payload?.content || '';
        setCurrentResponse(responseBufferRef.current);
        setSofieState('speaking');
        break;
        
      case 'stream_end':
        // Speak the complete response once at the end
        const finalText = responseBufferRef.current;
        if (finalText) {
          VoicePipeline.speak(finalText);
        }
        finalizeResponse(id || conversationId);
        break;
        
      case 'biometric_request':
        captureBiometricSnapshot();
        break;
        
      case 'entrainment_start':
        setSofieState('entrainment');
        break;
        
      case 'error':
        handleBridgeError(payload);
        break;
        
      default:
        // Handle other message types
        break;
    }
  }, [conversationId]);

  /**
   * Finalize completed response
   */
  const finalizeResponse = useCallback((convId) => {
    const finalText = responseBufferRef.current;
    
    if (finalText) {
      setConversationHistory(prev => [...prev, {
        role: 'assistant',
        content: finalText,
        timestamp: Date.now(),
        conversationId: convId
      }]);
    }
    
    responseBufferRef.current = '';
    setCurrentResponse('');
    setSofieState('dormant');
    
    if (convId && !conversationId) {
      setConversationId(convId);
    }
  }, [conversationId]);

  /**
   * Handle bridge errors
   */
  const handleBridgeError = useCallback((error) => {
    console.error('[AIContext] Bridge error:', error);
    addError({
      message: error?.message || 'AI connection error',
      source: 'AIContext',
      timestamp: new Date()
    });
    
    // Reset state
    setSofieState('dormant');
    setIsListening(false);
    setIsUserSpeaking(false);
    responseBufferRef.current = '';
    setCurrentResponse('');
  }, [addError]);

  /**
   * Setup BridgeService listeners on mount
   */
  useEffect(() => {
    // Subscribe to bridge events
    const unsubStatus = BridgeService.on('status', (status) => {
      setConnectionStatus(status === 'authenticated' ? 'online' : 'offline');
    });
    
    const unsubMessage = BridgeService.on('message', handleBridgeMessage);
    
    const unsubBiometricRequest = BridgeService.on('biometric-request', () => {
      captureBiometricSnapshot();
    });
    
    const unsubError = BridgeService.on('error', handleBridgeError);
    
    const unsubAuthenticated = BridgeService.on('authenticated', (payload) => {
      if (payload?.conversationId) {
        setConversationId(payload.conversationId);
      }
    });

    // Auto-connect on mount
    BridgeService.connect().catch(error => {
      console.error('[AIContext] Failed to connect:', error);
    });
    
    // Initialize voice pipeline
    VoicePipeline.initialize();

    return () => {
      // Cleanup subscriptions
      unsubStatus();
      unsubMessage();
      unsubBiometricRequest();
      unsubError();
      unsubAuthenticated();
      
      // Clear intervals and timeouts
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (biometricIntervalRef.current) {
        clearInterval(biometricIntervalRef.current);
      }
      
      // Disconnect bridge
      BridgeService.disconnect();
    };
  }, [handleBridgeMessage, handleBridgeError]);

  /**
   * Start listening for user voice input
   */
  const startListening = useCallback(async () => {
    console.log('[AIContext] startListening called');
    
    try {
      // Ensure BridgeService is connected
      const bridgeStatus = BridgeService.getStatus();
      
      if (bridgeStatus === 'disconnected') {
        console.log('[AIContext] BridgeService not connected, connecting...');
        await BridgeService.connect();
      }
      
      // Set UI state optimistically
      setIsListening(true);
      setSofieState('listening');
      
      // Initialize voice pipeline (microphone only)
      VoicePipeline.initialize();
      
      if (!VoicePipeline.isSTTAvailable()) {
        throw new Error('Speech Recognition not supported in this browser');
      }
      
      console.log('[AIContext] Starting VoicePipeline recording (mic only)');
      await VoicePipeline.startRecording({
        onInterim: (text) => {
          setIsUserSpeaking(true);
          // Reset silence timeout
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
        },
        onFinal: (text) => {
          setIsUserSpeaking(false);
          setIsListening(false);
          
          if (text.trim()) {
            // Add to conversation history
            setConversationHistory(prev => [...prev, {
              role: 'user',
              content: text,
              timestamp: Date.now()
            }]);
            
            // Send to AI
            sendToAI(text);
          } else {
            setSofieState('dormant');
          }
        },
        onSilence: () => {
          // Auto-stop after silence
          stopListening();
        }
      });
      
    } catch (error) {
      console.error('[AIContext] Start listening error:', error);
      addError({ message: error.message || 'Failed to start voice recognition', source: 'AIContext' });
      setIsListening(false);
      setSofieState('dormant');
    }
  }, [addError]);

  /**
   * Stop listening and process captured audio
   */
  const stopListening = useCallback(async () => {
    console.log('[AIContext] stopListening called');
    try {
      setIsListening(false);
      setIsUserSpeaking(false);
      
      console.log('[AIContext] Calling VoicePipeline.stopRecording()...');
      const transcript = await VoicePipeline.stopRecording();
      console.log('[AIContext] Transcript received:', transcript ? `"${transcript}"` : 'EMPTY');
      
      if (transcript?.trim()) {
        console.log('[AIContext] Transcript has content, setting processing state');
        setSofieState('processing');
        
        // Add to conversation history
        setConversationHistory(prev => [...prev, {
          role: 'user',
          content: transcript,
          timestamp: Date.now()
        }]);
        
        // Send to AI
        console.log('[AIContext] Calling sendToAI with transcript');
        await sendToAI(transcript);
      } else {
        console.log('[AIContext] Transcript empty, returning to dormant');
        setSofieState('dormant');
      }
    } catch (error) {
      console.error('[AIContext] Stop listening error:', error);
      setSofieState('dormant');
    }
  }, []);

  /**
   * Send message to AI via BridgeService
   */
  const sendToAI = useCallback(async (text) => {
    console.log('[AIContext] sendToAI called with text:', text.substring(0, 50) + '...');
    try {
      setCurrentResponse('');
      responseBufferRef.current = '';
      setSofieState('processing');
      
      console.log('[AIContext] BridgeService mode:', BridgeService.getMode());
      
      // Send via BridgeService (voice only, no biometrics)
      console.log('[AIContext] Calling BridgeService.sendChat()');
      await BridgeService.sendChat(text, {
        conversationId,
        conversationHistory: conversationHistory.slice(-10) // Last 10 messages for context
      }, true);
      console.log('[AIContext] BridgeService.sendChat() completed');
      
    } catch (error) {
      console.error('[AIContext] Send to AI error:', error);
      addError({ message: 'Failed to send message to AI', source: 'AIContext' });
      setSofieState('dormant');
    }
  }, [conversationId, conversationHistory, addError]);

  /**
   * Capture biometric snapshot
   */
  const captureBiometricSnapshot = useCallback(async () => {
    try {
      const data = await BiometricAdapter.capture();
      
      if (data) {
        setUserBiometrics({
          ...data,
          timestamp: Date.now()
        });
        
        // Send to backend
        BridgeService.sendBiometric(data);
      }
      
      return data;
    } catch (error) {
      console.error('[AIContext] Biometric capture error:', error);
      return null;
    }
  }, []);

  /**
   * Start periodic biometric capture
   */
  const startBiometricCapture = useCallback(() => {
    // Clear existing interval
    if (biometricIntervalRef.current) {
      clearInterval(biometricIntervalRef.current);
    }
    
    // Capture every 5 seconds during active conversation
    biometricIntervalRef.current = setInterval(() => {
      captureBiometricSnapshot();
    }, 5000);
  }, [captureBiometricSnapshot]);

  /**
   * Stop periodic biometric capture
   */
  const stopBiometricCapture = useCallback(() => {
    if (biometricIntervalRef.current) {
      clearInterval(biometricIntervalRef.current);
      biometricIntervalRef.current = null;
    }
  }, []);

  /**
   * Abort AI speaking (interruption)
   */
  const abortSpeaking = useCallback(() => {
    // Send interruption to backend
    BridgeService.sendInterruption();
    
    // Stop TTS
    VoicePipeline.stopSpeaking();
    
    // Reset state
    responseBufferRef.current = '';
    setCurrentResponse('');
    setSofieState('dormant');
  }, []);

  /**
   * Clear conversation history
   */
  const clearConversation = useCallback(() => {
    setConversationHistory([]);
    setConversationId(null);
    responseBufferRef.current = '';
    setCurrentResponse('');
    BridgeService.setConversationId(null);
  }, []);

  /**
   * Send text message directly (without voice)
   */
  const sendMessage = useCallback(async (text) => {
    if (!text?.trim()) return;
    
    // Add to history
    setConversationHistory(prev => [...prev, {
      role: 'user',
      content: text,
      timestamp: Date.now()
    }]);
    
    // Send to AI
    await sendToAI(text);
  }, [sendToAI]);

  // Build context value object (following RegionContext pattern)
  const value = {
    // State
    sofieState,
    userBiometrics,
    currentResponse,
    conversationHistory,
    isListening,
    isUserSpeaking,
    connectionStatus,
    conversationId,
    
    // Computed
    canInterrupt: sofieState === 'speaking',
    isOnline: connectionStatus === 'online',
    
    // Actions
    startListening,
    stopListening,
    abortSpeaking,
    captureBiometricSnapshot,
    clearConversation,
    sendMessage,
    
    // Helpers
    startBiometricCapture,
    stopBiometricCapture
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}

/**
 * useAI hook - must be used within AIProvider
 * Pattern: Same as useRegion in RegionContext
 */
export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within AIProvider');
  }
  return context;
}

// Hook for accessing sofie state only (convenience)
export function useSofieState() {
  const { sofieState } = useAI();
  return sofieState;
}

// Hook for accessing biometrics only (convenience)
export function useBiometrics() {
  const { userBiometrics, captureBiometricSnapshot } = useAI();
  return { userBiometrics, captureBiometricSnapshot };
}

// Hook for conversation management (convenience)
export function useConversation() {
  const {
    conversationHistory,
    currentResponse,
    sendMessage,
    clearConversation,
    conversationId
  } = useAI();
  
  return {
    conversationHistory,
    currentResponse,
    sendMessage,
    clearConversation,
    conversationId
  };
}

// Also export AIProvider as named export for flexibility
export { AIProvider };
