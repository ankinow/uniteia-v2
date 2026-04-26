#!/bin/bash
# Header Verification Script
# Diagnoses duplicate header rendering issues

set -e

SERVER_URL="${1:-http://localhost:8788}"
REPORT_FILE="${2:-diagnostic-report.md}"

echo "=== UniTeia Header Diagnostic Report ==="
echo ""
echo "Server: $SERVER_URL"
echo "Report: $REPORT_FILE"
echo ""

# Header 1: Find all <header> tag sources in source code
echo "## Source Code Header Locations"
echo "\`\`\`"
grep -rn '<header' src/ --include='*.tsx' --include='*.ts' 2>/dev/null || echo "No headers found"
echo "\`\`\`"
echo ""

# Header count per file
echo "## Header Element Count Per Source File"
echo "\`\`\`"
for file in $(find src -name '*.tsx' -o -name '*.ts'); do
  count=$(grep -o '<header' "$file" 2>/dev/null | wc -l)
  if [ "$count" -gt 0 ]; then
    echo "$file: $count"
  fi
done
echo "\`\`\`"
echo ""

# Check if AdaptiveHeader is used anywhere
echo "## AdaptiveHeader Usage Locations"
echo "\`\`\`"
grep -rn 'AdaptiveHeader' src/ --include='*.tsx' 2>/dev/null | grep -E '(import|<'AdaptiveHeader')' || echo "No AdaptiveHeader usage found"
echo "\`\`\`"
echo ""

# Test rendered output
echo "## Rendered Output - Header Count Per Route"
echo "Testing routes..."
echo ""

# Test niche index route
echo "### Route: /en/n"
curl -s "$SERVER_URL/en/n" 2>/dev/null | grep -o '<header' | wc -l | xargs -I{} echo "  Header count: {}"
echo ""

# Test article route if exists
echo "### Route: /en/llm-aggregators-compared"
status=$(curl -s -o /dev/null -w "%{http_code}" "$SERVER_URL/en/llm-aggregators-compared" 2>/dev/null)
if [ "$status" = "200" ]; then
  curl -s "$SERVER_URL/en/llm-aggregators-compared" 2>/dev/null | grep -o '<header' | wc -l | xargs -I{} echo "  Header count: {}"
else
  echo "  Status: HTTP $status"
fi
echo ""

# Test content route with slug
echo "### Route: /en/llm-aggregators-compared"
if [ "$status" = "200" ]; then
  curl -s "$SERVER_URL/en/llm-aggregators-compared" 2>/dev/null | grep -o '<header' | wc -l | xargs -I{} echo "  Header count: {}"
fi
echo ""

echo "=== End of Report ==="
