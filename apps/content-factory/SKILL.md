---
name: llm-wiki-uniteia-factory
version: 0.1.0
location: uniteia-v2/apps/content-factory
description: |
  Manual-first, isolated content factory inside the uniteia-v2 monorepo
  that produces llm-wiki-uniteia/<lang>/<slug>.md (combined wiki+blog)
  from prompt, link, or notes. ZERO automatic link with the Qwik app.
lang: [en, pt, es, ja, zh]
compatibility: [opencode, gsd, hermes, claude-code, vibe-coding]
allowed-tools: [read, write, edit, bash, fetch, llm]
commands:
  - generate: "Pipeline: gather → build → render"
  - render: "Re-render channels from existing core.yaml (pure)"
  - export: "Combine into llm-wiki-uniteia/<lang>/<slug>.md (pure)"
  - lint: "Per-channel and combined lint via _engine/lint/rules.yaml"
  - validate: "AJV (Draft 2020-12) + evidence binding"
---

# Skill: llm-wiki-uniteia-factory

This skill builds canonical wiki+blog combined Markdown for the LLM
ecosystem niche, with strict evidence binding and pure-render export.
All LLM and HTTP work is dependency-injected (`llmFn`, `fetcherFn`).
The app is isolated from the rest of the monorepo and is operated
manually — no watcher, no root CI, no cross-package imports.
