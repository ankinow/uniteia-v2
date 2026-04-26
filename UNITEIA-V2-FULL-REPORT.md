# UniTeia v2 — Complete Project Report

**Generated:** 2026-04-26T03:30:00Z  
**Version:** 0.1.0  
**Status:** M004 Active (3/4 slices complete)

---

## 1. Executive Summary

UniTeia v2 is a **Qwik-City edge-native multi-niche editorial platform** deploying to **Cloudflare Pages**. It enforces a **60KB gzip JS budget** per route, **15.2:1 contrast ratio** (AAA), **Lighthouse ≥95** quality gate, and a **JRPG-style dopamine budget** that throttles UI rewards per viewport/session. Content lives as **markdown + frontmatter** validated at build-time by AJV against a strict JSON Schema (Draft 2020-12). The platform supports **5 languages** (en, pt, es, ja, zh), **3 editorial niches** (AI Agents, Language Models, Prompt Engineering), and has **12 validated requirements**, **81 unit tests** across 12 files, and **7 E2E Playwright specs**. The project has completed **3 milestones** (M001–M003) and is currently in **M004: Qwik Audit Remediation** with 3/4 slices done. One intermittent unit-test timeout (content-loader cold-start) and pending E2E verification are the remaining blockers.

---

## 2. Vision & Identity

**Tagline:** *Brutalist Editorial · Multi-Niche · Edge-Native · JRPG Soul*

UniTeia is designed as an "editorial wiki for the AI age" — a single Qwik-City codebase that serves multiple editorial niches (singularity, hardware, AI agents, etc.) from Cloudflare's edge. The aesthetic follows **SolarLanso 2100 v1.2**: a brutalist design system with editorial bones, NERV/GITS-inspired HUD diagnostics, JRPG-style dopamine rewards (strictly throttled), and a measured 15.54:1 contrast ratio (exceeding the AAA 15.2:1 target).

**Core Philosophy:**
- **Brutalist bones** — high-contrast void/bone palette, sharp edges, no rounded corners
- **Editorial flesh** — Geist Sans typography, scratch-texture dividers, source ledgers
- **One JRPG whisper** — dopamine budget system: max 2 whispers/route, 1/session, Apex only
- **Kuwaii breath** — quality ring animation, subtle HUD diagnostics

---

## 3. Architecture

### 3.1 Technology Stack

| Layer | Technology | Version | Role |
|-------|-----------|---------|------|
| Framework | Qwik-City | 1.19.2 | Resumable SSR framework with edge-first design |
| Build Tool | Vite | 6.2.5 | SSR bundling, glob imports, HMR |
| Language | TypeScript | 5.6.2 | Strict mode, exactOptionalPropertyTypes, noUncheckedIndexedAccess |
| Runtime | Bun | 1.3.6 | Package manager, test runner, script executor |
| Deployment | Cloudflare Pages | Workers-types 4.x | Edge runtime with CF-IPCountry, KV, D1 access |
| Styling | Tailwind CSS | 3.x | Utility-first with SolarLanso 2100 custom tokens |
| Typography | @fontsource/geist-sans | 5.2.5 | Self-hosted display font (prevents CLS) |
| Typography | @fontsource-variable/inter | 5.2.8 | Self-hosted body font |
| Typography | @fontsource/jetbrains-mono | 5.2.8 | Self-hosted monospace |
| Markdown | marked | 18.0.2 | GFM server-side MD→HTML transformation |
| Frontmatter | gray-matter | 4.0.3 | YAML frontmatter parsing (JS eval disabled) |
| Sanitization | isomorphic-dompurify | 3.10.0 | XSS prevention in rendered HTML |
| Schema | AJV 2020 | 8.18.0 + ajv-formats 3.0.1 | Build-time frontmatter validation |
| Linting | Biome | 1.9.4 | Strict lint/format (noExplicitAny, noForEach, noBannedTypes) |
| Unit Tests | Vitest | 4.1.5 | 81 tests across 12 files |
| E2E Tests | Playwright | 1.59.1 | 7 spec files, Chromium only |
| Perf Gate | Lighthouse | 13.1.0 | ≥95 in Performance, A11y, Best Practices |
| Forms | @modular-forms/qwik | 0.24.0 | Type-safe form handling |

### 3.2 Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│  ☁ CLOUDFLARE PAGES (Edge Runtime)                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Qwik-City│  │ Edge         │  │ Cloudflare Worker │  │
│  │ SSR      │  │ Middleware   │  │ (entry.cf-pages)  │  │
│  └──────────┘  └──────────────┘  └───────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  ⚡ APPLICATION LAYER (Resumable)                        │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────┐  │
│  │ SiteShell│  │ArticleFrame│  │Dopamine  │  │Quali │  │
│  │          │  │            │  │Budget    │  │tyRing│  │
│  └──────────┘  └────────────┘  │Store     │  └──────┘  │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐ │
│  │AdaptiveHeader│  │DopamineCard│  │SourceLedger      │ │
│  └──────────────┘  └────────────┘  └──────────────────┘ │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐ │
│  │EditorialVerd│  │FrontmatterS│  │LangSwitcher      │ │
│  │ict          │  │lots        │  │(server$ action)  │ │
│  └──────────────┘  └────────────┘  └──────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  📝 CONTENT & i18n PIPELINE                             │
│  ┌──────────────┐  ┌────────────┐  ┌────────┐  ┌─────┐ │
│  │Content Loader│  │gray-matter │  │DOMPurif│  │AJV  │ │
│  │(Vite Glob)   │  │+ marked    │  │(XSS)   │  │Gate │ │
│  └──────────────┘  └────────────┘  └────────┘  └─────┘ │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐ │
│  │i18n Middleware│  │5 Languages │  │HttpOnly Cookie   │ │
│  │              │  │en/pt/es/ja │  │(server$ action)  │ │
│  │              │  │/zh         │  │                  │ │
│  └──────────────┘  └────────────┘  └──────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  🛡 QUALITY GATES (ship:check)                          │
│  ┌──────┐ ┌───────────┐ ┌─────────┐ ┌──────┐ ┌───────┐ │
│  │ lint │ │ typecheck │ │test:unit│ │build │ │size:  │ │
│  │Biome │ │   tsc     │ │ Vitest  │ │  qwik│ │check  │ │
│  └──────┘ └───────────┘ └─────────┘ └──────┘ └───────┘ │
│  ┌────────────┐ ┌──────────────┐ ┌───────┐ ┌─────────┐ │
│  │lighthouse  │ │browser:verify│ │slug:  │ │content: │ │
│  │≥95         │ │  Playwright  │ │check  │ │check    │ │
│  └────────────┘ └──────────────┘ └───────┘ └─────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 3.3 Content Pipeline

The content pipeline is the core data flow of UniTeia v2. It transforms raw markdown files into typed, validated, sanitized editorial content:

```
📄 .md File  →  Vite Glob  →  gray-matter  →  marked  →  DOMPurify  →  AJV Schema  →  Slug Check  →  LlmWikiContent  →  ArticleFrame
```

**Step-by-step:**

1. **Vite Glob** (`import.meta.glob('../../content/**/*.md', { query: '?raw', import: 'default', eager: true })`) — Bundles all markdown files at build-time. No `node:fs` needed at runtime (Cloudflare Workers compatibility).

2. **gray-matter** — Parses YAML frontmatter from markdown body. JS eval is explicitly disabled (`engines: { js: () => { throw new Error('JS eval disabled') } }`) to prevent code injection through frontmatter.

3. **marked** — Transforms markdown body to HTML (GFM mode, async:false, breaks:false). H1 headings are stripped (the article title comes from frontmatter). Server-side only — no parser shipped to client.

4. **DOMPurify** (`isomorphic-dompurify`) — Sanitizes the HTML output, stripping `<script>`, `onclick`, and other XSS vectors. Applied after marked, before schema validation.

5. **AJV Schema Validation** — Validates the frontmatter object against `schemas/llm-wiki-v1.schema.json` (JSON Schema Draft 2020-12). Checks: required fields (slug, lang, title, content, subjects, referral_links), pattern constraints, enum values, additionalProperties: false.

6. **Slug Validation** — Checks slug against `SLUG_PATTERN = /^[a-z]+(-[a-z]+){1,5}$/` and bans reserved/problematic terms (admin, api, openai, chatgpt, best, free, etc.).

7. **LlmWikiContent** — The final typed object returned to the route loader, containing slug, lang, title, content (sanitized HTML), subjects, referral_links, verdict, quality_score, metadata, and translations.

8. **ArticleFrame** — Qwik component that renders the content in a brutalist editorial container.

### 3.4 Language Negotiation

Priority: **URL path** → **Cookie** → **Accept-Language header** → **CF-IPCountry** → **Default (en)**

The middleware (`src/i18n/middleware.ts`) runs on every request:
1. Extracts niche from Host header via `parseHost()` (subdomain → niche slug, apex domain → 'apex')
2. Negotiates language through the priority chain
3. Sets `x-negotiated-lang` and `x-negotiated-niche` headers for downstream use
4. Layout route loader reads these headers to provide lang/niche to components

**Cookie mechanism (M004/S01):** Language switching uses `server$` action (`updateLangCookie`) that sets an **HttpOnly, Secure, SameSite=Lax** cookie with 1-year maxAge. This was hardened in M004/S01 from a previous insecure client-side approach.

### 3.5 Dopamine Budget System

The dopamine budget is a **Qwik store** provided at the shell/layout level that strictly throttles UI rewards:

| Budget | Limit | Scope | Reset |
|--------|-------|-------|-------|
| Route (Meso) | 2 whispers | Per route change | On pathname change |
| Session (Macro) | 1 whisper | Per browser session | On new session (sessionStorage) |
| Apex-only | — | Non-apex hosts blocked entirely | — |

**State machine:** `ready` → `spent` → (reset) → `ready`  
**Blocked when:** `isApexHost === false`  
**Consumers:** `DopamineCard` (spends route budget), `QualityRing` (spends session budget)

The store uses `sessionStorage` key `uniteia:dopamine-budget:v1` for session persistence. Route changes trigger `resetDopamineRoute()`, which reseeds the route bucket. New sessions trigger `resetDopamineSession()`, which reseeds both buckets.

### 3.6 Niche System

Niches are configured in `config/niches.yaml` — adding a niche requires zero code changes, only a YAML entry.

**Current niches:**

| Slug | Icon | EN Title | Status |
|------|------|----------|--------|
| ai-agents | bot | AI Agents | 1 editorial article |
| language-models | message-square-text | Language Models | 0 articles |
| prompt-engineering | pen-tool | Prompt Engineering | 0 articles |

Each niche must have: slug (1-6 lowercase segments), icon (Lucide name), title (5 languages), description (5 languages). Validated by `validateNicheConfig()`.

**Host-based niche detection:**
- `uniteia.com` → apex (default)
- `singularity.uniteia.com` → singularity
- `localhost` → apex
- `*.uniteia.local` → subdomain part

### 3.7 Design System — SolarLanso 2100 v1.2

**Color tokens:**

| Token | Value | Usage |
|-------|-------|-------|
| void | #0D1117 | Page background |
| deep | #161B22 | Card/panel background |
| mid | #21262D | Secondary surfaces |
| raised | #30363D | Borders, dividers |
| action | oklch(0.85 0.18 210) | Primary interactive (cyan) |
| action-hi | oklch(0.90 0.18 210) | Hover state |
| verified | oklch(0.79 0.18 145) | Success/trusted (green) |
| verified-hi | oklch(0.84 0.18 145) | Hover state |
| curation | oklch(0.79 0.09 75) | Editorial/bronze |
| curation-hi | oklch(0.84 0.09 75) | Hover state |
| bone | #F0E8D8 | Primary text |
| bone-muted | #8B949E | Secondary text |

**Contrast ratio:** 15.54:1 (bone on void) — exceeds the 15.2:1 AAA target, verified by Playwright computed-style checks.

**Typography:**
- Display/Headings: Geist Sans (self-hosted via @fontsource)
- Body: Inter Variable (self-hosted)
- Code: JetBrains Mono (self-hosted)

**SVG Filters (hosted in SiteShell):**
- `#scratch` — Horizontal scratch texture for dividers (feTurbulence + feColorMatrix + feComposite)
- `#noise` — Subtle grain overlay for void surfaces (fractalNoise + feColorMatrix)
- Both under 3KB total, hidden from layout/screen readers

**HUD Grammar:**
- NERV/GITS-inspired amber diagnostic labels
- Kanji labels on shell surfaces
- Diagnostic raster patterns
- Monospace `hud-label` class: uppercase, letter-spaced, action-colored

---

## 4. Source Code Structure

### 4.1 File Inventory

**Total source lines:** 7,023 (TypeScript/TSX)  
**Total content lines:** 298 (Markdown)  
**Total GSD artifact lines:** ~51,853 (Markdown)

```
src/
├── entry.ssr.tsx              — SSR entry point (sets <html lang> from route params)
├── entry.cloudflare-pages.tsx — Cloudflare Pages edge adapter
├── root.tsx                   — App root: QwikCityProvider + RouterHead + RouterOutlet
├── global.css                 — SolarLanso 2100 tokens, @fontsource imports, HUD utilities
├── cli.ts                     — Content Factory CLI
├── template.html              — HTML template
│
├── components/
│   ├── adaptive-header/       — Responsive nav header with HUD labels
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── article-frame/         — Prose container (max-w-prose, surface-void, brutalist)
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── dopamine-card/         — Whisper display (spends route budget)
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── editorial-verdict/     — Trust/caution/flagged indicator
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── error-pages/           — NotFound + ServerError
│   │   ├── not-found.tsx
│   │   └── server-error.tsx
│   ├── footer/                — Site footer with diagnostics
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── frontmatter-slots/     — Dynamic frontmatter rendering
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── hud-label/             — NERV-style diagnostic label
│   │   └── index.tsx
│   ├── lang-switcher/         — 5-language switcher (server$ action for cookie)
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── niche-card/            — Individual niche display card
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── niche-landing/         — Niche index page component
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── quality-ring/          — Editorial quality ring (spends session budget)
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── router-head/           — SEO head renderer (canonical, hreflang, OG)
│   │   └── index.tsx
│   ├── scratch-divider/       — SVG scratch texture divider
│   │   └── index.tsx
│   ├── site-shell/            — Root layout shell + SVG filters + dopamine provider
│   │   ├── index.tsx
│   │   ├── svg-filters.tsx
│   │   └── types.ts
│   └── source-ledger/         — Source citation list
│       ├── index.tsx
│       └── types.ts
│
├── i18n/
│   ├── context.tsx            — i18n provider + useI18n hook
│   ├── middleware.ts          — Language/niche negotiation (onLanguageNegotiation)
│   ├── middleware.test.ts     — 5 tests: negotiation precedence
│   ├── set-lang-cookie.ts     — server$ action for HttpOnly cookie
│   ├── set-lang-cookie.test.ts— 3 tests: cookie attributes
│   ├── document-language.ts   — Resolves <html lang> from pathname
│   ├── document-language.test.ts — 2 tests
│   ├── types.ts               — SupportedLanguage, TranslationStrings, SUPPORTED_LANGUAGES
│   ├── en.ts                  — English translations
│   ├── pt.ts                  — Portuguese translations
│   ├── es.ts                  — Spanish translations
│   ├── ja.ts                  — Japanese translations
│   └── zh.ts                  — Chinese translations
│
├── pipeline/
│   ├── transformer.ts         — Core YAML → blog.md + short.json transform
│   └── transformer.test.ts    — 2 tests
│
├── routes/
│   ├── index.tsx              — Root redirect to /en
│   ├── layout.tsx             — Global layout: middleware, lang/niche loaders, nav, footer
│   ├── [...catchall]/index.tsx— 404 handler
│   ├── [lang]/
│   │   ├── [...slug]/index.tsx— Article route (166 lines: loader + ArticleFrame)
│   │   ├── [...slug]/types.ts — Route params type
│   │   ├── n/index.tsx        — Niche index page
│   │   ├── n/[niche]/index.tsx— Specific niche landing
│   │   └── n/[niche]/types.ts — Niche route params type
│   └── sitemap.xml/index.ts   — Dynamic sitemap from listNicheArticles()
│
├── stores/
│   ├── dopamine-budget.ts     — Full dopamine budget store (createState, reset, reserve, provider)
│   └── dopamine-budget.test.ts— 4 tests: route/session budget enforcement
│
├── types/
│   └── niche.ts               — NicheConfig, NichesConfig, NicheValidationError
│
└── utils/
    ├── content-loader.ts      — loadContent(), getAvailableLanguages(), listNicheArticles()
    ├── content-loader.test.ts — 10 tests (1 flaky timeout on cold-start)
    ├── host-parser.ts         — parseHost() for niche detection
    ├── host-parser.test.ts    — 9 tests: subdomain, apex, localhost
    ├── icon-classes.ts        — Static Lucide icon lookup table (Tailwind safelist)
    ├── lighthouse-gate.ts     — Lighthouse audit gate (≥95)
    ├── lighthouse-gate.test.ts— 3 tests
    ├── niche-loader.ts        — loadNichesConfig(), validateNicheConfig()
    ├── schema-validation.ts   — validateContent(), validateMarkdownFrontmatter()
    ├── schema-validation.test.ts— 30 tests (largest suite)
    ├── ship-check.ts          — Release orchestrator (9 steps, fail-fast, timeout/kill)
    ├── ship-check.test.ts     — 4 tests
    ├── size-gate.ts           — Route gzip budget gate (60KB)
    ├── size-gate.test.ts      — 4 tests
    ├── slug-check.ts          — Slug validation helper
    ├── slug-check.test.ts     — 5 tests
    └── url-validation.ts      — SLUG_PATTERN, BANNED_SLUG_TERMS, validateSlug()
```

### 4.2 Content Files

```
content/
├── ai-agents/en/
│   └── llm-aggregators-compared.md  — Real editorial article (verdict: trusted, score: 95)
├── apex/
│   ├── en/
│   │   ├── test-article.md      — Integration fixture (verdict: trusted, score: 92)
│   │   ├── test-xss.md          — XSS test fixture (contains <script> in body)
│   │   ├── test-admin.md        — Invalid fixture (banned slug term) [EXCLUDED from content:check]
│   │   └── test-invalid-schema.md— Invalid fixture (bad frontmatter) [EXCLUDED from content:check]
│   ├── es/test-article.md       — Spanish translation
│   ├── ja/test-article.md       — Japanese translation
│   ├── pt/test-article.md       — Portuguese translation
│   └── zh/test-article.md       — Chinese translation
```

### 4.3 Configuration & Scripts

```
config/
└── niches.yaml              — 3 niche definitions (ai-agents, language-models, prompt-engineering)

schemas/
└── llm-wiki-v1.schema.json  — AJV Draft 2020-12 schema for article frontmatter

scripts/
├── ship-check.ts            — Release orchestrator (9 sequential gates)
├── validate-content.ts      — content:check gate (AJV validation, skip-list for fixtures)
├── slug-lint.ts             — slug:check gate
├── size-gate.ts             — size:check gate (60KB gzip per route)
└── lighthouse-gate.ts       — lighthouse:check gate (≥95)

playwright.config.ts         — E2E config (Chromium, 60s webServer timeout, localhost:3000)
tailwind.config.js           — Tailwind + SolarLanso tokens + Iconify + typography plugin
vite.config.ts               — Vite + QwikCity + QwikVite (smart entry) + tsconfigPaths
tsconfig.json                — TS 5.6 strict, ES2022, Bundler resolution, path alias ~/→src/
```

---

## 5. Content Schema (llm-wiki-v1.schema.json)

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| slug | string | ✓ | Pattern: `^[a-z]+(-[a-z]+){1,5}$` |
| lang | string | ✓ | Enum: en, pt, es, ja, zh |
| title | string | ✓ | minLength:1, maxLength:200 |
| content | string | ✓ | minLength:100 |
| subjects | array | ✓ | minItems:1, maxItems:10, items: string(1-50) |
| referral_links | array | ✓ | maxItems:5, items: {url:uri, title:string, description?:string} |
| verdict | string | ✗ | Enum: trusted, caution, flagged (default: trusted) |
| quality_score | integer | ✗ | min:0, max:100 (default: 85) |
| metadata | object | ✗ | {created_at?:date-time, updated_at?:date-time, author?:string(100), version?:int≥1} |

**additionalProperties: false** — any extra fields are rejected.

---

## 6. Route Map

| Route | File | Component Stack | Purpose |
|-------|------|-----------------|---------|
| `/` | `routes/index.tsx` | Redirect | 302 → `/en` |
| `/[lang]/[...slug]` | `routes/[lang]/[...slug]/index.tsx` | ArticleFrame + AdaptiveHeader + SourceLedger + EditorialVerdict + FrontmatterSlots | Article rendering |
| `/[lang]/n` | `routes/[lang]/n/index.tsx` | NicheLanding + NicheCards | Niche index |
| `/[lang]/n/[niche]` | `routes/[lang]/n/[niche]/index.tsx` | NicheLanding | Specific niche landing |
| `/sitemap.xml` | `routes/sitemap.xml/index.ts` | Server function | Dynamic sitemap from listNicheArticles() |
| `/[...catchall]` | `routes/[...catchall]/index.tsx` | NotFound | 404 page |

---

## 7. Quality Gates (ship:check)

The release orchestrator (`bun run ship:check`) runs 9 sequential gates, fail-fast:

| # | Gate | Command | Status | Detail |
|---|------|---------|--------|--------|
| 1 | lint | `bun run lint` | ✅ PASS | Biome, 117 files, 0 errors |
| 2 | typecheck | `bun run typecheck` | ✅ PASS | tsc --noEmit, 0 errors |
| 3 | test:unit | `bun run test:unit` | ⚠️ FLAKE | 81/81 pass but first loadContent() may timeout at 15s |
| 4 | build | `bun run build` | ✅ PASS | Qwik build for Cloudflare Pages |
| 5 | size:check | `bun run size:check` | ✅ PASS | All routes under 60KB gzip |
| 6 | lighthouse:check | `bun run lighthouse:check` | ✅ PASS | ≥95 in Performance, A11y, Best Practices |
| 7 | browser:verify | `bun run browser:verify` | ⏳ PENDING | Playwright smoke + shell-visual |
| 8 | slug:check | `bun run slug:check` | ✅ PASS | All tracked markdown slugs valid |
| 9 | content:check | `bun run content:check` | ✅ 7/7 | Valid files pass, 2 invalid fixtures excluded |

**Timeout defaults:** 15 minutes per step, 5s kill grace after SIGTERM → SIGKILL.

---

## 8. Test Coverage

### 8.1 Unit Tests (Vitest) — 81 tests, 12 files

| File | Tests | Coverage Scope |
|------|-------|---------------|
| schema-validation.test.ts | 30 | validateContent() and validateMarkdownFrontmatter() — all AJV error paths, frontmatter parsing, slug/file-slug mismatch |
| content-loader.test.ts | 10 | loadContent() pipeline: read, parse, transform, sanitize, schema, slug; getAvailableLanguages(); listNicheArticles(); XSS sanitization |
| host-parser.test.ts | 9 | parseHost(): apex domains, subdomain extraction, localhost, null host, port stripping |
| slug-check.test.ts | 5 | validateSlug(): valid patterns, banned terms, invalid format |
| middleware.test.ts | 5 | Language negotiation: URL > Cookie > Header > Country > Default |
| size-gate.test.ts | 4 | Route gzip budget boundary conditions |
| ship-check.test.ts | 4 | Release orchestrator: step execution, fail-fast, timeout |
| dopamine-budget.test.ts | 4 | Route/session budget creation, reserve, reset, apex-only blocking |
| lighthouse-gate.test.ts | 3 | Lighthouse threshold boundary |
| set-lang-cookie.test.ts | 3 | HttpOnly cookie attributes, server$ action |
| document-language.test.ts | 2 | DOM lang attribute resolution from pathname |
| transformer.test.ts | 2 | Core YAML → blog.md + short.json pipeline |

### 8.2 E2E Tests (Playwright) — 7 spec files

| Spec | Scope |
|------|-------|
| smoke.spec.ts | Basic page load, shell render |
| s02-editorial-fidelity.spec.ts | Contrast ratio 15.54:1, Geist/Inter font activation |
| s03-seo-integration.spec.ts | Canonical links, hreflang, Open Graph, sitemap |
| s03-shell.spec.ts | Shell structure, SVG filters, scratch textures |
| s05-shell-visual.spec.ts | Visual baseline on /en/n deterministic route |
| s07-dopamine-budget.spec.ts | Whisper limit enforcement, route/session reseeding |
| s07-shell-fidelity.spec.ts | HUD grammar visibility and stability |

---

## 9. Milestone History

### M001: Shell Foundation & Edge Middleware ✅
- **Slices:** 7 (S01–S07, including S04.1 hotfix)
- **Key deliverables:** Edge middleware (Host→Niche + language negotiation), SolarLanso design system, 60KB size gate, Lighthouse gate, ship-check orchestrator, Dopamine budget store, HUD grammar, frontmatter schema enforcement
- **Completed:** 2026-04-24

### M002: Atom Render ✅
- **Slices:** 3 (S01–S03)
- **Key deliverables:** Niche-aware content loader (Vite glob), build-time AJV validation gate, marked server-side transform, Geist Sans self-hosting, scratch texture SVG filters, SEO integration (RouterHead, canonical, hreflang, OG, sitemap)
- **Completed:** 2026-04-25

### M003: Content Factory Build Pack v0 ✅
- **Slices:** 7 (S01–S07)
- **Key deliverables:** UnoCSS→Tailwind migration, Content Factory CLI (Gather/Build/Render/Export phases), all engine phases implemented and tested
- **Completed:** 2026-04-25

### M004: Qwik Audit Remediation ⟳ (Active)
- **Slices:** 4 (S01–S04)
- **S01** ✅ HttpOnly Cookie — Language switching sets secure HttpOnly cookie via server$ action
- **S02** ✅ XSS Sanitization — Markdown rendering strips `<script>` tags, follows strict GFM via DOMPurify
- **S03** ✅ Loader Schema Gate — loadContent() throws on invalid frontmatter, 30 unit tests, content:check 7/7
- **S04** ⟳ Suite Remediation — Target: E2E 24/24, content:check 8/8. 1 timeout flake, E2E pending

### M005: Future ○ (Planned)
- Not yet defined

---

## 10. Requirements Traceability

| ID | Class | Description | Validated In | Key Proof |
|----|-------|-------------|-------------|-----------|
| R001 | core-capability | Detect niche via Host header in middleware | M001/S05 | host-parser.test.ts + middleware.test.ts + ship:check |
| R002 | primary-user-loop | Negotiate 5 languages at edge | M001/S05 | URL/Cookie/Header precedence + cookie-driven switching |
| R003 | core-capability | Vite-glob content import into route loaders | M002/S01 | content-loader.ts + content-loader.test.ts |
| R004 | quality-attribute | Strict frontmatter schema at build/dev time | M001/S07 | schema-validation.test.ts + slug:check |
| R005 | quality-attribute | SolarLanso 2100 tokens, 15.2:1 contrast (AAA) | M002/S02 | s02-editorial-fidelity.spec.ts (measured 15.54:1) |
| R006 | quality-attribute | 60KB gzip JS budget per route | M001/S04 | size-gate.test.ts + size:check |
| R007 | quality-attribute | Lighthouse ≥95 | M001/S04 | lighthouse-gate.test.ts + lighthouse:check |
| R008 | differentiator | JRPG whispers (1/viewport, Apex only) | M001/S07 | dopamine-budget.test.ts + s07-dopamine-budget.spec.ts |
| R009 | differentiator | NERV/GITS HUD grammar | M001/S07 | s07-shell-fidelity.spec.ts + browser:verify |
| R010 | differentiator | <3KB SVG scratch textures | M002/S02 | SiteShell svg-filters.tsx + E2E DOM checks |
| R011 | quality-attribute | Self-host Geist Sans via @fontsource | M002/S02 | global.css import + font-family E2E verification |
| R012 | operability | Global Qwik Store for dopamine budgets | M001/S07 | dopamine-budget.test.ts + budget store unit tests |

---

## 11. Decisions Register (26 Total)

| # | Scope | Decision | Choice | Rationale |
|---|-------|----------|--------|-----------|
| D001 | arch | Tech stack | Qwik-City + Tailwind + Cloudflare Pages | Resumability, edge-native, brutalist |
| D002 | arch | Multi-niche strategy | Detect niche via Host header in edge middleware | Single-codebase multi-tenant on Cloudflare |
| D003 | i18n | Language priority | URL > Cookie > Headers > IPCountry > Default | Maximize accessibility + persistence |
| D004 | quality | JS route budget | 60KB gzip per route | Accommodate resumability + innovation layer |
| D005 | aesthetic | Innovation layer | 3-tier Dopamine Taxonomy + Anime-HUD grammar | Unique aesthetic identity |
| D006 | aesthetic | Design tokens | SolarLanso 2100 v1.2 with Satoshi/Geist Sans | Editorial brutalist look |
| D007 | quality | Linting | Biome strict (noExplicitAny, noForEach, etc.) | High code quality, functional style |
| D008 | architecture | Niche slug pattern | 1-6 lowercase hyphen-separated segments | Support single-word niches like 'singularity' |
| D009 | quality | Route budgets | Route-aware gzip from Qwik manifest | Avoid false results from shared chunks |
| D010 | ci | Lighthouse | Self-contained preview-backed gate | Reproducible locally and in CI |
| D011 | architecture | Size gate | q-manifest bundle closures as source of truth | Deterministic per-route accounting |
| D012 | architecture | Lighthouse server | In-process preview from built worker bundle | Deterministic, no external dependencies |
| D013 | observability | ship:check | TypeScript orchestrator + failing subcommand name | Diagnosable from logs alone |
| D014 | architecture | S05 release proof | Vitest + Playwright snapshots + ship:check | Header tests for negotiation, browser for shell |
| D015 | verification | Negotiation state | Header boundary only, no footer DOM diagnostics | Avoid leaking routing internals |
| D016 | architecture | Content root | `content/` as canonical (migrated from llm-wiki/) | Explicit migration boundary |
| D017 | validation | Evidence recovery | Artifact-layer regeneration, truthful verdict | Durable evidence trail |
| D018 | architecture | Schema enforcement | Build/dev time, not runtime AJV | Worker AJV JIT limitations |
| D019 | architecture | Dopamine budgets | Shell/layout-level Qwik store | Cross-component consistency |
| D020 | design-system | HUD/scratch | Shared CSS utilities + small shell components | Performance gate compliant |
| D021 | quality-gate | Content validation | Strict build-time AJV gate | Content errors = compilation errors |
| D022 | architecture | Markdown transform | Server-side via marked | No heavy client parser |
| D023 | architecture | Translation discovery | Filesystem glob (content/{niche}/{lang}/{slug}.md) | Single source of truth |
| D024 | architecture | Route head | Explicit RouterHead component in root.tsx | SEO metadata reaching browser |
| D025 | seo | Canonical URLs | Remove trailing slash before emitting | Avoid indexing duplicates |
| D026 | architecture | Dynamic icons | Static lookup table (icon-classes.ts) | Tailwind/Iconify static discovery |

---

## 12. Known Issues & Risks

| Issue | Severity | Detail | Mitigation |
|-------|----------|--------|-----------|
| content-loader.test.ts timeout | Medium | First `loadContent()` triggers `import.meta.glob` cold-start; 15s timeout is intermittent | Bump to 30s or add `beforeAll` warm-up |
| Chromium provisioning | Medium | E2E tests require `bunx playwright install chromium` | Pre-install in CI, document in README |
| E2E test count ambiguity | Low | Roadmap says "24/24" but actual count from 7 specs needs verification | Count tests, adjust target or add tests |
| content:check 8/8 target | Low | Currently 7/7, need 1 more valid editorial file | Add article under language-models or prompt-engineering niche |
| Playwright visual baselines | Low | Time-based footer content and font swaps can cause snapshot drift | Frozen clock + font readiness wait (MEM035) |

---

## 13. Banned Slug Terms

```
admin, api, app, assets, blog, cdn, dashboard, login, logout, privacy,
public, search, settings, terms, user, users, wiki,
galaxy-ai, google-ai, openai, chatgpt, meta-ai, microsoft-ai,
best, cheap, free, top, new, latest
```

---

## 14. Country→Language Mapping

| Countries | Language |
|-----------|----------|
| BR, PT, AO, MZ | pt |
| ES, MX, AR, CO, CL, PE, VE, EC, GT, CU, BO, DO, HN, PY, SV, NI, CR, PA, UY, PR | es |
| JP | ja |
| CN, TW, HK, SG, MO | zh |

---

*End of Report — UniTeia v2 · SolarLanso 2100 v1.2 · Brutalist Editorial · Edge-Native · JRPG Soul*
