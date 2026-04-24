#!/bin/bash
# =============================================================================
# ORQUIDIA SECRET CLEANUP
# SOTA 2026: Clean up old/invalid Cloudflare Workers secrets
# =============================================================================
#
# WARNING: This script will DELETE and recreate secrets!
# Make sure you have your API keys ready.
#
# Usage:
#   chmod +x scripts/cleanup-secrets.sh
#   ./cleanup-secrets.sh

set -e

echo "🧹 Orquidia Secret Cleanup"
echo "=========================="
echo ""
echo -e "${RED}⚠️  WARNING: This will delete and recreate all secrets!${NC}"
echo ""
echo "Make sure you have your API keys ready before proceeding."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Confirmation
read -p "Type 'yes' to continue: " confirm
if [ "$confirm" != "yes" ]; then
  echo "Cleanup cancelled."
  exit 0
fi

echo ""
echo "Step 1: Backup current secrets"
echo "------------------------------"
echo -e "${YELLOW}Note: wrangler doesn't export secrets, you'll need to re-enter them${NC}"
echo ""

echo "Step 2: Recreating secrets with new values"
echo "-------------------------------------------"
echo ""

# Function to prompt for secret
prompt_secret() {
    local name=$1
    local description=$2
    
    echo -n "Enter ${name} (${description}): "
    read -s secret
    echo ""
    
    if [ -n "$secret" ]; then
        echo "Setting ${name}..."
        echo "$secret" | npx wrangler secret put "$name" 2>/dev/null
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ ${name} set successfully${NC}"
        else
            echo -e "${RED}✗ Failed to set ${name}${NC}"
        fi
    else
        echo "⚠ ${name} skipped (empty)"
    fi
}

# AI Providers
echo "AI Providers:"
echo "-------------"
prompt_secret "GEMINI_API_KEY" "Google Gemini API key (primary)"
prompt_secret "WORKERS_AI_TOKEN" "Cloudflare Workers AI token"
prompt_secret "OPENROUTER_API_KEY" "OpenRouter API key"

echo ""
echo "Cloudflare:"
echo "-----------"
prompt_secret "CLOUDFLARE_API_TOKEN" "Cloudflare API token"

echo ""
echo "Step 3: Verification"
echo "--------------------"
echo ""
echo -e "${BLUE}Current secrets:${NC}"
npx wrangler secret list 2>/dev/null || echo "No secrets configured"

echo ""
echo "========================================"
echo -e "${GREEN}✅ Secret cleanup complete!${NC}"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Test the deployment: npx wrangler deploy"
echo "  2. Verify functionality: curl https://your-worker.workers.dev/api/health"
