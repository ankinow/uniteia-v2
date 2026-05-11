---
id: CTX-V2-I18N-01
repo: uniteia-v2
role: consumer
symbol: ⊕
status: active
version: 1.0.0
created_at: 2026-05-11
updated_at: 2026-05-11
source_of_truth: true
depends_on: []
hash: SELF
---

# MULTILINGUAL-ROUTING-SEO — 8-Language Routing and SEO

## 0. Trace
| Field | Value |
|---|---|
| id | CTX-V2-I18N-01 |
| symbol | ⊕ |
| repo | uniteia-v2 |
| role | consumer |
| source | src/i18n/types.ts, src/i18n/middleware.ts, AGENTS.md |
| last_verified | 2026-05-11 |
| hash | SELF |

## 1. Use When
- Implementing or modifying language routing
- Debugging middleware behavior
- Setting up hreflang, sitemap, or SEO per language
- Adding or removing a language

## 2. Context Summary
Σ: 8 language views: en, pt, es, fr, de, it, ja, zh. Dynamic resolution: URL > cookie > Accept-Language > CF-IPCountry > technical fallback. Cookie and IP must not replace crawlable URLs.

## 3. Language Model

| Code | Script | Notes |
|---|---|---|
| en | Latin | Global default |
| pt | Latin | pt-BR primary |
| es | Latin | Neutral |
| fr | Latin | fr-FR standard |
| de | Latin | de-DE standard |
| it | Latin | it-IT standard |
| ja | Japanese | Noto Sans JP |
| zh | Han (Simplified) | Noto Sans SC |

## 4. Non-Negotiable Rules
[!]
- Dynamic resolution: URL > cookie > Accept-Language > CF-IPCountry > fallback 'en'
- SEO must use real URLs (no cookie-dependent or IP-dependent URLs)
- hreflang includes x-default
- All 8 language views must be complete before promotion
- canonicalLanguage = provenance only (when imported from factory)

## 5. Middleware Behavior

Current resolution (src/i18n/middleware.ts):
1. URL path segment /{lang}/
2. Cookie 'uniteia_lang'
3. CF-IPCountry header (Cloudflare geo)
4. Accept-Language header
5. Default: 'en'

[!] CF-IPCountry is currently checked before Accept-Language. This differs from the documented policy. Confirm behavior before making assumptions.

## 6. Verification
♻️:
- vitest run src/i18n/ — 8-language middleware tests
- Locale validation: src/i18n/locale-validation.ts validates SUPPORTED_LOCALES
- Geo map: src/i18n/geo-map.ts maps ~200 countries to languages

## 7. Related Contexts
⊕:
- /home/lermf/uniteia-mega-factory/docs/context/MULTILINGUAL-MODEL.md — producer-side model
- docs/context/SEO-RENDERING-CONTRACT.md — hreflang and canonical rendering
- docs/context/CONTENT-PACKAGE-IMPORT.md — locale handling at import
