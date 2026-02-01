# Minimal SOFIE WebSocket bridge for Heartware UI
# Run: python sofie_ws_bridge.py

import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sofie_protocol_engine import sofie_protocol_respond

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    user_id = "user1"  # In production, use real user/session
    try:
        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                user_input = msg.get("input")
                if not user_input:
                    await websocket.send_text(json.dumps({"type": "error", "error": "No input provided"}))
                    continue
                # Dummy LLaMA inference (replace with real if needed)
                def llama_infer(messages):
                    return "[LLAMA OUTPUT HERE]"
                reply = sofie_protocol_respond(user_id, user_input, llama_infer)
                await websocket.send_text(json.dumps({"type": "token", "token": reply}))
            except Exception as e:
                await websocket.send_text(json.dumps({"type": "error", "error": str(e)}))
    except WebSocketDisconnect:
        pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
