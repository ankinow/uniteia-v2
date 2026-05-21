# Changelog

All notable changes to uniteia-v2 will be documented in this file.

## [Unreleased]

## [0.14.0] - 2026-05-21

### Added
- New components: signal-grid, quality-ring, sketch-note, decision-map, kindle-playground
- collage-editorial variant for DepthCard (corkboard + paper-real-texture + ink-effect + scrapbook-layer)
- Bridge exports: DepthCard re-exported from cinematic-depth barrel
- MasterOpenCanvas: sticky-note + cardboard texture layers with showStickyNote/showCardboard props
- ArticleFrame: kindleMode toggle (warm sepia bg + KindlePlayground)
- SignalGrid: organic variant (staggered paper-fiber grid with rotation/scale)
- QualityRing: freshness decay via publishedAt prop (>90d stale, >180d archived)

### Changed
- DEFAULT_ROUTE_GZIP_BUDGET_BYTES: 115→120 KB
- ship-check.ts --threshold: 117760→122880
- .gitignore: added =3 and gsd-session-*.html rules

### Fixed
- Removed stale Sora @font-face (sora.woff2 missing from public/fonts/)

### Removed
- =3 file (2.4KB, test artifact)
- 5 GSD session logs (~6.8MB total)

### Added
- Canonical `skills/` library with the baseline skill set
- Multilingual Qwik-City routing for `en`, `pt`, `es`, `ja`, and `zh`
- Content pipeline scaffolding (`content/`, `data/`, `runs/`)
- Article, header, slots, ledger, and niche landing components

### Changed
- Reworked error pages into shared components with catchall routing
- Added `niches.yaml` and supporting canonical URL validation
- Strengthened i18n and frontmatter validation flow

## [0.1.0] - 2026-04-19

### Added
- Initial Qwik-City + UnoCSS + Cloudflare Pages scaffold
- App shell, layout, entrypoints, and content validation scripts
- SolarLanso design tokens and brutalist-editorial baseline
- First content routes, templates, and multilingual page support
