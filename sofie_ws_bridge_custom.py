# Minimal SOFIE WebSocket bridge for Heartware UI (custom port)
# Usage: python sofie_ws_bridge_custom.py 9001

import sys
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
    user_id = "user1"
    print("[SOFIE WS] Client connected")
    try:
        # Send initial status message to confirm connection
        await websocket.send_text(json.dumps({"type": "status", "status": "connected"}))
        while True:
            data = await websocket.receive_text()
            print('[SOFIE WS] Received:', data)
            try:
                # Accept pings, handshake, or any message
                if data == 'ping' or data == '{"type":"ping"}':
                    await websocket.send_text(json.dumps({"type": "pong"}))
                    continue
                msg = json.loads(data)
                # If message type is handshake, respond with status
                if msg.get('type') == 'handshake':
                    await websocket.send_text(json.dumps({"type": "status", "status": "connected"}))
                    continue
                user_input = msg.get("input") or msg.get("text") or str(msg)
                if not user_input:
                    await websocket.send_text(json.dumps({"type": "error", "error": "No input provided"}))
                    continue
                def llama_infer(messages):
                    return "[LLAMA OUTPUT HERE]"
                reply = sofie_protocol_respond(user_id, user_input, llama_infer)
                await websocket.send_text(json.dumps({"type": "token", "token": reply}))
            except Exception as e:
                print('[SOFIE WS] Error:', str(e))
                await websocket.send_text(json.dumps({"type": "error", "error": str(e)}))
    except WebSocketDisconnect:
        print('[SOFIE WS] Client disconnected')
        pass

if __name__ == "__main__":
    import uvicorn
    port = 9001
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    uvicorn.run(app, host="0.0.0.0", port=port)
