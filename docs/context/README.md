---
id: CTX-V2-ROOT-03
repo: uniteia-v2
role: consumer
symbol: Σ
status: active
version: 1.0.0
created_at: 2026-05-11
updated_at: 2026-05-11
source_of_truth: false
depends_on: [CTX-V2-ROOT-01, CTX-V2-ROOT-02]
hash: SELF
---

# docs/context — Context System Guide (v2)

This directory holds operational context documents for AI agents working on uniteia-v2.

## How to Use

1. Always start with AGENTS.md and CONTEXT-MAP.md
2. Read the domain-specific doc relevant to your task
3. Cross-reference IDs for traceability
4. Update context-index.md and context-ledger.jsonl if you modify a doc

## File Map

| File | Purpose |
|---|---|
| PROJECT-CONTEXT.md | Repo mission, scope, boundaries |
| CONTENT-PACKAGE-IMPORT.md | Import contract from mega-factory |
| MULTILINGUAL-ROUTING-SEO.md | 8-language routing and hreflang |
| SEO-RENDERING-CONTRACT.md | SEO metadata rendering |
| VISUAL-TEXTLESS-ASSETS.md | Visual asset consumption |
| AGENT-BOOT-SEQUENCE.md | Session startup checklist |
| SESSION-RECOVERY.md | Recovery protocol after interruption |
| CONTEXT-SYMBOLS.md | Symbol notation reference |
| context-symbols.json | Machine-readable symbols |
| context-ids.json | Stable ID registry |
| context-manifest.json | Machine-readable artifact manifest |
| context-ledger.jsonl | Append-only trace ledger |
| context-index.md | Human-readable index with hashes |
