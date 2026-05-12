# AGENTS.md — UniTeia Multi-Repo Agent Context

## Repositories

### uniteia-v2 (content platform)
- **Path:** /root/projects/uniteia-multirepo/uniteia-v2
- **Stack:** Qwik City, Bun, TypeScript, Biome, Vitest
- **Runner:** `bun run test:unit` (vitest, 224 tests) — NOT `bun test` (native runner loads Playwright + content-factory)
- **Lint:** `bun run lint` = `biome check .`
- **Build:** `bun run build` (content-registry → qwik build → sitemap → CF Pages prep)
- **Ship check:** `bun run ship:check` (scripts/ship-check.ts) — runs lint → typecheck → test:unit → build → size → header → slug → content → sitemap → lighthouse → smoke → invalid-locale
- **Size threshold:** 87,040 gzip bytes (85 KB, DECISION-SIZE-001)
- **Gate to verify before PR:** `bun run ship:check`

### uniteia-mega-factory (content generation)
- **Path:** /root/projects/uniteia-multirepo/uniteia-mega-factory
- **Stack:** TypeScript monorepo (core/db/web/tui)
- **Typecheck:** `tsc` not in PATH per-workspace. Engine uses `bunx tsc`.
- **Test:** `bun test` (234 pass, 0 fail)

## Post-Merge State (main @ 102c0bb)
- PR #3 (`fix: resolve P0 language roots and broken production links`) merged to main
- Merge commit: `102c0bb3f1ec7765321b6b29ca8e6520ddb871de`
- Author: Luiz Eloi <luixglad@gmail.com>
- Main branches: `main` (default), `feat/content-package-import-contract`, `feat/design-review-dog-api-fixture`, `v0/ankinow-852e44d3`
- Feature branch `fix/p0-prod-navigation-links` is aheah of main by 3 commits — can be deleted after verification
- Vercel author mismatch (`root@localhost` in 13b5390) — non-blocking external status

## Key Quality Artifacts (docs/context/)
| File | Purpose |
|---|---|
| `post-merge-state.md` | Canonical post-merge state snapshot |
| `quality-completion-report.md` | Full quality closeout report |
| `SIZE_BASELINE_DIFF_REPORT.md` | Bundle size baseline comparison report |
| `MCB720_PHASE2_QUALITY_SNAPSHOT.yaml` | Quality snapshot YAML |
| `context-runtime/*.md` | 6 modular agent policy files |

## Key Commands
```bash
# Run correct test suite
bun run test:unit

# Full quality gate
bun run ship:check

# Size gate standalone
bun run size:check

# Lint full repo
bun run lint

# Lint + auto-fix (runs during build via generate:content-registry)
bun run lint.fix
```
