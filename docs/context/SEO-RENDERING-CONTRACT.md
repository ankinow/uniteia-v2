---
id: CTX-V2-SEO-01
repo: uniteia-v2
role: consumer
symbol: ⛓️
status: active
version: 1.0.0
created_at: 2026-05-11
updated_at: 2026-05-11
source_of_truth: true
depends_on: []
hash: SELF
---

# SEO-RENDERING-CONTRACT — Site SEO Generation

## 0. Trace
| Field | Value |
|---|---|
| id | CTX-V2-SEO-01 |
| symbol | ⛓️ |
| repo | uniteia-v2 |
| role | consumer |
| source | AGENTS.md, docs/architecture/content-package-contract-v1.md |
| last_verified | 2026-05-11 |
| hash | SELF |

## 1. Use When
- Implementing SEO meta tags in page components
- Setting up hreflang alternates in <head>
- Generating sitemap.xml, robots.txt, llms.txt
- Configuring OpenGraph / Twitter card / JSON-LD

## 2. Context Summary
Σ: SEO is package-first. canonical-package.seo from the Content Package is the source of truth. The site renders deterministic projections: seo/<lang>.json, hreflang-map.json, sitemap-entry.json, llms-entry.md.

## 3. Required Meta Per Page

| Meta | Source | Example |
|---|---|---|
| title | seo/<lang>.json | "LLM Aggregators Compared" |
| description | seo/<lang>.json | "A technical comparison..." |
| canonical | seo/<lang>.json | https://singularity.uniteia.com/en/llm-aggregators-compared |
| hreflang alternates | hreflang-map.json | <link rel="alternate" hreflang="pt" ...> |
| x-default | hreflang-map.json | <link rel="alternate" hreflang="x-default" ...> |
| robots | per-page | index, follow (unless draft) |
| og:title | seo/<lang>.json | Same as title |
| og:description | seo/<lang>.json | Same as description |
| og:url | seo/<lang>.json | Same as canonical |
| og:image | seo/<lang>.json | Textless visual |
| twitter:card | seo/<lang>.json | summary_large_image |
| JSON-LD | seo/<lang>.json | schema.org/Article |

## 4. Non-Negotiable Rules
[!]
- Crawlable URLs only — no cookie/IP-dependent SEO
- All hreflang alternates present for all 8 languages
- x-default included as separate alternate
- Draft pages: <meta name="robots" content="noindex">
- Noindex pages must still have valid canonical

## 5. Verification
♻️:
- Google Rich Results Test: PASS
- Lighthouse SEO audit: ≥95
- hreflang validation: all languages present, no dead alternates

## 6. Related Contexts
⊕:
- /home/lermf/uniteia-mega-factory/docs/context/SEO-PACKAGE-FIRST.md — producer-side SEO
- docs/context/MULTILINGUAL-ROUTING-SEO.md — hreflang per language
