#!/usr/bin/env bash
set -euo pipefail

API_KEY="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"
ENDPOINT="https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev"
OUTDIR="/home/lermf/uniteia-v2/public/assets/flux/jrpg-magica/mini"
mkdir -p "$OUTDIR"

declare -A PROMPTS=(
  [88881]="JRPG game sprite icon, waving hand gesture, pixel art style, dark background, sharp edges, no text"
  [88882]="JRPG game sprite icon, countdown number 3 glowing, pixel art, dark background, sharp edges, no text"
  [88883]="JRPG game sprite icon, pointing finger right, pixel art, dark background, sharp edges, no text"
  [88884]="JRPG game sprite icon, brain with gears thinking pose, pixel art, dark background, sharp edges, no text"
  [88885]="JRPG game sprite icon, network arrows routing between nodes, pixel art, dark background, sharp edges, no text"
  [88886]="JRPG game sprite icon, shield blocking X attack dodge pose, pixel art, dark background, sharp edges, no text"
)

declare -A NAMES=(
  [88881]="mini-waving-goodbye"
  [88882]="mini-countdown-3"
  [88883]="mini-pointing-right"
  [88884]="mini-thinking-brain"
  [88885]="mini-routing-arrows"
  [88886]="mini-dodging-x"
)

for SEED in 88881 88882 88883 88884 88885 88886; do
  NAME="${NAMES[$SEED]}"
  PROMPT="${PROMPTS[$SEED]}"
  OUT_WEBP="$OUTDIR/${NAME}.webp"
  TMP_JSON="$OUTDIR/_tmp_${NAME}.json"

  # Skip if already exists and >5KB
  if [ -f "$OUT_WEBP" ] && [ "$(stat -c%s "$OUT_WEBP" 2>/dev/null || echo 0)" -gt 5120 ]; then
    echo "SKIP: $OUT_WEBP already exists ($(stat -c%s "$OUT_WEBP") bytes)"
    continue
  fi

  echo "GENERATING: $NAME (seed=$SEED)"

  # Call NVIDIA FLUX API - returns JSON with base64-encoded image
  HTTP_CODE=$(curl -s -w "%{http_code}" -o "$TMP_JSON" \
    -X POST "$ENDPOINT" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"prompt\": $(echo "$PROMPT" | jq -Rs .),
      \"seed\": $SEED,
      \"width\": 768,
      \"height\": 768
    }")

  if [ "$HTTP_CODE" != "200" ]; then
    echo "  ERROR: HTTP $HTTP_CODE"
    cat "$TMP_JSON" 2>/dev/null || true
    rm -f "$TMP_JSON"
    continue
  fi

  # Extract base64 data from JSON and decode to JPEG
  jq -r '.artifacts[0].base64' "$TMP_JSON" | base64 -d > "${TMP_JSON%.json}.jpg" 2>/dev/null || {
    echo "  ERROR: Failed to decode base64"
    cat "$TMP_JSON"
    rm -f "$TMP_JSON"
    continue
  }

  TMP_JPG="${TMP_JSON%.json}.jpg"
  FILE_SIZE=$(stat -c%s "$TMP_JPG" 2>/dev/null || echo 0)
  echo "  Decoded JPEG: $FILE_SIZE bytes"

  if [ "$FILE_SIZE" -lt 1000 ]; then
    echo "  ERROR: Decoded image too small"
    rm -f "$TMP_JSON" "$TMP_JPG"
    continue
  fi

  # Convert to 256x256 webp
  magick "$TMP_JPG" -resize 256x256 "$OUT_WEBP" 2>&1 || {
    echo "  ERROR: ImageMagick conversion failed"
    rm -f "$TMP_JSON" "$TMP_JPG"
    continue
  }

  rm -f "$TMP_JSON" "$TMP_JPG"
  FINAL_SIZE=$(stat -c%s "$OUT_WEBP")
  echo "  DONE: $OUT_WEBP ($FINAL_SIZE bytes)"
done

echo ""
echo "=== ALL DONE ==="
ls -la "$OUTDIR"/*.webp 2>/dev/null || echo "(no webp files)"
