# AGENTS.md — uniteia-v2

Owner: `LERMF` | Root: `/root/hub/uniteia-v2/`

Purpose: backend de conteúdo curado com pipeline determinístico `entidade -> core.yaml -> blog.md + short.json`.

## Scope

- Keep changes small and surgical
- Prefer Bun + TypeScript
- Preserve deterministic content generation
- Do not expand into UI, CMS, analytics, multi-tenant, or affiliate flows

## Current Bootstrap Status

Loaded skills in this session:

- `workspace-surface-audit`
- `karpathy-guidelines`
- `relace-search`

Unavailable skill names referenced by the bootstrap prompt:

- `project-bootstrap`
- `agents-md-generator`
- `skill-md-writer`
- `soul-md-writer`
- `mcp-config-scaffold`
- `content-research-brief`
- `affiliate-blog-builder`
- `dense-prompt-llmlingua3`
- `ttc-budget-forcing`
- `agentops-trace`
- `guardrails-lint`
- `golden-snapshot-test`
- `rsip-self-improve`
- `ma-tot-consensus`

## Commands

```bash
bun install
bun run dev
bun run build
bun run typecheck
bun run test
```
