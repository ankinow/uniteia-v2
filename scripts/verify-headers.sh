#!/bin/bash
# Header Verification Script
# Diagnoses duplicate header rendering issues

set -e

SERVER_URL="${1:-http://localhost:3000}"

echo "=== UniTeia Header Diagnostic Report ==="
echo ""
echo "Server: $SERVER_URL"
echo ""

# Find all <header> tag sources in source code
echo "## Source Code Header Locations"
echo '```'
grep -rn '<header' src/ --include='*.tsx' --include='*.ts' 2>/dev/null || echo "No headers found"
echo '```'
echo ""

# Header count per file
echo "## Header Element Count Per Source File"
echo '```'
for file in $(find src -name '*.tsx' -o -name '*.ts' 2>/dev/null); do
  count=$(grep -o '<header' "$file" 2>/dev/null | wc -l)
  if [ "$count" -gt 0 ]; then
    echo "$file: $count"
  fi
done
echo '```'
echo ""

# Check if AdaptiveHeader is used anywhere
echo "## AdaptiveHeader Usage Locations"
echo '```'
grep -rn 'AdaptiveHeader' src/ --include='*.tsx' 2>/dev/null | grep -E '(import|AdaptiveHeader)' || echo "No AdaptiveHeader usage found"
echo '```'
echo ""

# Test rendered output
echo "## Rendered Header Count Per Route"
echo ""

# Helper function to count headers
count_headers() {
  local url="$1"
  curl -sL "$url" 2>/dev/null | grep -o '<header' | wc -l | tr -d ' '
}

# Test niche index route
echo "Route: /en/n/"
headers=$(count_headers "$SERVER_URL/en/n/")
echo "  Header count: $headers"
if [ "$headers" -gt 1 ]; then
  echo "  ⚠ WARNING: Multiple headers detected (expected: 1)"
fi
echo ""

# Test apex route
echo "Route: /en/"
headers=$(count_headers "$SERVER_URL/en/")
echo "  Header count: $headers"
echo ""

echo "=== End of Report ==="
