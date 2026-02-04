#!/bin/sh
# ╔════════════════════════════════════════════════════════════════════════════╗
# ║  DOCKER ENTRYPOINT - Environment Variable Injection                       ║
# ║  Replaces placeholders in env-config.js with runtime values              ║
# ╚════════════════════════════════════════════════════════════════════════════╝

# Generate env-config.js with runtime environment variables
cat > /usr/share/nginx/html/env-config.js << EOF
window._env_ = {
  REACT_APP_TERRACARE_RPC_URL: "${REACT_APP_TERRACARE_RPC_URL:-http://localhost:8545}",
  REACT_APP_CHAIN_ID: "${REACT_APP_CHAIN_ID:-1337}",
  REACT_APP_ENV: "${REACT_APP_ENV:-production}",
  REACT_APP_SOVEREIGN_IDENTITY: "${REACT_APP_SOVEREIGN_IDENTITY:-}",
  REACT_APP_ACCESS_GOVERNOR: "${REACT_APP_ACCESS_GOVERNOR:-}",
  REACT_APP_AUDIT_TRAIL: "${REACT_APP_AUDIT_TRAIL:-}",
  REACT_APP_THOLOS_ADAPTER: "${REACT_APP_THOLOS_ADAPTER:-}",
  REACT_APP_HARMONIC_ADAPTER: "${REACT_APP_HARMONIC_ADAPTER:-}",
  REACT_APP_TERRATONE_ADAPTER: "${REACT_APP_TERRATONE_ADAPTER:-}",
  REACT_APP_SOFIE_OS_ADAPTER: "${REACT_APP_SOFIE_OS_ADAPTER:-}",
  REACT_APP_LLAMA_ADAPTER: "${REACT_APP_LLAMA_ADAPTER:-}",
  REACT_APP_MAP_ADAPTER: "${REACT_APP_MAP_ADAPTER:-}",
  REACT_APP_RELAYER_URL: "${REACT_APP_RELAYER_URL:-}",
  REACT_APP_LEDGER_WS_URL: "${REACT_APP_LEDGER_WS_URL:-}",
  REACT_APP_WALLET_CONNECT_PROJECT_ID: "${REACT_APP_WALLET_CONNECT_PROJECT_ID:-}",
};
EOF

# Inject env-config.js into index.html
sed -i 's|<head>|<head>\n  <script src="/env-config.js"></script>|' /usr/share/nginx/html/index.html

echo "[Heartware] Environment configuration injected"
echo "[Heartware] Starting Nginx..."

exec "$@"
