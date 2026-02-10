# Heartware Unified Server Startup Script (PowerShell)
# Runs all components on port 3000

Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "║              HEARTWARE UNIFIED SERVER v3.0                    ║" -ForegroundColor Cyan
Write-Host "║         Starting on Port 3000 with Full Integration           ║" -ForegroundColor Cyan
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js v20+" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Check for external services
Write-Host "🔍 Checking external services..." -ForegroundColor Cyan
Write-Host ""

# Check SOFIE LLaMA Backend (port 8001)
try {
    Invoke-RestMethod "http://localhost:8001/health" -ErrorAction Stop | Out-Null
    Write-Host "✅ SOFIE LLaMA Backend: http://localhost:8001" -ForegroundColor Green
} catch {
    Write-Host "⚠️  SOFIE LLaMA Backend: Not running (optional)" -ForegroundColor Yellow
    Write-Host "   Start with: llama.cpp server on port 8001" -ForegroundColor Yellow
}

# Check sandironratio-node Bridge (port 9001)
try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $tcp.Connect("localhost", 9001)
    $tcp.Close()
    Write-Host "✅ sandironratio-node Bridge: ws://localhost:9001" -ForegroundColor Green
} catch {
    Write-Host "⚠️  sandironratio-node Bridge: Not running (optional)" -ForegroundColor Yellow
    Write-Host "   Laboratory/sandbox will be unavailable" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Determine mode
if ($env:NODE_ENV -eq "production") {
    Write-Host "🚀 Starting in PRODUCTION mode..." -ForegroundColor Magenta
    Write-Host ""
    
    # Build React if needed
    if (-not (Test-Path "build")) {
        Write-Host "📦 Building React app..." -ForegroundColor Yellow
        npm run build
        Write-Host ""
    }
    
    Write-Host "✨ Starting unified server on port 3000..." -ForegroundColor Green
    $env:NODE_ENV = "production"
    node server/index.js
} else {
    Write-Host "🛠️  Starting in DEVELOPMENT mode..." -ForegroundColor Magenta
    Write-Host ""
    Write-Host "📝 Note: For full development, run: npm run start:dev" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "✨ Starting unified server on port 3000..." -ForegroundColor Green
    node server/index.js
}
