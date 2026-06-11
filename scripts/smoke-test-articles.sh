#!/bin/bash
# Smoke test: verify all 6 article URLs return HTTP 200 across 8 locales
set -e

BASE="${1:-https://uniteia.com}"
ARTICLES=("magica-overview" "magica-quickstart" "magica-mcp-server" "tencent-cloud-deal-stack-builders" "opencode-vibecoders" "multi-agent-vibecoding")
LOCALES=("en" "pt" "es" "fr" "de" "it" "ja" "zh")
FAILS=0
TOTAL=0

for article in "${ARTICLES[@]}"; do
  for loc in "${LOCALES[@]}"; do
    TOTAL=$((TOTAL + 1))
    code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/$loc/signals/apex/$article" 2>/dev/null)
    if [ "$code" = "200" ]; then
      echo "  ✅ $loc/$article"
    else
      echo "  ❌ $loc/$article — HTTP $code"
      FAILS=$((FAILS + 1))
    fi
  done
done

echo ""
echo "Results: $((TOTAL - FAILS))/$TOTAL passed"
if [ $FAILS -gt 0 ]; then
  echo "❌ $FAILS failures detected"
  exit 1
fi
echo "✅ All articles OK"
