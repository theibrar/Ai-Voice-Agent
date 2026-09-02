#!/usr/bin/env bash
# ==============================================================================
# Enterprise Voice AI - Contabo VPS Setup & Orchestrator
# Connects Contabo LiveKit & SIP to Vast.ai Dedicated GPU Real-Time AI Engines
# ==============================================================================

set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}"
echo "=============================================================================="
echo "    🎙️  CONTABO VPS VOICE AI CLUSTER INSTALLER (LIVEKIT + SIP + WORKER)      "
echo "    GPU Target: 173.185.79.174 (Vast.ai Dedicated RTX 3060)                   "
echo "=============================================================================="
echo -e "${NC}"

# 1. Check Docker & Docker Compose
echo -e "${GREEN}[1/4] Checking Docker Environment...${NC}"
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
fi

if ! command -v docker compose &> /dev/null; then
    echo "Installing Docker Compose..."
    apt-get update && apt-get install -y docker-compose-plugin
fi
echo -e "${GREEN}✓ Docker ready.${NC}"

# 2. Test GPU Connection to Vast.ai
echo -e "${GREEN}[2/4] Testing Connectivity to Vast.ai GPU AI Engines (173.185.79.174)...${NC}"
GPU_HOST="173.185.79.174"

curl -s -o /dev/null -w "vLLM Port 46409: %{http_code}\n" http://${GPU_HOST}:46409/v1/models || echo "vLLM not reachable yet"
curl -s -o /dev/null -w "Kokoro TTS Port 47830: %{http_code}\n" http://${GPU_HOST}:47830/health || echo "Kokoro not reachable yet"
curl -s -o /dev/null -w "Parakeet STT Port 46819: %{http_code}\n" http://${GPU_HOST}:46819/health || echo "Parakeet not reachable yet"

# 3. Pull & Build Docker Containers
echo -e "${GREEN}[3/4] Building and Launching LiveKit, SIP Gateway, and Agent Worker...${NC}"
docker compose -f docker-compose.contabo.yml pull livekit livekit-sip redis
docker compose -f docker-compose.contabo.yml build agent-worker
docker compose -f docker-compose.contabo.yml up -d

# 4. Success Status
echo -e "${CYAN}"
echo "=============================================================================="
echo " 🎉 ALL CONTABO SERVICES ARE RUNNING!"
echo "    • LiveKit WebRTC SFU   : ws://localhost:7880"
echo "    • LiveKit SIP Gateway  : port 5060 (UDP/TCP)"
echo "    • LiveKit Agent Worker : Connected & listening for incoming calls"
echo ""
echo "    View Agent Worker live logs anytime:"
echo "    👉 docker compose -f docker-compose.contabo.yml logs -f agent-worker"
echo "=============================================================================="
echo -e "${NC}"
