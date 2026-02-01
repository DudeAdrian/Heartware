/**
 * SofieLlamaApi.js
 * Service for connecting to the Llama Sofie AI backend
 * Uses OpenAI-compatible /v1/chat/completions endpoint
 * 
 * Endpoint: http://localhost:8000/v1/chat/completions
 */

import bridgeService from './BridgeService';

const API_URL = process.env.REACT_APP_SOFIE_API_URL || 'http://localhost:8000/v1/chat/completions';

/**
 * Build messages array with required system message
 */
function buildMessages(userMessage, context = []) {
  const systemMessage = {
    role: 'system',
    content: 'You are S.O.F.I.E. (Sentient Organic Friendly Intelligence Entity), a warm and empathetic AI wellness companion. Provide evidence-based guidance with care.'
  };
  
  const history = (context || [])
    .slice(-5) // Last 5 messages
    .map(msg => ({
      role: msg.role || 'user',
      content: msg.content || msg.message || msg.text
    }));
  
  return [systemMessage, ...history, { role: 'user', content: userMessage }];
}

/**
 * Send message and get response
 * @param {string} message - User message
 * @param {array} context - Previous messages
 * @returns {Promise<string>} AI response
 */
export async function sendSofieMessage(message, context = []) {
  try {
    const messages = buildMessages(message, context);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        temperature: 0.7,
        max_tokens: 512
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || 'I apologize, but I could not generate a response.';
    
  } catch (err) {
    console.error('[SofieLlamaApi] Error:', err);
    return 'Sorry, I could not reach the Sofie AI right now. Please try again later.';
  }
}

/**
 * HTTP fallback with simulated streaming
 */
export async function streamWithFallback(prompt, context = {}, onChunk = null, signal = null) {
  console.log('[SofieLlamaApi] streamWithFallback called');
  
  const messages = buildMessages(prompt, context.previousMessages || context.conversationHistory || []);
  
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 30000);
  
  try {
    console.log('[SofieLlamaApi] POST to', API_URL);
    
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
    console.log('[SofieLlamaApi] Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const fullText = data.choices?.[0]?.message?.content || '';
    
    console.log('[SofieLlamaApi] Got response, length:', fullText.length);
    
    // Simulate streaming word-by-word
    if (onChunk && fullText) {
      const words = fullText.split(/(\s+)/);
      for (const word of words) {
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        onChunk(word);
        await new Promise(resolve => setTimeout(resolve, 40));
      }
    }
    
    return fullText;
    
  } catch (error) {
    clearTimeout(timeout);
    console.error('[SofieLlamaApi] Error:', error.message);
    const errorMsg = "I'm having trouble connecting to my neural core. Please ensure the AI backend is running on port 8000.";
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
    let conversationId = null;
    let streamComplete = false;
    
    const handleChunk = (data) => {
      const { payload, id } = data;
      if (payload?.content) {
        chunks.push(payload.content);
        if (onChunk) onChunk(payload.content, payload.isComplete);
      }
      if (id) conversationId = id;
    };
    
    const handleStreamEnd = (data) => {
      streamComplete = true;
      if (data?.payload?.conversationId) {
        conversationId = data.payload.conversationId;
      }
      cleanup();
      resolve({ fullText: chunks.join(''), conversationId });
    };
    
    const handleError = (error) => {
      cleanup();
      reject(new Error(error.message || 'Streaming error'));
    };
    
    const unsubChunk = bridgeService.on('stream_chunk', handleChunk);
    const unsubEnd = bridgeService.on('stream_end', handleStreamEnd);
    const unsubError = bridgeService.on('error', handleError);
    
    function cleanup() {
      unsubChunk();
      unsubEnd();
      unsubError();
    }
    
    const timeout = setTimeout(() => {
      if (!streamComplete) {
        cleanup();
        reject(new Error('Stream timeout'));
      }
    }, 60000);
    
    try {
      if (bridgeService.isReady()) {
        bridgeService.sendChat(prompt, context, true);
      } else {
        cleanup();
        clearTimeout(timeout);
        reject(new Error('Bridge not connected'));
      }
    } catch (error) {
      cleanup();
      clearTimeout(timeout);
      reject(error);
    }
  });
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
  isStreamingAvailable,
  getConnectionStatus,
  abortStream
};
