# Unified Server Implementation - Complete

**Date**: 2026-02-10
**Status**: ✅ Ready for deployment
**Port**: 3000 (all components unified)

---

## What Was Built

### Unified Backend Server (`server/index.js`)

A single Express.js server that runs on port 3000 and integrates:

1. **Heartware React UI** - Frontend served on `/`
2. **SOFIE LLaMA Backend** - Proxied to `/api/sofie/*` (from port 8001)
3. **sandironratio-node Bridge** - Connected via WebSocket (port 9001)
4. **God Mode API** - Admin controls at `/api/god/*`
5. **WebSocket Server** - Real-time communication at `ws://localhost:3000/ws`

### Key Features

#### 1. SOFIE AI Integration
- Proxies to SOFIE LLaMA backend (port 8001)
- All AI/voice requests go through `/api/sofie/*`
- Seamless voice interface in React UI
- Streaming support for real-time responses

#### 2. Bridge Laboratory
- WebSocket connection to sandironratio-node (port 9001)
- Real-time chamber state synchronization
- God mode access to ecosystem development
- Auto-reconnect on connection loss

#### 3. God Mode
```
GET  /api/god/status       # Admin status
POST /api/god/command      # Execute admin commands
```

Commands available:
- `bridge.status` - Bridge connection state
- `sofie.status` - AI backend health
- `agents.list` - View agent council

#### 4. API Endpoints

```
GET  /api/health           # System health check
POST /api/sofie/*          # SOFIE LLaMA (proxied to port 8001)
GET  /api/bridge/status    # Bridge connection status
POST /api/bridge/send      # Send message to bridge
GET  /api/god/status       # God mode status
POST /api/god/command      # Execute god mode command
POST /api/voice/synthesize # Voice synthesis
```

#### 5. WebSocket Communication

- Path: `ws://localhost:3000/ws`
- Real-time bridge messages
- Agent coordination
- Chamber updates
- Broadcast to all connected clients

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Port 3000                                  │
│                  Unified Heartware Server                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  React UI (/)                                                   │
│    └── Voice, Galaxy, Web3, God Mode UI                        │
│                                                                 │
│  API Layer                                                      │
│    ├── /api/sofie/*    → SOFIE LLaMA (8001)                   │
│    ├── /api/bridge/*   → sandironratio-node (9001)             │
│    ├── /api/god/*      → God Mode controls                     │
│    └── /api/voice/*    → Voice processing                      │
│                                                                 │
│  WebSocket (/ws)                                                │
│    └── Real-time: Bridge ↔ UI ↔ Agents                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
              ↓                ↓                ↓
      [SOFIE LLaMA]  [sandironratio-node]  [AI Agents]
        Port 8001      Bridge Port 9001     Council
```

---

## Installation & Startup

### Step 1: Install Dependencies

```bash
npm install
```

New dependencies added:
- `express` - Web server
- `http-proxy-middleware` - API proxying
- `ws` - WebSocket support
- `cors` - CORS handling
- `concurrently` - Run multiple processes (dev mode)

### Step 2: Start External Services (Optional)

**SOFIE LLaMA Backend** (port 8001):
```bash
# Run llama.cpp server or compatible backend
llama-server -m model.gguf --port 8001
```

**sandironratio-node Bridge** (port 9001):
```bash
# In sandironratio-node repo
npm run bridge
```

### Step 3: Start Unified Server

**Production Mode** (serves built React):
```bash
npm run build  # Build React once
npm start      # Start unified server
```

**Development Mode** (proxies to React dev server):
```bash
# Option 1: Run both together
npm run start:dev

# Option 2: Run separately
npm run start:server  # Terminal 1
npm run start:ui      # Terminal 2 (React on port 3001)
```

**Using Scripts**:
```bash
# Linux/Mac
./server/start.sh

# Windows
.\server\start.ps1
```

---

## Configuration

### Environment Variables

Create `.env` file (or use existing `.env.example`):

```bash
# Server
PORT=3000
NODE_ENV=development

# External Services
SOFIE_LLAMA_URL=http://localhost:8001
SANDIRONRATIO_BRIDGE=ws://localhost:9001

# React App (from .env.example)
REACT_APP_TERRACARE_RPC_URL=http://localhost:8545
REACT_APP_CHAIN_ID=1337
# ... other variables
```

---

## Usage

### Access Points

- **Main UI**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **God Mode**: http://localhost:3000/api/god/status
- **Bridge Status**: http://localhost:3000/api/bridge/status
- **WebSocket**: ws://localhost:3000/ws

### God Mode Commands

```bash
# Get status
curl http://localhost:3000/api/god/status

# List agents
curl -X POST http://localhost:3000/api/god/command \
  -H "Content-Type: application/json" \
  -d '{"command":"agents.list"}'

# Check SOFIE status
curl -X POST http://localhost:3000/api/god/command \
  -H "Content-Type: application/json" \
  -d '{"command":"sofie.status"}'
```

### WebSocket Example

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onopen = () => {
  console.log('Connected to unified server');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.source === 'bridge') {
    console.log('Bridge message:', data);
  }
};

// Send to bridge
ws.send(JSON.stringify({
  target: 'bridge',
  type: 'chamber:query',
  data: { chamber: 5 }
}));
```

---

## Files Modified/Created

### Created
```
server/
  ├── index.js              # Main unified server (355 lines)
  ├── README.md             # Server documentation
  ├── start.sh              # Linux/Mac startup script
  └── start.ps1             # Windows startup script

UNIFIED_SERVER_IMPLEMENTATION.md  # This file
```

### Modified
```
package.json              # Added dependencies & scripts
src/core/SofieCore.js    # Updated API endpoint to /api/sofie/*
```

---

## NPM Scripts

```bash
# Production
npm start              # Start unified server (serves built React)
npm run build          # Build React for production

# Development
npm run start:dev      # Start both backend + UI
npm run start:server   # Start backend only
npm run start:ui       # Start React dev server only

# CLI Tools
npm run sofie          # SOFIE CLI terminal
npm run agents         # View agent council
npm run tasks          # View task queue
```

---

## Integration Points

### 1. SOFIE LLaMA (AI/Voice)

**Requirement**: Running on port 8001

Frontend makes requests to `/api/sofie/completion` which proxies to `http://localhost:8001/completion`.

### 2. sandironratio-node (Laboratory)

**Requirement**: Bridge running on port 9001

Server connects via WebSocket and:
- Receives chamber updates
- Forwards God mode commands
- Synchronizes agent states

### 3. AI Agent Council

**Status**: Operational

Agents configured in `.github/agents/council-config.json`:
- Architect, Test, Doc, Security, Refactor, Integration
- Daily automation via GitHub Actions

---

## Benefits

✅ **Single Port** - Everything on 3000, no juggling ports
✅ **God Mode** - Full admin access to ecosystem
✅ **Bridge Laboratory** - sandbox for development
✅ **Voice Integration** - Full SOFIE voice capabilities
✅ **WebSocket** - Real-time communication
✅ **Production Ready** - Serves built React app
✅ **Development Friendly** - Proxies to dev servers
✅ **Auto-Reconnect** - Bridge reconnects automatically

---

## Next Steps

1. **Install dependencies**: `npm install`
2. **Start SOFIE LLaMA**: Port 8001 (optional but recommended)
3. **Start sandironratio-node bridge**: Port 9001 (optional)
4. **Run unified server**: `npm start` or `npm run start:dev`
5. **Access**: http://localhost:3000

---

## Troubleshooting

### Dependencies not found
```bash
npm install
```

### Port 3000 in use
```bash
PORT=3100 npm start
```

### SOFIE LLaMA not connecting
```bash
# Check it's running
curl http://localhost:8001/health

# Check unified server can reach it
curl http://localhost:3000/api/health
```

### Bridge not connecting
```bash
# Server will auto-reconnect every 5 seconds
# Check sandironratio-node bridge is running on port 9001
```

---

**Status**: ✅ Implementation Complete
**Ready**: For deployment on port 3000
**Components**: Unified and operational

**The ecosystem runs on port 3000. God mode is active. The laboratory is ready. The Dude abides. 🌟**
