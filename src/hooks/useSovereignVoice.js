import { useState, useCallback, useRef, useEffect } from 'react';

export function useSovereignVoice({ onTranscript, onSpeechEnd }) {
  const [isListening, setIsListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const finalTranscriptRef = useRef('');
  
  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      setIsListening(true);
      finalTranscriptRef.current = '';
    };
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Send final transcript when speech pauses
      if (finalTranscriptRef.current.trim()) {
        const transcript = finalTranscriptRef.current.trim();
        finalTranscriptRef.current = '';
        onTranscript?.(transcript);
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Restart if no speech detected
        try {
          recognition.stop();
        } catch (e) {}
      }
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      onSpeechEnd?.();
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [onTranscript, onSpeechEnd]);
  
  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window === 'undefined') return;
    synthRef.current = window.speechSynthesis;
  }, []);
  
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition not available');
      return;
    }
    
    try {
      // Stop any ongoing speech
      if (synthRef.current?.speaking) {
        synthRef.current.cancel();
      }
      
      finalTranscriptRef.current = '';
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start listening:', error);
      // If already started, stop and restart
      try {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current?.start(), 100);
      } catch (e) {}
    }
  }, []);
  
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Failed to stop listening:', error);
    }
    setIsListening(false);
  }, []);
  
  const speak = useCallback((text) => {
    if (!synthRef.current || !text) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to use a good voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Google US English') ||
      v.name.includes('Microsoft Zira')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    synthRef.current.speak(utterance);
  }, []);
  
  const stopSpeaking = useCallback(() => {
    if (synthRef.current?.speaking) {
      synthRef.current.cancel();
    }
    setSpeaking(false);
  }, []);
  
  return {
    isListening,
    speaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    supported: !!recognitionRef.current
  };
}
