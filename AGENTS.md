# AGENTS.md — UniTeia Multi-Repo Agent Context

## Repositories

### uniteia-v2 (content platform)
- **Path:** `/home/lermf/uniteia-v2`
- **Stack:** Qwik City, Bun, TypeScript, Biome, Vitest, Playwright
- **Runner:** `bun run test:unit` (vitest, 224 tests) — NOT `bun test` (native runner loads Playwright + content-factory)
- **Lint:** `bun run lint` = `biome check .`
- **Typecheck:** `bunx tsc`
- **Build:** `bun run build` (content-registry → qwik build → sitemap → CF Pages prep)
- **Ship check:** `bun run ship:check` — runs lint → typecheck → test:unit → build → size → header → slug → content → sitemap → lighthouse → smoke → invalid-locale
- **Dev:** `bun run dev` (Qwik City dev server)
- **Size threshold:** 87,040 gzip bytes (85 KB, DECISION-SIZE-001)
- **Deploy:** Cloudflare Pages via Wrangler
- **Gate to verify before PR:** `bun run ship:check`

### uniteia-mega-factory (content generation)
- **Path:** `/home/lermf/uniteia-mega-factory`
- **Stack:** TypeScript monorepo (core/db/web/tui), Bun workspaces
- **Typecheck:** `bun run typecheck` (uses `bunx tsc`)
- **Test:** `bun test` (234 pass, 0 fail)
- **Build:** `bun run build`
- **Verify:** `bun run verify`

## Architecture

Two-repo system:
```
uniteia-mega-factory (producer) → Content Package Contract v1 → uniteia-v2 (consumer/publisher)
```

u2 never writes to the factory. Factory never deploys to production.

## Key Commands (uniteia-v2)
```bash
bun run dev          # Qwik City dev server
bun run test:unit    # vitest (NOT bun test)
bun run ship:check   # full quality gate before PR
bun run lint         # biome check .
bun run lint.fix     # biome check --write .
bun run size:check   # bundle size gate
```

## Quality Artifacts (docs/context/)
| File | Purpose |
|------|---------|
| `CONTEXT-MAP.md` | Context map index |
| `post-merge-state.md` | Canonical post-merge state snapshot |
| `quality-completion-report.md` | Full quality closeout report |
| `SIZE_BASELINE_DIFF_REPORT.md` | Bundle size baseline comparison |
| `MCB720_PHASE2_QUALITY_SNAPSHOT.yaml` | Quality snapshot YAML |
| `context-runtime/*.md` | 6 modular agent policy files |

## ADRs (docs/adr/)
Key architectural decisions for content import contract, bridge validation, and page size budget.
