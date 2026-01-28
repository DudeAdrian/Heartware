// SOFIE LLaMA API Service for Heartware
// Connects to local S.O.F.I.E. LLaMA server via HTTP

const SOFIE_API_URL = 'http://localhost:8000/v1/chat/completions';

export async function sendSofiePrompt(prompt, context = {}) {
  try {
    // Use user_id from context or fallback
    const user_id = context.user_id || 'demo-user';
    
    // Format for llama.cpp server chat completions endpoint
    const payload = {
      messages: [
        {
          role: 'system',
          content: 'You are S.O.F.I.E., a sentient, evidence-based AI wellness companion. You provide personalized, protocol-driven guidance with warmth and empathy. Always cite evidence when providing wellness advice.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 512
    };
    
    const response = await fetch(SOFIE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error('SOFIE API error: ' + response.status);
    }
    
    const data = await response.json();
    
    // Extract response from OpenAI-compatible format
    const reply = data.choices?.[0]?.message?.content || 'No response from SOFIE';
    
    return { 
      response: reply,
      user_id,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('SOFIE API Error:', error);
    return { error: error.message };
  }
}
