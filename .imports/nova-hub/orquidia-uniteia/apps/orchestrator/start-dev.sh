#!/bin/bash
# =============================================================================
# Orquidia-uniteia Development Server
# SOTA 2026: Starts development server with remote D1 access
# =============================================================================

set -e

cd "$(dirname "$0")"

echo "🚀 Starting Orquidia Development Server with Remote D1..."
echo "================================================================"

# Check Cloudflare authentication
if ! npx wrangler whoami &> /dev/null; then
    echo "⚠️  Not authenticated with Cloudflare"
    echo "   Run: npx wrangler login"
    exit 1
fi

# Check if GEMINI_API_KEY is configured
if ! npx wrangler secret list --name orquidia-admin 2>/dev/null | grep -q "GEMINI_API_KEY"; then
    echo "⚠️  GEMINI_API_KEY not configured"
    echo "   Run: npx wrangler secret put GEMINI_API_KEY"
    echo "   Or AI features will fail"
fi

echo "✅ Cloudflare authenticated"
echo "📦 Starting dev server..."
echo ""
echo "   URL: http://localhost:8976"
echo "   Ctrl+C to stop"
echo ""
echo "================================================================"

# Start wrangler dev with remote D1
npx wrangler dev --remote
