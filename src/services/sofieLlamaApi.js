// sofieLlamaApi.js
// Service for connecting to the real Llama Sofie AI backend

const API_URL = process.env.REACT_APP_SOFIE_LLAMA_API_URL || 'http://localhost:5000/api/sofie-llama'; // Update as needed

export async function sendSofieMessage(message, context = []) {
  // context: optional array of previous messages for multi-turn
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers here if needed
      },
      body: JSON.stringify({
        message,
        context,
      }),
    });
    if (!response.ok) throw new Error('Llama Sofie API error');
    const data = await response.json();
    return data.reply || '...';
  } catch (err) {
    return 'Sorry, I could not reach the Sofie AI right now.';
  }
}
