---
name: i18n-first
description: 5 languages from F01 (en/pt/es/ja/zh), middleware negotiation, hreflang, CJK fonts
license: MIT
compatibility: [claude-code, cursor, codex, windsurf, opencode]
---

# i18n First

5 languages active from F01: en, pt, es, ja, zh.

## Language Precedence

1. URL explicit: `/{lang}/{slug}`
2. Cookie: `uniteia_lang`
3. Accept-Language header
4. CF-IPCountry hint
5. Fallback: `en`

## Cookie Contract

```
Name: uniteia_lang
Value: en | pt | es | ja | zh
Domain: .uniteia.com
Max-Age: 31536000 (1 year)
SameSite: Lax
Secure: true
HttpOnly: false (readable by client)
```

## Redirects

- **302 Temporary** (not 301) — allows language switching without cache pollution

## Slug Immutability

Slug does NOT change across languages. Same slug, different content.

- ✅ `/en/llm-aggregators-compared`
- ✅ `/pt/llm-aggregators-compared`
- ✅ `/ja/llm-aggregators-compared`

## Hreflang

Mandatory per atom. Include `x-default` pointing to EN.

## Fallback Behavior

When translation missing:
1. Render EN version
2. Inject `TranslationFallbackBanner` at top of article
3. Banner text in user's language

## CJK Typography Adjustments

For `ja` and `zh`:
- Line-height: +10%
- Letter-spacing: 0.02em (titles)
- Font-weight: 400 (titles, lighter than Latin)
- Text-align: justify disabled

## CJK Fonts

- **ja:** Noto Sans JP (conditional load)
- **zh:** Noto Sans SC (conditional load)

Load ONLY when `lang=ja` or `lang=zh`. Never add to EN/PT/ES bundle.
