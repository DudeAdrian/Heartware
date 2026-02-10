# Heartware Unified Server - Port 3000

## Overview

The **Heartware Unified Server** integrates all ecosystem components on a single port (3000):

- **Heartware UI** - React frontend with voice interface
- **SOFIE LLaMA Backend** - AI/Voice processing (port 8001)
- **sandironratio-node Bridge** - Laboratory/sandbox (port 9001)
- **God Mode** - Admin controls and agent coordination
- **WebSocket** - Real-time communication

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Port 3000 - Unified Server                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  React UI (/)                                               │
│    └── Galaxy visualization, voice, Web3                   │
│                                                             │
│  API Routes                                                 │
│    ├── /api/sofie/*     → Proxy to SOFIE LLaMA (8001)     │
│    ├── /api/bridge/*    → sandironratio-node (9001)        │
│    ├── /api/god/*       → God Mode admin controls          │
│    └── /api/voice/*     → Voice processing                 │
│                                                             │
│  WebSocket (/ws)                                            │
│    └── Real-time bridge and agent communication            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
    [SOFIE LLaMA]    [sandironratio-node]    [Agents]
      Port 8001          Bridge 9001          Council
```

## Quick Start

### Prerequisites

1. **SOFIE LLaMA Backend** running on port 8001
2. **sandironratio-node** with bridge on port 9001 (optional)
3. **Node.js** v20+

### Installation

```bash
# Install dependencies
npm install

# Start unified server (production mode)
npm start

# Or development mode (React dev server + backend)
npm run start:dev
```

### Access

- **UI**: http://localhost:3000
- **Health**: http://localhost:3000/api/health
- **God Mode**: http://localhost:3000/api/god/status
- **Bridge**: http://localhost:3000/api/bridge/status
- **WebSocket**: ws://localhost:3000/ws

## Environment Variables

Create `.env` file:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# External Services
SOFIE_LLAMA_URL=http://localhost:8001
SANDIRONRATIO_BRIDGE=ws://localhost:9001

# React App Variables (from .env.example)
REACT_APP_TERRACARE_RPC_URL=http://localhost:8545
REACT_APP_CHAIN_ID=1337
# ... other variables
```

## API Endpoints

### Health Check
```bash
GET /api/health

Response:
{
  "status": "healthy",
  "components": {
    "ui": "online",
    "sofie": "http://localhost:8001",
    "bridge": "connected|disconnected",
    "godMode": "active"
  }
}
```

### SOFIE API (Proxy)
```bash
POST /api/sofie/completion
Content-Type: application/json

{
  "prompt": "Hello SOFIE",
  "max_tokens": 60,
  "temperature": 0.8
}
```

### Bridge API
```bash
# Get bridge status
GET /api/bridge/status

# Send message to bridge
POST /api/bridge/send
{
  "type": "chamber:enter",
  "data": {...}
}
```

### God Mode
```bash
# Get God Mode status
GET /api/god/status

Response:
{
  "active": true,
  "permissions": ["read", "write", "execute", "admin"],
  "laboratory": {
    "status": "active",
    "environment": "sandbox",
    "ecosystemDev": true
  }
}

# Execute God Mode command
POST /api/god/command
{
  "command": "agents.list",
  "args": {}
}
```

## Development Mode

In development, the unified server proxies to React dev server on port 3001:

```bash
# Terminal 1: Start unified backend
npm run start:server

# Terminal 2: Start React dev server
npm run start:ui

# Or use concurrently
npm run start:dev
```

## Production Mode

Build React and serve from unified server:

```bash
# Build React app
npm run build

# Start unified server
NODE_ENV=production npm start
```

Server will serve the built React app from `/build` directory.

## WebSocket Communication

Connect to real-time updates:

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
  
  if (data.source === 'bridge') {
    // Message from sandironratio-node bridge
  }
};

// Send to bridge
ws.send(JSON.stringify({
  target: 'bridge',
  type: 'chamber:update',
  data: {...}
}));
```

## God Mode Features

God Mode provides admin-level access to:

1. **Agent Council Control**
   - View agent status
   - Execute agent commands
   - Monitor task queue

2. **Bridge Laboratory**
   - Send commands to sandironratio-node
   - Monitor chamber states
   - Coordinate ecosystem development

3. **SOFIE Administration**
   - Check AI backend status
   - Monitor voice processing
   - System diagnostics

## Integration with sandironratio-node

The bridge connects to sandironratio-node for:

- **Chamber coordination** - 9 Chambers Academy
- **Hive consensus** - Geographic agent network
- **Laboratory access** - Ecosystem development sandbox
- **Agent synchronization** - Cross-system coordination

## Troubleshooting

### SOFIE LLaMA not connecting
```bash
# Check SOFIE backend is running
curl http://localhost:8001/health

# Check proxy configuration
curl http://localhost:3000/api/health
```

### Bridge not connecting
```bash
# Check sandironratio-node is running with bridge
# Default: ws://localhost:9001

# Check bridge status
curl http://localhost:3000/api/bridge/status
```

### Port 3000 already in use
```bash
# Use different port
PORT=3100 npm start
```

## Scripts Reference

```bash
npm start          # Start unified server (production)
npm run start:ui   # Start React dev server on port 3001
npm run start:dev  # Start both backend + UI (development)
npm run build      # Build React for production
npm run sofie      # Start SOFIE CLI
npm run agents     # View agent council
npm run tasks      # View task queue
```

## Files Structure

```
server/
  ├── index.js              # Main unified server
  └── routes/               # API route handlers (future)

cli/
  ├── sofie-cli.js          # SOFIE terminal interface
  └── README.md             # CLI documentation

.github/
  ├── agents/               # Agent council configuration
  └── workflows/            # Daily automation

src/                        # React UI source
build/                      # React production build
```

## Benefits of Unified Server

✅ **Single Port** - All components on port 3000
✅ **Simplified Deployment** - One server to manage
✅ **God Mode Integration** - Built-in admin access
✅ **Bridge Laboratory** - Sandbox for ecosystem dev
✅ **WebSocket Support** - Real-time communication
✅ **Production Ready** - Serves built React app
✅ **Development Friendly** - Proxies to dev servers

---

**The ecosystem is unified. The laboratory is active. The Dude abides. 🌟**
