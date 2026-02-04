/**
 * annyang Wake Word Hook - Emergency Fix
 * Uses proven annyang.js library
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export function useAnnyangWakeWord({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  
  const annyangRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const initAnnyang = async () => {
      try {
        const annyang = (await import('annyang')).default;
        
        if (!annyang) {
          setIsSupported(false);
          return;
        }

        // Skip isSupported check - just try to use it
        annyangRef.current = annyang;

        const commands = {
          'sofie': () => {
            console.log('[annyang] WAKE WORD DETECTED!');
            startCommandRecording();
          },
        };

        annyang.addCommands(commands);
        annyang.setLanguage('en-US');

        // Try to start - may fail but we'll catch it
        try {
          annyang.start({ continuous: true, autoRestart: true });
          console.log('[annyang] Started');
        } catch (e) {
          console.log('[annyang] Start failed:', e.message);
        }

      } catch (err) {
        console.log('[annyang] Load failed:', err.message);
        setIsSupported(false);
      }
    };

    initAnnyang();

    return () => {
      if (annyangRef.current) {
        try {
          annyangRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  // Command recording
  const startCommandRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (annyangRef.current) {
      try {
        annyangRef.current.pause();
      } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('[annyang] Recording...');
      setIsRecording(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      const text = lastResult[0].transcript;
      setTranscript(text);

      if (lastResult.isFinal && text.trim()) {
        console.log('[annyang] Command:', text);
        onTranscript?.(text.trim());
        setIsRecording(false);
        
        if (annyangRef.current) {
          try {
            annyangRef.current.resume();
          } catch (e) {}
        }
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (annyangRef.current) {
        try {
          annyangRef.current.resume();
        } catch (e) {}
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    setTimeout(() => {
      try {
        recognition.stop();
      } catch (e) {}
    }, 8000);

    recognitionRef.current = recognition;
    recognition.start();
  }, [onTranscript]);

  // Manual toggle recording - RELIABLE BUTTON
  const toggleRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    if (isRecording) {
      // STOP
      console.log('[annyang] Stopping recording');
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsRecording(false);
      
      if (transcript.trim()) {
        console.log('[annyang] Sending:', transcript);
        onTranscript?.(transcript.trim());
      }
    } else {
      // START
      console.log('[annyang] Starting recording');
      
      if (annyangRef.current) {
        try {
          annyangRef.current.pause();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      setTranscript('');

      recognition.onstart = () => {
        console.log('[annyang] Recording active');
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const text = event.results[event.results.length - 1][0].transcript;
        setTranscript(text);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  }, [isRecording, transcript, onTranscript]);

  return {
    isRecording,
    isSupported,
    transcript,
    toggleRecording,
  };
}

export default useAnnyangWakeWord;
