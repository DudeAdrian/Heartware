const CONFIG = {
  AI_ENDPOINT: 'http://localhost:8001/v1/chat/completions',
  SYSTEM_PROMPT: `You are Sofie (S.O.F.I.E.), a warm wellness companion. Keep responses concise (1-2 sentences). Never spell out S-O-F-I-E, use "Sofie".`
};

// Real-time streaming function
export const streamConsciousness = async (message, onWord, onComplete, onError) => {
  try {
    const response = await fetch(CONFIG.AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {role: 'system', content: CONFIG.SYSTEM_PROMPT},
          {role: 'user', content: message}
        ],
        temperature: 0.75,
        max_tokens: 150,
        stream: true
      })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            
            if (content) {
              fullText += content;
              const cleanText = fullText.replace(/\bS\.O\.F\.I\.E\.\b/g, 'Sofie');
              if (onWord) onWord(cleanText);
            }
          } catch (e) {}
        }
      }
    }
    
    const finalClean = fullText.replace(/\bS\.O\.F\.I\.E\.\b/g, 'Sofie');
    if (onComplete) onComplete(finalClean);
    return finalClean;
    
  } catch (err) {
    console.error('[Sofie]', err);
    if (onError) onError(err.message);
    return '';
  }
};

export const captureVoice = () => {
  return new Promise((resolve) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      resolve('');
      return;
    }
    
    const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    
    let finalTranscript = '';
    let silenceTimeout;
    
    rec.onresult = (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript;
      if (e.results[e.results.length - 1].isFinal) {
        finalTranscript += transcript + ' ';
      }
      clearTimeout(silenceTimeout);
      silenceTimeout = setTimeout(() => rec.stop(), 2000);
    };
    
    rec.onerror = () => resolve(finalTranscript.trim());
    rec.onend = () => resolve(finalTranscript.trim());
    
    silenceTimeout = setTimeout(() => rec.stop(), 5000);
    rec.start();
  });
};

export const speakText = async (text) => {
  if (!text) return;
  const cleanText = text.replace(/\bS\.O\.F\.I\.E\.\b/g, 'Sofie').trim();
  
  try {
    // Try Piper on port 5000 first
    const response = await fetch('http://localhost:5000', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanText })
    });
    
    if (response.ok) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      return new Promise((resolve) => {
        audio.onended = () => { URL.revokeObjectURL(audioUrl); resolve(); };
        audio.play();
      });
    }
  } catch (e) {
    // Piper not running, use browser TTS
  }
  
  // Browser fallback
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(cleanText);
    u.rate = 0.9;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
    u.onend = resolve;
  });
};