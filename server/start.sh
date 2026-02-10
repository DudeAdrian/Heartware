#!/bin/bash

# Heartware Unified Server Startup Script
# Runs all components on port 3000

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║              HEARTWARE UNIFIED SERVER v3.0                    ║"
echo "║         Starting on Port 3000 with Full Integration           ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v20+"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check for external services
echo "🔍 Checking external services..."
echo ""

# Check SOFIE LLaMA Backend (port 8001)
if curl -s http://localhost:8001/health > /dev/null 2>&1; then
    echo "✅ SOFIE LLaMA Backend: http://localhost:8001"
else
    echo "⚠️  SOFIE LLaMA Backend: Not running (optional)"
    echo "   Start with: llama.cpp server on port 8001"
fi

# Check sandironratio-node Bridge (port 9001)
if nc -z localhost 9001 2>/dev/null; then
    echo "✅ sandironratio-node Bridge: ws://localhost:9001"
else
    echo "⚠️  sandironratio-node Bridge: Not running (optional)"
    echo "   Laboratory/sandbox will be unavailable"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Determine mode
if [ "$NODE_ENV" = "production" ]; then
    echo "🚀 Starting in PRODUCTION mode..."
    echo ""
    
    # Build React if needed
    if [ ! -d "build" ]; then
        echo "📦 Building React app..."
        npm run build
        echo ""
    fi
    
    echo "✨ Starting unified server on port 3000..."
    NODE_ENV=production node server/index.js
else
    echo "🛠️  Starting in DEVELOPMENT mode..."
    echo ""
    echo "📝 Note: For development, consider running:"
    echo "   npm run start:dev"
    echo ""
    echo "✨ Starting unified server on port 3000..."
    node server/index.js
fi
