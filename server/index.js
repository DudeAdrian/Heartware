/**
 * Unified Heartware Server - Port 3000
 * 
 * Integrates all ecosystem components:
 * - Heartware UI (React)
 * - SOFIE LLaMA Backend (AI/Voice)
 * - sandironratio-node Bridge (Laboratory)
 * - God Mode (Admin Controls)
 */

const express = require('express');
const http = require('http');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 3000;
const SOFIE_LLAMA_URL = process.env.SOFIE_LLAMA_URL || 'http://localhost:8001';
const SANDIRONRATIO_BRIDGE = process.env.SANDIRONRATIO_BRIDGE || 'ws://localhost:9001';
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║                                                               ║');
console.log('║              HEARTWARE UNIFIED SERVER v3.0                    ║');
console.log('║       AI + Bridge + God Mode on Port 3000                    ║');
console.log('║                                                               ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// ═══════════════════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  if (!req.path.startsWith('/static') && !req.path.endsWith('.js') && !req.path.endsWith('.css')) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// ═══════════════════════════════════════════════════════════════════════════
// BRIDGE CONNECTION - sandironratio-node Laboratory
// ═══════════════════════════════════════════════════════════════════════════

let bridgeConnection = null;
let bridgeReconnectInterval = null;

function connectToBridge() {
  try {
    bridgeConnection = new WebSocket(SANDIRONRATIO_BRIDGE);
    
    bridgeConnection.on('open', () => {
      console.log('✅ Connected to sandironratio-node bridge (Laboratory)');
      if (bridgeReconnectInterval) {
        clearInterval(bridgeReconnectInterval);
        bridgeReconnectInterval = null;
      }
    });
    
    bridgeConnection.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        console.log('📡 Bridge message:', message.type);
        // Broadcast to all connected WebSocket clients
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ source: 'bridge', ...message }));
          }
        });
      } catch (error) {
        console.error('Bridge message parse error:', error);
      }
    });
    
    bridgeConnection.on('error', (error) => {
      console.error('⚠️  Bridge connection error:', error.message);
    });
    
    bridgeConnection.on('close', () => {
      console.log('🔌 Bridge disconnected. Attempting reconnect in 5s...');
      bridgeConnection = null;
      if (!bridgeReconnectInterval) {
        bridgeReconnectInterval = setInterval(connectToBridge, 5000);
      }
    });
  } catch (error) {
    console.error('❌ Failed to connect to bridge:', error.message);
  }
}

// Start bridge connection
connectToBridge();

// ═══════════════════════════════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════════════════════════════

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'heartware-unified-server',
    version: '3.0.0',
    components: {
      ui: 'online',
      sofie: SOFIE_LLAMA_URL,
      bridge: bridgeConnection ? 'connected' : 'disconnected',
      godMode: 'active'
    },
    timestamp: new Date().toISOString()
  });
});

// SOFIE LLaMA Proxy - AI/Voice backend
app.use('/api/sofie', createProxyMiddleware({
  target: SOFIE_LLAMA_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/sofie': ''
  },
  onError: (err, req, res) => {
    console.error('SOFIE proxy error:', err.message);
    res.status(503).json({
      error: 'SOFIE LLaMA backend unavailable',
      message: 'Start SOFIE LLaMA backend on port 8001',
      details: err.message
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('→ SOFIE:', req.method, req.path);
  }
}));

// Bridge API - sandironratio-node laboratory
app.get('/api/bridge/status', (req, res) => {
  res.json({
    connected: bridgeConnection !== null && bridgeConnection.readyState === WebSocket.OPEN,
    url: SANDIRONRATIO_BRIDGE,
    readyState: bridgeConnection ? bridgeConnection.readyState : null,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/bridge/send', (req, res) => {
  if (!bridgeConnection || bridgeConnection.readyState !== WebSocket.OPEN) {
    return res.status(503).json({
      error: 'Bridge not connected',
      message: 'sandironratio-node bridge is offline'
    });
  }
  
  try {
    bridgeConnection.send(JSON.stringify(req.body));
    res.json({ success: true, sent: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// God Mode - Admin Controls
app.get('/api/god/status', (req, res) => {
  res.json({
    active: true,
    mode: 'development',
    permissions: ['read', 'write', 'execute', 'admin'],
    agents: {
      council: 'operational',
      sofie: 'online',
      bridge: bridgeConnection ? 'connected' : 'disconnected'
    },
    laboratory: {
      status: 'active',
      environment: 'sandbox',
      ecosystemDev: true
    }
  });
});

app.post('/api/god/command', async (req, res) => {
  const { command, args } = req.body;
  
  console.log('🔱 God Mode Command:', command, args);
  
  // Execute god mode commands
  try {
    let result;
    
    switch (command) {
      case 'bridge.status':
        result = {
          connected: bridgeConnection !== null,
          readyState: bridgeConnection?.readyState
        };
        break;
        
      case 'sofie.status':
        const response = await fetch(`${SOFIE_LLAMA_URL}/health`);
        result = await response.json();
        break;
        
      case 'agents.list':
        result = {
          agents: [
            { id: 'architect', status: 'ready' },
            { id: 'test', status: 'ready' },
            { id: 'doc', status: 'ready' },
            { id: 'security', status: 'ready' },
            { id: 'refactor', status: 'ready' },
            { id: 'integration', status: 'ready' }
          ]
        };
        break;
        
      default:
        result = { message: `Command ${command} queued for execution` };
    }
    
    res.json({ success: true, command, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Voice API
app.post('/api/voice/synthesize', (req, res) => {
  const { text } = req.body;
  // Voice synthesis handled by browser Web Speech API
  res.json({
    success: true,
    method: 'browser-synthesis',
    text
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// WEBSOCKET SERVER - Real-time Communication
// ═══════════════════════════════════════════════════════════════════════════

const wss = new WebSocket.Server({ server, path: '/ws' });

wss.on('connection', (ws, req) => {
  console.log('🔌 WebSocket client connected');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to Heartware Unified Server',
    components: {
      sofie: 'available',
      bridge: bridgeConnection ? 'connected' : 'disconnected',
      godMode: 'active'
    }
  }));
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('📨 WS message:', data.type);
      
      // Forward certain messages to bridge
      if (data.target === 'bridge' && bridgeConnection) {
        bridgeConnection.send(JSON.stringify(data));
      }
      
      // Broadcast to other clients
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } catch (error) {
      console.error('WS message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('🔌 WebSocket client disconnected');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// STATIC FILES - React UI
// ═══════════════════════════════════════════════════════════════════════════

if (NODE_ENV === 'production') {
  // Serve React build
  const buildPath = path.join(__dirname, '..', 'build');
  app.use(express.static(buildPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  // Development: Proxy to React dev server
  app.use('/', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    ws: true,
    onError: (err, req, res) => {
      console.log('⚠️  React dev server not running on port 3001');
      res.status(503).send('Start React dev server with: npm run start:ui');
    }
  }));
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVER STARTUP
// ═══════════════════════════════════════════════════════════════════════════

server.listen(PORT, () => {
  console.log(`\n✨ Server ready on port ${PORT}\n`);
  console.log('📡 Components:');
  console.log(`   - UI:        http://localhost:${PORT}`);
  console.log(`   - SOFIE API: http://localhost:${PORT}/api/sofie/*`);
  console.log(`   - Bridge:    http://localhost:${PORT}/api/bridge/*`);
  console.log(`   - God Mode:  http://localhost:${PORT}/api/god/*`);
  console.log(`   - WebSocket: ws://localhost:${PORT}/ws`);
  console.log(`\n🔗 External Services:`);
  console.log(`   - SOFIE LLaMA: ${SOFIE_LLAMA_URL}`);
  console.log(`   - Bridge:      ${SANDIRONRATIO_BRIDGE}`);
  console.log('\n🌟 The Dude abides. The ecosystem is unified.\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  if (bridgeConnection) {
    bridgeConnection.close();
  }
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
