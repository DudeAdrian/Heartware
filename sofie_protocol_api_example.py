# Example FastAPI app to bridge Heartware frontend to S.O.F.I.E protocol engine and LLaMA
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sofie_protocol_engine import sofie_protocol_respond

app = FastAPI()

# Allow frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SofieRequest(BaseModel):
    user_id: str
    input: str

@app.post("/v1/sofie/chat")
async def sofie_chat(req: SofieRequest):
    # Replace with your real LLaMA inference function
    def llama_infer(messages):
        # TODO: Call your LLaMA backend here
        return "[LLAMA OUTPUT HERE]"
    reply = sofie_protocol_respond(req.user_id, req.input, llama_infer)
    return {"reply": reply}
