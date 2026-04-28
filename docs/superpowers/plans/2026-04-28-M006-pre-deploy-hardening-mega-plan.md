# M006: Pre-Deploy Hardening — Mega Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> 
> **Execution Mode:** Swarm-ready (parallel subagents) + Ralph Loop (auto-continuation) + PI (prompt intelligence layering)

**Goal:** Transform UniTeia v2 from "GO-WITH-CONDITIONS" (81/100) to production-ready state with all 9 ship-check gates green, culminating in apex domain activation at uniteia.com.

**Architecture:** 8-phase hardening pipeline with content-first navigation, i18n hardened routing, security headers (A+ grade), and performance optimization (81% → 90%+). Uses Qwik-City edge-native SSR with Cloudflare Pages deployment.

**Tech Stack:** Bun 1.x + Qwik-City 2.x + TypeScript 5.8 (strict) + TailwindCSS 3.x + PostCSS pipeline + Cloudflare Pages + Playwright (E2E) + Vitest (unit) + Biome (lint) + Lighthouse CI

**GSD Context:** Active milestone M006, Slice S08 evaluating gates, 6 active requirements (R014, R016, R017, R019, R020, R021), 15 validated, 0 deferred.

**Ralph Loop Integration:** Each task checkpoint triggers `/ralph-loop checkpoint` for auto-continuation. Failed gates spawn remediation subagents automatically.

**PI Layering:** Prompts include previous context hashes for coherence across subagent swarm.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Swarm Architecture](#swarm-architecture)
3. [Phase S01: Diagnose Duplicate Header](#phase-s01-diagnose-duplicate-header)
4. [Phase S02: Auto-Derived Navigation](#phase-s02-auto-derived-navigation)
5. [Phase S03: Content Gap Fill](#phase-s03-content-gap-fill)
6. [Phase S04: i18n Routing Hardening](#phase-s04-i18n-routing-hardening)
7. [Phase S05: SEO Sitemap Meta](#phase-s05-seo-sitemap-meta)
8. [Phase S06: Perf A11y Security](#phase-s06-perf-a11y-security)
9. [Phase S07: Ship-Check Gate](#phase-s07-ship-check-gate)
10. [Phase S08: Apex Flip (HUMAN GATE)](#phase-s08-apex-flip-human-gate)
11. [Swarm Coordination Protocol](#swarm-coordination-protocol)
12. [Ralph Loop Triggers](#ralph-loop-triggers)

---

## Executive Summary

### Current State (M005 Exit)
- ✅ M001-M004 complete
- ✅ E2E tests: 24/24 passing
- ✅ Content validation: 8/8 passing
- ⚠️ Ship-check: 6/9 gates (lighthouse blocked at 81% vs 95% required)
- ⚠️ Duplicate `<header>` element on niche routes
- ⚠️ Performance: 81% (need 90%+)
- ⚠️ Security headers: missing CSP, Permissions-Policy

### Target State (M006 Exit)
- ✅ Ship-check: 9/9 gates green
- ✅ Lighthouse mobile: ≥90 Performance, ≥95 A11y/SEO/Best-Practices
- ✅ securityheaders.com: Grade A+
- ✅ curl `/en | grep -c '<header'` = 1 (single header)
- ✅ `/xx/anything` returns 404 for invalid locales
- ✅ Auto-derived navigation from content scan
- ✅ Sitemap passes xmllint with hreflang alternates
- ✅ Apex domain: uniteia.com live (HUMAN GATE)

### Execution Strategy
```
Swarm Pattern: "Wave & Validate"
├── Wave 1 (Parallel): S01, S03 (diagnostics + content stubs)
├── Wave 2 (Sequential): S02 → S04 (nav → i18n)
├── Wave 3 (Parallel): S05, S06 (seo + perf/security)
├── Wave 4 (Validation): S07 (ship-check)
└── Wave 5 (Manual): S08 (apex flip - HUMAN GATE)
```

---

## Swarm Architecture

### Subagent Types

| Type | Responsibility | Concurrency | Skills |
|------|---------------|-------------|--------|
| `diagnostic` | Root cause analysis, evidence gathering | 3 | debug-like-expert, systematic-debugging |
| `frontend` | Qwik components, TSX, CSS | 5 | react-best-practices, make-interfaces-feel-better |
| `backend` | Middleware, loaders, utilities | 4 | api-design, observability |
| `qa` | Tests, assertions, gates | 3 | test, tdd, verification-before-completion |
| `security` | Headers, CSP, audits | 2 | security-review, best-practices |
| `seo` | Meta, sitemap, structured data | 2 | web-quality-audit |
| `devops` | Scripts, CI, deployment | 2 | github-workflows |

### Communication Protocol
- **State Store:** `.gsd/projects/8a9776d89b51/swarm-state/`
- **Checkpoint Files:** `M006-S{slice}-T{task}-checkpoint.json`
- **Log Aggregation:** `journal/M006-{timestamp}.jsonl`
- **PI Context Hash:** SHA256 of previous 3 successful prompts

---

## Phase S01: Diagnose Duplicate Header

**Goal:** Identify and eliminate duplicate `<header>` elements. `curl /en/n | grep -c '<header'` must return 1.

**Depends On:** None  
**Risk:** Multiple root causes possible  
**Swarm Slots:** 1 diagnostic + 1 frontend

### File Map
- `src/components/site-shell/index.tsx:65` - SiteShell header wrapper
- `src/components/adaptive-header/index.tsx:29` - AdaptiveHeader component
- `src/routes/[lang]/n/index.tsx:38` - Niche index page header
- `src/components/niche-landing/index.tsx:28` - Niche landing header (potentially unused)

### Task S01-T01: Evidence Gathering (Diagnostic Subagent)

**Files:**
- Read: `src/components/site-shell/index.tsx`
- Read: `src/components/adaptive-header/index.tsx`
- Read: `src/routes/[lang]/n/index.tsx`
- Read: `src/components/niche-landing/index.tsx`
- Read: `src/components/error-pages/server-error.tsx`

**Steps:**
- [ ] **Step 1: Run grep to locate all header elements**
  ```bash
  grep -rn "<header" src/ --include="*.tsx" | head -20
  ```
  Expected: List of files with line numbers

- [ ] **Step 2: Build and serve for inspection**
  ```bash
  bun run build
  bunx wrangler pages dev dist --compatibility-date=2026-04-01 --port=8788 &
  sleep 5
  curl -s http://localhost:8788/en | grep -o "<header[^>]*>" | wc -l
  ```
  Expected: Currently returns 2 (should be 1)

- [ ] **Step 3: Generate diagnostic report**
  Create: `audit/S01-header-diagnostic.md`
  Content: Document header hierarchy, nesting, duplicate causes

- [ ] **Step 4: Commit diagnostic evidence**
  ```bash
  git add audit/S01-header-diagnostic.md
  git commit -m "docs(audit): S01 header diagnostic evidence"
  ```

### Task S01-T02: Header Deduplication (Frontend Subagent)

**Files:**
- Modify: `src/components/site-shell/index.tsx:65` - Remove wrapper or make optional
- Modify: `src/routes/[lang]/n/index.tsx:38` - Use semantic element or remove
- Modify: `src/components/adaptive-header/index.tsx:29` - Ensure single header output

**Steps:**
- [ ] **Step 1: Write failing test**
  Create: `src/components/site-shell/site-shell.test.tsx`
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { render } from '@testing-library/qwik';
  import { SiteShell } from './index';
  
  describe('SiteShell', () => {
    it('renders exactly one header element', async () => {
      const { screen } = await render(<SiteShell><div>Content</div></SiteShell>);
      const headers = screen.queryAllByTestId('site-header');
      expect(headers).toHaveLength(1);
    });
  });
  ```

- [ ] **Step 2: Run test to verify failure**
  ```bash
  bun run test:unit -- src/components/site-shell/site-shell.test.tsx
  ```
  Expected: FAIL (duplicate headers detected)

- [ ] **Step 3: Implement deduplication**
  Edit: `src/components/site-shell/index.tsx`
  - Remove nested `<header>` if AdaptiveHeader already renders one
  - OR: Convert SiteShell wrapper to `<div role="banner">`
  - OR: Pass `header={false}` prop to AdaptiveHeader

- [ ] **Step 4: Run test to verify pass**
  ```bash
  bun run test:unit -- src/components/site-shell/site-shell.test.tsx
  ```
  Expected: PASS

- [ ] **Step 5: Verify with curl**
  ```bash
  bun run build
  bunx wrangler pages dev dist --compatibility-date=2026-04-01 --port=8788 &
  curl -s http://localhost:8788/en | grep -o "<header[^>]*>" | wc -l
  ```
  Expected: 1

- [ ] **Step 6: Commit**
  ```bash
  git add src/components/site-shell/
  git commit -m "fix(shell): deduplicate header elements - S01"
  ```

**Checkpoint Trigger:** `/ralph-loop checkpoint S01`

---

## Phase S02: Auto-Derived Navigation

**Goal:** Replace hardcoded menu items with filesystem-driven navigation at build time. Policy: hide-if-missing.

**Depends On:** S03 (content stubs exist)  
**Risk:** Glob may slow dev server  
**Swarm Slots:** 2 frontend + 1 backend + 1 qa

### File Map
- Create: `src/utils/nav-builder.ts` - Build-time nav tree generator
- Create: `src/utils/nav-builder.test.ts` - Unit tests
- Create: `src/components/nav-tree/index.tsx` - SSR Nav component
- Modify: `src/components/site-shell/index.tsx` - Integrate NavTree
- Modify: `src/routes/layout.tsx` - Pass nav data

### Content Structure
```
content/
├── {niche}/
│   ├── {lang}/
│   │   ├── _index.md          # Section index
│   │   ├── {slug}.md         # Articles
│   │   └── {category}/
│   │       └── {slug}.md
```

### Task S02-T01: Nav Builder Utility (Backend Subagent)

**Files:**
- Create: `src/utils/nav-builder.ts`
- Create: `src/utils/nav-builder.test.ts`

**Steps:**
- [ ] **Step 1: Write failing test for nav tree generation**
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { buildNavTree } from './nav-builder';
  
  describe('buildNavTree', () => {
    it('returns empty array for empty content dir', () => {
      const nav = buildNavTree('test/fixtures/empty-content');
      expect(nav).toEqual([]);
    });
    
    it('builds nav from _index.md files', () => {
      const nav = buildNavTree('test/fixtures/sample-content');
      expect(nav).toHaveLength(1);
      expect(nav[0].slug).toBe('singularity');
      expect(nav[0].locales).toContain('en');
    });
  });
  ```

- [ ] **Step 2: Run test to verify failure**
  ```bash
  bun run test:unit -- src/utils/nav-builder.test.ts
  ```
  Expected: FAIL (function not defined)

- [ ] **Step 3: Implement nav builder**
  ```typescript
  // src/utils/nav-builder.ts
  import { readFileSync, readdirSync, statSync } from 'fs';
  import { join, parse } from 'path';
  import matter from 'gray-matter';
  
  export interface NavItem {
    slug: string;
    title: string;
    locales: string[];
    children: NavItem[];
    hasContent: boolean;
  }
  
  export function buildNavTree(contentRoot: string): NavItem[] {
    // Implementation: scan content/{niche}/{lang}/_index.md
    // Build tree with hide-if-missing policy
  }
  ```

- [ ] **Step 4: Run test to verify pass**
  ```bash
  bun run test:unit -- src/utils/nav-builder.test.ts
  ```
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/utils/nav-builder.ts src/utils/nav-builder.test.ts
  git commit -m "feat(nav): build-time navigation tree generator - S02-T01"
  ```

### Task S02-T02: NavTree Component (Frontend Subagent)

**Files:**
- Create: `src/components/nav-tree/index.tsx`
- Create: `src/components/nav-tree/nav-tree.test.tsx`

**Steps:**
- [ ] **Step 1: Write component with hide-if-missing logic**
  ```typescript
  // src/components/nav-tree/index.tsx
  import { component$ } from '@builder.io/qwik';
  import type { NavItem } from '~/utils/nav-builder';
  
  interface NavTreeProps {
    items: NavItem[];
    currentLocale: string;
    currentNiche: string;
  }
  
  export const NavTree = component$<NavTreeProps>(({ items, currentLocale }) => {
    // Filter items by current locale availability (hide-if-missing)
    const visibleItems = items.filter(item => 
      item.locales.includes(currentLocale) && item.hasContent
    );
    
    return (
      <nav aria-label="Main navigation">
        <ul>
          {visibleItems.map(item => (
            <li key={item.slug}>
              <a href={`/${currentLocale}/${item.slug}`}>{item.title}</a>
            </li>
          ))}
        </ul>
      </nav>
    );
  });
  ```

- [ ] **Step 2: Write tests**
  ```typescript
  // Test: hides items without locale content
  // Test: shows items with _index.md present
  ```

- [ ] **Step 3: Run tests**
  ```bash
  bun run test:unit -- src/components/nav-tree/
  ```

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/nav-tree/
  git commit -m "feat(nav): NavTree component with hide-if-missing - S02-T02"
  ```

### Task S02-T03: Integration with SiteShell (Frontend Subagent)

**Files:**
- Modify: `src/components/site-shell/index.tsx`
- Modify: `src/routes/layout.tsx`

**Steps:**
- [ ] **Step 1: Add nav data to layout loader**
  ```typescript
  // src/routes/layout.tsx
  export const useNavData = routeLoader$(() => {
    const nav = buildNavTree('./content');
    return nav;
  });
  ```

- [ ] **Step 2: Pass nav to SiteShell**
  ```typescript
  // In layout.tsx
  const nav = useNavData();
  return <SiteShell nav={nav.value}>{...}</SiteShell>;
  ```

- [ ] **Step 3: Render NavTree in SiteShell**
  ```typescript
  // SiteShell renders NavTree with nav prop
  ```

- [ ] **Step 4: E2E verification**
  ```bash
  bun run test:e2e tests/e2e/nav-derived.spec.ts
  ```

- [ ] **Step 5: Commit**
  ```bash
  git add src/components/site-shell/ src/routes/layout.tsx
  git commit -m "feat(nav): integrate NavTree into SiteShell - S02-T03"
  ```

**Checkpoint Trigger:** `/ralph-loop checkpoint S02`

---

## Phase S03: Content Gap Fill

**Goal:** Create minimum viable content stubs to enable navigation and build.

**Depends On:** None  
**Risk:** Placeholder confusion  
**Swarm Slots:** 1 backend (stub generator)

### Task S03-T01: Content Stub Generator (Backend Subagent)

**Files:**
- Create: `scripts/generate-content-stubs.ts`
- Create: `content/singularity/en/_index.md`
- Create: `content/singularity/pt/_index.md`
- Create: `content/hardware/en/_index.md`

**Steps:**
- [ ] **Step 1: Define stub schema**
  ```yaml
  # _index.md frontmatter
  title: "Singularity"
  description: "AI Singularity content hub"
  updated: "2026-04-28"
  ---
  # Stub content
  ```

- [ ] **Step 2: Generate stubs**
  ```bash
  bun run scripts/generate-content-stubs.ts
  ```

- [ ] **Step 3: Validate stubs pass content:check**
  ```bash
  bun run content:check
  ```
  Expected: PASS

- [ ] **Step 4: Commit**
  ```bash
  git add content/
  git commit -m "content(stubs): add _index.md stubs for all niches/locales - S03"
  ```

**Checkpoint Trigger:** `/ralph-loop checkpoint S03`

---

## Phase S04: i18n Routing Hardening

**Goal:** Invalid locales return 404 (not redirect). Valid locales: en, pt, es, ja, zh.

**Depends On:** S02 (nav tree knows valid locales)  
**Risk:** CJK font conditionals  
**Swarm Slots:** 1 backend + 1 qa + 1 frontend

### File Map
- Modify: `src/routes/[lang]/index.tsx` - Add 404 for invalid locales
- Modify: `functions/[[route]].ts` - Edge middleware validation
- Modify: `src/i18n/middleware.ts` - Locale validation
- Create: `tests/e2e/i18n-404.spec.ts`

### Task S04-T01: Locale Validation Middleware (Backend Subagent)

**Files:**
- Modify: `src/i18n/middleware.ts`
- Modify: `src/i18n/locale-validation.ts`

**Steps:**
- [ ] **Step 1: Write failing test for invalid locale 404**
  ```typescript
  // tests/e2e/i18n-404.spec.ts
  import { test, expect } from '@playwright/test';
  
  test('/xx returns 404', async ({ page }) => {
    const response = await page.goto('/xx');
    expect(response?.status()).toBe(404);
  });
  
  test('/de returns 404 (not redirect)', async ({ page }) => {
    const response = await page.goto('/de');
    expect(response?.status()).toBe(404);
    expect(response?.url()).not.toContain('/en');
  });
  ```

- [ ] **Step 2: Run test to verify failure**
  ```bash
  bun run test:e2e tests/e2e/i18n-404.spec.ts
  ```
  Expected: FAIL (currently may 200 or redirect)

- [ ] **Step 3: Implement locale validation**
  ```typescript
  // src/i18n/locale-validation.ts
  export const VALID_LOCALES = ['en', 'pt', 'es', 'ja', 'zh'] as const;
  export type ValidLocale = typeof VALID_LOCALES[number];
  
  export function isValidLocale(locale: string): locale is ValidLocale {
    return VALID_LOCALES.includes(locale as ValidLocale);
  }
  
  // In middleware or route
  export const onGet: RequestHandler = ({ params, status }) => {
    if (!isValidLocale(params.lang)) {
      throw status(404);
    }
  };
  ```

- [ ] **Step 4: Run test to verify pass**
  ```bash
  bun run test:e2e tests/e2e/i18n-404.spec.ts
  ```
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add src/i18n/ tests/e2e/i18n-404.spec.ts
  git commit -m "feat(i18n): invalid locales return 404 - S04-T01"
  ```

### Task S04-T02: CJK Font Conditionals (Frontend Subagent)

**Files:**
- Modify: `src/utils/font-conditions.ts`
- Modify: `src/root.tsx`

**Steps:**
- [ ] **Step 1: Add conditional font loading**
  ```typescript
  // Load Noto Sans JP for Japanese, Noto Sans SC for Chinese
  // Only when locale matches
  ```

- [ ] **Step 2: Test font loading**
  ```bash
  bun run test:unit -- src/utils/font-conditions.test.ts
  ```

- [ ] **Step 3: Commit**
  ```bash
  git add src/utils/font-conditions.ts
  git commit -m "feat(i18n): CJK conditional font loading - S04-T02"
  ```

**Checkpoint Trigger:** `/ralph-loop checkpoint S04`

---

## Phase S05: SEO Sitemap Meta

**Goal:** Sitemap includes all routes, `<lastmod>` from frontmatter, hreflang alternates. Passes xmllint.

**Depends On:** S02 (nav tree), S04 (hreflang)  
**Risk:** robots.txt switch  
**Swarm Slots:** 1 seo + 1 backend

### File Map
- Modify: `src/routes/sitemap.xml/index.tsx` - Dynamic sitemap generation
- Modify: `public/robots.txt` - Production-ready rules
- Create: `src/utils/schema-generators.ts` - JSON-LD helpers

### Task S05-T01: Dynamic Sitemap Generation (Backend Subagent)

**Files:**
- Modify: `src/routes/sitemap.xml/index.tsx`

**Steps:**
- [ ] **Step 1: Write test for sitemap structure**
  ```typescript
  // tests/e2e/sitemap.spec.ts
  import { test, expect } from '@playwright/test';
  
  test('sitemap passes xmllint', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const xml = await response?.text();
    
    // Must have urlset, lastmod, hreflang alternates
    expect(xml).toContain('<urlset');
    expect(xml).toContain('<lastmod>');
    expect(xml).toContain('hreflang');
  });
  ```

- [ ] **Step 2: Implement dynamic sitemap**
  ```typescript
  // src/routes/sitemap.xml/index.tsx
  import { buildNavTree } from '~/utils/nav-builder';
  
  export const onGet: RequestHandler = async ({ html }) => {
    const nav = buildNavTree('./content');
    const urls = generateSitemapUrls(nav); // Include all locales
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${urls.map(url => `
    <url>
      <loc>${url.loc}</loc>
      <lastmod>${url.lastmod}</lastmod>
      ${url.alternates.map(alt => `
      <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}" />`).join('')}
    </url>`).join('')}
  </urlset>`;
    
    throw html(200, sitemap);
  };
  ```

- [ ] **Step 3: Test with xmllint**
  ```bash
  curl -s http://localhost:8788/sitemap.xml > /tmp/sitemap.xml
  xmllint --noout /tmp/sitemap.xml && echo "Valid XML"
  ```
  Expected: "Valid XML"

- [ ] **Step 4: Commit**
  ```bash
  git add src/routes/sitemap.xml/ tests/e2e/sitemap.spec.ts
  git commit -m "feat(seo): dynamic sitemap with hreflang - S05-T01"
  ```

### Task S05-T02: JSON-LD Structured Data (SEO Subagent)

**Files:**
- Modify: `src/components/json-ld.tsx`
- Modify: `src/routes/[lang]/[niche]/[slug]/index.tsx`

**Steps:**
- [ ] **Step 1: Generate Article schema**
  ```typescript
  // Article schema with headline, author, datePublished, dateModified
  ```

- [ ] **Step 2: Generate WebSite schema for landing**

- [ ] **Step 3: Validate with Google Rich Results Test**
  ```bash
  # Manual: open https://search.google.com/test/rich-results
  # Paste URL: https://uniteia-v2.pages.dev/en/singularity
  ```

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/json-ld.tsx
  git commit -m "feat(seo): JSON-LD Article and WebSite schemas - S05-T02"
  ```

**Checkpoint Trigger:** `/ralph-loop checkpoint S05`

---

## Phase S06: Perf A11y Security

**Goal:** Lighthouse ≥90 Performance, ≥95 A11y/SEO/Best-Practices. Security headers A+.

**Depends On:** S01 (header fix)  
**Risk:** CSP nonce integration with Qwik resumability  
**Swarm Slots:** 1 security + 1 frontend + 1 qa

### File Map
- Modify: `public/_headers` - Security headers
- Create: `scripts/generate-csp-nonce.ts` - Nonce generator
- Modify: `src/entry.cloudflare-pages.tsx` - Inject nonce
- Modify: `src/global.css` - Performance optimizations

### Task S06-T01: Security Headers (Security Subagent)

**Files:**
- Modify: `public/_headers`

**Steps:**
- [ ] **Step 1: Define security headers**
  ```
  /*
    Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{NONCE}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
    Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  ```

- [ ] **Step 2: Test headers with curl**
  ```bash
  curl -I https://uniteia-v2.pages.dev/en | grep -E "(CSP|X-Frame|Permissions)"
  ```

- [ ] **Step 3: Commit**
  ```bash
  git add public/_headers
  git commit -m "feat(security): A+ grade security headers - S06-T01"
  ```

### Task S06-T02: CSP Nonce Integration (Security Subagent)

**Files:**
- Modify: `src/entry.cloudflare-pages.tsx`
- Modify: `src/root.tsx`

**Steps:**
- [ ] **Step 1: Generate nonce at edge**
  ```typescript
  // In entry.cloudflare-pages.tsx
  const nonce = crypto.randomUUID();
  ```

- [ ] **Step 2: Pass nonce to Qwik**
  ```typescript
  // Inject nonce into Qwik context
  ```

- [ ] **Step 3: Validate nonce in CSP**

- [ ] **Step 4: Commit**
  ```bash
  git add src/entry.cloudflare-pages.tsx
  git commit -m "feat(security): CSP nonce injection at edge - S06-T02"
  ```

### Task S06-T03: Performance Optimizations (Frontend Subagent)

**Files:**
- Modify: `src/global.css`
- Modify: `vite.config.ts`

**Steps:**
- [ ] **Step 1: Critical CSS inline**
  - Extract above-fold CSS
  - Inline in `<head>`

- [ ] **Step 2: Font preloading**
  ```html
  <link rel="preload" href="/fonts/geist-sans.woff2" as="font" type="font/woff2" crossorigin>
  ```

- [ ] **Step 3: Image optimization**
  - Add width/height to prevent CLS
  - Lazy load below-fold images

- [ ] **Step 4: Lighthouse audit**
  ```bash
  bun run lighthouse:check
  ```
  Target: Performance ≥90

- [ ] **Step 5: Commit**
  ```bash
  git add src/global.css vite.config.ts
  git commit -m "perf(lighthouse): optimizations for 90+ score - S06-T03"
  ```

**Checkpoint Trigger:** `/ralph-loop checkpoint S06`

---

## Phase S07: Ship-Check Gate

**Goal:** `bun run ship:check` exits 0 with all 9 gates passing.

**Depends On:** S05 (SEO), S06 (perf/security)  
**Risk:** Lighthouse may fail  
**Swarm Slots:** 1 devops + 2 qa + 1 diagnostic

### Task S07-T01: Ship-Check Orchestration (DevOps Subagent)

**Files:**
- Modify: `scripts/ship-check.ts`
- Create: `scripts/gates/validate-all.ts`

**Steps:**
- [ ] **Step 1: Define all 9 gates**
  1. Build passes
  2. Lint + types pass
  3. Single header (S01)
  4. Sitemap valid (S05)
  5. Smoke 200s
  6. Invalid locale 404 (S04)
  7. Lighthouse thresholds (S06)
  8. Content validation (R021)
  9. Security headers (S06)

- [ ] **Step 2: Implement gate runner**
  ```typescript
  // scripts/ship-check.ts
  const gates = [
    { name: 'build', run: () => exec('bun run build') },
    { name: 'lint', run: () => exec('bun run lint') },
    { name: 'single-header', run: () => checkHeaderCount() },
    // ... etc
  ];
  
  for (const gate of gates) {
    console.log(`Running gate: ${gate.name}`);
    await gate.run();
  }
  ```

- [ ] **Step 3: Test ship-check locally**
  ```bash
  bun run ship:check
  ```
  Expected: All gates green, exit 0

- [ ] **Step 4: Commit**
  ```bash
  git add scripts/ship-check.ts scripts/gates/
  git commit -m "feat(ci): ship-check with 9 gates - S07-T01"
  ```

### Task S07-T02: Gate Failure Remediation (Diagnostic Subagent)

**PI Trigger:** If any gate fails, spawn remediation subagent with:
```
Context: Gate {name} failed with {error}
Previous fix attempts: {count}
Required skill: {domain-specific}
Ralph command: /ralph-loop remediate {gate}
```

**Steps:**
- [ ] **Step 1: Parse gate failure output**
- [ ] **Step 2: Identify root cause**
- [ ] **Step 3: Dispatch domain-specific subagent**
- [ ] **Step 4: Re-run gate**
- [ ] **Step 5: Update checkpoint**

**Checkpoint Trigger:** `/ralph-loop checkpoint S07`

---

## Phase S08: Apex Flip (HUMAN GATE)

**Goal:** Activate uniteia.com with DNS backup and rollback runbook.

**Depends On:** S07 (ship-check green)  
**Risk:** Irreversible propagation  
**Swarm Slots:** NONE — Human only

### Prerequisites
- [ ] S07 ship-check exits 0
- [ ] Rollback runbook exists at `docs/runbooks/rollback-apex.md`
- [ ] DNS backup captured
- [ ] LERMF sign-off obtained

### Task S08-T01: Pre-Flip Validation (Manual)

**Steps:**
- [ ] **Step 1: Verify preview URL green**
  ```bash
  curl -s https://uniteia-v2.pages.dev/en | head -5
  bun run ship:check
  ```

- [ ] **Step 2: Check Cloudflare Pages status**
  - Build successful
  - No deployment errors

- [ ] **Step 3: Review rollback runbook**
  ```bash
  cat docs/runbooks/rollback-apex.md
  ```

### Task S08-T02: Apex Activation (HUMAN GATE)

**Steps:**
- [ ] **Step 1: DNS apex record**
  ```
  Type: A
  Name: @
  Content: 192.0.2.1 (Cloudflare Pages IP)
  TTL: Auto
  ```

- [ ] **Step 2: CNAME www**
  ```
  Type: CNAME
  Name: www
  Content: uniteia-v2.pages.dev
  ```

- [ ] **Step 3: Verify propagation**
  ```bash
  dig uniteia.com +short
  curl -I https://uniteia.com/en
  ```

- [ ] **Step 4: Submit sitemap**
  - Google Search Console
  - Bing Webmaster Tools

- [ ] **Step 5: Sign-off**
  ```bash
  echo "S08 complete - LERMF $(date)" >> M006-S08-COMPLETE.txt
  git add M006-S08-COMPLETE.txt
  git commit -m "deploy(apex): uniteia.com activated - S08"
  git push origin main
  ```

**HUMAN GATE ACKNOWLEDGMENT REQUIRED**

---

## Swarm Coordination Protocol

### Subagent Dispatch Template

```yaml
subagent_id: "M006-S{slice}-T{task}-{uuid}"
type: "frontend|backend|qa|security|seo|devops|diagnostic"
parent: "mega-plan-orchestrator"
context_hash: "sha256:{previous_prompts}"
skills_required:
  - "skill-name"
input_artifacts:
  - "path/to/file.ts"
output_artifacts:
  - "path/to/output.ts"
  - "checkpoint.json"
success_criteria:
  - "test passes"
  - "build succeeds"
rollback_on_failure: true
ralph_integration: 
  checkpoint: "/ralph-loop checkpoint {slice}-{task}"
  remediate: "/ralph-loop remediate {slice}-{task}"
```

### State Synchronization

1. **Pre-task:** Read latest checkpoint from `.gsd/projects/8a9776d89b51/swarm-state/`
2. **During:** Write progress every 2 minutes
3. **Post-task:** Write checkpoint + commit
4. **Failure:** Write failure context + spawn remediation subagent

---

## Ralph Loop Triggers

### Checkpoints
- `/ralph-loop checkpoint S01` — After header deduplication
- `/ralph-loop checkpoint S02` — After nav integration
- `/ralph-loop checkpoint S03` — After content stubs
- `/ralph-loop checkpoint S04` — After i18n hardening
- `/ralph-loop checkpoint S05` — After SEO sitemap
- `/ralph-loop checkpoint S06` — After perf/security
- `/ralph-loop checkpoint S07` — After ship-check green
- `/ralph-loop checkpoint S08` — After human sign-off

### Remediation Patterns
```
/ralph-loop remediate {slice}-{task} --with-context={failure_log}
```

### Auto-Continuation Rules
1. If checkpoint exists and tests pass → auto-advance to next task
2. If checkpoint exists but tests fail → spawn diagnostic subagent
3. If no checkpoint → start from beginning of phase
4. If 3 failures on same task → escalate to human

---

## PI Context Layering

### Prompt Template for Subagents

```
# PI Context Hash: {sha256}
# Parent Task: M006-S{slice}-T{task}
# Dependencies: [{list}]
# Previous Failures: {count}

You are implementing: {task_description}

## Context from GSD
- Active Milestone: M006
- State: {current_state}
- Blockers: {list}
- Decisions: {relevant D00x}

## Constraints from AGENTS.md
- Stack: Qwik-City + Cloudflare Pages
- Budget: 60KB gzip per route
- Contrast: 15.2:1 (AAA)
- No React, No GSAP, No glassmorphism

## Output Requirements
- TDD: Test first, then implement
- DRY: Reuse existing utilities
- YAGNI: No speculative features
- Commit: Every checkpoint

## Ralph Commands Available
- /ralph-loop checkpoint
- /ralph-loop remediate
- /ralph-loop status

Begin implementation now.
```

---

## Success Criteria Summary

| Gate | Target | Verification |
|------|--------|--------------|
| Build | Pass | `bun run build` exits 0 |
| Lint + Types | Pass | `bun run lint && bun run typecheck` |
| Single Header | 1 | `curl /en \| grep -c '<header'` = 1 |
| Sitemap Valid | XML | `xmllint --noout sitemap.xml` |
| Smoke 200s | All routes | `bun run test:e2e smoke.spec.ts` |
| Invalid Locale 404 | Returns 404 | `curl -I /xx` → 404 |
| Lighthouse | ≥90/95/95/95 | `bun run lighthouse:check` |
| Content Check | Pass | `bun run content:check` |
| Security Headers | A+ | securityheaders.com scan |
| Ship-Check | 9/9 | `bun run ship:check` exits 0 |
| Apex Live | uniteia.com | DNS resolves, HTTPS works |

---

**Plan Generated:** 2026-04-28
**GSD Project:** 8a9776d89b51
**Milestone:** M006 Pre-Deploy Hardening
**Execution Mode:** Swarm + Ralph + PI
**Human Gate:** S08 (apex flip)

**Next Action:** Initialize Swarm Wave 1 (S01 + S03 parallel) via subagent-driven-development.
