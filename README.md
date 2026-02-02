@"
# Heartware 2.0.1

**Sovereign AI Companion with Galaxy Visualization**

## Quick Start (Windows)

\`\`\`powershell
# 1. Start AI backend
cd C:\llama
.\server.exe -m models\your-model.gguf --port 8001 -c 2048

# 2. Start Piper (optional)
cd C:\llama\voices
piper --model en_US-amy-medium.onnx --http-server --port 5000

# 3. Start Heartware
cd C:\Users\squat\Heartware
.\start-all.ps1
\`\`\`

## Docker

\`\`\`bash
docker-compose up --build
\`\`\`

## Features

- Galaxy visualization (35k particles)
- Voice conversation with Sofie
- Terratone frequency generator (manual toggle)
- Real-time date awareness (2026)

## Version

v2.0.1-stable
"@ | Out-File -FilePath "README.md" -Encoding utf8