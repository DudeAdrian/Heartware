/**
 * VoicePipeline.js
 * STT/TTS coordination with interruption support
 * Manages Web Speech API for speech recognition and synthesis
 * 
 * Features:
 * - Speech-to-text with interim and final results
 * - Text-to-speech with sentence-level chunking
 * - Interruption support (cancel speaking)
 * - Silence detection for auto-stop
 */

class VoicePipeline {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.currentUtterance = null;
    this.isRecording = false;
    this.isSpeaking = false;
    this.silenceTimeout = null;
    this.interimCallback = null;
    this.finalCallback = null;
    this.silenceCallback = null;
    this.currentTranscript = ''; // Store transcript for stopRecording
    
    // Configuration
    this.config = {
      language: 'en-US',
      silenceThreshold: 2000, // ms of silence before auto-stop
      interimResults: true,
      continuous: false,
      maxAlternatives: 1
    };
  }

  /**
   * Initialize speech recognition
   * @returns {boolean} Whether STT is available
   */
  initialize() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('[VoicePipeline] Speech Recognition not supported');
      return false;
    }
    
    if (!this.synthesis) {
      console.warn('[VoicePipeline] Speech Synthesis not supported');
      return false;
    }
    
    // Pre-warm the speech synthesis (workaround for Chrome)
    this.synthesis.cancel();
    
    return true;
  }

  /**
   * Check if STT is available
   * @returns {boolean}
   */
  isSTTAvailable() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Check if TTS is available
   * @returns {boolean}
   */
  isTTSAvailable() {
    return !!window.speechSynthesis;
  }

  /**
   * Start recording with callbacks
   * @param {Object} callbacks - Callback functions
   * @param {function} callbacks.onInterim - Called with interim transcript
   * @param {function} callbacks.onFinal - Called with final transcript
   * @param {function} callbacks.onSilence - Called when silence detected
   * @param {function} callbacks.onError - Called on error
   */
  async startRecording(callbacks = {}) {
    console.log('[VoicePipeline] startRecording called');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      throw new Error('Speech Recognition not supported in this browser');
    }
    
    if (this.isRecording) {
      console.log('[VoicePipeline] Already recording');
      return;
    }

    this.interimCallback = callbacks.onInterim;
    this.finalCallback = callbacks.onFinal;
    this.silenceCallback = callbacks.onSilence;
    
    // Request microphone permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('[VoicePipeline] Microphone permission denied:', err);
      throw new Error('Microphone permission required');
    }

    // Create recognition instance
    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.config.language;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.continuous = this.config.continuous;
    this.recognition.maxAlternatives = this.config.maxAlternatives;

    // Store final transcript on instance so stopRecording can access it
    this.currentTranscript = '';

    this.recognition.onstart = () => {
      console.log('[VoicePipeline] Recording started');
      this.isRecording = true;
      this.currentTranscript = '';
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          this.currentTranscript += transcript;
          console.log('[VoicePipeline] Final transcript updated:', this.currentTranscript);
        } else {
          interimTranscript += transcript;
        }
      }

      // Reset silence timeout on speech
      if (this.silenceTimeout) {
        clearTimeout(this.silenceTimeout);
      }
      
      this.silenceTimeout = setTimeout(() => {
        if (this.silenceCallback && this.currentTranscript) {
          this.silenceCallback();
        }
      }, this.config.silenceThreshold);

      // Call callbacks
      if (interimTranscript && this.interimCallback) {
        this.interimCallback(interimTranscript);
      }

      if (this.currentTranscript && this.finalCallback) {
        this.finalCallback(this.currentTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('[VoicePipeline] Recognition error:', event.error);
      this.isRecording = false;
      
      if (callbacks.onError) {
        callbacks.onError(event.error);
      }
      
      // Don't throw for no-speech errors, just stop
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.warn('[VoicePipeline] Recognition error:', event.error);
      }
    };

    this.recognition.onend = () => {
      console.log('[VoicePipeline] Recording ended');
      this.isRecording = false;
      
      if (this.silenceTimeout) {
        clearTimeout(this.silenceTimeout);
        this.silenceTimeout = null;
      }

      // If we have a final transcript and weren't manually stopped
      if (this.currentTranscript && this.finalCallback) {
        this.finalCallback(this.currentTranscript);
      }
    };

    this.recognition.start();
  }

  /**
   * Stop recording and return final transcript
   * @returns {Promise<string>} Final transcript
   */
  stopRecording() {
    console.log('[VoicePipeline] stopRecording called, current transcript:', this.currentTranscript);
    return new Promise((resolve) => {
      if (!this.recognition || !this.isRecording) {
        console.log('[VoicePipeline] Not recording, returning transcript:', this.currentTranscript);
        resolve(this.currentTranscript || '');
        return;
      }

      // Set up one-time handler for final result
      const handleEnd = () => {
        console.log('[VoicePipeline] onend fired, final transcript:', this.currentTranscript);
        resolve(this.currentTranscript || '');
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        handleEnd();
      };

      console.log('[VoicePipeline] Calling recognition.stop()');
      this.recognition.stop();
      
      // Fallback timeout - resolve with current transcript if onend doesn't fire
      setTimeout(() => {
        if (this.isRecording) {
          console.log('[VoicePipeline] Timeout, forcing resolve with:', this.currentTranscript);
          this.isRecording = false;
          resolve(this.currentTranscript || '');
        }
      }, 1000);
    });
  }

  /**
   * Abort recording immediately
   */
  abortRecording() {
    if (this.recognition) {
      this.recognition.abort();
      this.isRecording = false;
    }
    
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }
  }

  /**
   * Speak text using TTS
   * @param {string} text - Text to speak
   * @param {function} onChunk - Called when each sentence starts
   * @param {Object} options - TTS options
   * @returns {Promise<void>}
   */
  speak(text, onChunk = null, options = {}) {
    return new Promise((resolve) => {
      if (!this.synthesis) {
        console.warn('[VoicePipeline] TTS not available');
        resolve();
        return;
      }

      if (!text?.trim()) {
        resolve();
        return;
      }

      // Cancel any current speech
      this.stopSpeaking();

      // Split into sentences for chunking
      const sentences = text.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) || [text];
      let currentIndex = 0;

      const speakNext = () => {
        if (currentIndex >= sentences.length) {
          this.isSpeaking = false;
          resolve();
          return;
        }

        const sentence = sentences[currentIndex].trim();
        if (!sentence) {
          currentIndex++;
          speakNext();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(sentence);
        
        // Apply options
        utterance.lang = options.language || this.config.language;
        utterance.rate = options.rate || 1.0;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        // Try to find a good voice
        const voices = this.synthesis.getVoices();
        const preferredVoice = voices.find(v => 
          v.name.includes('Google') || 
          v.name.includes('Samantha') || 
          v.name.includes('Victoria')
        ) || voices.find(v => v.lang.startsWith('en'));
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
          this.isSpeaking = true;
          this.currentUtterance = utterance;
          
          if (onChunk) {
            onChunk(sentence, currentIndex);
          }
        };

        utterance.onend = () => {
          currentIndex++;
          speakNext();
        };

        utterance.onerror = (event) => {
          console.warn('[VoicePipeline] TTS error:', event.error);
          currentIndex++;
          speakNext();
        };

        this.synthesis.speak(utterance);
      };

      speakNext();
    });
  }

  /**
   * Stop speaking immediately
   */
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  /**
   * Pause speaking
   */
  pauseSpeaking() {
    if (this.synthesis) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume speaking
   */
  resumeSpeaking() {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  /**
   * Check if currently speaking
   * @returns {boolean}
   */
  isCurrentlySpeaking() {
    return this.isSpeaking;
  }

  /**
   * Check if currently recording
   * @returns {boolean}
   */
  isCurrentlyRecording() {
    return this.isRecording;
  }

  /**
   * Get available voices
   * @returns {SpeechSynthesisVoice[]}
   */
  getVoices() {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  /**
   * Set configuration
   * @param {Object} config
   */
  setConfig(config) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get configuration
   * @returns {Object}
   */
  getConfig() {
    return { ...this.config };
  }
}

// Export singleton instance
export const voicePipeline = new VoicePipeline();
export default voicePipeline;
