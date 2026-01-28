# S.O.F.I.E LLaMA Bridge: Connects protocol engine to real LLaMA inference
import requests
from sofie_protocol_engine import sofie_protocol_respond

LLAMA_API_URL = "http://127.0.0.1:8000/v1/chat/completions"  # Update to your LLaMA backend

def llama_infer(messages):
    # Converts protocol messages to LLaMA API format
    payload = {"messages": messages}
    resp = requests.post(LLAMA_API_URL, json=payload)
    resp.raise_for_status()
    data = resp.json()
    # Expecting OpenAI-style: { choices: [ { message: { content: ... } } ] }
    return data["choices"][0]["message"]["content"]

# Example FastAPI endpoint using real LLaMA
if __name__ == "__main__":
    from fastapi import FastAPI
    from pydantic import BaseModel
    from fastapi.middleware.cors import CORSMiddleware
    app = FastAPI()
    app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

    class SofieRequest(BaseModel):
        user_id: str
        input: str

    @app.post("/v1/sofie/chat")
    async def sofie_chat(req: SofieRequest):
        reply = sofie_protocol_respond(req.user_id, req.input, llama_infer)
        return {"reply": reply}

    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
