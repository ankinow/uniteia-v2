#!/usr/bin/env bash
# build-locale.sh — Build and deploy per-locale Cloudflare Pages projects
# ──────────────────────────────────────────────────────────────────────
# Usage: ./scripts/build-locale.sh en   # builds LOCALE=en
#        ./scripts/build-locale.sh all  # builds all 8 locales + deploys
#
# Each locale gets its own Cloudflare Pages project:
#   en → uniteia-en → en.uniteia.com
#   pt → uniteia-pt → pt.uniteia.com
#   es → uniteia-es → es.uniteia.com
#   fr → uniteia-fr → fr.uniteia.com
#   de → uniteia-de → de.uniteia.com
#   it → uniteia-it → it.uniteia.com
#   ja → uniteia-ja → ja.uniteia.com
#   zh → uniteia-zh → zh.uniteia.com
#
# The root uniteia.com becomes a redirector to the browser's preferred locale.
# ──────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
V2_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$V2_ROOT"

LOCALES=(en pt es fr de it ja zh)
TARGET="${1:-all}"

# Cloudflare auth
export CLOUDFLARE_API_KEY="${CLOUDFLARE_API_KEY:-$(grep '^CLOUDFLARE_API_KEY=' /home/lermf/.hermes/.env | cut -d= -f2-)}"
export CLOUDFLARE_EMAIL="${CLOUDFLARE_EMAIL:-gersonvida12@gmail.com}"
unset CLOUDFLARE_API_TOKEN

build_one() {
  local loc="$1"
  echo ""
  echo "══════════════════════════════════════════"
  echo "  Building uniteia-${loc} → ${loc}.uniteia.com"
  echo "══════════════════════════════════════════"

  # Build with locale env var
  LOCALE="${loc}" npx qwik build 2>&1 | tail -3

  # Deploy to per-locale project
  npx wrangler pages deploy dist/ \
    --branch=main \
    --project-name="uniteia-${loc}" \
    --commit-dirty=true 2>&1 | tail -5

  echo "  ✅ ${loc}.uniteia.com deployed"
}

create_projects() {
  echo "Creating 8 Cloudflare Pages projects (one per locale)..."
  for loc in "${LOCALES[@]}"; do
    npx wrangler pages project create "uniteia-${loc}" \
      --production-branch=main 2>&1 | head -1 || echo "  uniteia-${loc}: may already exist"
  done
  echo ""
  echo "⚠️  Next: add custom domains in Cloudflare Dashboard:"
  echo "    https://dash.cloudflare.com → Workers & Pages → each uniteia-* project"
  echo "    → Custom Domains → Add ${loc}.uniteia.com"
  echo ""
  echo "  DNS CNAME records (add in Cloudflare DNS):"
  for loc in "${LOCALES[@]}"; do
    echo "    ${loc}.uniteia.com  CNAME  uniteia-${loc}.pages.dev"
  done
}

case "$TARGET" in
  all)
    for loc in "${LOCALES[@]}"; do
      build_one "$loc"
    done
    echo ""
    echo "══════════════════════════════════════════"
    echo "  All 8 locales built and deployed"
    echo "══════════════════════════════════════════"
    ;;
  create-projects)
    create_projects
    ;;
  *)
    if [[ " ${LOCALES[*]} " =~ " ${TARGET} " ]]; then
      build_one "$TARGET"
    else
      echo "Usage: $0 {en|pt|es|fr|de|it|ja|zh|all|create-projects}"
      exit 1
    fi
    ;;
esac
