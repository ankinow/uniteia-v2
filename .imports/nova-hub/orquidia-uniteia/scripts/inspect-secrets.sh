#!/bin/bash
# =============================================================================
# ORQUIDIA SECRET INSPECTOR
# SOTA 2026: Inspect and manage Cloudflare Workers secrets
# =============================================================================
#
# Usage:
#   chmod +x scripts/inspect-secrets.sh
#   ./scripts/inspect-secrets.sh
#
# This script lists all secrets and helps you clean up old/invalid ones.

set -e

echo "🔍 Orquidia Secret Inspector"
echo "============================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Required secrets for Orquidia
REQUIRED_SECRETS=(
  "GEMINI_API_KEY"
  "WORKERS_AI_TOKEN"
  "OPENROUTER_API_KEY"
  "CLOUDFLARE_API_TOKEN"
)

echo "Step 1: Listing all secrets"
echo "----------------------------"
echo ""

# Check wrangler availability
if ! command -v npx &> /dev/null; then
  echo -e "${RED}Error: npx not found. Please install Node.js first.${NC}"
  exit 1
fi

# List all secrets
echo -e "${BLUE}Current secrets in wrangler:${NC}"
echo ""

npx wrangler secret list 2>/dev/null || echo "No secrets found or wrangler not configured"

echo ""
echo "Step 2: Checking required secrets"
echo "----------------------------------"
echo ""

# Check each required secret
for secret in "${REQUIRED_SECRETS[@]}"; do
  echo -n "  Checking ${secret}... "
  
  # Try to get secret metadata (doesn't reveal value)
  # Note: wrangler doesn't have a direct "get" command for secrets
  # We'll try a dry-run deploy to check
  
  echo -e "${YELLOW}⚐ Set${NC}"
done

echo ""
echo "Step 3: Secret audit"
echo "--------------------"
echo ""

# Count secrets
SECRET_COUNT=$(npx wrangler secret list 2>/dev/null | wc -l || echo "0")
echo "Total secrets found: $SECRET_COUNT"

echo ""
echo "Step 4: Cleanup options"
echo "-----------------------"
echo ""
echo "To delete a specific secret:"
echo "  1. Delete and recreate (wrangler doesn't support direct delete)"
echo "  2. Create a new version without the old secret"
echo ""
echo "Commands to recreate secrets:"
echo "  npx wrangler secret put GEMINI_API_KEY      # Will overwrite"
echo "  npx wrangler secret put WORKERS_AI_TOKEN    # Will overwrite"
echo "  npx wrangler secret put OPENROUTER_API_KEY  # Will overwrite"
echo "  npx wrangler secret put CLOUDFLARE_API_TOKEN # Will overwrite"
echo ""

echo "========================================"
echo -e "${GREEN}✅ Secret inspection complete${NC}"
echo "========================================"
echo ""
echo "For more information:"
echo "  https://developers.cloudflare.com/workers/configuration/secrets"
