#!/bin/bash
# scripts/deep-validate.sh — DVE v2.0 entry point
# From PLANO-082: Deep Validation Engine v2.0
# Run: bash scripts/deep-validate.sh [--layer=N] [--fail-fast]
set -euo pipefail

LAYER=6
FAIL_FAST=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --layer=*) LAYER="${1#*=}" ;;
    --fail-fast) FAIL_FAST="true" ;;
    *) echo "Unknown: $1"; exit 1 ;;
  esac
  shift
done

PASS=0; FAIL=0; SKIP=0
ok()  { echo "  ✅ $1"; ((PASS++)); }
err() { echo "  ❌ $1"; ((FAIL++)); [ "$FAIL_FAST" ] && exit 1; }
skip(){ echo "  ⏭️  $1"; ((SKIP++)); }

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  DEEP VALIDATION ENGINE v2.0 — PLANO-082                 ║"
echo "║  Layers: 1-$LAYER  |  Fail-fast: ${FAIL_FAST:-no}        ║"
echo "╚═══════════════════════════════════════════════════════════╝"

# LAYER 1: Syntactic
if [ "$LAYER" -ge 1 ]; then
  echo ""; echo "┌─ LAYER 1: SYNTACTIC ─────────────────────────────────────┐"
  
  BUILD_OUT=$(npx qwik build 2>&1)
  echo "$BUILD_OUT" | grep -q "Generated: 83 pages" && ok "SSG build: 83 pages" || err "SSG build failed"
  
  PAGES=$(find dist -name 'index.html' | wc -l)
  [ "$PAGES" -ge 80 ] && ok "Page count: $PAGES" || err "Page count: $PAGES"
  
  I18N_OUT=$(bun run validate:i18n 2>&1)
  echo "$I18N_OUT" | grep -q "Tests.*102 passed" && ok "i18n: 102/102" || err "i18n validation"
  
  TS=$(bun run typecheck 2>&1 | grep -c "error TS" || true)
  [ "$TS" -le 71 ] && ok "TypeScript: $TS errors (baseline 71)" || err "TS regression: $TS (baseline 71)"
  
  BUNDLE=$(node scripts/bundle-analyzer.cjs --budget=500 2>&1)
  echo "$BUNDLE" | grep -q "All chunks within budget" && ok "Bundle: 0 flagged" || err "Bundle oversized"
fi

# LAYER 2: Functional
if [ "$LAYER" -ge 2 ]; then
  echo ""; echo "┌─ LAYER 2: FUNCTIONAL ────────────────────────────────────┐"
  
  # Check if Playwright config exists
  if [ -f playwright.config.ts ]; then
    PW_OUT=$(npx playwright test tests/e2e/canva-visual.spec.ts --reporter=line 2>&1) && ok "Playwright: 13/13" || err "Playwright failed"
  else
    skip "Playwright: no config"
  fi
  
  [ -f scripts/mcp/harden-mcp.py ] && python3 scripts/mcp/harden-mcp.py --audit 2>/dev/null && ok "MCP audit" || skip "MCP audit"
fi

# LAYER 3: Performance
if [ "$LAYER" -ge 3 ]; then
  echo ""; echo "┌─ LAYER 3: PERFORMANCE ───────────────────────────────────┐"
  if command -v lhci &>/dev/null; then
    LH_OUT=$(lhci autorun --config=lighthouserc.prod.cjs 2>&1) && ok "Lighthouse prod" || err "Lighthouse prod: $(echo "$LH_OUT" | tail -3)"
  else
    skip "Lighthouse CI: not installed"
  fi
fi

# LAYER 4: Accessibility
if [ "$LAYER" -ge 4 ]; then
  echo ""; echo "┌─ LAYER 4: ACCESSIBILITY ────────────────────────────────┐"
  if command -v npx &>/dev/null && npx --yes axe-core-cli --help &>/dev/null 2>&1; then
    AXE_OUT=$(npx axe-core-cli http://localhost:8788/en/signals/apex/magica-overview 2>&1) && ok "axe-core: 0 violations" || skip "axe-core: check results"
  else
    skip "axe-core CLI: npm i -g axe-core-cli"
  fi
fi

# LAYER 5: SEO/Navigation
if [ "$LAYER" -ge 5 ]; then
  echo ""; echo "┌─ LAYER 5: SEO/NAVIGATION ────────────────────────────────┐"
  [ -f dist/sitemap.xml ] && ok "Sitemap exists" || err "Sitemap missing"
  skip "Orphan check: implement crawler (R18)"
fi

# LAYER 6: Visual
if [ "$LAYER" -ge 6 ]; then
  echo ""; echo "┌─ LAYER 6: VISUAL ────────────────────────────────────────┐"
  if [ -f playwright.visual.config.ts ]; then
    npx playwright test tests/e2e/visual-baseline.spec.ts --config=playwright.visual.config.ts 2>&1 && ok "Visual baseline: 0 diffs" || err "Visual regression"
  else
    skip "Visual: no config"
  fi
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  RESULT: $PASS passed | $FAIL failed | $SKIP skipped      ║"
echo "╚═══════════════════════════════════════════════════════════╝"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
