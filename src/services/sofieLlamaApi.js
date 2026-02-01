// sofieLlamaApi.js
// Service for connecting to Llama.cpp backend

const API_URL = process.env.REACT_APP_SOFIE_API_URL || 'http://localhost:8000/v1/chat/completions';

export async function sendSofieMessage(message, context = [], onStream = null) {
  console.log('[Sofie] Sending:', message);
  
  try {
    const messages = [
      {
        role: 'system',
        content: 'You are S.O.F.I.E., a wellness companion. Be warm, brief, and evidence-based.'
      },
      ...context.slice(-3), // Keep last 3 messages only
      { role: 'user', content: message }
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // No Authorization header - llama.cpp doesn't need it
      },
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
      const errorText = await response.text();
      console.error('[Sofie] HTTP Error:', response.status, errorText);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('[Sofie] Raw response:', JSON.stringify(data).substring(0, 200));

    // Try multiple response formats
    let reply = '';
    
    if (data.choices?.[0]?.message?.content) {
      // OpenAI format
      reply = data.choices[0].message.content;
    } else if (data.choices?.[0]?.text) {
      // Alternative format
      reply = data.choices[0].text;
    } else if (data.content) {
      // Direct content
      reply = data.content;
    } else if (data.response) {
      // Another variation
      reply = data.response;
    } else if (typeof data === 'string') {
      // Plain text
      reply = data;
    } else {
      console.warn('[Sofie] Unknown format:', data);
      reply = 'I received a response but could not understand the format.';
    }

    console.log('[Sofie] Reply:', reply.substring(0, 100));
    
    // Stream word by word if callback provided
    if (onStream && typeof onStream === 'function') {
      const words = reply.split(' ');
      for (let i = 0; i < words.length; i++) {
        onStream(words[i] + (i < words.length - 1 ? ' ' : ''));
        await new Promise(r => setTimeout(r, 30));
      }
    }
    
    return reply;

  } catch (error) {
    console.error('[Sofie] Error:', error.name, error.message);
    
    if (error.name === 'AbortError') {
      return 'Request timed out after 30 seconds. Is the AI backend running?';
    }
    
    return 'Sorry, I cannot connect to the AI backend. Please check that llama.cpp is running on port 8000.';
  }
}

// Convenience function for streaming
export async function streamSofieMessage(message, context = [], onChunk) {
  return sendSofieMessage(message, context, onChunk);
}

// Health check
export async function checkBackend() {
  try {
    const res = await fetch(API_URL.replace('/v1/chat/completions', '/health'), 
      { method: 'GET', signal: AbortSignal.timeout(5000) }
    );
    return res.ok;
  } catch {
    // Try models endpoint as fallback
    try {
      const res = await fetch(API_URL.replace('/v1/chat/completions', '/v1/models'), 
        { method: 'GET', signal: AbortSignal.timeout(5000) }
      );
      return res.ok;
    } catch {
      return false;
    }
  }
}

export default { sendSofieMessage, streamSofieMessage, checkBackend };
