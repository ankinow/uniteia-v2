#!/usr/bin/env bash
# Audit script: checks all content/{niche}/{locale}/*.md files (excluding _index.md)
# for frontmatter integrity, lang consistency, truncation, and corruption.

cd /home/lermf/uniteia-v2

echo "=== LOCALE CONTENT AUDIT ==="
echo ""

niches=("apex" "ai-agents" "cloud-computing" "llm-comparison" "virtual-machines")
locales=("en" "pt" "es" "fr" "de" "it" "ja" "zh")

# Arrays to collect issues
declare -a problematic_files
declare -a missing_description
declare -a truncated_desc
declare -a lang_mismatch
declare -a corrupt_files
declare -a missing_title
declare -a missing_lang_field

total_articles=0

echo "=== ARTICLE COUNTS PER NICHE x LOCALE ==="
for niche in "${niches[@]}"; do
  for loc in "${locales[@]}"; do
    dir="content/$niche/$loc"
    if [ -d "$dir" ]; then
      # Count .md files excluding _index.md
      count=$(ls "$dir"/*.md 2>/dev/null | grep -v '_index.md' | wc -l)
      if [ "$count" -gt 0 ]; then
        echo "  $niche / $loc : $count articles"
        total_articles=$((total_articles + count))
      fi
    fi
  done
done
echo ""
echo "TOTAL articles across all niches: $total_articles"
echo ""

echo "=== DETAILED FILE AUDIT ==="
for niche in "${niches[@]}"; do
  for loc in "${locales[@]}"; do
    dir="content/$niche/$loc"
    if [ -d "$dir" ]; then
      for f in "$dir"/*.md; do
        [ -e "$f" ] || continue
        basename=$(basename "$f")
        [ "$basename" = "_index.md" ] && continue

        relpath="content/$niche/$loc/$basename"

        # Check for cat -n corruption: lines starting with digits followed by tab/space and pipe
        if head -1 "$f" | grep -qP '^\s*\d+\s*\|\s'; then
          corrupt_files+=("$relpath")
        fi

        # Check for truncated content: lines ending with "..." (not part of normal content)
        if grep -qP '\.\.\.$' "$f"; then
          truncated_desc+=("$relpath")
        fi

        # Check if file has frontmatter (starts with ---)
        if ! head -1 "$f" | grep -q '^---$'; then
          problematic_files+=("$relpath (no frontmatter)")
          continue
        fi

        # Extract frontmatter (between first --- and second ---)
        fm=$(sed -n '/^---$/,/^---$/p' "$f" | sed '1d;$d')

        # Check required fields
        title_line=$(echo "$fm" | grep -E '^title:')
        desc_line=$(echo "$fm" | grep -E '^[[:space:]]*description:')
        lang_line=$(echo "$fm" | grep -E '^lang:')

        # Check title
        if [ -z "$title_line" ]; then
          missing_title+=("$relpath")
        fi

        # Check metadata.description (nested under metadata:)
        # Look for metadata: block and description within it
        in_metadata=false
        has_desc=false
        desc_value=""
        while IFS= read -r line; do
          if echo "$line" | grep -q '^metadata:'; then
            in_metadata=true
            continue
          fi
          if $in_metadata; then
            if echo "$line" | grep -q '^  description:'; then
              desc_value=$(echo "$line" | sed 's/^  description:[[:space:]]*//' | sed 's/^"//;s/"$//')
              if [ -n "$desc_value" ]; then
                has_desc=true
              fi
              break
            elif echo "$line" | grep -q '^[a-z]'; then
              # Next top-level key, stop looking
              in_metadata=false
              break
            fi
          fi
        done <<< "$fm"

        if ! $has_desc; then
          missing_description+=("$relpath")
        fi

        # Check lang consistency
        lang_value=$(echo "$lang_line" | sed 's/^lang:[[:space:]]*//' | sed 's/^"//;s/"$//')
        if [ -n "$lang_line" ] && [ "$lang_value" != "$loc" ]; then
          lang_mismatch+=("$relpath (got '$lang_value', expected '$loc')")
        elif [ -z "$lang_line" ]; then
          missing_lang_field+=("$relpath")
        fi

      done
    fi
  done
done

echo ""

if [ ${#missing_title[@]} -gt 0 ]; then
  echo "--- MISSING 'title' FIELD ---"
  for f in "${missing_title[@]}"; do echo "  $f"; done
  echo ""
fi

if [ ${#missing_description[@]} -gt 0 ]; then
  echo "--- MISSING/EMPTY 'metadata.description' FIELD ---"
  for f in "${missing_description[@]}"; do echo "  $f"; done
  echo ""
fi

if [ ${#lang_mismatch[@]} -gt 0 ]; then
  echo "--- LANG TAG MISMATCH ---"
  for f in "${lang_mismatch[@]}"; do echo "  $f"; done
  echo ""
fi

if [ ${#missing_lang_field[@]} -gt 0 ]; then
  echo "--- MISSING 'lang' FIELD ---"
  for f in "${missing_lang_field[@]}"; do echo "  $f"; done
  echo ""
fi

if [ ${#truncated_desc[@]} -gt 0 ]; then
  echo "--- TRUNCATED CONTENT (lines ending with '...') ---"
  for f in "${truncated_desc[@]}"; do echo "  $f"; done
  echo ""
fi

if [ ${#corrupt_files[@]} -gt 0 ]; then
  echo "--- cat -n CORRUPTED FILES (N| prefix) ---"
  for f in "${corrupt_files[@]}"; do echo "  $f"; done
  echo ""
fi

if [ ${#problematic_files[@]} -gt 0 ]; then
  echo "--- FILES WITH NO FRONTMATTER ---"
  for f in "${problematic_files[@]}"; do echo "  $f"; done
  echo ""
fi

echo "=== SUMMARY ==="
echo "Total articles: $total_articles"
echo "Missing title: ${#missing_title[@]}"
echo "Missing metadata.description: ${#missing_description[@]}"
echo "Lang mismatch: ${#lang_mismatch[@]}"
echo "Missing lang field: ${#missing_lang_field[@]}"
echo "Truncated content (ellipsis): ${#truncated_desc[@]}"
echo "cat -n corruption: ${#corrupt_files[@]}"
echo "No frontmatter: ${#problematic_files[@]}"
