#!/bin/bash
# =============================================================================
# ORQUIDIA SECRET AUDIT & ROTATION
# SOTA 2026: Audit and rotate secrets for security compliance
# =============================================================================
#
# Usage:
#   chmod +x scripts/audit-secrets.sh
#   ./scripts/audit-secrets.sh
#
# This script helps you:
#   1. Audit current secrets
#   2. Check for expired/old secrets
#   3. Plan rotation schedule

set -e

echo "🔒 Orquidia Secret Audit"
echo "========================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Secret audit log file
AUDIT_LOG="secrets-audit-$(date +%Y%m%d).log"

echo "Step 1: Current Secrets Status"
echo "-------------------------------"
echo ""

# Check if wrangler is available
if ! command -v npx &> /dev/null; then
  echo -e "${RED}Error: npx not found${NC}"
  exit 1
fi

# List secrets
echo -e "${BLUE}Secrets in Cloudflare Workers:${NC}"
echo ""
npx wrangler secret list 2>/dev/null || echo "  No secrets configured"

echo ""
echo "Step 2: Required Secrets Checklist"
echo "-----------------------------------"
echo ""

# Required secrets
declare -a REQUIRED=(
  "GEMINI_API_KEY:Google Gemini API (primary provider)"
  "WORKERS_AI_TOKEN:Cloudflare Workers AI (fallback provider)"
  "OPENROUTER_API_KEY:OpenRouter (backup provider)"
  "CLOUDFLARE_API_TOKEN:Cloudflare deployment"
)

for item in "${REQUIRED[@]}"; do
  IFS=':' read -r secret desc <<< "$item"
  echo -n "  [${CYAN}?${NC}] $secret"
  echo "  - $desc"
done

echo ""
echo "Step 3: Secret Rotation Schedule"
echo "---------------------------------"
echo ""
echo "Recommended rotation schedule:"
echo ""
echo "  ┌─────────────────────┬──────────────┬────────────────────────────┐"
echo "  │ Secret              │ Frequency    │ Last Rotated               │"
echo "  ├─────────────────────┼──────────────┼────────────────────────────┤"
echo "  │ GEMINI_API_KEY      │ 90 days      │ Unknown                    │"
echo "  │ WORKERS_AI_TOKEN    │ 90 days      │ Unknown                    │"
echo "  │ OPENROUTER_API_KEY  │ 90 days      │ Unknown                    │"
echo "  │ CLOUDFLARE_API_TOKEN│ 180 days     │ Unknown                    │"
echo "  └─────────────────────┴──────────────┴────────────────────────────┘"
echo ""

echo "Step 4: Security Checklist"
echo "---------------------------"
echo ""
echo "  [${YELLOW}?${NC}] Secrets never committed to git"
echo "  [${YELLOW}?${NC}] Secrets use minimal permissions"
echo "  [${YELLOW}?${NC}] Usage monitored for anomalies"
echo "  [${YELLOW}?${NC}] Different keys for dev/staging/prod"
echo ""

echo "Step 5: Export Audit Report"
echo "----------------------------"
echo ""

# Generate audit report
cat > "$AUDIT_LOG" << EOF
================================================================================
ORQUIDIA SECRET AUDIT REPORT
Generated: $(date)
================================================================================

1. CURRENT SECRETS
------------------
$(npx wrangler secret list 2>/dev/null || echo "No secrets configured")

2. REQUIRED SECRETS
-------------------
EOF

for item in "${REQUIRED[@]}"; do
  IFS=':' read -r secret desc <<< "$item"
  echo "- $secret: $desc" >> "$AUDIT_LOG"
done

cat >> "$AUDIT_LOG" << EOF

3. RECOMMENDATIONS
------------------
- Review secret values and rotate if older than 90 days
- Ensure production secrets differ from development
- Monitor API usage for unusual patterns

4. NEXT STEPS
-------------
1. Review this audit report
2. Rotate any secrets older than 90 days
3. Update documentation with rotation dates
4. Schedule next audit in 30 days

================================================================================
END OF REPORT
================================================================================
EOF

echo -e "${GREEN}Audit report saved to: $AUDIT_LOG${NC}"
echo ""

echo "========================================"
echo -e "${GREEN}✅ Secret audit complete!${NC}"
echo "========================================"
echo ""
echo "Next actions:"
echo "  1. Review: cat $AUDIT_LOG"
echo "  2. Rotate: ./scripts/cleanup-secrets.sh"
echo "  3. Schedule next audit in 30 days"
