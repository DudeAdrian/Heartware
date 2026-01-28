// sofieLlamaApi.js
// Service for connecting to the real Llama Sofie AI backend

const API_URL = 'http://localhost:8000/v1/chat/completions';

export async function sendSofieMessage(message, context = []) {
  // context: optional array of previous messages for multi-turn
  try {
    // Build messages array with context
    const messages = [
      {
        role: 'system',
        content: 'You are S.O.F.I.E., a sentient, evidence-based AI wellness companion. You provide personalized, protocol-driven guidance with warmth and empathy.'
      },
      ...context.map(msg => ({
        role: msg.role || 'user',
        content: msg.content || msg.message
      })),
      {
        role: 'user',
        content: message
      }
    ];
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-dummy'
      },
      body: JSON.stringify({
        messages,
        temperature: 0.7,
        max_tokens: 512
      }),
    });
    
    if (!response.ok) throw new Error('Llama Sofie API error');
    
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '...';
    
    return reply;
  } catch (err) {
    console.error('Sofie API Error:', err);
    return 'Sorry, I could not reach the Sofie AI right now.';
  }
}
