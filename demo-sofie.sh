#!/bin/bash
echo "=== SOFIE CLI Demo ==="
echo ""
echo "$ npm run sofie"
echo ""
timeout 3 node cli/sofie-cli.js << 'INPUT' 2>&1 | head -50
/agents
/tasks
/status
/quit
INPUT
