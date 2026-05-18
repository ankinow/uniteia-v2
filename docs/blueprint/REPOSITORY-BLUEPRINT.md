---
title: "UniTeia v2 — Repository Blueprint"
type: "blueprint"
subtype: "repository-snapshot"
lang: "en"
tags:
  - uniteia-v2
  - blueprint
  - llm-context
  - repository-snapshot
  - qwik
  - cloudflare-pages
  - content-publisher
version: "1.1"
generated: "2026-05-18"
source: "/home/lermf/uniteia-v2"
role: "content-publisher"
depends_on: ["uniteia-mega-factory (producer)"]
compatible_with:
  - "@uniteia/content-node-contract (content-graph.v1)"
  - "uniteia-mega-factory (Content Package Contract v1)"
---

# UniTeia v2 — Repository Blueprint (LLM-Optimized)

**Stack:** Qwik City 1.19 + Bun 1.3.6 + TypeScript 5.6 + Vite 6 + Vitest 4  
**Target:** Cloudflare Pages (edge-deployed SSG)  
**Role:** Content publisher/consumer (receives from `uniteia-mega-factory`)  
**Quality gate:** `bun run ship:check` (14-step pipeline)  
**Bundle cap:** 87,040 bytes gzip  
**CI:** `.github/workflows/quality-gates.yml`

---

## 1. Repository Identity

| Field | Value |
|-------|-------|
| Name | `uniteia-v2` |
| Package type | `"type": "module"` (ESM-only) |
| Alias path | `~/` → `./src/*` |
| Runner | `bun run` for everything |
| Test framework | Vitest (224 unit tests) + Playwright (15 e2e specs) |
| Deploy target | Cloudflare Pages via Wrangler |
| Package manager | Bun 1.3.6 |

---

## 2. Directory Map

```
uniteia-v2/
├── src/                          # Main source code (~200+ TS/TSX files)
│   ├── entry.ssr.tsx             # SSR entry — renderToStream, lang resolution
│   ├── entry.cloudflare-pages.tsx# CF Pages adapter — createQwikCity
│   ├── root.tsx                  # QwikCityProvider + RouterOutlet + font preloads
│   ├── global.css                # Tailwind + custom design tokens (432 lines)
│   ├── content-registry.generated.ts  # AUTO-GENERATED — all .md inlined as JSON strings
│   ├── content-graph.generated.ts     # AUTO-GENERATED — compiled ContentGraph via JSON.parse
│   ├── search-index.generated.ts      # AUTO-GENERATED — search index documents
│   │
│   ├── routes/                   # Qwik City file-based routing
│   │   ├── layout.tsx            # Root layout — language negotiation, security headers
│   │   ├── index.tsx             # Root redirect → /{lang}/signals
│   │   ├── service-worker.ts     # SW with BUILD_ID mismatch cache invalidation
│   │   ├── [...catchall]/        # 404 handler
│   │   └── [lang]/               # Language-scoped routes
│   │       ├── layout.tsx        # Locale validation → 404 on invalid lang
│   │       ├── index.tsx         # Homepage via getHomepageProjection()
│   │       ├── signals/
│   │       │   ├── index.tsx     # Niche index (all niches as cards)
│   │       │   └── [niche]/
│   │       │       ├── index.tsx # Niche landing (article list)
│   │       │       └── [slug]/
│   │       │           └── index.tsx # Article page
│   │       └── search/
│   │           └── index.tsx     # Search page
│   │
│   ├── components/               # 29 component directories
│   │   ├── site-shell/           # Root layout shell (skip-link, header/main/footer)
│   │   ├── router-head/          # Dynamic <head> — title, meta, JSON-LD schemas
│   │   ├── sidebar/              # JRPG-style sticky sidebar (desktop-only)
│   │   ├── depth-card/           # Glass/2.5D card (4 variants)
│   │   ├── article-frame/        # Article wrapper
│   │   ├── niche-card/           # Niche display card
│   │   ├── niche-landing/        # Niche landing page
│   │   ├── related-articles/     # Related content grid
│   │   ├── json-ld.tsx           # JSON-LD schema injection component
│   │   ├── quality-ring/         # Quality score ring visualization
│   │   ├── dopamine-card/        # Microinteraction reward component
│   │   ├── lang-switcher/        # Compact + full variants
│   │   ├── nav-tree/             # Auto-derived navigation tree
│   │   ├── search/               # Search interface components
│   │   ├── signal-grid/          # Signal grid layout
│   │   ├── adaptive-header/      # Dynamic page header
│   │   ├── frontmatter-slots/    # Article metadata display (subjects, author, version)
│   │   ├── footer/               # Site footer
│   │   ├── error-pages/          # not-found, error pages
│   │   ├── hud-label/            # HUD-style labels
│   │   ├── scratch-divider/      # Decorative divider
│   │   ├── editorial-verdict/    # Quality/verdict badge
│   │   ├── lesson/               # Lesson/teaching components
│   │   ├── donation/             # Donation button
│   │   ├── source-ledger/        # Source attribution ledger
│   │   ├── visual/               # Decorative (handdraw arrows/circles)
│   │   ├── jrpg/                 # JRPG pixel-themed components
│   │   ├── depth/                # Shared depth utilities
│   │   └── depth-section/        # Depth-aware section wrapper
│   │
│   ├── content-graph/            # Core data engine (see §4)
│   │   ├── index.ts              # Public API barrel exports
│   │   ├── SPEC.md               # Contract specification
│   │   ├── contracts/            # TypeScript interfaces (node, graph, provider, routing, group, queries, edge, search, artifacts)
│   │   ├── compiler/             # Build-time compilation pipeline
│   │   ├── loaders/              # Runtime graph loaders
│   │   ├── providers/            # StaticJsonContentGraphProvider (main query engine)
│   │   ├── policies/             # Visibility & quality policies
│   │   └── projections/          # Data projections for UI (homepage, navigation)
│   │
│   ├── content-contracts/        # Content Package Contract v1 schema validators
│   ├── content-import/           # Factory→Site import bridge
│   ├── i18n/                     # 8-language i18n system
│   ├── routing/                  # URL routing utilities (AppRoutes)
│   ├── types/                    # Shared type definitions
│   ├── utils/                    # Utility modules
│   ├── stores/                   # App stores (dopamine-budget)
│   ├── pipeline/                 # Content transformation pipeline
│   ├── adapters/                 # External API adapters (demo)
│   ├── taxonomy/                 # tags.yaml
│   └── layouts/                  # Layout registry
│
├── content/                      # Markdown content files (niche/lang/slug.md)
├── config/                       # niches.yaml
├── schemas/                      # llm-wiki-v1.schema.json (JSON Schema)
├── functions/                    # Cloudflare Pages Functions (edge middleware)
├── scripts/                      # 33 build/CI/quality scripts
├── tests/e2e/                    # 15 Playwright spec files
├── docs/                         # ADRs, design, architecture, blueprints
└── public/                       # Static assets, fonts, _headers, _routes.json, robots.txt
```

---

## 3. Architecture — Data Flow

```
[uniteia-mega-factory]            ← Content producer (separate repo, independent)
       │
       ▼  Content Package Contract v1 (manifest.json + content.*.mdx + content-nodes.json + ...)
       │
[bun run import:package]          ← Import bridge (validate + extract factory nodes)
       │
       ▼
content/{niche}/{lang}/{slug}.md  ← Markdown files on disk
       │
       ▼  Build-time compilation
[generate:content-registry]       ← Inlines all .md into content-registry.generated.ts
[generate:content-graph]          ← Compiles ContentGraph from registry + factory L2 bridge
[verify:content-graph]            ← Health verification
[generate:search-index]           ← Builds search index
       │
       ▼
[qwik build]                      ← Qwik SSG build (smart entry strategy)
       │
       ▼
dist/                             ← Static output → Cloudflare Pages
       │
       ▼
[Cloudflare Edge]                 ← functions/[[route]].ts middleware
[Qwik City Runtime]               ← StaticJsonProvider on pre-compiled graph
[Browser]                         ← Resumable Qwik components, no hydration
```

### Architectural Principles

| Principle | Description |
|-----------|-------------|
| **Static-first** | All content compiled at build time into JSON artifacts embedded in SSG bundle. Zero runtime content fetching. |
| **Graph-native** | Navigation, related content, projections all derived from in-memory content graph, not config files. |
| **Edge-middleware** | CF Pages Functions handle locale negotiation/validation + security headers *before* Qwik City routing. |
| **8-locale symmetry** | Content must exist in all 8 languages to be public — hard quality gate. |
| **Qwik resumability** | Components use `component$` for lazy loading. State serialized in HTML, no hydration needed. |
| **Two-layer quality** | Factory can provide structured quality metadata (L2 bridge) that v2 prefers over self-computed values. |
| **Zero-broken-link** | Graph compilation computes routes, alternates, and related links deterministically at build time. |

---

## 4. Content Graph System (Core Engine)

### 4.1 Compilation Pipeline

```
compileContentGraph(input: CompileInput): ContentGraph
  1. parseRegistryEntry() per file
     - Extract niche, locale, slug from path
     - Parse frontmatter via gray-matter
     - Compute quality/trust etc OR merge factory-provided ContentNode (L2 bridge)
  2. compileTaxonomy() — build tag→nodes index
  3. compileRouting() — assign canonical route strings
  4. compileLocales() — populate alternates between locale siblings
  5. compileRelated() — compute related via niche/tag overlap
  6. build groups Map (by canonicalSlug), niches Map (by niche)
  7. compute graphScores: quality*0.25 + trust*0.25 + semantic*0.2 + freshness*0.15 + edgeRank*0.15
  8. serializeGraphArtifacts() → 6 JSON artifact files on disk
```

### 4.2 ContentNode Contract

Defined in `src/content-graph/contracts/node.ts` (mirrors `@uniteia/content-node-contract`):

```typescript
type ContentLocale = 'en' | 'pt' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'zh'

interface ContentNode {
  id: string                    // "{locale}-{canonicalSlug}"
  canonicalSlug: string         // global identity
  locale: ContentLocale
  canonicalLocale: ContentLocale
  title: string
  summary: string
  slug: string
  niche: string[]
  tags: string[]
  entities: string[]
  qualityScore: number          // 0-100
  trustScore: number            // 0-100
  visibility: 'draft' | 'review' | 'published'
  lifecycle: 'generated' | 'verified' | 'reviewed' | 'published' | 'deprecated'
  verdict: 'safe' | 'caution' | 'unsafe'
  routes: { canonical: string; aliases: string[] }
  alternates: Partial<Record<ContentLocale, string>>
  related: string[]
  seo: { noindex: boolean; priority: number }
  timestamps: { createdAt: string; updatedAt: string }
  metrics: { edgeRank: number; semanticDensity: number; freshnessScore: number; graphScore: number }
  visualStyle?: VisualStyle
  sketchnoteSpecId?: string
}
```

### 4.3 ContentGraphProvider Interface

`src/content-graph/contracts/provider.ts`:

```typescript
interface ContentGraphProvider {
  getNode(slug, locale?)                → ContentNode | null
  getGroup(canonicalSlug)               → ContentNode[] | null  // all locales
  getPublicNodes(locale, filters?)      → ContentNode[]
  getHomepageProjection(locale)         → { featured, clusters, frontier }
  getNavigation()                       → NavigationItem[]
  getRelated(fromId, locale, limit?)    → ContentNode[]
  getSitemapEntries()                   → SitemapEntry[]
  isPublic(node)                        → boolean
  // Legacy methods
  getNodes(query?), getByNiche(), getByLocale(), getFeatured(), getTotalCount()
}
```

### 4.4 isPublic() — The Hard Gate

```typescript
isPublic(node):
  qualityScore >= 95
  && visibility === 'published'
  && group.length === 8          // all 8 locales present
  && new Set(locales).size === 8 // symmetry: no duplicates
```

### 4.5 Compilation Artifacts (6 JSON files)

| File | Content |
|------|---------|
| `content-graph.v1.json` | Full graph (nodes, edges, groups, indexes) |
| `route-manifest.v1.json` | Route table per node |
| `locale-index.v1.json` | Alternates lookup |
| `taxonomy-index.v1.json` | byNiche, byTag indexes |
| `related-index.v1.json` | Related node IDs |
| `visibility-index.v1.json` | Public, noindex, sitemapEligible, draft lists |

### 4.6 Runtime Provider

`StaticJsonContentGraphProvider` (`src/content-graph/providers/static-json-provider.ts`):
- Implements `ContentGraphProvider`
- Accepts `Map<string, ContentNode>` or `ContentNode[]`
- O(N) scans via `.filter()` / `.find()` (acceptable for small graph)
- Lazy-loaded via dynamic `import()` to avoid ~88KB in shared client bundle

---

## 5. Content Import Bridge

**Files:** `src/content-import/import-package.ts`, `src/content-contracts/*.schema.ts`

```typescript
interface ImportedPackage {
  manifest: Manifest                      // Content Package Contract v1
  packageDir: string
  factoryNodes: ContractContentNode[]     // from factory via L2 bridge (content-nodes.json)
  importReport: {
    canPublish: boolean
    metadataOrigin: 'factory' | 're-derived'
    nodeCount: number
    warnings: string[]
    slug: string
    layoutId: string
    status: string
  }
}
```

- If `content-nodes.json` exists in package → factory metadata wins (L2 bridge)
- If not → v2 re-derives quality scores from frontmatter
- Validated against Zod schemas from `@uniteia/content-node-contract`

---

## 6. Internationalization

**Files:** `src/i18n/*`

| Aspect | Detail |
|--------|--------|
| Languages | `en`, `pt`, `es`, `fr`, `de`, `it`, `ja`, `zh` |
| Negotiation chain | URL path > Cookie (`uniteia_lang`) > CF-IPCountry > Accept-Language > `en` |
| Type contract | `TranslationStrings` interface with nav, footer, article, niche, editorial, search, SEO keys |
| Context API | `useI18n()` hook + `useProvideI18n()` provider |
| Geo mapping | `geo-map.ts` — maps ISO country codes to preferred language |

---

## 7. Quality Gate (ship:check)

**Orchestrator:** `src/utils/ship-check.ts` — sequential step runner, stops at first failure.

### Group A — Static Analysis (no server needed)
| Step | Command | Description |
|------|---------|-------------|
| lint | `biome check .` | Code style + linting |
| typecheck | `tsc --noEmit` | TypeScript type checking |
| test:unit | `vitest run` | 224 unit tests |
| build | `generate:content → qwik build` | Full build |
| header:single | header check script | Security headers |
| size:check | size-gate.ts | 87KB gzip limit |
| slug:check | slug-lint.ts | Slug pattern validation |
| content:check | validate-content.ts | Content schema validation |
| sitemap:check | check-sitemap.ts | Sitemap coherence |
| linkgraph:report | generate-linkgraph-report.ts | Link graph audit |
| seo:verification | generate-seo-verification.ts | SEO tag verification |
| size:sub-budgets | size:check --threshold 117760 | 115KB soft limit |

### Group B — Runtime QA (requires preview server)
| Step | Description |
|------|-------------|
| edge:chaos | Edge case test suite |
| route:fuzzing | Route fuzzing (Playwright) |
| hydration:resilience | Hydration resilience (Playwright) |
| visual:qa | Visual QA (Playwright) |
| lighthouse:check | Lighthouse CI audit |
| smoke:200s | HTTP 200 verification |
| invalid-locale-404 | Edge function 404 test |

---

## 8. Component Architecture

### Layout Hierarchy
```
Root (root.tsx)
└── QwikCityProvider
    ├── RouterHead               ← dynamic <head>: title, meta, JSON-LD
    └── RouterOutlet
        └── SiteShell
            ├── [header]         ← nav, LangSwitcher, NavTree
            ├── Sidebar          ← JRPG-themed, desktop-only
            ├── <Slot />         ← main content
            └── Footer
```

### Component Pattern
```typescript
export const MyComponent = component$<Props>(({ prop1 }) => {
  const signal = useSignal()
  const store = useStore()
  return <div>{signal.value}</div>
})
```

---

## 9. Routing

### URL Structure
```
/{lang}/signals                    ← Niche index
/{lang}/signals/{niche}            ← Niche landing
/{lang}/signals/{niche}/{slug}     ← Article page
/{lang}/search                     ← Search
```

### AppRoutes (`src/routing/routes.ts`)
```typescript
class AppRoutes implements RouteContract {
  home(locale)                    → "/{locale}"
  signalsIndex(locale)            → "/{locale}/signals"
  signal(locale, niche, slug)     → "/{locale}/signals/{niche}/{slug}"
  localized(currentPath, target)  → graph-aware locale switch (finds correct slug)
}
```

The `localized()` method uses the content graph to find the correct slug per target locale (cross-locale slug mapping). Falls back to same-slug if graph not yet loaded.

### Edge Middleware (`functions/[[route]].ts`)
- Locale-less `/n/{niche}/{slug}` → redirect to `/{lang}/signals/{niche}/{slug}`
- Invalid locale path → 404 (e.g., `/xx/`)
- Sets response headers: `x-negotiated-lang`, `x-locale-valid`
- Security headers: HSTS, CSP, X-Frame-Options, etc.

---

## 10. Content Loading Pipeline

```
loadContent(niche, slug, lang)
  Phase 1: parse — gray-matter() → frontmatter + markdown body
  Phase 2: transform — marked.parse() → HTML (H1 stripped for layout)
  Phase 3: schema — AJV validation against llm-wiki-v1 JSON Schema
  Phase 4: slug — regex validation
  Return: LlmWikiContent (typed, with translations metadata)
```

Content is inlined as JSON strings in `content-registry.generated.ts` during build. This avoids needing `node:fs` at runtime on Cloudflare Workers.

---

## 11. Testing

### Unit Tests (Vitest, 224 tests)
- Pattern: `src/**/*.test.ts`
- Key files: compile-content-graph, compile-groups, verify-content-graph, content-loader, niche-loader, schema-validation, ship-check, size-gate, sitemap-builder, middleware, locale-validation, document-language, dopamine-budget, content-package, linkgraph-seo (532 lines)

### E2E Tests (Playwright, 15 specs)
- Pattern: `tests/e2e/*.spec.ts`
- Runs against `http://localhost:8788` (CF Pages preview)
- Covers: smoke, edge-chaos, editorial-fidelity, hydration, SEO, shell, route-fuzzing, visual QA, dopamine-budget

### Run Commands
```bash
bun run test:unit       # Vitest (unit tests only)
bun run test:e2e        # Playwright full suite
bun run browser:verify  # Playwright smoke subset
```

---

## 12. Build & Deploy

### Build Pipeline
```bash
bun run build
  ├── generate:content
  │   ├── generate:content-registry   → content-registry.generated.ts
  │   ├── generate:content-graph      → content-graph.generated.ts + 6 JSON artifacts
  │   ├── verify:content-graph        → integrity check
  │   └── generate:search-index       → search-index.generated.ts
  └── qwik build
      └── postbuild (generate-sitemap → build-service-worker → prepare-cloudflare-pages)
```

### Deploy Target
- **Cloudflare Pages** via Wrangler (`wrangler.toml`: `name = "uniteia-v2"`)
- Compatibility date: `2026-04-01`, `nodejs_compat` flag
- Preview: `bun run preview:cf` (port 8788)
- CI: `.github/workflows/quality-gates.yml`

### Build Config (Vite)
- Target: `es2022`, minifier: `esbuild`, chunk warning: 15KB
- Smart entry strategy for optimal Qwik code splitting

---

## 13. Stores & Runtime State

### Dopamine Budget (`src/stores/dopamine-budget.ts`)
- Controls microinteraction frequency (fun UI animations)
- Route budget: 2 per route. Session budget: 1 total.
- Persisted via `sessionStorage` (`uniteia:dopamine-budget:v1`)

### Content Graph Provider (lazy singleton)
```typescript
// Module-level: eagerly starts loading at import time
let _graphProvider: ContentGraphProvider | null = null
ensureGraphProvider()  // dynamic import to avoid ~88KB in shared bundle
```

---

## 14. Key ADRs

| ADR | Decision |
|-----|----------|
| Content import contract | Factory exports validated Content Package Contract v1 |
| Bridge validation | 10+ checks before writing to disk |
| Page size budget | 87,040 bytes gzip hard cap |
| Graph-native routing | Routes from compiled graph, not filesystem |
| 8-locale symmetry | All 8 locales required for public visibility |
| Two-layer quality | Factory overrides v2 quality computation via L2 bridge |

---

## 15. LLM Interaction Points

| Task | Starting Point |
|------|----------------|
| Understand content model | `src/content-graph/contracts/node.ts`, `SPEC.md` |
| Add/modify build step | `scripts/*.ts` + `package.json` scripts |
| Modify compilation | `src/content-graph/compiler/compile-content-graph.ts` |
| Add route | `src/routes/[lang]/signals/[niche]/` or `AppRoutes` |
| Add component | `src/components/` — create directory with `index.tsx` |
| Add i18n key | `src/i18n/types.ts` + all 8 locale files |
| Import content | Factory → `bun run import:package` → `bun run generate:content` |
| Fix quality gate | `src/utils/ship-check.ts` or individual `scripts/*` |
| Debug graph | `compile-content-graph.test.ts`, `verify-content-graph.test.ts` |
| Modify i18n logic | `src/i18n/middleware.ts`, `locale-validation.ts` |
| Security headers | `functions/[[route]].ts` + `public/_headers` |
| Bundle size | `src/utils/size-gate.ts`, `vite.config.ts` |
