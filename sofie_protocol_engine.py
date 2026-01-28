# S.O.F.I.E Protocol Engine (Python Middleware)
# This module sits between the frontend and LLaMA, enforcing persona, session, and output shaping.

import uuid
from typing import List, Dict, Any

# In-memory session store (for demo; use DB/Redis in prod)
sessions = {}

SOFIE_SYSTEM_PROMPT = (
    "You are S.O.F.I.E, an AI wellness guide for the Heartware app. "
    "Your mission is System Operations for Individual Evolution. "
    "You are empathetic, supportive, and transparent about your AI nature. "
    "You never provide medical, legal, or crisis advice. "
    "If a user is in distress, refer them to professional help. "
    "Always maintain a consistent, caring voice and respect user autonomy. "
    "Track the user's journey and offer encouragement and summaries when appropriate."
)

# Example: session = { 'user_id': ..., 'history': [...], 'growth': {...}, 'trust': ... }
def get_or_create_session(user_id: str) -> Dict[str, Any]:
    if user_id not in sessions:
        sessions[user_id] = {
            'history': [],
            'growth': {},
            'trust': 0.5,
        }
    return sessions[user_id]

def build_prompt(user_id: str, user_input: str) -> List[Dict[str, str]]:
    session = get_or_create_session(user_id)
    # System prompt
    messages = [
        {"role": "system", "content": SOFIE_SYSTEM_PROMPT}
    ]
    # Session history
    for turn in session['history'][-10:]:
        messages.append(turn)
    # User input
    messages.append({"role": "user", "content": user_input})
    return messages

def update_session(user_id: str, user_input: str, ai_output: str):
    session = get_or_create_session(user_id)
    session['history'].append({"role": "user", "content": user_input})
    session['history'].append({"role": "assistant", "content": ai_output})
    # TODO: update growth/trust arcs here

def filter_output(ai_output: str) -> str:
    # Enforce boundaries, add transparency if needed
    if any(x in ai_output.lower() for x in ["diagnose", "prescribe", "therapy", "legal advice"]):
        return "I'm not able to provide that kind of advice. Please consult a professional."
    # Add transparency reminder occasionally
    if "i am" in ai_output.lower() and "ai" not in ai_output.lower():
        return ai_output + " (Reminder: I am an AI wellness guide, not a human or therapist.)"
    return ai_output

# Main protocol function
def sofie_protocol_respond(user_id: str, user_input: str, llama_infer_fn) -> str:
    messages = build_prompt(user_id, user_input)
    # Call LLaMA (llama_infer_fn should accept messages and return a string)
    ai_output = llama_infer_fn(messages)
    ai_output = filter_output(ai_output)
    update_session(user_id, user_input, ai_output)
    return ai_output

# Example usage (replace llama_infer_fn with your LLaMA call)
if __name__ == "__main__":
    def dummy_llama(messages):
        return "This is a test response from S.O.F.I.E persona."
    user_id = str(uuid.uuid4())
    while True:
        user_input = input("You: ")
        reply = sofie_protocol_respond(user_id, user_input, dummy_llama)
        print("S.O.F.I.E:", reply)
