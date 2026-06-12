#!/bin/bash
# Per-locale build + deploy for all 8 locales
# Each CF Pages project gets ONLY its locale's content
set -e
cd /home/lermf/uniteia-v2
source .env 2>/dev/null
unset CLOUDFLARE_API_TOKEN
export CLOUDFLARE_API_KEY="${CLOUDFLARE_API_KEY}"
export CLOUDFLARE_EMAIL="${CLOUDFLARE_EMAIL}"
export CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID}"

LOCALES=("en" "pt" "es" "fr" "de" "it" "ja" "zh")

for loc in "${LOCALES[@]}"; do
  echo ""
  echo "═══════════ ${loc} ═══════════"
  echo "  Building with LOCALE=${loc}..."
  rm -rf dist
  LOCALE=${loc} bun run build 2>&1 | tail -2
  
  echo "  Deploying to uniteia-${loc}..."
  bunx wrangler pages deploy dist --project-name "uniteia-${loc}" --commit-dirty=true --branch main 2>&1 | grep "Deployment complete"
  
  echo "  ✅ ${loc}.uniteia.com deployed"
done

echo ""
echo "═══════ ALL 8 LOCALES DEPLOYED ═══════"
