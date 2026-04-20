---
name: canonical-url-law
description: Enforces slug regex and BANNED_SLUG_TERMS — no proper nouns, dates, versions in URLs
license: MIT
compatibility: [claude-code, cursor, codex, windsurf, opencode]
---

# Canonical URL Law

Enforces URL law for UniTeia content.

## Slug Regex

```
^[a-z]+(-[a-z]+){1,5}$
```

Valid: 2-6 segments, lowercase letters only, hyphen-separated.

## BANNED_SLUG_TERMS

**Proper Nouns:**
- galaxy-ai, openrouter, poe, chatgpt, claude, gpt-4, llama-3
- openai, anthropic, google, meta

**Versions:**
- v2, v3, 2026, latest

**Dates:**
- 2026, april-2026, q2-2025

**Promotional:**
- best, top, ultimate, sota, definitive

**Quantifiers:**
- top-10, 5-best

## Correct Examples

- `llm-aggregators-compared`
- `local-llm-runtimes-ranked-by-latency`
- `rag-frameworks-for-self-hosted`

## Incorrect Examples

- ❌ `galaxy-ai` (proper noun)
- ❌ `best-llms-2026` (promotional + date)
- ❌ `openrouter-vs-poe` (two proper nouns)

## Proper Nouns Location

Brand names belong in `frontmatter.subjects[]`, NOT in slug.

## Schema Validation

Build fails if slug violates regex or contains BANNED_SLUG_TERMS.
