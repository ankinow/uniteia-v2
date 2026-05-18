# AGENTS.md — UniTeia Multi-Repo Agent Context

## Repositories

### uniteia-v2 (content platform / publisher)
- **Path:** `/home/lermf/uniteia-v2`
- **Stack:** Qwik City, Bun 1.3.6, TypeScript, Biome, Vitest, Playwright
- **Runner:** `bun run test:unit` (vitest, 224 tests) — NOT `bun test` (native runner loads Playwright + content-factory)
- **Lint:** `bun run lint` = `biome check .`
- **Typecheck:** `bunx tsc`
- **Build:** `bun run build` (content-registry → qwik build → sitemap → CF Pages prep)
- **Ship check:** `bun run ship:check` — runs lint → typecheck → test:unit → build → size → header → slug → content → sitemap → lighthouse → smoke → invalid-locale
- **Dev:** `bun run dev` (vite --mode ssr)
- **Size threshold:** 87,040 gzip bytes (85 KB, DECISION-SIZE-001)
- **Deploy:** Cloudflare Pages via Wrangler (`bun run preview:cf` for local preview)
- **Gate to verify before PR:** `bun run ship:check`
- **CI:** `.github/workflows/quality-gates.yml` — runs `bun run ship:check` on push/PR

### uniteia-mega-factory (content generation / producer)
- **Path:** `/home/lermf/uniteia-mega-factory`
- **Stack:** TypeScript monorepo (core/db/web/tui), Bun workspaces
- **Typecheck:** `bun run typecheck` (uses `bunx tsc`)
- **Test:** `bun test` (234 pass, 0 fail)
- **Build:** `bun run build`
- **Verify:** `bun run verify` (typecheck → test → build)
- **CI:** `.github/workflows/ci.yml` — runs typecheck → test → build on push/PR

### CTt-Guaratuba-AI (civic dashboard)
- **Path:** `/home/lermf/CTt-Guaratuba-AI`
- **Stack:** npm workspaces, Qwik (civic-os), Astro (web), Deno/TS (ingest), Python (nlp-pipeline), Rust (dedup-rust)
- **No CI** — no GitHub workflows configured

## Architecture

Two-repo content system + one civic dashboard:
```
uniteia-mega-factory (producer) → Content Package Contract v1 → uniteia-v2 (consumer/publisher)
CTt-Guaratuba-AI (civic-os) → static-first radar dashboard, independent
```

u2 never writes to the factory. Factory never deploys to production.

## Connected MCP Tools

| Tool | Role |
|------|------|
| `filesystem` | Local truth — files, configs, logs, scripts |
| `context7` | Library/API/framework documentation |
| `exa` | Targeted web/code search |
| `parallel-search` | Multi-source research |
| `deep-thinker` | DAG reasoning, branching, critique |
| `graphrag` (CLI) | Entity/relation KG — multi-hop, cross-file |
| `playwright` | Browser automation, e2e testing |
| `browser-skills` | Browser interaction skills |

## Key Commands (uniteia-v2)
```bash
bun run dev          # Qwik City dev server
bun run test:unit    # vitest (NOT bun test)
bun run test:e2e     # playwright e2e tests
bun run ship:check   # full quality gate before PR
bun run lint         # biome check .
bun run lint.fix     # biome check --write .
bun run size:check   # bundle size gate
bun run import:package  # import content package from factory
```

## Key Commands (uniteia-mega-factory)
```bash
bun run verify           # pre-PR gate: typecheck + test + build
bun run factory:wiki:dry-run  # dry-run wiki pipeline (start here)
bun run factory:wiki     # run full wiki pipeline
bun run package:roundtrip  # full bridge test: export → v2 import → render
bun run doctor:providers # LLM provider diagnostics
```

## Key Commands (CTt-Guaratuba-AI)
```bash
cd apps/civic-os && npm run dev          # Qwik dev server
cd apps/civic-os && npm run build        # Qwik build
cd apps/civic-os && npm run lint         # eslint
cd apps/civic-os && npm run build.types  # tsc --noEmit
cd apps/web && npm run dev               # Astro dev server
```

## Content Import Workflow (uniteia-v2)
- Factory exports Content Package Contract v1 → `bun run import:package` validates and imports
- Required package files: manifest.json, content.*.mdx, design.md, quality.json, sources.json, tags.json, blocks/*.json
- After import: `bun run generate:content` rebuilds registry, graph, and search index

## Quality Artifacts (uniteia-v2 docs/context/)
| File | Purpose |
|------|---------|
| `CONTEXT-MAP.md` | Context map index |
| `post-merge-state.md` | Canonical post-merge state snapshot |
| `quality-completion-report.md` | Full quality closeout report |
| `context-runtime/*.md` | 6 modular agent policy files |

## ADRs
- uniteia-v2: `docs/adr/` — content import contract, bridge validation, page size budget
- uniteia-mega-factory: `docs/adr/` — factory architecture decisions
- CTt-Guaratuba-AI: `docs/adr/` — static-first, Nova isolation

## Active Milestone Context
- **M010 — Graph-Native Stabilization**: Complete rewrite of the content compilation and routing layer to fully rely on the in-memory content graph. Enforces quality visibility gates, i18n symmetry, and localized link generation. Spec exists at `src/content-graph/SPEC.md`.
- **M011 — Visual DNA Renaissance** (functionally complete): Tailwind v4 Oxide, OKLCH palette, tactile warmth (grain-4k + paper-fiber), 2.5D header with WAAPI tilt, organic anti-grid layout, visual regression gate. 8.3/10 SOTA. Post-M011 re-evaluation at `docs/reference/post-m011-sota-reevaluation.md`.
- **M012 — MasterOpenCanvas** (active): Interactive sketchnote decision surface. Reuses VisualDNAIntegrator + DecisionMap + DepthSection. Component at `src/components/master-open-canvas/`, wired into homepage hero.

## Active JIT Skills (2026-05-18)
- **VisualDNAIntegrator_v2026_05** — Editorial Collage + Signal Grid + 2.5D depth (3 variants)
- **MasterOpenCanvas_v2026_05** — sketchnote decision flows → M012 bleeding-edge canvas
- **DecisionMap_v2026_05** — organic branching decision tree (sketchnote/signal/minimal)
- **JIT Mutant Compiler ativo** (GraphRAG + MCP)
