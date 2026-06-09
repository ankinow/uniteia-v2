#!/bin/bash
# DIFF-GUARDIAN v1.0 — Pre-commit Contract Regression Blocker
# 
# Runs before every commit. Blocks commits that reintroduce:
#   G1: z.literal in contract schemas.ts
#   G2: backdrop-filter: blur( in CSS (glassmorphism regression)
#   G3: qualityScore binary fallback (publishable?95:65)
#   G4: VisualAsset local redefinition in v2 node.ts
#   G5: content-graph.v2 removed from registry
#
# Install:
#   cp scripts/qa/diff-guardian.sh .git/hooks/pre-commit
#   chmod +x .git/hooks/pre-commit
#
# Skip (emergency only):
#   git commit --no-verify

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
REPO_NAME="$(basename "$REPO_ROOT")"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
CHECKS=()

check() {
  local gate="$1"
  local detail="$2"
  local result="$3"  # "PASS" or "FAIL"
  CHECKS+=("$gate|$detail|$result")
  if [ "$result" = "PASS" ]; then
    PASSED=$((PASSED + 1))
    echo -e "  ${GREEN}✓${NC} $gate"
  else
    FAILED=$((FAILED + 1))
    echo -e "  ${RED}✗${NC} $gate — $detail"
  fi
}

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  DIFF-GUARDIAN v1.0 — Contract Audit     ║"
echo "╠══════════════════════════════════════════╣"
echo "║  Repo: $REPO_NAME"
echo "║  Checking staged + working tree changes..."
echo "╚══════════════════════════════════════════╝"
echo ""

# ── G1: z.literal regression ──

MF_SCHEMAS="$HOME/uniteia-mega-factory/packages/content-node-contract/src/schemas.ts"
if [ -f "$MF_SCHEMAS" ]; then
  if grep -q "z\.literal(CONTENT_GRAPH_SCHEMA_VERSION)" "$MF_SCHEMAS" 2>/dev/null; then
    check "G1:z-literal" "z.literal found in schemas.ts (should be z.enum)" "FAIL"
  elif grep -q "z\.literal(" "$MF_SCHEMAS" 2>/dev/null; then
    check "G1:z-literal-any" "z.literal(...) found — audit required" "FAIL"
  else
    check "G1:z-literal" "z.enum active" "PASS"
  fi
else
  check "G1:z-literal" "schemas.ts not at expected path" "FAIL"
fi

# ── G2: Glassmorphism CSS regression in v2 ──

if [ "$REPO_NAME" = "uniteia-v2" ]; then
  GLASS_FOUND=0
  # Check staged + working tree CSS diffs
  CSS_DIFF=$(git diff --cached --name-only 2>/dev/null || echo "")
  CSS_DIFF="$CSS_DIFF $(git diff --name-only 2>/dev/null || echo "")"
  
  # Also scan the full source for any backdrop-filter: blur( additions
  for f in src/assets/*.css src/components/*/*.css src/global.css; do
    if [ -f "$f" ]; then
      if grep -n "backdrop-filter:" "$f" 2>/dev/null | grep -v "backdrop-filter:\s*none" | grep -q "blur"; then
        GLASS_FOUND=1
        LINE=$(grep -n "backdrop-filter:" "$f" 2>/dev/null | grep -v "backdrop-filter:\s*none" | grep "blur" | head -1)
        check "G2:glassmorphism" "$f:$LINE" "FAIL"
      fi
      if grep -n "filter:\s*blur(" "$f" 2>/dev/null | grep -q .; then
        GLASS_FOUND=1
        LINE=$(grep -n "filter:\s*blur(" "$f" 2>/dev/null | head -1)
        check "G2:glassmorphism-blur" "$f:$LINE" "FAIL"
      fi
    fi
  done
  if [ "$GLASS_FOUND" -eq 0 ]; then
    check "G2:glassmorphism" "0 blur instances in CSS" "PASS"
  fi
else
  check "G2:glassmorphism" "skipped (not v2 repo)" "PASS"
fi

# ── G3: Binary qualityScore fallback ──

MF_MW="$HOME/uniteia-mega-factory/src/exporters/uniteia-v2/manifest-writer.ts"
if [ -f "$MF_MW" ]; then
  if grep -q "publishable ? 95 : 65" "$MF_MW" 2>/dev/null; then
    check "G3:binary-fallback" "publishable?95:65 found — blind trust regression" "FAIL"
  else
    check "G3:binary-fallback" "audit gate active (wasAudited check)" "PASS"
  fi
else
  check "G3:binary-fallback" "manifest-writer.ts not found" "FAIL"
fi

# ── G4: VisualAsset local redefinition ──

if [ "$REPO_NAME" = "uniteia-v2" ]; then
  V2_NODE="src/content-graph/contracts/node.ts"
  if [ -f "$V2_NODE" ]; then
    if grep -q "export interface VisualAsset" "$V2_NODE" 2>/dev/null; then
      check "G4:visualasset-dual" "Local VisualAsset definition found — should import from shared" "FAIL"
    elif grep -q "@uniteia/content-node-contract" "$V2_NODE" 2>/dev/null; then
      check "G4:visualasset-dual" "imported from shared contract" "PASS"
    else
      check "G4:visualasset-dual" "no VisualAsset reference (may be unused)" "PASS"
    fi
  fi
else
  check "G4:visualasset-dual" "skipped (not v2 repo)" "PASS"
fi

# ── G5: Contract registry has v2 ──

MF_REG="$HOME/uniteia-mega-factory/packages/content-node-contract/src/contract-versions.ts"
if [ -f "$MF_REG" ]; then
  if grep -q "content-graph.v2" "$MF_REG" 2>/dev/null; then
    check "G5:registry-v2" "v2 entry present" "PASS"
  else
    check "G5:registry-v2" "content-graph.v2 not found in registry" "FAIL"
  fi
else
  check "G5:registry-v2" "contract-versions.ts not found" "FAIL"
fi

# ── G6: AUDIT_GATE_REQUIRED present ──

MF_QP="$HOME/uniteia-mega-factory/src/shared/quality-policy.ts"
if [ -f "$MF_QP" ]; then
  if grep -q "AUDIT_GATE_REQUIRED" "$MF_QP" 2>/dev/null; then
    check "G6:audit-gate-flag" "AUDIT_GATE_REQUIRED present" "PASS"
  else
    check "G6:audit-gate-flag" "AUDIT_GATE_REQUIRED removed — regression" "FAIL"
  fi
else
  check "G6:audit-gate-flag" "quality-policy.ts not found" "FAIL"
fi

# ── Summary ──

echo ""
echo "╔══════════════════════════════════════════╗"
printf "║  %-38s ║\n" "$PASSED/$((PASSED+FAILED)) gates passed"
if [ "$FAILED" -eq 0 ]; then
  echo "║  ALL CLEAR — commit allowed               ║"
  echo "╚══════════════════════════════════════════╝"
  echo ""
  exit 0
else
  echo "║  BLOCKED — fix regressions before commit  ║"
  echo "╚══════════════════════════════════════════╝"
  echo ""
  echo -e "${RED}❌ Commit blocked.${NC} ${FAILED} contract regression(s) detected."
  echo "   See: ESTUDO-CONTENT-PACKAGE-CONTRACT-v2.md"
  echo "   Emergency skip: git commit --no-verify"
  exit 1
fi
