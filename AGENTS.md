# AGENTS.md — UniTeia Ecosystem
# Canonical: sim | Stale copy: AGENTS(1).md (session artifact — delete)
# Verified: 2026-05-21 via codebase inspection (ship-check.ts, package.json, biome.json, tsconfig.json, vitest.config.ts, vite.config.ts, playwright.config.ts)
# Protocol: AGENTS.md v1.2 (OpenCode /init compatible)
# Scope: Multi-repo — UniTeia v2 (product) + UniTeia Mega-Factory (orchestration) + CTt-Guaratuba-AI (satellite)

## Ecosystem Map

```
┌─────────────────────────────────────────────────────────────┐
│                    UNITEIA ECOSYSTEM                         │
├─────────────────────────────────────────────────────────────┤
│  uniteia-v2 (this repo)                                     │
│  ├── Product: Multilingual editorial platform (8 locales)  │
│  ├── Stack: Qwik City + Tailwind v4 + Cloudflare Pages     │
│  └── Role: Primary deliverable — what users see              │
│                                                              │
│  uniteia-mega-factory (sibling repo)                        │
│  ├── Orchestration: 44-agent pipeline                        │
│  ├── Stack: Node.js + custom agent framework               │
│  └── Role: Content generation + quality gates              │
│                                                              │
│  CTt-Guaratuba-AI (satellite repo)                          │
│  ├── Scope: Regional AI experiments                          │
│  ├── Stack: Python + local LLM inference                     │
│  └── Role: R&D + low-cost inference validation             │
└─────────────────────────────────────────────────────────────┘
```

## Repo: UniTeia v2 (this repo)

### Stack

| Layer | Tool | Version | Notes |
|-------|------|---------|-------|
| Framework | Qwik City | 1.19.x | SSR/SSG with resumability |
| Styling | Tailwind CSS v4 | Oxide engine | `@tailwindcss/vite` plugin only |
| Runtime | Bun | 1.3.6 | **Mandatory** — never npm/yarn/pnpm |
| Lint/Format | Biome | 1.9.4 | **NOT** ESLint/Prettier |
| Unit Test | Vitest | 4.x | Pattern: `src/**/*.test.ts` |
| E2E Test | Playwright | 1.60 | `tests/e2e/*.spec.ts` |
| Deploy | Cloudflare Pages | — | Wrangler (`wrangler.toml` / `wrangler.jsonc`) |

### Build & Quality Commands

| Command | What it does |
|---------|-------------|
| `bun install` | Install dependencies |
| `bun run dev` | Dev server (port **3000**, `vite --mode ssr`) |
| `bun run build` | Content generation + Qwik SSG build → `dist/` |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | `biome check .` (no autofix) |
| `bun run lint.fix` | `biome check --write .` (autofix) |
| `bun run test:unit` | Vitest run (`src/**/*.test.ts`) |
| `bun run test:e2e` | Playwright test (`tests/e2e/`) |
| `bun run ship:check` | Full quality gate — sequence at `src/utils/ship-check.ts:55-97` |
| `bun run preview` | `qwik preview` on port **4000** |
| `bun run preview:cf` | Wrangler preview on port **8788** (used by Playwright) |

**Quick loop:** `bun run lint.fix && bun run typecheck && bun run test:unit`  
**Full gate:** `bun run ship:check`

### ⚠️ CRITICAL: .gitignore *.md Catch-All

`.gitignore` line 63 contains `*.md`. **New markdown files are NOT tracked by git automatically.**

```bash
git add -f AGENTS.md          # ← required -f flag
git add -f CHANGELOG.md       # ← required -f flag
git add -f *.md               # ← NEVER works without -f
```

### Content Pipeline (SACRED — read-only generated files)

```
content/niches/*.yaml  +  content/articles/**/index.{lang}.md
        │
        ▼  (bun run generate:content, also runs on build)
        │
src/content-graph.generated.ts      ← AUTO-GENERATED, read-only
src/content-registry.generated.ts   ← AUTO-GENERATED, read-only
src/search-index.generated.ts       ← AUTO-GENERATED, read-only
src/content-graph/generated/*.json  ← AUTO-GENERATED (gitignored)
```

- **8-locale symmetry is non-negotiable:** `en, pt, es, fr, de, it, ja, zh`
- Adding content to one locale requires at least stubs in the other 7
- `ship:check` validates locale symmetry; failure blocks the gate
- Niches with 0 articles are filtered at **compile time** — never filter at runtime

### Architecture

#### Routes (Qwik City file-based)

```
src/routes/
  [lang]/              ← 8 locales: en, pt, es, fr, de, it, ja, zh
    signals/           ← content by niche
    search/            ← search page
    [...slug]/         ← article detail
    index.tsx          ← language landing
    layout.tsx         ← lang layout wrapper
  n/                   ← non-locale fallback
  [...catchall]/       ← 404 handler
  ops-lab/             ← demo API fixtures
```

#### Key directories

| Directory | Purpose |
|-----------|---------|
| `src/components/` | Components: `{name}/index.tsx` + optional `index.test.ts` + optional `style.css` |
| `src/routes/` | Qwik City routing |
| `src/i18n/` | Locale detection, document language, middlewares |
| `src/content-graph/` | Content graph compiler, contracts, loaders |
| `src/pipeline/` | Content transformation pipeline |
| `scripts/` | 41 build/dev scripts (bun + TypeScript) |
| `tests/e2e/` | Playwright E2E specs (14 files) |
| `content/` | Source: YAML niches + MD articles per locale |

#### Entry points

- `src/root.tsx` — QwikCityProvider, global CSS, RouterHead
- `src/entry.ssr.tsx` — SSR render entry, document language resolution
- `src/entry.cloudflare-pages.tsx` — Cloudflare adapter entry

### Qwik Conventions

- Use `component$()` for all components
- Use `$()` for callbacks/event handlers
- `useSignal()` for simple state, `useStore()` for complex objects
- `useVisibleTask$()` only when unavoidable (SEO penalty)
- **Never** use `useClientEffect$()` — deprecated, breaks resumability
- `useTask$()` with `track()` for reactive side effects
- Path alias: `~/` → `src/` (configured in `tsconfig.json`)
- Imports use `verbatimModuleSyntax` — use `import type` for type-only imports

### Design Constraints

- Colors: OKLCH wide-gamut only (defined in `src/global.css` as `@theme` tokens)
- Fonts: Sora (display), Inter Variable (body), JetBrains Mono (mono), Press Start 2P (JRPG)
- Motion: compositor-only (`transform`, `opacity`), 120ms–400ms max
- Bundle cap: **87KB gzip** (checked by `bun run size:check`)
- **Never** use `!important` in CSS
- **Never** use CSS-in-JS (emotion, styled-components) — Tailwind v4 only
- Biome enforces: `noExplicitAny`, `noForEach`, `noUnusedVariables`, `noUnusedImports`, `noNonNullAssertion`, `useImportType`, a11y recommended rules

### Testing

#### Unit Tests (Vitest)

- Pattern: `src/**/*.test.ts` (NOT `.test.tsx` — confirmed in `vitest.config.ts`)
- Import `createDOM` from `@builder.io/qwik/testing` for component rendering
- No special fixtures required — tests run standalone
- Update snapshots: `bun run test:unit --update`

#### E2E Tests (Playwright)

- Runs against `http://localhost:8788` (Wrangler CF preview)
- Must `bun run build` first or use built-in webServer config
- `bun run test:e2e` starts CF preview automatically (webServer in `playwright.config.ts`)
- Visual regression uses Playwright screenshots
- Run single spec: `bun run test:e2e tests/e2e/smoke.spec.ts`

### Git & Repo Rules

- `.gitignore` line 63: `*.md` → new .md files require `git add -f`
- `node_modules`, `dist`, `.gsd`, `.bg-shell`, `.opencode/`, `.wrangler`, `playwright-report`, `test-results`, `.worktrees`, `server/` are all gitignored
- Commit convention: `M{NNN}-S{step}: {type} — {desc}`
- Types: `feat | fix | refactor | docs | test | chore | cleanup | reconcile | evolve | verify`

### Milestone Context

| Milestone | Status | Description |
|-----------|--------|-------------|
| M012 | ✅ Merged | Visual Refinement — Sora Serif, OKLCH tokens, 5 new components, Galaxy AI content |
| M013 | ✅ Merged | Visual Evolution System v2 — OnboardingFlow, CinematicDepth, adaptive-header |
| M014 | 🔄 Active | Cleanup + Reconciliation + Evolution (see `M014-SUPER-PROMPT.md`) |

## Repo: UniTeia Mega-Factory (sibling)

### Role
Orchestration layer for 44-agent content pipeline. Generates articles, runs quality gates, manages i18n stubs.

### Key Integration Points
- Consumes `content-graph.generated.ts` from uniteia-v2 to know content structure
- Outputs `content/articles/**/index.{lang}.md` back to uniteia-v2
- Uses free/low-cost inference (local LLMs, Gemini Flash, etc.)
- Dense symbolic notation + hash tracking + file traceability

### Agent Architecture (44 agents)
```
Tier 1: Research (exa-search, parallel-search, deep-thinker)
Tier 2: Drafting (content-agent, i18n-agent, fact-check-agent)
Tier 3: Review (test-agent, visual-agent, ops-agent)
Tier 4: Integration (dev-agent, deploy-agent)
```

### Communication Protocol
- Agents generate prompts with `$M{NNN}-H{NNN}` hashes
- File traceability in all outputs
- Portuguese (pt-BR) for internal notes, English for code/docs

## Repo: CTt-Guaratuba-AI (satellite)

### Role
R&D lab for regional AI experiments. Validates low-cost inference strategies before adoption in mega-factory.

### Stack
- Python 3.11+
- Local LLM inference (llama.cpp, ollama, vllm)
- FastAPI for API layer
- SQLite for experiment tracking

### Integration
- Experiment results feed back into mega-factory agent configurations
- Not directly connected to uniteia-v2 production pipeline

## Subagents & Responsibilities (OpenCode)

| Subagent | Role | Scope | Permissions |
|----------|------|-------|-------------|
| `dev-agent` | Code implementation, refactors, bugfixes | uniteia-v2 | write `src/`, `tests/` |
| `content-agent` | Content generation, i18n, YAML/MD editing | uniteia-v2 + mega-factory | write `content/`, `public/locales/` |
| `visual-agent` | CSS, tokens, animations, visual regression | uniteia-v2 | write `src/global.css`, `src/components/**/style.css` |
| `ops-agent` | Build, deploy, CI, bundle analysis | uniteia-v2 | read `dist/`, write `.github/workflows/` |
| `test-agent` | Test writing, coverage, edge-case discovery | uniteia-v2 | write `src/**/*.test.ts`, `tests/e2e/` |
| `research-agent` | Multi-source research, fact-checking | mega-factory | read `content/`, exa-search |
| `factory-agent` | Agent pipeline orchestration, 44-agent coordination | mega-factory | write pipeline configs, agent manifests |

## MCP Servers (Connected)

| Server | Purpose | Use When | Scope |
|--------|---------|----------|-------|
| `filesystem` | Read/write project files | Always active | All repos |
| `browser-skills` | Playwright-based visual regression | Visual tasks, E2E | uniteia-v2 |
| `parallel-search` | Multi-source research | Research tasks | mega-factory |
| `deep-thinker` | Complex architectural decisions | ADR-level decisions | All repos |
| `context7` | Codebase context retrieval | Large refactors | uniteia-v2 |
| `exa` | Web search for fact-checking | Content verification | mega-factory |
| `composio` | External tool gateway | Integrations | mega-factory |

## Communication Style

- **Dense symbolic notation** preferred: `§`, `→`, `⊕`, `Σ`, `⟳`
- **Hash tracking** for every file change: `$M{NNN}-H{NNN}`
- **File traceability** in commits: `M014-S03: evolve — $M014-H009 article-frame.tsx`
- **No prose waste** — bullet points, tables, code blocks only
- Portuguese (pt-BR) for internal notes, English for code/docs

## Auto-Approve Rules

**Auto-approved (no human confirmation):**
- `bun run test:unit`, `bun run ship:check`, `bun run lint`, `bun run lint.fix`, `bun run build`, `bun run typecheck`
- Formatting with Biome
- Updating `CHANGELOG.md` (with `git add -f`)
- Committing with conventional format `M{NNN}-S{step}: {type} — {desc}`

**Requires human confirmation:**
- Pushing to `main` branch (any repo)
- Modifying sacred files (`compile-content-graph.ts`, `*.generated.ts`)
- Adding new npm/bun dependencies
- Deleting existing components
- Deploying to production (Cloudflare Pages)
- Modifying `.github/workflows/` (CI changes)
- Changes to mega-factory agent configurations (44-agent architecture)

## Vibe Coding Prohibition

This ecosystem uses **Spec-Driven Development**. All changes must reference a milestone (M012-M014) and a task hash. No "vibe coding" — every modification is traceable to a specification.

## Hygiene

Automated dead-code and lint maintenance. Baseline scanned R26 (2026-06-03).

- `bunx knip --reporter compact` — find unused files, exports, deps (JSON report at `artifacts/hygiene/knip-report.json`)
- `bun run lint` — Biome check (8 pre-existing warnings)
- `bun run lint.fix` — Biome auto-format

**Knip tuning**: `knip.json` at root — ignores Qwik `$()` wrappers, Vite dynamic `import()`, generated files.
False positives expected: `useVisibleTask$`, `$()` closures, CF Pages Worker functions.

## Knowledge Graph

Cross-repo graph bridge via graphify (R21 ACTIVE in factory).

- Factory publishes `.factory/graphify/graph.json` → consumes inferred semantic edges
- Bridge: `bun run import:graphify` (R27) — merges graphify nodes into content-graph compiler
- God nodes, surprising connections, community detection
- Status: factory-side active (nightly cron 4AM UTC). v2-side pending (R27).
