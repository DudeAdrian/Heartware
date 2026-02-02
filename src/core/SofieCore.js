const API_CONFIG = {
  endpoint: process.env.REACT_APP_BACKEND_URL 
    ? `${process.env.REACT_APP_BACKEND_URL}/chat/completions`
    : 'http://localhost:8000/v1/chat/completions',
  timeout: 30000,
  retries: 1
};

/**
 * Stream AI response word by word
 * @param {string} message - User message
 * @param {function} onWord - Callback for each word received
 * @param {AbortSignal} signal - Abort signal for cancellation
 */
export const streamResponse = async (message, onWord, signal) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  
  try {
    const response = await fetch(API_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'default',
        messages: [
          { role: 'system', content: 'You are a helpful assistant. Keep responses concise and clear.' },
          { role: 'user', content: message }
        ],
        stream: false,
        max_tokens: 500,
        temperature: 0.7
      }),
      signal: signal || controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 
                 data.response || 
                 data.text ||
                 'I apologize, but I could not process your request.';
    
    // Word-by-word emission for particle text animation
    const words = text.split(/(\s+)/);
    
    for (const word of words) {
      if (signal?.aborted) break;
      onWord(word);
      // Dynamic delay based on punctuation
      const delay = /[.!?]$/.test(word) ? 300 : /[,;]$/.test(word) ? 150 : 50;
      await new Promise(r => setTimeout(r, delay));
    }
    
    return text;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.log('Request aborted');
      return null;
    }
    
    console.error('AI request failed:', error);
    
    // Fallback response
    const fallback = "I'm having trouble connecting right now. Please try again.";
    onWord(fallback);
    return fallback;
  }
};

/**
 * Simple non-streaming request
 * @param {string} message - User message
 * @returns {Promise<string>} - Complete response
 */
export const askSofie = async (message) => {
  let fullResponse = '';
  await streamResponse(message, (word) => {
    fullResponse += word;
  });
  return fullResponse;
};
