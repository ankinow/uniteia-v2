# CONTEXT_DOC_AGENT.md

## Context Documentation Standards

1. **LIVE_CONTEXT.md** at multi-repo root — canonical project state, updated on every significant change
2. **AGENTS.md** in each repo root — repo-specific commands, gate rules, quirks
3. **context-runtime/** — modular agent rules per domain (QA, security, size, config, handoff)
4. **TECH_QUALITY_AUDIT_*.md** — per-cycle quality reports with before/after

## Content to Document
- Gate results with command, exit code, expected, observed
- Blockers with P0/P1/P2 priority
- Decisions with rollback option
- Baseline comparisons with evidence (bytes, diffs)
