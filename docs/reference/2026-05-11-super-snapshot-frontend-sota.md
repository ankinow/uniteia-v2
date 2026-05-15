# UniTeia V2 — Super Snapshot + Frontend SOTA 2026 Audit

> **Generated:** 2026-05-11T11:37:27-03:00  
> **Context:** Post-production-deploy audit. PR #2 merged to `main` at `1f59112`.  
> **Reader:** Future agent/engineer landing cold.  
> **Post-read action:** Fix any documented issue or extend any subsystem with full context.  
> **Notation:** See `docs/context/CONTEXT-SYMBOLS.md` for symbol table (Σ φ λ Δ ♻️ Ω ⊕ ⊗ ⋈ ⛓️ Ψ).

---

## Σ0: System Topology — Repo Layout

```
uniteia-v2/                          ← CONSUMER site repo (Qwik + Cloudflare Pages)
├── apps/content-factory/            ← PRODUCER: manual-first content factory (isolated)
│   └── _engine/                     ←   4-phase pipeline engine (gather → build → render → export)
├── content/                         ← SOURCE OF TRUTH: markdown articles per {niche}/{lang}/{slug}.md
│   ├── apex/                        ←   apex.uniteia.com (now root domain: uniteia.com/...)
│   │   ├── en|pt|es|fr|de|it|ja|zh/←   8-language directories
│   │   └── *{slug}.md              ←   Article frontmatter: title, description, lang, verdict, quality_score, subjects
│   ├── ai-agents/
│   ├── language-models/
│   └── prompt-engineering/
├── src/
│   ├── routes/[lang]/[...slug]/     ← ARTICLE ROUTE: SSG + routeLoader$ + DocumentHead
│   ├── utils/content-loader.ts      ← LOADER: inline registry → gray-matter → marked → AJV → typed LlmWikiContent
│   ├── utils/schema-generators.ts   ← FIXED: apex→root domain ternary
│   ├── i18n/                        ← 8 language modules (en|pt|es|fr|de|it|ja|zh.ts)
│   ├── components/                  ← Atomic: ArticleFrame, AdaptiveHeader, QualityRing, etc.
│   └── content-registry.generated.ts← AUTO-GENERATED build-time registry
├── scripts/
│   ├── generate-content-registry.ts ← REGISTRY BUILDER: scans content/*.md → inlines into content-loader.ts
│   ├── generate-sitemap.ts          ← SITEMAP: exclusions for caution/draft (FIXED)
│   ├── prepare-cloudflare-pages-output.ts ← CF PAGES PREP: copies server/, generates _routes.json
│   └── import-content-package.ts    ← BRIDGE: imports factory packages to content/<niche>/<lang>/
├── adapters/cloudflare-pages/       ← SSG adapter config
└── functions/[[route]].ts           ← CF Worker: language middleware (negotiation + cookie)
```

**Key insight:** The content-factory lives INSIDE uniteia-v2 at `apps/content-factory/` but is intentionally **isolated** (no cross-import with Qwik app). Output is manual via `bun run factory:export` → `llm-wiki-uniteia/` directory, then manually copied to `content/apex/`. Decision D-005 in `DECISIONS.md`.

---

## Σ1: Git State

```json
{
  "repo": "uniteia-v2",
  "branch": "main",
  "head": "1f59112684ef9051134a3fb8a9ad0c1dce64ab92",
  "other_branches": [
    "feat/content-package-import-contract",
    "feat/design-review-dog-api-fixture"
  ],
  "last_10_commits": [
    "1f59112  feat: content package import bridge + editorial/SEO upgrade (#2)",
    "6465f1d  fix(build): sync inline content registry with generated file",
    "8437517  feat(i18n): expand ES, FR, DE, IT, JA, ZH articles to full 8-section structure",
    "818aefb  feat(content): add visual-brief SVG to PT and EN articles",
    "72799cd  feat(seo): add og:image meta for social share cards",
    "6bf4d64  fix(i18n): translate qualityScore labels for FR, DE, IT",
    "b2912a4  feat(seo): meta description from content excerpt",
    "932a3da  fix(seo): exclude caution/draft articles from sitemap",
    "ab630db  fix(seo): emit noindex for caution/draft articles",
    "574ff04  fix(schema): apex niche URL should use root domain, not subdomain"
  ],
  "uncommitted_changes_count": 23,
  "uncommitted_categories": [
    "fixtures/ (7 files — bridge test data)",
    "src/content-contracts/ (6 files — bridge stabilization)",
    "src/content-import/ (3 files — bridge stabilization)",
    "src/adapters/demo/ (2 files — dog-ceo pre-existing)",
    "src/layouts/registry.ts, src/content-registry.generated.ts, src/routes/ops-lab/ (3 files — pre-existing)"
  ]
}
```

[!] **23 uncommitted files** — all from the bridge branch, carried over from the merge. None are critical runtime changes. They are test fixtures + contract schemas for content package import. Safe to discard or commit separately.

---

## Σ2: Dependency Map

| Layer | Tech | Version | Notes |
|-------|------|---------|-------|
| **Runtime** | Bun | 1.x | Lockfile: `bun.lock` |
| **Framework** | Qwik + Qwik City | ^1.19.2 | Resumability-first SSR/SSG |
| **CSS** | Tailwind CSS | ^3 (NOT v4) | `tailwind.config.js`, `postcss.config.mjs` |
| **PostCSS** | nesting + custom-media + preset-env | — | 4-stage pipeline |
| **Typography** | @tailwindcss/typography | ^0.5.19 | Prose classes for article body |
| **Icons** | Lucide via @iconify/tailwind | — | `addDynamicIconSelectors()` |
| **Content** | gray-matter + marked + ajv | — | MD→HTML pipeline with schema validation |
| **Schema** | zod | ^4.4.3 | Runtime validation |
| **Lint** | Biome | ^1.9.4 | Replaces ESLint + Prettier |
| **Test** | Vitest + Playwright | ^4.1.5 / ^1.59.1 | Unit + e2e |
| **Deploy** | Cloudflare Pages | wrangler ^4.84.1 | SSG via cloudflarePagesAdapter |
| **Fonts** | Inter Variable, Geist Sans, JetBrains Mono | — | @fontsource packages |
| **Bridge** | AJV, glob, ignore | — | Content package import validation |

### content-factory deps (isolated sub-package)

```json
{
  "dependencies": ["ajv", "ajv-formats", "gray-matter", "handlebars", "yaml"],
  "devDependencies": ["@biomejs/biome", "typescript", "vitest"]
}
```

---

## Φ1: Route Architecture

```
/                                 → Root landing (apex)
/n                                → Niche listing (no lang prefix)
/n/{slug}                         → Niche landing (no lang prefix)
/{lang}/                          → [404 — BLOCKER] No route handler exists
/{lang}/{slug}                    → Article route (SSG)
/{lang}/n/                        → Niche listing per language
/{lang}/n/{niche}/                → Niche landing per language
/[...catchall]                    → 404 handler
/ops-lab/api-fixtures/dog-ceo/    → Demo API fixture
```

### Article Route (`src/routes/[lang]/[...slug]/index.tsx`)

| Export | Purpose | Key Behavior |
|--------|---------|--------------|
| `onStaticGenerate` | SSG param generator | Iterates `REGISTRY_PATHS`, extracts `{lang, slug}` pairs. Skips `_index.md`. |
| `useContent` | `routeLoader$` | Validates lang, parses host for niche, normalizes slug, calls `loadContent()`. Returns null → 404. |
| `default` | `component$` | Renders `<ArticleFrame>` with AdaptiveHeader, EditorialVerdict, QualityRing, prose content div. |
| `head` | `DocumentHead` | Canonical URL, hreflang (8 + x-default), meta excerpt, OG/Twitter, robots (noindex for caution/draft). |

### Type Flow

```
content/*.md (frontmatter + MD body)
  → gray-matter (parse frontmatter)
  → marked (MD→HTML, strips h1)
  → AJV validateContent (schema: schemas/llm-wiki-v1.schema.json)
  → validateSlug (regex)
  → typed LlmWikiContent {
      slug, lang, title, content(HTML), subjects, referral_links,
      metadata, verdict?, quality_score?, translations?
    }
```

---

## Φ2: Content Pipeline

```
┌──────────────────────────────────────────────────────────────────────┐
│  PRODUCER: apps/content-factory/                                     │
│                                                                      │
│  gather (fetch URLs → sources.json)                                  │
│     → build (LLM → core.yaml, AJV-validated + evidence binding)      │
│     → render (Handlebars → blog.md + wiki.md + short.json)           │
│     → export (combine → llm-wiki-uniteia/{lang}/{slug}.md)          │
│     → package (SHA-256 manifest + deploy-ready/)                     │
│                                                                      │
│  Providers: stub (offline deterministic) + nvidia (NVIDIA NIM API)   │
│  Output langs (content-factory): 5 — en, pt, es, ja, zh              │
│  Site langs (uniteia-v2): 8 — en, pt, es, fr, de, it, ja, zh        │
└──────────────────────────────────────┬───────────────────────────────┘
                       manual copy ↓
┌──────────────────────────────────────────────────────────────────────┐
│  CONSUMER: uniteia-v2/                                               │
│                                                                      │
│  content/apex/{lang}/{slug}.md                                       │
│     → generate:content-registry (scans content/*.md, builds inline)  │
│     → qwik build (SSG: onStaticGenerate → pre-renders all pages)     │
│     → postbuild (sitemap.xml + prepare:cloudflare-pages)            │
│     → dist/ (static HTML + server/ + _worker.js + _routes.json)     │
│     → wrangler pages deploy → cloudflarepages.net / uniteia.com      │
└──────────────────────────────────────────────────────────────────────┘
```

### Registry Trap (❗)

`scripts/generate-content-registry.ts` uses `replace('// __CONTENT_REGISTRY_IMPORT__', ...)` in `src/utils/content-loader.ts`. After the **first** successful replacement, the placeholder is **gone**. All subsequent runs silently skip the inliner while reporting "36 files inlined". **Fix:** either (a) restore the placeholder in the generator script after replacing, or (b) switch to a stable insertion marker.

---

## Φ3: SSG / Cloudflare Pages Infra

```
SSG adapter config: adapters/cloudflare-pages/vite.config.ts
  → origin: https://uniteia.com
  → include: ["/*"]
  → exclude: ["/ops-lab/*"]
  → emit404Pages: true

Build flow:
  generate:content-registry → qwik build (SSG) → postbuild (sitemap + prepare)
  
Prepare script (scripts/prepare-cloudflare-pages-output.ts):
  → Copies dist/server/ to dist/_worker.js dir
  → Fixes import paths
  → Generates _routes.json excluding 19 SSG paths from Worker

Wrangler config (wrangler.jsonc):
  → name: uniteia-v2
  → compatibility_date: 2026-04-01
  → pages_build_output_dir: ./dist
  → Compatibility flags: nodejs_compat

Deploy command: wrangler pages deploy dist --branch main
```

### Current SSG Stats

- **19 pages** generated at build time
- All 8 language variants of `tencent-cloud-deal-stack-builders` pre-rendered
- 404 pages included
- `/ops-lab/*` excluded from SSG (falls back to Worker)
- Content pages: `q:render="static-ssr"` (SSG, not SSR)

---

## Δ1: Known Bugs & Issues

### BLOCKER — Language root paths 404

| Path | HTTP | Mitigation |
|------|------|------------|
| `/en` | 404 | No `[lang]/index.tsx` route handler |
| `/pt` | 404 | Sidebar `<a>` links point to `/en`, `/pt`, etc. |
| `/es, /fr, /de, /it, /ja, /zh` | 404 | Same issue |
| `/n` | 200 | Works (has handler) |

**Fix:** Either:
- Add `src/routes/[lang]/index.tsx` that redirects to `/lang/n` or renders a language landing page
- Or update sidebar `href` from `/en` to `/en/n` (niche listing)

### HIGH — GitHub repo link 404

`href="https://github.com/uniteia/uniteia-v2"` in footer → returns 404.  
Repo is either private, renamed, or wrong org name.

### HIGH — Tencent free page 404 in article content

`https://www.tencentcloud.com/free` → 404. URL was changed/removed by Tencent.  
Update to: `https://www.tencentcloud.com/act/pro/promo` (which returns 200).

### MEDIUM — No HTTP-level SEO headers

Response headers missing:
- `Link: <https://uniteia.com/pt/article>; rel="canonical"`
- `Content-Language: pt`
- `Vary: Accept-Language`

These help crawlers that don't parse `<head>`. All SEO metadata is embedded in HTML `<head>` only.

### MEDIUM — 308 redirect for non-trailing-slash URLs

`/pt/article` → 308 → `/pt/article/`.  
Impact on link equity if external sites link to the non-trailing-slash version. Fix: add `trailingSlash: true` to Qwik config or generate both variants.

### LOW — Hreflang includes EN as x-default

`x-default` points to `https://uniteia.com/en/...`. This is correct per spec but means non-English users with no Accept-Language header get the EN version. Consider: should x-default point to a language-picker page instead?

### LOW — content-loader.ts has inline registry + generated file duplication

`src/content-registry.generated.ts` and the inline data in `src/utils/content-loader.ts` are **duplicated**. Every generator run must sync both. Fix: choose ONE source of truth.

---

## Δ2: Broken Links (Production Audit)

```
┌──────────────────────────────────────────────────────────────────┐
│  All 8 article language variants               200 ✓             │
│  Homepage (/)                                  200 ✓             │
│  buymeacoffee.com/lermf                        200 ✓             │
│  tencentcloud.com/act/pro/promo                200 ✓             │
│  tencentcloud.com/products/cvm                 200 ✓             │
│  tencentcloud.com/products/lighthouse          200 ✓             │
│  tencentcloud.com/products/teo                 200 ✓             │
│──────────────────────────────────────────────────────────────────│
│  github.com/uniteia/uniteia-v2                 404 ✗             │
│  tencentcloud.com/free                         404 ✗             │
│  /en, /pt, /es, /fr, /de, /it, /ja, /zh       404 ✗ (8×)       │
└──────────────────────────────────────────────────────────────────┘
```

---

## ϙ1: frontend_sota_2026 Gap Analysis

Mapping actual codebase against the frontend SOTA 2026 spec provided.

### Framework: Qwik + Qwik City

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Qwik current stable (^1.19.2) | ✅ | `package.json` `@builder.io/qwik` |
| Qwik City stable (^1.19.2) | ✅ | `@builder.io/qwik-city` |
| Resumability | ✅ | No hydration, serialization via `q:render` |
| HTML-first | ✅ | SSG output is static HTML |
| Fine-grained lazy loading | ✅ | Qwik auto-lazy loads per interaction |
| Edge-ready routing | ✅ | `functions/[[route]].ts` + Cloudflare Workers |
| Route loaders/actions | ✅ | `routeLoader$` in article route |
| qwikCityPlan.routes | ⚠️ | Not directly used; SSG uses `onStaticGenerate` |

**Δ:** No route introspection via `qwikCityPlan`. Current SSG uses a custom registry loop. Fine for current scale but diverges from the standard pattern.

### Styling: Tailwind CSS

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Tailwind v4.3.0+ | ❌ **v3.x** | `tailwind.config.js` with `theme.extend` (v3 API) |
| @tailwindcss/oxide | ❌ | Not present (v4-only) |
| lightningcss | ❌ | Not configured |
| CSS-first config | ❌ | Using JS config file |
| @theme directives | ❌ | Not found in any CSS file |
| OKLCH/color-mix | ⚠️ | Referenced in `AGENTS.md` YAML arsenal but NOT in actual CSS |
| Container queries | ❌ | No `@container` in codebase |
| Logical properties | ❌ | No `inset-inline`, `margin-inline`, etc. |

**Δ:** Spec claims v4 but codebase is v3. OKLCH declared in arsenal but never materialized in CSS. To upgrade: `npm install tailwindcss@next` → migrate `tailwind.config.js` to `@import "tailwindcss"` + `@theme` directives. Major effort (~2-3d).

### Design Tokens & Aesthetic

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Atomic Design bottom-up | ⚠️ | Components are modular but no token system |
| W3C-style design tokens | ❌ | No `design-tokens.json` or CSS custom properties |
| Semantic tokens | ❌ | Colors are Tailwind extend values |
| TypeScript strict props | ✅ | All components export typed props |
| Tailwind classes bound to CSS variables | ❌ | Direct Tailwind values, not CSS var references |
| Organic Anti-Grid | ⚠️ | Two-column layout with sidebar |
| Tactile Warmth | ⚠️ | Bone/void palette, but no texture or depth illusion |
| Cinematic Nostalgia | ⚠️ | JRPG sidebar (Press Start 2P font, scanlines) |
| Glassmorphism functional | ❌ | Explicitly banned in anti-goals |
| Intentional Imperfection | ❌ | All borders uniform zero-radius (brutalist) |
| No generic purple/blue/pink gradients | ✅ | Custom dark solar palette |
| No SaaS-card sameness | ✅ | Custom layout, no 3-column feature cards |
| No emoji as icon system | ✅ | Lucide icons throughout |
| No fake metrics | ✅ | QualityRing uses real `quality_score` |
| No motion without meaning | ⚠️ | Minimal motion; need dopamine-budget enforcement |

### Quality Gates

| Requirement | Status | Evidence |
|-------------|--------|----------|
| LCP ≤ 1.5s | ⚠️ Unknown | No Lighthouse measurement in this session |
| INP ≤ 200ms | ⚠️ Unknown | Needs field data (Chrome CrUX) |
| CLS ≤ 0.05 | ⚠️ Unknown | Needs measuring |
| Minimal initial JS | ⚠️ | Qwik resumability principle, but bundle unknown |
| WCAG AA global | ⚠️ Unknown | No a11y audit performed |
| WCAG AAA for long text | ❌ | Not confirmed |
| Semantic landmarks | ⚠️ | SiteShell has `<aside>` + `<main>` |
| focus-visible | ❌ | Default browser behavior only |
| Skip link | ❌ | Not present |
| prefers-reduced-motion | ❌ | Not implemented |
| Contrast validation | ⚠️ | `contrast_ratio_bone_void: 15.2:1` declared but not verified |

### WebMCP (Experimental)

| Requirement | Status | Evidence |
|-------------|--------|----------|
| window.navigator.modelContext | ❌ | Not implemented |
| registerTool() | ❌ | Not implemented |
| Feature-detect before use | ❌ | Not applicable (not present) |
| Never required for core UX | ✅ | N/A — no MCP dependency |
| Fallback to normal UI/API routes | ✅ | N/A — content renders fine without it |

---

## ϙ2: Quality Gate Scorecard

```
Gate                  Target        Actual         Status
──────────────────────────────────────────────────────────────
Tests                 217+          218 pass       ✅
Typecheck             clean         clean          ✅
Build                 19 pages      19 pages       ✅
SSG content           renders       200 OK         ✅
Noindex for caution   required      present        ✅
Sitemap excludes      caution       excluded       ✅
Schema URL            root domain   root domain    ✅
OG image              present       present        ✅
Meta description      excerpt       excerpt        ✅
Hreflang tags         8 + x-default all present    ✅
Canonical URL         correct       correct        ✅
──────────────────────────────────────────────────────────────
Language root paths   /{lang}→200   404            ❌
Broken external links 0             2              ❌
HTTP SEO headers      present       missing        ❌
Tailwind v4.3+        required      v3             ❌
WCAG AA               required      unverified     ?
LCP ≤ 1.5s            required      unverified     ?
INP ≤ 200ms           required      unverified     ?
CLS ≤ 0.05            required      unverified     ?
Skip link             required      missing        ❌
prefers-reduced-motion required     missing        ❌
OKLCH/color-mix       required      absent         ❌
Design tokens         required      absent         ❌
Container queries     required      absent         ❌
```
---

## Ψ: Content Factory State

```
Path: uniteia-v2/apps/content-factory/
Head: same as monorepo (main @ 1f59112)
Version: 0.1.0
Status: Manual-first, isolated, no CI/CD pipeline connecting to v2
Engine actors: stub + nvidia NIM
Pipeline: gather → build → render → export → package
Langs: 5 (en, pt, es, ja, zh) — SITE has 8 (adds fr, de, it)
Schema: uniteia-invite-link-core/1 (15 root fields, evidence binding)
```

### Known content-factory limitations

1. **Language gap:** Factory produces 5 languages, site consumes 8. FR/DE/IT articles must be written manually or translated separately.
2. **No CI/CD bridge:** Factory output lands in `llm-wiki-uniteia/` directory. Must be manually copied to `content/apex/`. No watcher, no hook.
3. **Provider gap:** Only stub + nvidia NIM. No OpenAI, Anthropic, or other provider integrations.
4. **Evidence binding:** Regex-based, not AST. Can miss cross-references.
5. **Schema name:** `uniteia-invite-link-core/1` is specific to invite-link products. General articles may not fit the schema well.

### When to use content-factory vs manual

| Scenario | Approach |
|----------|----------|
| Product buying guides with invite links | Factory → `factory:generate` → manual copy |
| General editorial articles | Manual `.md` write to `content/apex/{lang}/` |
| Multi-language expansion | Factory for 5 core langs, then manual FR/DE/IT |
| Schema-strict content | Factory with AJV validation |
| Quick content test | Direct `.md` in content/ (no factory needed) |

---

## Ω: Prioritized Fix Queue

### P0 — Must fix before next deploy

```
[ ] Fix language root 404s
    Files: src/routes/[lang]/index.tsx (CREATE) or update sidebar hrefs
    Test: curl -sL https://uniteia.com/en → 200
    └─ Also fix: verify sidebar <a> tags point to /en/n instead of /en

[ ] Fix broken GitHub link
    File: (find in footer component or site-shell)
    Change: https://github.com/uniteia/uniteia-v2 → correct URL or remove

[ ] Fix broken Tencent free page link
    File: content/apex/*/tencent-cloud-deal-stack-builders.md (all 8 lang variants)
    Change: https://www.tencentcloud.com/free → https://www.tencentcloud.com/act/pro/promo
```

### P1 — SEO hardening

```
[ ] Add HTTP-level SEO headers
    File: adapters/cloudflare-pages/vite.config.ts or _headers
    Add: Link: <canonical>; rel="canonical", Content-Language, Vary: Accept-Language

[ ] Add trailingSlash config or redirect mapping
    File: vite.config.ts
    Add: trailingSlash: true (or generate both URL variants in _routes.json)
```

### P2 — Frontend SOTA 2026 upgrades

```
[ ] Upgrade Tailwind v3 → v4
    Effort: 2-3d (config migration, @theme directives, purge CSS vars)
    Breaking: tailwind.config.js → @import "tailwindcss", theme() → @theme

[ ] Add OKLCH/color-mix CSS variables
    Files: src/global.css
    Add: CSS custom properties using oklch() for the palette

[ ] Add WCAG AA baseline
    Files: multiple components
    Required: skip-link, focus-visible styles, prefers-reduced-motion, semantic landmarks

[ ] Add Lighthoue CI measurement
    Files: scripts/lighthouse-gate.ts (already exists, needs measurement)
```

### P3 — Architecture improvements

```
[ ] Fix inline registry generator (placeholder trap)
    File: scripts/generate-content-registry.ts
    Fix: restore __CONTENT_REGISTRY_IMPORT__ after replacement, or switch to stable marker

[ ] Unify content registry — pick single source of truth
    Options: (a) only generated file, (b) only inline in content-loader.ts
    Remove duplication

[ ] Reduce uncommitted file debt
    Action: git stash or commit the 23 fixture/schema files
    Branch: clean up the bridge branch artifacts
```

---

## ⛓️ Cross-Repo Contracts

| Contract | Producer | Consumer | Mechanism | Status |
|----------|----------|----------|-----------|--------|
| Content package import | content-factory (`apps/content-factory/`) | uniteia-v2 (`scripts/import-content-package.ts`) | Static filesystem: `deploy-ready/files/llm-wiki-uniteia/{lang}/{slug}.md` | ✅ Validated |
| URL schema root domain | content-factory (schema) | uniteia-v2 (`schema-generators.ts`) | `apex` niche → `https://uniteia.com` not subdomain | ✅ Fixed |
| 5→8 language bridge | content-factory (5 langs) | uniteia-v2 (8 langs) | Manual FR/DE/IT translation | ⚠️ Manual |
| Visual assets | content-factory (SVGs) | uniteia-v2 (`public/assets/wiki/`) | Manual copy | ✅ Done |

---

## Session State (for next agent picking up)

```json
{
  "last_action": "Wrote UNITEIA-V2-SUPER-SNAPSHOT.md after production audit",
  "next_action": "Fix P0 items: language root 404s + broken links",
  "known_trap": "content-loader.ts inline registry placeholder is consumed after first run",
  "uncommitted": "23 files from bridge branch (fixtures, contracts, demo code)",
  "verified": ["218 tests pass", "typecheck clean", "build succeeds (19 SSG pages)", "all 8 lang variants 200 on production"]
}
```
