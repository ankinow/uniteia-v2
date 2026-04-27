#!/bin/bash
#
# ship-check.sh - Complete ship-check with all gates
# Run all verification gates and exit with clear pass/fail status
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "$REPO_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0
STEP_COUNT=0

# Helper function to print step header
step() {
  STEP_COUNT=$((STEP_COUNT + 1))
  echo ""
  echo -e "${YELLOW}▶ Step $STEP_COUNT: $1${NC}"
}

# Helper function to run check and handle failure
run_check() {
  local name="$1"
  local command="$2"

  if eval "$command"; then
    echo -e "${GREEN}✓ $name passed${NC}"
    return 0
  else
    echo -e "${RED}✗ $name failed${NC}"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

echo "=========================================="
echo "🚀 UniTeia Ship Check 🚀"
echo "=========================================="

# Step 1: Build (produces dist/)
step "Build (bun run build)"
run_check "build" "bun run build"

# Step 2: Lint + Typecheck
step "Lint (bun run lint)"
run_check "lint" "bun run lint"

step "Typecheck (bun run typecheck)"
run_check "typecheck" "bun run typecheck"

# Step 3: Single header check
step "Single Header Check"
run_check "header:single" "bun run scripts/check-single-header.ts"

# Step 4: Sitemap validation
step "Sitemap Validation"
run_check "sitemap:check" "bun run scripts/check-sitemap.ts"

# Step 5: Smoke test 200s (curl key routes)
# Note: Requires dev server running
echo "  (Note: smoke:200s requires dev server on localhost:5173)"
echo ""

# Step 6: Invalid locale 404 check
step "Invalid Locale 404 Check"
run_check "invalid-locale-404" "bun run scripts/check-invalid-locale.ts"

# Step 7: Lighthouse thresholds
step "Lighthouse Thresholds (≥90/95/95/95)"
run_check "lighthouse:check" "bun run lighthouse:check"

# Final summary
echo ""
echo "=========================================="
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ ship-check.sh PASSED${NC}"
  echo "All $STEP_COUNT steps completed successfully"
  echo "=========================================="
  exit 0
else
  echo -e "${RED}❌ ship-check.sh FAILED${NC}"
  echo "$FAILED step(s) failed out of $STEP_COUNT"
  echo "=========================================="
  exit 1
fi
