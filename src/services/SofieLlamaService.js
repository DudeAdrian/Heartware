// SOFIE LLaMA API Service for Heartware
// Connects to local S.O.F.I.E. LLaMA server via HTTP

const SOFIE_API_URL = 'http://127.0.0.1:8080/v1/sofie/chat';

export async function sendSofiePrompt(prompt, context = {}) {
  try {
    // Use user_id from context or fallback
    const user_id = context.user_id || 'demo-user';
    const payload = {
      user_id,
      input: prompt
    };
    const response = await fetch(SOFIE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('SOFIE API error: ' + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
}
