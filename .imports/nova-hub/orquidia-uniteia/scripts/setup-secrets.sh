#!/bin/bash
# =============================================================================
# Orquidia-uniteia Secrets Setup Script
# SOTA 2026: Secure API key management for Cloudflare Workers
# =============================================================================
# Usage: ./setup-secrets.sh [--env production|staging]
# =============================================================================

set -e

ENV="${1:-development}"
PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

echo "🚀 Setting up secrets for Orquidia-uniteia ($ENV environment)"
echo "================================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ Error: npx not found. Please install Node.js first.${NC}"
    exit 1
fi

# Check if user is logged in to Cloudflare
echo -e "\n${YELLOW}📋 Checking Cloudflare authentication...${NC}"
if ! npx wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Cloudflare. Please run: npx wrangler login${NC}"
    echo "   Or set CLOUDFLARE_API_TOKEN environment variable manually."
    exit 1
fi

echo -e "${GREEN}✅ Cloudflare authentication OK${NC}"

# Function to set a secret
set_secret() {
    local name="$1"
    local description="$2"
    local env_file="$PROJECT_DIR/.env.$ENV"
    
    # Check if secret is already set
    if npx wrangler secret list 2>/dev/null | grep -q "\"$name\""; then
        echo -e "${YELLOW}⏭️  Secret '$name' already exists, skipping${NC}"
        return 0
    fi
    
    # Check .env file
    if [ -f "$env_file" ]; then
        local value=$(grep "^${name}=" "$env_file" 2>/dev/null | cut -d'=' -f2- | tr -d '"' | tr -d "'")
        if [ -n "$value" ]; then
            echo "$value" | npx wrangler secret put "$name" --env "$ENV"
            echo -e "${GREEN}✅ Set '$name' from .env.$ENV${NC}"
            return 0
        fi
    fi
    
    # Prompt user
    echo -e "\n${YELLOW}Enter $description:${NC}"
    read -s value
    echo ""
    echo "$value" | npx wrangler secret put "$name" --env "$ENV"
    echo -e "${GREEN}✅ Set '$name'${NC}"
}

echo -e "\n${YELLOW}🔐 Setting up required secrets...${NC}"

# Required secrets (in order of priority)
set_secret "GEMINI_API_KEY" "Google Gemini API Key (get from https://aistudio.google.com/)"

echo -e "\n${YELLOW}🔐 Setting up optional secrets...${NC}"

# Optional secrets - skip if not available
set_secret "WORKERS_AI_TOKEN" "Cloudflare Workers AI Token (optional, uses account auth)"
set_secret "OPENROUTER_API_KEY" "OpenRouter API Key (optional fallback)"

echo -e "\n${GREEN}✅ All secrets configured!${NC}"
echo -e "\n${YELLOW}📋 Verifying secrets...${NC}"
npx wrangler secret list --env "$ENV"

echo -e "\n${GREEN}🎉 Setup complete!${NC}"
echo -e "\n📝 Next steps:"
echo "   1. Run: cd $PROJECT_DIR && bun run build"
echo "   2. Deploy: npx wrangler deploy --env $ENV"
