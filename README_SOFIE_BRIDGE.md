# S.O.F.I.E Persona Bridging: Quick Start

## 1. Start the LLaMA Backend
- Ensure your LLaMA server is running and accessible at the configured URL (default: http://127.0.0.1:8000/v1/chat/completions)

## 2. Start the S.O.F.I.E Protocol Bridge
- In your project root:
  ```
  python sofie_llama_bridge.py
  ```
- This launches a FastAPI server at http://127.0.0.1:8080/v1/sofie/chat
- All persona shaping, session, and output filtering is handled here

## 3. Start the Heartware React Frontend
- In another terminal:
  ```
  npm start
  ```
- The frontend will POST to http://127.0.0.1:8080/v1/sofie/chat for all Sofie chat

## 4. How It Works
- User input → React frontend → /v1/sofie/chat (protocol engine)
- Protocol engine assembles persona prompt, session, and calls LLaMA
- LLaMA output is filtered for persona, boundaries, and transparency
- Response is returned to frontend and displayed to user

## 5. Troubleshooting
- If you see no reply, check:
  - LLaMA backend is running and reachable
  - No CORS/network errors in browser console
  - Protocol engine logs for errors
- You can test the protocol engine directly with curl or Postman:
  ```
  curl -X POST http://127.0.0.1:8080/v1/sofie/chat -H "Content-Type: application/json" -d '{"user_id": "test", "input": "Hello Sofie!"}'
  ```

## 6. Customization
- Edit sofie_protocol_spec.md to update persona rules/values
- Edit sofie_protocol_engine.py to change session, filtering, or prompt logic
- Edit sofie_llama_bridge.py to update LLaMA backend URL or response handling

---

This setup ensures S.O.F.I.E is a true persona-layered AI, not just a stateless LLM.