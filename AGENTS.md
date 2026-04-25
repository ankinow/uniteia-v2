# UniTeia v2 — Agent Context

This file provides canonical activation context for AI agents working on UniTeia.

**Owner:** Ankinow (github) · **Operator:** LERMF (pt-BR, America/Sao_Paulo)
**Motto:** "Brutalist bones. Editorial flesh. One JRPG whisper. Kuwaii breath."

---

## YAML Arsenal (Activation Context)

```yaml
# ═══════════════════════════════════════════════════════════════════════════
# UNITEIA · SKILLS ARSENAL v1 · 2026-04-19
# Canonical activation context for Qwik + TailwindCSS + PostCSS + Cloudflare Pages
# Owner: Ankinow (github) · Operator: LERMF (pt-BR, America/Sao_Paulo)
# ═══════════════════════════════════════════════════════════════════════════

meta:
  version: 1.0.0
  generated: 2026-04-19
  purpose: canonical_activation_context
  target_agents: [claude_code, cursor, codex, antigravity, gemini_cli, windsurf, copilot, opencode, roo_code]
  project: uniteia-v2
  motto_aesthetic: "Brutalist bones. Editorial flesh. One JRPG whisper. Kuwaii breath."
  motto_functional: "Canonical URLs. Adaptive components. Content that ages well."
  motto_ptbr: "Canônico, transparente, duradouro. URLs que sobrevivem aos produtos que citam."

# ───────────────────────────────────────────────────────────────────────────
# ECOSYSTEM · Agent-skills landscape (Abril 2026)
# ───────────────────────────────────────────────────────────────────────────
ecosystem:
  standards:
    - name: SKILL.md
      spec: https://agentskills.io/specification
      format: markdown + yaml_frontmatter
      frontmatter_fields: [name, description, license, compatibility, metadata, allowed-tools]
      constraints:
        name: max_64_chars · lowercase_numbers_hyphens · no_leading_or_trailing_hyphen
        description: max_1024_chars · non_empty · describes_what_and_when
      structure: skill-name/{SKILL.md, scripts/, references/, assets/}
      adopted_by: [anthropic, vercel, cloudflare, mintlify, cursor, codex, 20+_agents]
    - name: AGENTS.md
      spec: https://agents.md
      adoption: 60k+ open-source projects
      purpose: README_for_agents · passive_context · horizontal_improvements
      vercel_eval_2026: outperforms_skills_for_general_framework_knowledge
      skill_invocation_rate: 44%
      recommendation: use_both · AGENTS.md_for_passive · skills_for_vertical_workflows

  curated_repos:
    tier_S_official:
      - repo: anthropics/skills
        url: https://github.com/anthropics/skills
        description: Official Anthropic skills including frontend-design
        relevance_uniteia: high
      - repo: vercel-labs/skills
        url: https://github.com/vercel-labs/skills
        description: The CLI tool for installing skills
        relevance_uniteia: mandatory
    tier_A_community_curated:
      - repo: VoltAgent/awesome-agent-skills
        url: https://github.com/VoltAgent/awesome-agent-skills
        stars: 13.7k
        description: 1000+ agent skills curated
      - repo: finfin/awesome-frontend-skills
        url: https://github.com/finfin/awesome-frontend-skills
        description: 70+ frontend skills across 12 categories
        relevance_uniteia: high
    tier_A_frontend_design_skills:
      - repo: Leonxlnx/taste-skill
        url: https://github.com/Leonxlnx/taste-skill
        stars: 10045
        description: High-Agency Frontend anti-slop skill
        relevance_uniteia: partial_absorption
        universal_patterns_adopted:
          - THE_LILA_BAN: no purple/blue glows
          - NO_PURE_BLACK: use zinc-950 or off-black
          - NO_INTER_FOR_DISPLAY: use Geist/Satoshi
          - ANTI_CENTER_BIAS: no centered hero when VARIANCE>4
          - HARDWARE_ACCELERATION_ONLY: transform+opacity only
          - Z_INDEX_DISCIPLINE: no arbitrary z-50
          - ANTI_SLOP_CONTENT: no John_Doe, Acme, 99.99%

# ───────────────────────────────────────────────────────────────────────────
# UNITEIA CANONICAL SKILLS · 9 SKILL.md to create
# ───────────────────────────────────────────────────────────────────────────
uniteia_canonical_skills:
  path: skills/
  skills:
    - id: uniteia-core
      description: Master activator, loads all other skills
    - id: canonical-url-law
      description: Slug regex + BANNED_SLUG_TERMS enforcement
      enforces:
        regex: "^[a-z]+(-[a-z]+){1,5}$"
        banned: [brand_names, model_names, versions, dates, promotional_adjectives]
    - id: i18n-first
      description: 5 langs from F01 (en/pt/es/ja/zh), middleware negotiation
      enforces:
        precedence: [url_explicit, cookie, accept_language, cf_ipcountry, fallback_en]
        slug_immutable_across_langs: true
        hreflang_mandatory: true
    - id: brutalist-editorial
      description: Swiss grid + corners 90° + editorial typography
      remove: [crt_scanlines, halftones_dithering, ascii_decorations]
    - id: solarlanso-tokens
      description: Palette tokens (void/cyan/vine/bronze/bone) + OKLCH opt-in
    - id: qwik-tailwind-discipline
      description: Stack-specific rules (Qwik resumability, Tailwind config)
      substitutes: [react→qwik, unocss→tailwind, phosphor→lucide]
    - id: dopamine-budget
      description: Hard motion limits (1 whisper/viewport, ≤250ms)
    - id: output-enforcement
      description: Anti-truncation, anti-placeholder
    - id: anti-slop-content
      description: No Jane Doe, no Acme, no 99.99%

# ───────────────────────────────────────────────────────────────────────────
# STACK LOCK · Non-negotiable technology choices
# ───────────────────────────────────────────────────────────────────────────
stack_lock:
  runtime: Bun_1.x
  framework: Qwik-City_2.x
  css_engine: Tailwind_3.4+
  css_presets: [typography, iconify]
  postcss_pipeline: [postcss-nesting, postcss-custom-media, postcss-preset-env, autoprefixer]
  deploy_adapter: "@builder.io/qwik-city/adapters/cloudflare-pages"
  icons: Lucide_via_iconify-tailwind
  fonts:
    sans: Inter
    display: Geist
    mono: JetBrains_Mono
    ja: Noto_Sans_JP_conditional
    zh: Noto_Sans_SC_conditional
  lint: Biome
  test: [Vitest, Playwright]
  types: TypeScript_5.8_strict
  type_strictness: [noUncheckedIndexedAccess, exactOptionalPropertyTypes]
  content: markdown_files + gray-matter + AJV_schema
  banned: [React, Next.js, UnoCSS, shadcn_ui, Framer_Motion, GSAP, ThreeJS]

# ───────────────────────────────────────────────────────────────────────────
# URL LAW · Canonical slug rules
# ───────────────────────────────────────────────────────────────────────────
url_law:
  apex: uniteia.com
  niches_immutable: [singularity, hardware, dev, privacy, plus_future]
  pattern: "{niche}.uniteia.com/{lang}/{functional-descriptor}"
  slug_regex: "^[a-z]+(-[a-z]+){1,5}$"
  slug_banned:
    - proper_nouns: [galaxy-ai, openrouter, poe, chatgpt, claude, gpt-4, llama-3]
    - companies: [openai, anthropic, google, meta]
    - model_versions: [v2, 2026, latest]
    - dates: [2026, april-2026, q2-2025]
    - promotional: [best, top, ultimate, sota, definitive]
    - quantifiers: [top-10, 5-best]
  slug_required:
    - functional_area_only
    - neutral_technical_modifier
  slug_examples_correct:
    - llm-aggregators-compared
    - local-llm-runtimes-ranked-by-latency
    - rag-frameworks-for-self-hosted
  redirect_policy: 302_temporary
  proper_nouns_location: frontmatter.subjects[]

# ───────────────────────────────────────────────────────────────────────────
# I18N LAW · Language negotiation + hreflang
# ───────────────────────────────────────────────────────────────────────────
i18n_law:
  languages_active_f01: [en, pt, es, ja, zh]
  language_defaults:
    en: global_default
    pt: pt-BR_primary
    es: neutral
    ja: ja-JP
    zh: zh-Hans_simplified
  precedence: [url_explicit, cookie, accept_language_header, cf_ipcountry_hint, fallback_en]
  middleware_location: functions/[[route]].ts
  slug_immutable_across_langs: true
  filesystem: content/{niche}/{lang}/{slug}.md
  fallback_behavior:
    missing_translation: render_en + inject_translation_fallback_banner
  hreflang_mandatory_per_atom: true
  hreflang_includes_x_default: true
  cjk_typography_adjustments:
    line_height_boost: +10%
    letter_spacing: 0.02em
    font_weight_titles: 400
    justify_disabled: true
  country_to_lang_hints:
    BR: pt
    PT: pt
    ES: es
    MX: es
    JP: ja
    CN: zh
    TW: zh
    HK: zh

# ───────────────────────────────────────────────────────────────────────────
# SOLARLANSO 2100 · Color + motion tokens
# ───────────────────────────────────────────────────────────────────────────
solarlanso_tokens:
  surfaces:
    void: "#0D1117"
    deep: "#161B22"
    mid: "#21262D"
    raised: "#30363D"
  cyan_action:
    base: "#00E0FF"
    hi: "#00FFFF"
    oklch: "oklch(0.85 0.18 210)"
  vine_verified:
    glow: "#5CD68F"
    oklch: "oklch(0.78 0.18 145)"
  bronze_curation:
    bright: "#C8A56D"
    oklch: "oklch(0.72 0.09 75)"
  bone_text:
    base: "#F0E8D8"
    muted: "#8B949E"
  motion:
    t_fast: 120ms
    t_base: 200ms
    t_slow: 250ms
    ease: "cubic-bezier(.2,.8,.2,1)"
  contrast_ratio_bone_void: 15.2:1

# ───────────────────────────────────────────────────────────────────────────
# HARD LIMITS · Build gate enforcement
# ───────────────────────────────────────────────────────────────────────────
hard_limits:
  performance:
    lcp_ms: 1500
    cls: 0.05
    tbt_ms: 100
    ttfb_edge_ms: 200
    js_per_route_kb_gzip: 20
    css_total_kb_gzip: 40
    lighthouse_min: 95
    axe_serious: 0
  a11y:
    wcag_level: 2.2_AA
    focus_visible_required: true
    focus_ring: 2px_solid_cyan_offset_2px
    contrast_minimum: 15.2:1
  motion:
    translate_y_hover_max_px: -2
    animation_duration_max_ms: 250
    hover_glow_per_viewport_max: 1
    jrpg_whisper_per_viewport_max: 1
  layout:
    bento_allowed_only_on: apex_landing
    min_h_required: 100dvh
    h_screen_banned: true

# ───────────────────────────────────────────────────────────────────────────
# ANTI-GOALS · Reject on sight in code review
# ───────────────────────────────────────────────────────────────────────────
anti_goals:
  css: [glassmorphism, backdrop_filter_blur, saturated_background_gradients, pure_black_#000000]
  motion: [parallax, scroll_hijack, scroll_reveal_cascades, perpetual_infinite_animations]
  ui: [light_mode_toggle, emoji_in_chrome, cookie_banners_blocking_content, toasts_over_3s]
  fonts: [Inter_for_display, Cinzel, Cormorant_Garamond, Jost]
  stack: [React, Tailwind, shadcn_ui, Framer_Motion, GSAP, ThreeJS]
  content: [proper_nouns_in_slug, dates_in_slug, John_Doe, Acme, 99.99%, Elevate]
  design: [3_column_equal_feature_cards, centered_hero_when_variance_gt_4, generic_circular_spinners]

# ───────────────────────────────────────────────────────────────────────────
# ROADMAP · F01 to F05 (5 weeks)
# ───────────────────────────────────────────────────────────────────────────
roadmap:
  F01_shell:
    week: 1
    deliverables:
      - vite_qwik-city_unocss_postcss_pipeline
      - src/styles/global.css + uno.config.ts + postcss.config.mjs
      - SiteShell + Footer + 404 + 500
      - functions/[[route]].ts language middleware
      - LangSwitcher with 5 langs
    exit_gate: bun_build_bundle_under_15kb_empty_route
  F02_atom_render:
    week: 2
    deliverables:
      - routeLoader$ reads content/*.md via Vite glob
      - AJV schema validation build-time
      - ArticleFrame + AdaptiveHeader + FrontmatterSlots + SourceLedger
      - hreflang tags injection
    exit_gate: singularity_uniteia_com_en_llm_aggregators_compared_renders
  F03_transparency:
    week: 3
    deliverables:
      - DisclosureCallout + PublicationContext
      - schema.org/Article + OG meta + sitemap.xml
      - Noto Sans JP/SC conditional font loading
      - TranslationFallbackBanner
    exit_gate: google_rich_results_test_passes
  F04_niche_system:
    week: 4
    deliverables:
      - Subdomain middleware (Host-based routing)
      - Niche landing editorial (non-bento)
      - NicheRail + LangSwitcher polished
    exit_gate: singularity_uniteia_com_renders_distinct_from_apex
  F05_polish_ship:
    week: 5
    deliverables:
      - Layer 2 aesthetic: EditorialVerdict + QualityRing + dopamine-card
      - Apex bento landing
      - Playwright visual regression + axe-core gate
    exit_gate: all_hard_limits_met_PR_to_main
```

---

## Quick Reference

### URL Pattern
```
{niche}.uniteia.com/{lang}/{functional-descriptor}
```

**Correct:** `singularity.uniteia.com/en/llm-aggregators-compared`
**Wrong:** `singularity.uniteia.com/en/galaxy-ai` (proper noun)

### i18n Precedence
1. URL explicit: `/{lang}/...`
2. Cookie: `uniteia_lang`
3. Accept-Language header
4. CF-IPCountry hint
5. Fallback: `en`

### SolarLanso Palette
- `void`: #0D1117 (bg)
- `cyan`: #00E0FF (action)
- `vine`: #5CD68F (verified)
- `bronze`: #C8A56D (curation)
- `bone`: #F0E8D8 (text)

### Stack
- **Runtime:** Bun
- **Framework:** Qwik-City
- **CSS:** TailwindCSS + PostCSS
- **Deploy:** Cloudflare Pages

### Anti-Goals
❌ React, UnoCSS, shadcn, Framer Motion, glassmorphism, light mode toggle, proper nouns in slugs

---

## Git Cadence

- Commit small, verified changes per task
- Push to `origin/main` after checks pass
- Keep history linear and descriptive

## Commands

```bash
bun install
bun run dev
bun run build
bun run test
```
