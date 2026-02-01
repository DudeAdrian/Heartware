/**
 * SofieLlamaApi.js
 * Service for connecting to the Llama Sofie AI backend
 * Uses OpenAI-compatible /v1/chat/completions endpoint
 */

import bridgeService from './BridgeService';

const API_URL = process.env.REACT_APP_SOFIE_API_URL || 'http://localhost:8000/v1/chat/completions';

/**
 * Send message and get response with optional streaming callback
 * @param {string} message - User message
 * @param {array} context - Previous messages
 * @param {function} onStream - Optional callback for word-by-word streaming
 * @returns {Promise<string>} AI response
 */
export async function sendSofieMessage(message, context = [], onStream = null) {
  console.log('[Sofie] Sending:', message);
  
  try {
    const messages = [
      {
        role: 'system',
        content: 'You are S.O.F.I.E. (Sentient Organic Friendly Intelligence Entity), a warm and empathetic AI wellness companion. Provide evidence-based guidance with care.'
      },
      ...context.slice(-3),
      { role: 'user', content: message }
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        temperature: 0.7,
        max_tokens: 256,
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    console.log('[Sofie] Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // Try multiple response formats
    let reply = data.choices?.[0]?.message?.content || 
                data.choices?.[0]?.text || 
                data.content || 
                'I could not generate a response.';

    console.log('[Sofie] Reply:', reply.substring(0, 100));
    
    // Stream word by word if callback provided
    if (onStream && typeof onStream === 'function') {
      const words = reply.split(/(\s+)/);
      for (const word of words) {
        onStream(word);
        await new Promise(r => setTimeout(r, 30));
      }
    }
    
    return reply;

  } catch (error) {
    console.error('[Sofie] Error:', error.name, error.message);
    
    if (error.name === 'AbortError') {
      return 'Request timed out. Is the AI backend running on port 8000?';
    }
    
    return 'Sorry, I cannot connect to the AI backend. Please check that llama.cpp server is running.';
  }
}

/**
 * HTTP fallback streaming for BridgeService
 */
export async function streamWithFallback(prompt, context = {}, onChunk = null, signal = null) {
  console.log('[SofieLlamaApi] streamWithFallback called');
  
  const messages = [
    {
      role: 'system',
      content: 'You are S.O.F.I.E., a warm AI wellness companion.'
    },
    ...(context.previousMessages || context.conversationHistory || []).slice(-3).map(msg => ({
      role: msg.role || 'user',
      content: msg.content || msg.message || msg.text
    })),
    { role: 'user', content: prompt }
  ];
  
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 30000);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        temperature: 0.7,
        max_tokens: 512
      }),
      signal: signal || abortController.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const fullText = data.choices?.[0]?.message?.content || '';
    
    // Simulate streaming
    if (onChunk && fullText) {
      const words = fullText.split(/(\s+)/);
      for (const word of words) {
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        onChunk(word);
        await new Promise(r => setTimeout(r, 40));
      }
    }
    
    return fullText;
    
  } catch (error) {
    clearTimeout(timeout);
    console.error('[SofieLlamaApi] Error:', error.message);
    const errorMsg = "I'm having trouble connecting. Please ensure the AI backend is running on port 8000.";
    if (onChunk) onChunk(errorMsg);
    return errorMsg;
  }
}

/**
 * WebSocket streaming via BridgeService
 */
export async function streamSofiePrompt(prompt, context = {}, onChunk = null) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let streamComplete = false;
    
    const handleChunk = (data) => {
      if (data.payload?.content) {
        chunks.push(data.payload.content);
        if (onChunk) onChunk(data.payload.content);
      }
    };
    
    const handleStreamEnd = () => {
      streamComplete = true;
      cleanup();
      resolve({ fullText: chunks.join('') });
    };
    
    const handleError = (error) => {
      cleanup();
      reject(error);
    };
    
    const unsubChunk = bridgeService.on('stream_chunk', handleChunk);
    const unsubEnd = bridgeService.on('stream_end', handleStreamEnd);
    const unsubError = bridgeService.on('error', handleError);
    
    function cleanup() {
      unsubChunk();
      unsubEnd();
      unsubError();
    }
    
    setTimeout(() => {
      if (!streamComplete) {
        cleanup();
        reject(new Error('Stream timeout'));
      }
    }, 60000);
    
    if (bridgeService.isReady()) {
      bridgeService.sendChat(prompt, context, true);
    } else {
      cleanup();
      reject(new Error('Bridge not connected'));
    }
  });
}

// Health check
export async function checkBackend() {
  try {
    const res = await fetch(API_URL.replace('/v1/chat/completions', '/v1/models'), 
      { method: 'GET', signal: AbortSignal.timeout(5000) }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export function isStreamingAvailable() {
  return bridgeService.isReady();
}

export function getConnectionStatus() {
  return bridgeService.getStatus();
}

export function abortStream() {
  bridgeService.sendInterruption();
}

export default { 
  sendSofieMessage, 
  streamWithFallback,
  streamSofiePrompt,
  checkBackend, 
  isStreamingAvailable,
  getConnectionStatus,
  abortStream
};
