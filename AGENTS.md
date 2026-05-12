# AGENTS.md — UniTeia Multi-Repo Agent Context

## Repositories

### uniteia-v2 (content platform)
- **Path:** /root/projects/uniteia-multirepo/uniteia-v2
- **Stack:** Qwik City, Bun, TypeScript, Biome, Vitest
- **Runner:** `bun run test:unit` (vitest, 224 tests) — NOT `bun test` (native runner loads Playwright + content-factory)
- **Lint:** `bun run lint` = `biome check .`
- **Build:** `bun run build` (content-registry → qwik build → sitemap → CF Pages prep)
- **Ship check:** `bun run ship:check` (scripts/ship-check.ts) — runs lint → typecheck → test:unit → build → size → header → slug → content → sitemap → lighthouse → smoke → invalid-locale
- **Size threshold:** Currently 61,440 gzip bytes. **Baseline is ~80KB** — pre-existing.
- **Gate to verify before PR:** `bun run ship:check`

### uniteia-mega-factory (content generation)
- **Path:** /root/projects/uniteia-multirepo/uniteia-mega-factory
- **Stack:** TypeScript monorepo (core/db/web/tui)
- **Typecheck:** `tsc` not in PATH per-workspace. Engine uses `bunx tsc`.
- **Test:** `bun test` (234 pass, 0 fail)

## Working Tree Rules
- Current branch: `fix/p0-prod-navigation-links` — HEAD `63a6fd4`
- Uncommitted changes are biome format/lint fixes only (15 src/ files)
- docs/ and fixtures/ changes are pre-existing dirty state from earlier sessions
- Do NOT push without authorization
- Do NOT merge or convert PR draft to ready

## PR #3 — P0 Link/Route Fixes
- **URL:** https://github.com/ankinow/uniteia-v2/pull/3
- **Status:** DRAFT, mergeable
- **Blocked by:** size:check (baseline, needs waiver) + Vercel author mismatch
- **No regressions vs origin/main:** proven by baseline worktree comparison

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
