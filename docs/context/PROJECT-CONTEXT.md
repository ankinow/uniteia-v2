---
id: CTX-V2-ROOT-04
repo: uniteia-v2
role: consumer
symbol: Ω
status: active
version: 1.0.0
created_at: 2026-05-11
updated_at: 2026-05-11
source_of_truth: true
depends_on: [CTX-V2-ROOT-01]
hash: SELF
---

# PROJECT-CONTEXT — UniTeia v2 Mission

## Mission

UniTeia v2 is the public-facing static multilingual site. It validates and imports Content Packages from uniteia-mega-factory and renders them as Qwik static pages with full SEO/hreflang support.

## Pipeline

```
Package filesystem → validatePackage() → importPackage() → mapLayout() → render() → static pages
```

## Scope

- Content Package validation and import
- Qwik static site rendering
- SEO metadata generation (canonical, hreflang, sitemap, OG, JSON-LD)
- Multilingual routing (8 languages)
- Textless visual asset display
- Performance and accessibility gates

## Stack

| Layer | Technology |
|---|---|
| Runtime | Bun 1.x |
| Framework | Qwik-City 2.x |
| CSS | Tailwind 3.4+ + PostCSS |
| Deploy | Cloudflare Pages |
| Icons | Lucide via Iconify Tailwind |
| Fonts | Inter, Geist, JetBrains Mono |
| Lint | Biome |
| Test | Vitest + Playwright |
| Types | TypeScript 5.8 strict |

## Boundaries

- Never generates content (that is mega-factory's role)
- Never calls mega-factory at runtime
- Never writes into mega-factory filesystem
- Imported packages are draft/preview only; noindex by default
- SEO projections derived from package canonical source
