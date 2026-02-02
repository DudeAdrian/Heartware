Write-Host "🚀 Starting Heartware 2.0.1..." -ForegroundColor Magenta

try {
    Invoke-RestMethod "http://localhost:8001/health" -ErrorAction Stop | Out-Null
    Write-Host "✅ Llama backend: localhost:8001" -ForegroundColor Green
} catch {
    Write-Host "❌ Start llama first: .\server.exe -m model.gguf --port 8001" -ForegroundColor Red
    exit
}

try {
    Invoke-RestMethod "http://localhost:5000" -Method Post -ErrorAction Stop | Out-Null
    Write-Host "✅ Amy voice: localhost:5000" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Piper optional - browser voice fallback" -ForegroundColor Yellow
}

npm start
