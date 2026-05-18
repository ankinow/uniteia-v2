/**
 * Codebase Description Generator — Heuristic v2
 *
 * Generates meaningful descriptions for every file in CODEBASE.md
 * by inferring purpose from path patterns, naming conventions,
 * extensions, and known Qwik/Qwik City project conventions.
 *
 * Usage:
 *   bun run scripts/generate-codebase-descriptions.ts         # dry-run
 *   bun run scripts/generate-codebase-descriptions.ts --write # persist
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, extname, join } from 'node:path'

// ─── Heuristic Engine ────────────────────────────────────────────────────────

type Heuristic = { pattern: RegExp; description: string | ((fp: string) => string) }

/** Ordered heuristics: first match wins. More specific before generic. */
const HEURISTICS: Heuristic[] = [
  // ── Config / Root ──
  { pattern: /^biome\.json$/, description: 'Biome linter and formatter configuration' },
  { pattern: /^tsconfig\.json$/, description: 'TypeScript project configuration' },
  { pattern: /^package\.json$/, description: 'Project manifest with dependency declarations' },
  { pattern: /^bun\.lock$/, description: 'Bun lockfile — dependency version lock' },
  { pattern: /^vitest\.config\.ts$/, description: 'Vitest test runner configuration' },
  { pattern: /^vite\.config\.ts$/, description: 'Vite bundler configuration' },
  { pattern: /^playwright\.config\.ts$/, description: 'Playwright e2e test configuration' },
  { pattern: /^wrangler\.toml$/, description: 'Cloudflare Pages deployment configuration' },
  { pattern: /^\.gitignore$/, description: 'Git ignore rules' },
  { pattern: /^\.env\.example$/, description: 'Environment variable template' },
  { pattern: /^\.dev\.vars\.example$/, description: 'Cloudflare Pages dev variables template' },
  { pattern: /^AGENTS\.md$/, description: 'Agent context instructions for AI coding assistants' },
  { pattern: /^README\.md$/, description: 'Project README — overview and usage guide' },
  { pattern: /^CHANGELOG\.md$/, description: 'Release changelog' },
  { pattern: /^CONTEXT-MAP\.md$/, description: 'Context map index for agent orientation' },

  // ── GitHub ──
  { pattern: /^\.github\/workflows\/.+\.ya?ml$/, description: 'GitHub Actions CI/CD workflow' },

  // ── Cloudflare ──
  { pattern: /^\.wrangler\/.+/, description: 'Cloudflare Pages local cache and state' },
  { pattern: /^functions\/.+\.ts$/, description: 'Cloudflare Functions (edge runtime handler)' },
  { pattern: /^public\/_headers$/, description: 'Cloudflare Pages custom HTTP headers' },
  { pattern: /^public\/_routes\.json$/, description: 'Cloudflare Pages routing configuration' },
  { pattern: /^public\/robots\.txt$/, description: 'Robots exclusion rules for search engines' },
  {
    pattern: /^public\/frames-reference\/.+\.html$/,
    description: 'Device frame reference (Chrome DevTools frame)',
  },
  {
    pattern: /^public\/frames-reference\/README\.md$/,
    description: 'Device frame reference documentation',
  },
  {
    pattern: /^adapters\/cloudflare-pages\/.+\.ts$/,
    description: 'Cloudflare Pages adapter configuration',
  },

  // ── Adapters ──
  {
    pattern: /^src\/adapters\/demo\/.+\.ts$/,
    description: 'Demo API adapter (external data integration)',
  },
  {
    pattern: /^src\/adapters\/demo\/.+\.fixture\.json$/,
    description: 'Demo API adapter test fixture',
  },
  { pattern: /^src\/adapters\/demo\/.+\.test\.ts$/, description: 'Demo API adapter tests' },

  // ── Source: Entry points ──
  { pattern: /^src\/entry\.ssr\.tsx?$/, description: 'Qwik City SSR entry point' },
  { pattern: /^src\/entry\.preview\.tsx?$/, description: 'Qwik City preview mode entry' },
  { pattern: /^src\/entry\.dev\.tsx?$/, description: 'Qwik City dev mode entry' },
  {
    pattern: /^src\/entry\.cloudflare-pages\.tsx?$/,
    description: 'Qwik City Cloudflare Pages entry point',
  },
  {
    pattern: /^src\/root\.tsx?$/,
    description: 'Qwik City root component (Html/Head/Body structure)',
  },
  { pattern: /^src\/global\.css$/, description: 'Global CSS stylesheet' },

  // ── Source: CLI ──
  { pattern: /^src\/cli\.ts$/, description: 'CLI entry point for automation scripts' },

  // ── Source: Routes (Qwik City) ──
  {
    pattern: /^src\/routes\/service-worker\.ts$/,
    description: 'Service Worker — chunk validation and cache strategy',
  },
  { pattern: /^src\/routes\/layout\.tsx?$/, description: 'Qwik City root layout component' },
  { pattern: /^src\/routes\/.+?\/layout\.tsx?$/, description: 'Qwik City nested layout component' },
  { pattern: /^src\/routes\/.+?\/index\.tsx?$/, description: 'Qwik City page route (endpoint)' },

  // ── Source: Content Graph ──
  {
    pattern: /^src\/content-graph\.generated\.ts$/,
    description: 'Auto-generated content graph TypeScript module',
  },
  {
    pattern: /^src\/content-registry\.generated\.ts$/,
    description: 'Auto-generated content registry TypeScript module',
  },
  { pattern: /^src\/content-graph\/index\.ts$/, description: 'Content graph barrel export' },
  {
    pattern: /^src\/content-graph\/SPEC\.md$/,
    description: 'Content graph specification document',
  },
  {
    pattern: /^src\/content-graph\/contracts\/.+\.ts$/,
    description: 'Content graph type contracts (nodes, edges, groups, queries)',
  },
  {
    pattern: /^src\/content-graph\/compiler\/compile-content-graph\.ts$/,
    description: 'Content graph compiler — graph construction from registry',
  },
  {
    pattern: /^src\/content-graph\/compiler\/compile-content-graph\.test\.ts$/,
    description: 'Content graph compiler tests',
  },
  {
    pattern: /^src\/content-graph\/compiler\/compile-groups\.ts$/,
    description: 'Content graph group compilation',
  },
  {
    pattern: /^src\/content-graph\/compiler\/compile-groups\.test\.ts$/,
    description: 'Content graph group compilation tests',
  },
  {
    pattern: /^src\/content-graph\/compiler\/compile-locales\.ts$/,
    description: 'Content graph locale compilation',
  },
  {
    pattern: /^src\/content-graph\/compiler\/compile-related\.ts$/,
    description: 'Content graph related-content compilation',
  },
  {
    pattern: /^src\/content-graph\/compiler\/compile-routing\.ts$/,
    description: 'Content graph routing data compilation',
  },
  {
    pattern: /^src\/content-graph\/compiler\/compile-taxonomy\.ts$/,
    description: 'Content graph taxonomy compilation',
  },
  {
    pattern: /^src\/content-graph\/compiler\/serialize-graph-artifacts\.ts$/,
    description: 'Content graph serialization to JSON/TS artifacts',
  },
  {
    pattern: /^src\/content-graph\/compiler\/verify-content-graph\.ts$/,
    description: 'Content graph structure verification',
  },
  {
    pattern: /^src\/content-graph\/compiler\/verify-content-graph\.test\.ts$/,
    description: 'Content graph verification tests',
  },
  {
    pattern: /^src\/content-graph\/generated\/\.gitkeep$/,
    description: 'Content graph generated output directory placeholder',
  },
  {
    pattern: /^src\/content-graph\/loaders\/create-static-provider\.ts$/,
    description: 'Static provider factory for content graph hydration',
  },
  {
    pattern: /^src\/content-graph\/loaders\/load-serialized-graph\.ts$/,
    description: 'Loader for serialized content graph data',
  },
  {
    pattern: /^src\/content-graph\/policies\/visibility-policy\.ts$/,
    description: 'Visibility policy — quality/published/locale gating',
  },
  {
    pattern: /^src\/content-graph\/projections\/homepage\.ts$/,
    description: 'Homepage content projection from graph',
  },
  {
    pattern: /^src\/content-graph\/projections\/index\.ts$/,
    description: 'Content graph projections barrel export',
  },
  {
    pattern: /^src\/content-graph\/projections\/navigation\.ts$/,
    description: 'Navigation content projection from graph',
  },
  {
    pattern: /^src\/content-graph\/providers\/static-json-provider\.ts$/,
    description: 'Static JSON content graph provider implementation',
  },

  // ── Source: Content Import ──
  {
    pattern: /^src\/content-import\/import-package\.ts$/,
    description: 'Content package import (validate + map + ingest)',
  },
  {
    pattern: /^src\/content-import\/validate-package\.ts$/,
    description: 'Content package validation against schema contracts',
  },
  {
    pattern: /^src\/content-import\/map-layout\.ts$/,
    description: 'Content package layout mapping',
  },
  { pattern: /^src\/content-import\/map-tags\.ts$/, description: 'Content package tag mapping' },

  // ── Source: Content Contracts ──
  {
    pattern: /^src\/content-contracts\/blocks\.schema\.ts$/,
    description: 'Content block type schemas and validation',
  },
  {
    pattern: /^src\/content-contracts\/content-package\.test\.ts$/,
    description: 'Content package contract tests',
  },
  {
    pattern: /^src\/content-contracts\/design\.schema\.ts$/,
    description: 'Content design schema and validation',
  },
  {
    pattern: /^src\/content-contracts\/manifest\.schema\.ts$/,
    description: 'Content manifest schema and validation',
  },
  {
    pattern: /^src\/content-contracts\/quality\.schema\.ts$/,
    description: 'Content quality schema and validation',
  },
  {
    pattern: /^src\/content-contracts\/tags\.schema\.ts$/,
    description: 'Content tags schema and validation',
  },

  // ── Source: i18n ──
  { pattern: /^src\/i18n\/context\.tsx?$/, description: 'i18n context provider component' },
  { pattern: /^src\/i18n\/[a-z]{2}\.ts$/, description: 'Locale translation data' },
  { pattern: /^src\/i18n\/geo-map\.ts$/, description: 'Geographic locale mapping' },
  {
    pattern: /^src\/i18n\/document-language\.ts$/,
    description: 'Document language detection utility',
  },
  { pattern: /^src\/i18n\/document-language\.test\.ts$/, description: 'Document language tests' },
  { pattern: /^src\/i18n\/locale-validation\.ts$/, description: 'Locale validation utility' },
  { pattern: /^src\/i18n\/locale-validation\.test\.ts$/, description: 'Locale validation tests' },
  { pattern: /^src\/i18n\/middleware\.ts$/, description: 'i18n routing middleware' },
  { pattern: /^src\/i18n\/middleware\.test\.ts$/, description: 'i18n middleware tests' },

  // ── Source: Components ──
  { pattern: /^src\/components\/json-ld\.tsx?$/, description: 'JSON-LD structured data component' },
  {
    pattern: /^src\/components\/router-head\/index\.tsx?$/,
    description: 'Router head — meta tags, SEO, and page metadata',
  },
  {
    pattern: /^src\/components\/site-shell\/index\.tsx?$/,
    description: 'Site shell — top-level page wrapper chrome',
  },
  {
    pattern: /^src\/components\/site-shell\/svg-filters\.tsx?$/,
    description: 'Site shell SVG filter definitions',
  },
  {
    pattern: /^src\/components\/site-shell\/types\.ts$/,
    description: 'Site shell type definitions',
  },
  { pattern: /^src\/components\/footer\/index\.tsx?$/, description: 'Site footer component' },
  {
    pattern: /^src\/components\/footer\/types\.ts$/,
    description: 'Footer component type definitions',
  },
  {
    pattern: /^src\/components\/sidebar\/index\.tsx?$/,
    description: 'Sidebar navigation component',
  },
  {
    pattern: /^src\/components\/sidebar\/sidebar-nav\.tsx?$/,
    description: 'Sidebar navigation tree component',
  },
  { pattern: /^src\/components\/sidebar\/styles\.css$/, description: 'Sidebar component styles' },
  { pattern: /^src\/components\/nav-tree\/index\.tsx?$/, description: 'Navigation tree component' },
  {
    pattern: /^src\/components\/lang-switcher\/index\.tsx?$/,
    description: 'Language switcher component',
  },
  {
    pattern: /^src\/components\/lang-switcher\/compact\.tsx?$/,
    description: 'Compact language switcher variant',
  },
  {
    pattern: /^src\/components\/lang-switcher\/types\.ts$/,
    description: 'Language switcher type definitions',
  },
  { pattern: /^src\/components\/search\/index\.tsx?$/, description: 'Search component' },
  {
    pattern: /^src\/components\/related-articles\/index\.tsx?$/,
    description: 'Related articles component',
  },
  {
    pattern: /^src\/components\/related-articles\/types\.ts$/,
    description: 'Related articles type definitions',
  },
  {
    pattern: /^src\/components\/article-frame\/index\.tsx?$/,
    description: 'Article frame component — content layout wrapper',
  },
  {
    pattern: /^src\/components\/article-frame\/types\.ts$/,
    description: 'Article frame type definitions',
  },
  { pattern: /^src\/components\/depth-card\/index\.tsx?$/, description: 'Depth card component' },
  {
    pattern: /^src\/components\/depth-section\/index\.tsx?$/,
    description: 'Depth section component',
  },
  { pattern: /^src\/components\/depth\/types\.ts$/, description: 'Depth type definitions' },
  { pattern: /^src\/components\/niche-card\/index\.tsx?$/, description: 'Niche card component' },
  {
    pattern: /^src\/components\/niche-card\/types\.ts$/,
    description: 'Niche card type definitions',
  },
  {
    pattern: /^src\/components\/niche-landing\/index\.tsx?$/,
    description: 'Niche landing page component',
  },
  {
    pattern: /^src\/components\/niche-landing\/types\.ts$/,
    description: 'Niche landing type definitions',
  },
  {
    pattern: /^src\/components\/signal-grid\/index\.tsx?$/,
    description: 'Signal grid visualization component',
  },
  {
    pattern: /^src\/components\/signal-grid\/types\.ts$/,
    description: 'Signal grid type definitions',
  },
  {
    pattern: /^src\/components\/editorial-verdict\/types\.ts$/,
    description: 'Editorial verdict type definitions',
  },
  {
    pattern: /^src\/components\/dopamine-card\/index\.tsx?$/,
    description: 'Dopamine card component',
  },
  {
    pattern: /^src\/components\/dopamine-card\/types\.ts$/,
    description: 'Dopamine card type definitions',
  },
  { pattern: /^src\/components\/donation\/index\.tsx?$/, description: 'Donation component' },
  {
    pattern: /^src\/components\/frontmatter-slots\/index\.tsx?$/,
    description: 'Frontmatter slots component',
  },
  {
    pattern: /^src\/components\/frontmatter-slots\/types\.ts$/,
    description: 'Frontmatter slots type definitions',
  },
  { pattern: /^src\/components\/hud-label\/index\.tsx?$/, description: 'HUD label component' },
  {
    pattern: /^src\/components\/source-ledger\/index\.tsx?$/,
    description: 'Source ledger / citations component',
  },
  {
    pattern: /^src\/components\/source-ledger\/types\.ts$/,
    description: 'Source ledger type definitions',
  },
  {
    pattern: /^src\/components\/scratch-divider\/index\.tsx?$/,
    description: 'Scratch divider decorative component',
  },
  {
    pattern: /^src\/components\/error-pages\/not-found\.tsx?$/,
    description: '404 Not Found error page',
  },
  {
    pattern: /^src\/components\/error-pages\/server-error\.tsx?$/,
    description: '500 Server Error page',
  },
  {
    pattern: /^src\/components\/adaptive-header\/index\.tsx?$/,
    description: 'Adaptive header component',
  },
  {
    pattern: /^src\/components\/adaptive-header\/types\.ts$/,
    description: 'Adaptive header type definitions',
  },
  {
    pattern: /^src\/components\/jrpg\/quest-progress\.tsx?$/,
    description: 'JRPG quest progress component',
  },
  {
    pattern: /^src\/components\/lesson\/analogy-box\.tsx?$/,
    description: 'Lesson analogy box component',
  },
  {
    pattern: /^src\/components\/lesson\/lesson-block\.tsx?$/,
    description: 'Lesson block component',
  },
  { pattern: /^src\/components\/lesson\/lesson-hero\.tsx?$/, description: 'Lesson hero component' },
  {
    pattern: /^src\/components\/lesson\/next-lesson-card\.tsx?$/,
    description: 'Next lesson card component',
  },
  {
    pattern: /^src\/components\/lesson\/summary-board\.tsx?$/,
    description: 'Lesson summary board component',
  },
  {
    pattern: /^src\/components\/visual\/handdraw-arrow\.tsx?$/,
    description: 'Hand-drawn arrow decorative visual',
  },
  {
    pattern: /^src\/components\/visual\/handdraw-circle\.tsx?$/,
    description: 'Hand-drawn circle decorative visual',
  },

  // ── Scripts ──
  { pattern: /^scripts\/.+\.ts$/, description: 'Build, automation, or analysis script' },

  // ── Tests ──
  { pattern: /\.test\.tsx?$/, description: 'Unit test file' },
  { pattern: /\.spec\.tsx?$/, description: 'E2E test specification' },
  { pattern: /\/tests\/.+\.ts$/, description: 'Test helper or fixture' },
  { pattern: /\/golden\/.+\.ya?ml$/, description: 'Golden test fixture' },

  // ── Content ──
  { pattern: /^content\/.+?\/_index\.md$/, description: 'Content section index page' },
  { pattern: /^content\/.+?\/[^_].+\.md$/, description: 'Content article (markdown)' },
  { pattern: /^content\/.+?\/[^_].+\.mdx$/, description: 'Content article (MDX)' },
  { pattern: /^content\/\.gitkeep$/, description: 'Content directory placeholder' },
  {
    pattern: /^content-metadata\/.+\.json$/,
    description: 'Content package import metadata and report',
  },

  // ── Fixtures ──
  {
    pattern: /^fixtures\/content-packages\/.+\.mdx?$/,
    description: 'Content package test fixture',
  },
  {
    pattern: /^fixtures\/content-packages\/.+\.json$/,
    description: 'Content package fixture metadata',
  },
  {
    pattern: /^fixtures\/content-packages\/.+\.md$/,
    description: 'Content package fixture design doc',
  },
  {
    pattern: /^fixtures\/content-packages\/blocks\/.+\.json$/,
    description: 'Content package fixture block data',
  },
  {
    pattern: /^fixtures\/content-packages\/blocks\/\.gitkeep$/,
    description: 'Fixture blocks directory placeholder',
  },

  // ── Skills ──
  { pattern: /^skills\/.+?\/SKILL\.md$/, description: 'Agent skill definition' },

  // ── Artifacts ──
  { pattern: /^artifacts\/.+?\/chaos-report\.md$/, description: 'Edge chaos testing report' },
  { pattern: /^artifacts\/.+?\/linkgraph-report\.md$/, description: 'Link graph analysis report' },
  { pattern: /^artifacts\/m010\/.+\.md$/, description: 'M010 (Graph-Native) closeout artifact' },
  { pattern: /^artifacts\/observability\/.+\.md$/, description: 'Observability analysis report' },
  {
    pattern: /^artifacts\/observability\/traces\/.+\.zip$/,
    description: 'Playwright trace artifact',
  },
  { pattern: /^artifacts\/semantic-audit\/.+\.md$/, description: 'Semantic content audit report' },
  { pattern: /^artifacts\/seo\/.+\.md$/, description: 'SEO verification report' },

  // ── Audit ──
  { pattern: /^audit\/actions\.jsonl$/, description: 'Audit trail of automation actions' },
  { pattern: /^audit\/.+\.md$/, description: 'Audit reconciliation report' },

  // ── Config ──
  { pattern: /^config\/niches\.yaml$/, description: 'Content niche configuration' },

  // ── Docs ──
  { pattern: /^docs\/adr\/.+\.md$/, description: 'Architecture Decision Record (ADR)' },
  { pattern: /^docs\/architecture\/.+\.md$/, description: 'Architecture documentation' },
  {
    pattern: /^docs\/agents\/.+\.md$/,
    description: 'Agent configuration and triage documentation',
  },
  {
    pattern: /^docs\/agent-fullstack-context\.md$/,
    description: 'Agent full-stack development context',
  },
  { pattern: /^docs\/design\/.+\.ya?ml$/, description: 'Design system specification (YAML)' },
  { pattern: /^docs\/design\/.+\.md$/, description: 'Design documentation' },
  {
    pattern: /^docs\/design-reference\/.+\.md$/,
    description: (fp: string) =>
      `Design reference — ${basename(fp, '.md')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())} pattern`,
  },
  { pattern: /^docs\/context\/README\.md$/, description: 'Project context documentation index' },
  {
    pattern: /^docs\/context\/.+\.md$/,
    description: 'Project context / agent policy documentation',
  },
  { pattern: /^docs\/context\/.+\.json$/, description: 'Project context metadata' },
  { pattern: /^docs\/context\/.+\.jsonl$/, description: 'Project context ledger' },
  { pattern: /^docs\/context\/.+\.yaml$/, description: 'Project context YAML configuration' },
  {
    pattern: /^docs\/context\/context-runtime\/.+\.md$/,
    description: 'Runtime agent policy / gate definition',
  },
  { pattern: /^docs\/plans\/.+\.md$/, description: 'Engineering plan' },
  { pattern: /^docs\/plans\/.+\.yaml$/, description: 'Engineering plan (YAML)' },
  { pattern: /^docs\/reference\/.+\.md$/, description: 'Technical reference document' },
  { pattern: /^docs\/superpowers\/plans\/.+\.md$/, description: 'Superpowers initiative plan' },

  // ── Schemas ──
  { pattern: /^schemas\/.+\.json$/, description: 'Content schema definition (JSON Schema)' },

  // ── Project Report ──
  { pattern: /^project-report\/server\.ts$/, description: 'Project report preview server' },
  { pattern: /^project-report\/public\/.+\.html$/, description: 'Project report frontend page' },
  { pattern: /^project-report\/public\/.+\.css$/, description: 'Project report stylesheet' },

  // ── Data / Placeholders ──
  { pattern: /^data\/\.gitkeep$/, description: 'Data directory placeholder' },
  { pattern: /^runs\/\.gitkeep$/, description: 'Runs directory placeholder' },
  { pattern: /^content\/\.gitkeep$/, description: 'Content directory placeholder' },

  // ── Content Factory ──
  {
    pattern: /^apps\/content-factory\/SKILL\.md$/,
    description: 'Content factory agent skill definition',
  },
  { pattern: /^apps\/content-factory\/README\.md$/, description: 'Content factory README' },
  {
    pattern: /^apps\/content-factory\/DECISIONS\.md$/,
    description: 'Content factory architecture decisions',
  },
  {
    pattern: /^apps\/content-factory\/biome\.json$/,
    description: 'Content factory Biome configuration',
  },
  {
    pattern: /^apps\/content-factory\/package\.json$/,
    description: 'Content factory package manifest',
  },
  {
    pattern: /^apps\/content-factory\/tsconfig\.json$/,
    description: 'Content factory TypeScript configuration',
  },
  {
    pattern: /^apps\/content-factory\/vitest\.config\.ts$/,
    description: 'Content factory Vitest configuration',
  },
  { pattern: /^apps\/content-factory\/\.gitignore$/, description: 'Content factory gitignore' },
  {
    pattern: /^apps\/content-factory\/\.env\.example$/,
    description: 'Content factory environment template',
  },
  {
    pattern: /^apps\/content-factory\/content\.plan\.example\.yaml$/,
    description: 'Content factory plan example',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/cli\.ts$/,
    description: 'Content factory CLI entry point',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/i18n\/.+\.ts$/,
    description: 'Content factory i18n data',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/lint\/lint\.ts$/,
    description: 'Content factory lint engine',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/lint\/rules\.yaml$/,
    description: 'Content factory lint ruleset',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/phases\/build\.ts$/,
    description: 'Content factory build phase',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/phases\/export\.ts$/,
    description: 'Content factory export phase',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/phases\/gather\.ts$/,
    description: 'Content factory gather phase',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/phases\/render\.ts$/,
    description: 'Content factory render phase',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/providers\/index\.ts$/,
    description: 'LLM provider index / factory',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/providers\/nvidia\.ts$/,
    description: 'NVIDIA LLM provider implementation',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/providers\/stub\.ts$/,
    description: 'Stub LLM provider for testing',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/providers\/types\.ts$/,
    description: 'LLM provider type definitions',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/schema\/core\.schema\.json$/,
    description: 'Content core schema (JSON Schema)',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/schema\/validate-core\.ts$/,
    description: 'Core schema validation logic',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/seo\/metadata\.ts$/,
    description: 'SEO metadata generation',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/templates\/.+\.hbs$/,
    description: 'Content factory Handlebars template',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/tests\/golden\/.+\.ya?ml$/,
    description: 'Content factory golden test fixture',
  },
  {
    pattern: /^apps\/content-factory\/_engine\/tests\/.+\.test\.ts$/,
    description: 'Content factory test',
  },

  // ── GENERIC FALLBACKS (lowest priority) ──
  { pattern: /\.gitkeep$/, description: 'Directory placeholder' },
  { pattern: /\.example$/, description: 'Example / template file' },
  { pattern: /\.json$/, description: 'JSON data or configuration' },
  { pattern: /\.ya?ml$/, description: 'YAML configuration' },
  { pattern: /\.toml$/, description: 'TOML configuration' },
  { pattern: /\.jsonl$/, description: 'JSONL data — line-delimited JSON records' },
  {
    pattern: /\.md$/,
    description: (fp: string) => {
      const name = basename(fp, '.md')
        .replace(/-/g, ' ')
        .replace(/(^|\s)(\w)/g, c => c.toUpperCase())
      const dir = fp.includes('/') ? fp.split('/').slice(0, -1).join('/') : ''
      if (dir) return `Documentation — ${name} (${dir})`
      return `Documentation — ${name}`
    },
  },
  { pattern: /\.css$/, description: 'Stylesheet' },
]

// ─── Inference Engine ────────────────────────────────────────────────────────

function inferDescription(filePath: string): string | null {
  // Skip binary artifacts
  const ext = extname(filePath).toLowerCase()
  if (
    [
      '.lock',
      '.png',
      '.jpg',
      '.jpeg',
      '.gif',
      '.ico',
      '.woff',
      '.woff2',
      '.ttf',
      '.eot',
      '.svg',
      '.zip',
    ].includes(ext)
  ) {
    return null
  }

  for (const h of HEURISTICS) {
    const match = filePath.match(h.pattern)
    if (match) {
      if (typeof h.description === 'function') {
        return h.description(filePath)
      }
      return `${h.description}`
    }
  }

  return null
}

// ─── CODEBASE.md Parser ──────────────────────────────────────────────────────

function parseCodebaseFile(content: string) {
  const lines = content.split('\n')

  // Find header/body split
  let firstHeading = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('### ')) {
      firstHeading = i
      break
    }
  }
  if (firstHeading === -1) throw new Error('Cannot find header/body split')

  const headerLines = lines.slice(0, firstHeading)
  const bodyLines = lines.slice(firstHeading)

  // Parse file entries from body
  const entries: { path: string; description: string; rawLine: string; bodyIndex: number }[] = []
  let inCollapsed = false

  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i]
    if (line.trimStart().startsWith('<!-- gsd:collapsed-descriptions')) {
      inCollapsed = true
      continue
    }
    if (inCollapsed && line.trimStart().startsWith('-->')) {
      inCollapsed = false
      continue
    }
    if (inCollapsed) continue

    const match = line.match(/^- `(.+?)`(?:\s*— (.+))?$/)
    if (match) {
      entries.push({ path: match[1], description: match[2] ?? '', rawLine: line, bodyIndex: i })
    }
  }

  return { headerLines, bodyLines, entries }
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const write = process.argv.includes('--write')
  const projectRoot = process.cwd()
  const codebasePath = join(projectRoot, '.gsd', 'CODEBASE.md')

  if (!existsSync(codebasePath)) {
    console.error('❌ CODEBASE.md not found at', codebasePath)
    console.error('   Run /gsd codebase generate first.')
    process.exit(1)
  }

  const content = readFileSync(codebasePath, 'utf-8')
  const { headerLines, bodyLines, entries } = parseCodebaseFile(content)

  const undescribed = entries.filter(e => !e.description)
  const described = entries.filter(e => e.description)

  console.log(`📊 CODEBASE.md: ${entries.length} files tracked`)
  console.log(
    `   Described: ${described.length} (${Math.round((described.length / entries.length) * 100)}%)`
  )
  console.log(`   Undescribed: ${undescribed.length}`)
  console.log('')

  // Infer descriptions
  let newDesc = 0
  let skipped = 0

  for (const entry of undescribed) {
    const desc = inferDescription(entry.path)
    if (desc && desc.length > 0) {
      // Replace the line in body
      const newLine = `- \`${entry.path}\` — ${desc}`
      bodyLines[entry.bodyIndex] = newLine
      entry.description = desc
      newDesc++
    } else {
      skipped++
    }
  }

  const newContent = `${headerLines.join('\n')}\n${bodyLines.join('\n')}`
  const finalDescribed = entries.filter(e => e.description).length

  console.log(`✅ ${newDesc} files described by heuristics`)
  if (skipped > 0) console.log(`⏭️  ${skipped} files skipped (no heuristic match)`)
  console.log(
    `📈 Coverage: ${Math.round((finalDescribed / entries.length) * 100)}% (${finalDescribed}/${entries.length})`
  )
  console.log('')

  // Show samples
  let shown = 0
  for (const entry of undescribed) {
    if (entry.description && shown < 10) {
      console.log(`  ✅ \`${entry.path}\``)
      console.log(`     → ${entry.description}`)
      shown++
    }
  }
  if (skipped > 0) {
    console.log('\n⏭️  Skipped files (no heuristic match):')
    for (const entry of undescribed) {
      if (!entry.description) console.log(`  · ${entry.path}`)
    }
  }

  if (write) {
    writeFileSync(codebasePath, newContent, 'utf-8')
    console.log(`\n💾 Persisted to ${codebasePath}`)
  } else {
    console.log('\n📋 Dry-run — use --write to persist')
  }
}

main()
