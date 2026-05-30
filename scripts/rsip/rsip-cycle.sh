#!/usr/bin/env bash
# scripts/rsip/rsip-cycle.sh — P4 RSIP∞ Weekly Cycle
# Runs observe → reflect → mutate → consolidate → audit
#
# Usage:
#   bash scripts/rsip/rsip-cycle.sh              # full cycle (dry-run mutate)
#   bash scripts/rsip/rsip-cycle.sh --write       # apply mutations
#   bash scripts/rsip/rsip-cycle.sh --quick       # observe → audit only

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
RSIP_DIR="$SCRIPT_DIR"
L4_DIR="$REPO_ROOT/meta/archive"

cd "$REPO_ROOT"

QUICK=false
WRITE=""
for arg in "$@"; do
  case "$arg" in
    --quick) QUICK=true ;;
    --write) WRITE="--write" ;;
  esac
done

echo "╔═══════════════════════════════════════════╗"
echo "║   P4 RSIP∞ Weekly Cycle                  ║"
echo "║   $(date -u '+%Y-%m-%d %H:%M UTC')             ║"
echo "╚═══════════════════════════════════════════╝"

# ── 1. OBSERVE ──
echo ""
echo "→ observe.py"
python3 "$RSIP_DIR/observe.py"
OBS_EXIT=$?
echo "   exit=$OBS_EXIT"

if $QUICK; then
  echo "   (quick mode — skipping reflect/mutate/consolidate)"
  echo ""
  echo "→ audit.py"
  python3 "$RSIP_DIR/audit.py" --skip-nim || true
  echo ""
  echo "→ p4-audit-trail.py --auto"
  python3 "scripts/memory/p4-audit-trail.py" --auto || true
  exit 0
fi

# ── 2. REFLECT ──
echo ""
echo "→ reflect.py"
python3 "$RSIP_DIR/reflect.py" --k=3
REF_EXIT=$?
echo "   exit=$REF_EXIT"

# ── 3. MUTATE ──
echo ""
echo "→ mutate.py $WRITE"
python3 "$RSIP_DIR/mutate.py" $WRITE
MUT_EXIT=$?
echo "   exit=$MUT_EXIT"

# ── 4. CONSOLIDATE ──
echo ""
echo "→ consolidate.py"
python3 "$RSIP_DIR/consolidate.py"
CON_EXIT=$?
echo "   exit=$CON_EXIT"

# ── 5. AUDIT ──
echo ""
echo "→ audit.py"
python3 "$RSIP_DIR/audit.py" --skip-nim || true
AUD_EXIT=$?
echo "   exit=$AUD_EXIT"

# ── Summary ──
echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║   Cycle Complete                         ║"
echo "║   observe=$OBS_EXIT reflect=$REF_EXIT mutate=$MUT_EXIT ║"
echo "║   consolidate=$CON_EXIT audit=$AUD_EXIT          ║"
echo "╚═══════════════════════════════════════════╝"
