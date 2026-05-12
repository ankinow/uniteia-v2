# UniTeia v2 — Visual Verification Plan

> Operational quality assurance plan for the frontend.
> Created: 2026-05-12

---

## 1. Verification Strategy

### 1.1 Per-Component Verification
Every component is verified against a defined checklist of visual, accessibility, and code-quality criteria. Components are checked in isolation (Storybook/dev sandbox) and in-context (on actual pages).

### 1.2 Per-Route Verification
Each route is rendered for all 8 locales, checked for correct redirect behavior, content loading, and SSG output.

### 1.3 i18n Per-Locale Verification
All 8 supported languages (en, pt, es, fr, de, it, ja, zh) are verified for correct translations, layout integrity, and character rendering.

### 1.4 Link Integrity Scan
Every `<a>` tag across all `.tsx` files is scanned for empty/missing/malformed `href` attributes, broken internal routes, and external URL validity.

### 1.5 Mobile / Responsive Checks
Layout integrity verified at 320px, 768px, 1024px, and 1440px breakpoints.

### 1.6 Accessibility Audit
WCAG 2.1 AA compliance audit covering: focus management, semantic landmarks, heading hierarchy, color contrast, touch targets, and reduced-motion support.

### 1.7 Performance Budget
CSS-first rendering, compositor-only animations, bundle size ≤85KB gzip, SSG build under 3 seconds.

---

## 2. Component Verification Checklist

### 2.1 Site Structure Components

| Component | File | data-testid | reduced-motion | Responsive | Contrast AA | Keyboard | CSS vars | aria attrs | alt text | href |
|---|---|---|---|---|---|---|---|---|---|---|
| SiteShell | `src/components/site-shell/index.tsx` | site-shell | — | ✅ | ✅ | ✅ | ✅ | ✅ skip-link | — | ✅ #main-content |
| RouterHead | `src/components/router-head/index.tsx` | — | — | — | — | — | — | — | — | — |
| SvgFilters | `src/components/site-shell/svg-filters.tsx` | — | — | — | — | — | ✅ | ✅ aria-hidden | — | — |

### 2.2 Navigation Components

| Component | File | data-testid | reduced-motion | Responsive | Contrast AA | Keyboard | CSS vars | aria attrs | alt text | href |
|---|---|---|---|---|---|---|---|---|---|---|
| NavTree | `src/components/nav-tree/index.tsx` | — | — | ✅ | ✅ | ✅ | ✅ | ✅ aria-current, aria-label | — | ✅ dynamic |
| Sidebar | `src/components/sidebar/index.tsx` | — | — | ✅ | ✅ | — | ✅ | — | — | — |
| SidebarNav | `src/components/sidebar/sidebar-nav.tsx` | — | — | — | ✅ | ✅ | ✅ | — | — | ✅ dynamic |
| AdaptiveHeader | `src/components/adaptive-header/index.tsx` | adaptive-header | — | ✅ | ✅ | — | ✅ | — | — | — |
| LangSwitcher | `src/components/lang-switcher/index.tsx` | lang-switcher, lang-switcher-trigger, lang-switcher-dropdown, lang-option-* | — | ✅ | ✅ | ✅ Escape | ✅ | ✅ aria-expanded, aria-haspopup, role=menu, menuitem, aria-selected, aria-label | — | — |
| LangSelectorCompact | `src/components/lang-switcher/compact.tsx` | — | — | ✅ | ✅ | ✅ | ✅ | — | — | ✅ dynamic |
| Footer | `src/components/footer/index.tsx` | footer, footer-copyright, footer-tagline, footer-links, footer-language | — | ✅ | ✅ | ✅ | ✅ | — | — | ✅ /privacy, /terms, https://github.com/... |

### 2.3 Content Components

| Component | File | data-testid | reduced-motion | Responsive | Contrast AA | Keyboard | CSS vars | aria attrs | alt text | href |
|---|---|---|---|---|---|---|---|---|---|---|
| ArticleFrame | `src/components/article-frame/index.tsx` | article-frame | — | ✅ | ✅ | — | ✅ | — | — | — |
| FrontmatterSlots | `src/components/frontmatter-slots/index.tsx` | frontmatter-slots | — | ✅ | ✅ | — | ✅ | ✅ aria-label (subjects) | — | — |
| EditorialVerdict | `src/components/editorial-verdict/index.tsx` | editorial-verdict | — | — | ✅ | — | ✅ | ✅ aria-label | — | — |
| QualityRing | `src/components/quality-ring/index.tsx` | quality-ring | ✅ via --whisper-duration | — | — | — | ✅ | ✅ role=img, aria-label | — | — |
| SourceLedger | `src/components/source-ledger/index.tsx` | source-ledger | — | ✅ | ✅ | ✅ | ✅ | ✅ aria-label | — | ✅ external URLs |
| JSONLD | `src/components/json-ld.tsx` | — | — | — | — | — | — | — | — | — |
| DepthCard | `src/components/depth-card/index.tsx` | — | ✅ via prefers-reduced-motion | ✅ | ✅ | — | ✅ | — | — | — |
| DepthSection | `src/components/depth-section/index.tsx` | — | ✅ via prefers-reduced-motion | ✅ | ✅ | — | ✅ | — | — | — |

### 2.4 Card & Listing Components

| Component | File | data-testid | reduced-motion | Responsive | Contrast AA | Keyboard | CSS vars | aria attrs | alt text | href |
|---|---|---|---|---|---|---|---|---|---|---|
| DopamineCard | `src/components/dopamine-card/index.tsx` | dopamine-card | ✅ motion-reduce | ✅ | ✅ | ✅ | ✅ --whisper-y, --whisper-duration | ✅ aria-disabled | — | ✅ required |
| NicheCard | `src/components/niche-card/index.tsx` | niche-card-{slug} | — | ✅ | ✅ | ✅ | ✅ | ✅ aria-hidden icon | — | ✅ dynamic |
| NicheLanding | `src/components/niche-landing/index.tsx` | niche-landing-{slug} | — | ✅ | ✅ | — | ✅ | ✅ aria-label sections | — | — |
| DepthCard | `src/components/depth-card/index.tsx` | — | ✅ via global.css | ✅ | ✅ | — | ✅ | — | — | — |

### 2.5 Lesson / Teaching Components

| Component | File | data-testid | reduced-motion | Responsive | Contrast AA | Keyboard | CSS vars | aria attrs | alt text | href |
|---|---|---|---|---|---|---|---|---|---|---|
| LessonHero | `src/components/lesson/lesson-hero.tsx` | lesson-hero | — | ✅ | ✅ | — | ✅ | — | — | — |
| LessonBlock | `src/components/lesson/lesson-block.tsx` | lesson-block | — | ✅ | ✅ | ✅ | ✅ | — | — | ✅ optional action |
| AnalogyBox | `src/components/lesson/analogy-box.tsx` | analogy-box | — | ✅ | ✅ | — | ✅ paper vars | — | — | — |
| SummaryBoard | `src/components/lesson/summary-board.tsx` | summary-board | — | ✅ | ✅ | — | ✅ | — | — | — |
| NextLessonCard | `src/components/lesson/next-lesson-card.tsx` | next-lesson-card | ✅ whisper-hover | ✅ | ✅ | ✅ | ✅ | — | — | ✅ required |

### 2.6 Visual Decorative Components

| Component | File | data-testid | reduced-motion | Responsive | Contrast AA | Keyboard | CSS vars | aria attrs | alt text | href |
|---|---|---|---|---|---|---|---|---|---|---|
| HanddrawArrow | `src/components/visual/handdraw-arrow.tsx` | handdraw-arrow | ✅ @media prefers-reduced-motion | — | — | — | ✅ --draw-duration | ✅ role=img, aria-hidden | — | — |
| HanddrawCircle | `src/components/visual/handdraw-circle.tsx` | handdraw-circle | ✅ @media prefers-reduced-motion | — | — | — | ✅ --draw-duration | ✅ role=img, aria-hidden | — | — |
| ScratchDivider | `src/components/scratch-divider/index.tsx` | scratch-divider | — | — | — | — | ✅ | ✅ aria-hidden | — | — |
| HudLabel | `src/components/hud-label/index.tsx` | hud-label | — | — | ✅ | — | ✅ | ✅ data-tone, data-surface | — | — |

### 2.7 JRPG Components

| Component | File | data-testid | reduced-motion | Responsive | Contrast AA | Keyboard | CSS vars | aria attrs | alt text | href |
|---|---|---|---|---|---|---|---|---|---|---|
| QuestProgress | `src/components/jrpg/quest-progress.tsx` | quest-progress | — | ✅ | ✅ | ✅ tabIndex=0 | ✅ | ✅ role=progressbar, aria-valuenow/min/max, aria-label, aria-current | — | — |

### 2.8 Utility / Functional Components

| Component | File | data-testid | reduced-motion | Responsive | Contrast AA | Keyboard | CSS vars | aria attrs | alt text | href |
|---|---|---|---|---|---|---|---|---|---|---|
| DonationButton | `src/components/donation/index.tsx` | — | — | ✅ | ✅ | ✅ | — | — | — | ✅ https://buymeacoffee.com/lermf |
| NotFound | `src/components/error-pages/not-found.tsx` | error-code, error-title, error-message, error-home-link | — | ✅ | ✅ | ✅ | ✅ | — | — | ✅ / |
| ServerError | `src/components/error-pages/server-error.tsx` | error-code, error-title, error-message, error-retry-button, error-home-link | — | ✅ | ✅ | ✅ | ✅ | — | — | ✅ / |

### 2.9 Page-Level Components (routes)

| Component | Route File | data-testid | Notes |
|---|---|---|---|
| RootRedirect | `src/routes/index.tsx` | — | Redirects / → /{lang}/n via 302 |
| Catchall404 | `src/routes/[...catchall]/index.tsx` | — | Renders NotFound for unmatched routes |
| LangLayout | `src/routes/[lang]/layout.tsx` | — | Validates locale, throws 404 for invalid |
| LangIndex | `src/routes/[lang]/index.tsx` | — | Redirects /{lang} → /{lang}/n via 302 |
| LangNicheIndex | `src/routes/[lang]/n/index.tsx` | niche-index | Shows all niche cards |
| NicheLandingPage | `src/routes/[lang]/n/[niche]/index.tsx` | — | Niche landing with articles |
| ContentArticlePage | `src/routes/[lang]/[...slug]/index.tsx` | — | Content article rendering |
| DogCeoFixture | `src/routes/ops-lab/api-fixtures/dog-ceo/index.tsx` | — | Internal fixture, not indexed |

### 2.10 Global CSS Foundation (checked separately)

| File | Purpose | Verified |
|---|---|---|
| `src/global.css` | CSS variables, tokens, utilities | ✅ |
| `src/root.tsx` | Root component, font preloads, meta | ✅ |

---

## 3. Route Verification

### 3.1 Route Inventory

All routes defined in `src/routes/`:

```
/                           → 302 redirect to /{lang}/n
/[...catchall]               → 404 NotFound page
/[lang]                      → 302 redirect to /{lang}/n
/[lang]/layout.tsx           → locale validation middleware
/[lang]/n                    → niche index page
/[lang]/n/[niche]            → niche landing page
/[lang]/[...slug]            → content article page
/ops-lab/api-fixtures/dog-ceo → internal fixture (noindex)
```

### 3.2 Per-Route Verification Matrix

| Route | /en | /pt | /es | /fr | /de | /it | /ja | /zh | /xx (invalid) |
|---|---|---|---|---|---|---|---|---|---|
| `/` (root) | 302→/en/n | 302→/pt/n | 302→/es/n | 302→/fr/n | 302→/de/n | 302→/it/n | 302→/ja/n | 302→/zh/n | — |
| `/{lang}` | 302→/en/n | 302→/pt/n | 302→/es/n | 302→/fr/n | 302→/de/n | 302→/it/n | 302→/ja/n | 302→/zh/n | 404 |
| `/{lang}/n` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 404 |
| `/{lang}/n/{niche}` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 404/redirect |
| `/{lang}/{slug}` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 404 |
| `/xx/anything` | — | — | — | — | — | — | — | — | 404 |

### 3.3 SSG Generation

- Source: `onStaticGenerate` in `src/routes/[lang]/[...slug]/index.tsx`
- Reads `REGISTRY_PATHS` from `src/content-registry.generated.ts`
- Current count: **19 SSG pages** (varies as content is added)
- Generation params: `{ lang, slug }` pairs for all available content files

### 3.4 Key Route Behaviors

1. **Root `/`** — `onGet` handler in `src/routes/index.tsx` runs `onLanguageNegotiation()` and throws 302 redirect to `/{lang}/n`
2. **`/{lang}`** — `onRequest` handler in `src/routes/[lang]/index.tsx` uses `buildNicheLocaleRedirectPath()` with Accept-Language negotiation and throws 302
3. **Invalid locale `/xx/...`** — `src/routes/[lang]/layout.tsx` calls `isValidLocale()`, throws 404 if invalid
4. **`/{lang}/n`** — Renders `NicheCard` grid from `loadNichesConfig()`
5. **`/{lang}/n/{niche}`** — Validates niche exists, redirects to canonical slug if needed, renders `NicheLanding`
6. **`/{lang}/[...slug]`** — Calls `loadContent()`, renders article or `<NotFound />`

---

## 4. Link Integrity Scan

### 4.1 Search Patterns

```bash
# Check for empty href
grep -rn 'href=""' src/ --include='*.tsx'

# Check for placeholder href
grep -rn 'href="#"' src/ --include='*.tsx'

# Check for root-only href (should use full path in context)
grep -rn 'href="/"' src/ --include='*.tsx'
```

### 4.2 Known Href Values (from audit)

| Location | href | Status |
|---|---|---|
| `src/routes/layout.tsx` — Nav logo | `/` | ✅ Valid root redirect |
| `src/routes/layout.tsx` — Home link | `/` | ✅ Valid |
| `src/routes/layout.tsx` — Topics link | `` /`${lang}/n` `` | ✅ Dynamic |
| `src/components/footer/index.tsx` — Privacy | `/privacy` | ✅ Internal route |
| `src/components/footer/index.tsx` — Terms | `/terms` | ✅ Internal route |
| `src/components/footer/index.tsx` — Source | `https://github.com/ankinow/uniteia-v2` | ✅ External, valid |
| `src/components/donation/index.tsx` | `https://buymeacoffee.com/lermf` | ✅ External, valid |
| `src/components/site-shell/index.tsx` — Skip link | `#main-content` | ✅ Skip-to-content anchor |
| `src/components/sidebar/sidebar-nav.tsx` — Home | `/` | ✅ |
| `src/components/sidebar/sidebar-nav.tsx` — Topics | `` /`${lang}/n` `` | ✅ Dynamic |
| `src/components/sidebar/sidebar-nav.tsx` — Niche links | `` /`${lang}/{slug}` `` | ✅ Dynamic |
| `src/components/lang-switcher/compact.tsx` | `` /`${langInfo.code}/n` `` | ✅ All 8 locales |
| `src/components/error-pages/not-found.tsx` — Home | `/` | ✅ |
| `src/components/error-pages/server-error.tsx` — Home | `/` | ✅ |
| `src/components/niche-card/index.tsx` — Niche link | `` /`${lang}/n/${getNicheSlug()}` `` | ✅ Dynamic |
| `src/components/dopamine-card/index.tsx` | `{href}` prop | ✅ Passed from parent |
| `src/components/niche-landing/index.tsx` — Article links | `` /`${lang}/n/${slug}/${article.slug}` `` | ✅ Dynamic |
| `src/components/lesson/lesson-block.tsx` — Action | `{action.href}` prop | ✅ Passed from parent |
| `src/components/lesson/next-lesson-card.tsx` | `{href}` prop | ✅ Required |
| `src/components/source-ledger/index.tsx` | `{link.url}` external | ✅ Verified URLs |

### 4.3 GitHub / Tencent URL Check

- GitHub URL in footer: `https://github.com/ankinow/uniteia-v2` → ✅ correct
- No Tencent URLs found in any component files.
- No placeholder `https://example.com` or `https://test.com` URLs found.

### 4.4 Language Switcher Href Generation

- `LangSwitcher` (header): builds redirect path by replacing lang segment in current URL → ✅
- `LangSelectorCompact` (sidebar): direct link `/{langInfo.code}/n` → ✅

---

## 5. i18n Visual Check

### 5.1 Supported Locales

| Code | Name | Native Name | i18n File |
|---|---|---|---|
| en | English | English | `src/i18n/en.ts` |
| pt | Portuguese | Português | `src/i18n/pt.ts` |
| es | Spanish | Español | `src/i18n/es.ts` |
| fr | French | Français | `src/i18n/fr.ts` |
| de | German | Deutsch | `src/i18n/de.ts` |
| it | Italian | Italiano | `src/i18n/it.ts` |
| ja | Japanese | 日本語 | `src/i18n/ja.ts` |
| zh | Chinese | 中文 | `src/i18n/zh.ts` |

### 5.2 Translation Keys (all locales)

Each locale implements the `TranslationStrings` interface from `src/i18n/types.ts`:
- `nav` — home, about, blog, projects, contact, topics
- `footer` — copyright, madeWith, links (privacy, terms, source)
- `langSwitcher` — label, current, available
- `errorPages` — 404 (title, message, backHome), 500 (title, message, retry)
- `fallbackBanner` — message, dismiss
- `article` — subjectsLabel, sourcesLabel, published, updated, byAuthor, version, readInLang
- `niche` — topicsLabel, exploreNiche, articleCount, allNiches
- `editorial` — verdictLabel, trusted, caution, flagged, qualityScore, editorialQuality
- `qualityRing` — qualityScore, editorialQuality
- `dopamineCard` — readMore
- `seo` — siteName, articleTitleTemplate, topicsTitle, topicsDescription

### 5.3 Visual Checks for Each Locale

| Check | Status | Notes |
|---|---|---|
| Long text (DE/FR) doesn't break layout | ⚠️ VERIFY | German compound words may overflow containers |
| Japanese text renders correctly | ⚠️ VERIFY | Requires CJK font support (Inter/Geist cover latin only) |
| Chinese text renders correctly | ⚠️ VERIFY | Same as Japanese — verify font fallback chain |
| RTL readiness | ⚠️ NOT YET | No RTL languages supported currently; `dir` attribute not set dynamically |
| Language switcher shows 8 locales | ✅ | `SUPPORTED_LANGUAGES` array has 8 entries |
| hreflang alternates correct | ✅ | Generated in `head` exports of `[lang]/n/index.tsx`, `[lang]/n/[niche]/index.tsx`, and `[lang]/[...slug]/index.tsx` |
| x-default hreflang present | ✅ | Points to `/en/n` or `/en/{slug}` |

### 5.4 Language Switcher Dropdown

- 8 items rendered from `SUPPORTED_LANGUAGES` mapping
- Each shows `nativeName` + `name` (e.g. "日本語 Japanese")
- Current language highlighted with checkmark
- Redirect via `updateLangCookie()` then `window.location.href`

---

## 6. Accessibility Audit

### 6.1 WCAG 2.1 AA Compliance Matrix

| Check | Implementation | WCAG | Status |
|---|---|---|---|
| Skip-to-content link | `src/components/site-shell/index.tsx` line 59-63 | 2.4.1 Bypass Blocks | ✅ Present |
| Focus indicator | `:focus-visible { outline: 2px solid var(--cyan) }` in global.css | 2.4.7 Focus Visible | ✅ Global |
| Focus ring on interactive | `focus:outline-none focus:ring-2 focus:ring-action/50` patterns | 2.4.7 | ✅ Per-component |
| Heading hierarchy | h1 → h2 → h3 structure used throughout | 1.3.1 | ✅ Followed |
| Single h1 per page | AdaptiveHeader uses h1, NicheLanding uses h1 | 1.3.1 | ✅ |
| Color contrast body | `--bone` (#f0e8d8) on `--void` (#0d1117) = ~12.5:1 | 1.4.3 | ✅ Exceeds AA |
| Color contrast muted | `--bone-muted` (#8b949e) on `--void` (#0d1117) = ~5.6:1 | 1.4.3 | ✅ Exceeds AA |
| Touch targets 44x44px | LangSwitcher trigger min-h-[2.5rem], buttons with adequate padding | 2.5.8 | ✅ Mostly |
| prefers-reduced-motion | Global in global.css, per-component in handdraw components, QualityRing, DopamineCard | — | ✅ All animation components |
| Semantic landmarks | `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>` used | 1.3.1 | ✅ |
| aria-label on interactive | LangSwitcher, EditorialVerdict, QualityRing, SourceLedger, QuestProgress | — | ✅ |
| aria-current on nav | NavTree sets `aria-current="page"` for active niche | — | ✅ |
| ARIA roles | `role="menu"`, `menuitem`, `progressbar`, `img` | — | ✅ |
| Keyboard navigation | All links/buttons focusable, Escape closes dropdown | — | ✅ |

### 6.2 Manual Accessibility Checks

1. Tab through every page — verify focus ring is visible on all interactive elements
2. Enable prefers-reduced-motion: reduce in DevTools → all animations must stop
3. Run axe-core on each route → 0 violations
4. Verify screen reader flow: skip link → nav → main content → footer
5. Test lang switcher with keyboard only: Tab to trigger, Enter to open, Arrow keys/Escape to navigate

---

## 7. Performance Budget

### 7.1 CSS-First Rendering

| Rule | Status | Evidence |
|---|---|---|
| No JS for visual effects | ✅ | All animations via CSS (transitions, @keyframes) |
| Animations on compositor-only properties | ✅ | transform, opacity only (no width/height/top/left) |
| No 3D libraries | ✅ | Depth effect uses CSS perspective/translateZ, no Three.js/Babylon |
| No heavy dependencies | ✅ | Minimal deps: qwik, qwik-city, marked, gray-matter, zod |
| Bundle size ≤85KB gzip | ⚠️ VERIFY | `size:check` script enforces threshold (default 60KB) |
| SSG build under 3s | ⚠️ VERIFY | Currently measured via `ship:check` |

### 7.2 Motion Compliance (R012)

| Component | Type | Duration | Compositor | Reduced Motion |
|---|---|---|---|---|
| QualityRing | stroke-dashoffset transition | 250ms | ✅ | ✅ via --whisper-duration |
| DopamineCard | translateY on hover | 250ms | ✅ | ✅ motion-reduce: variant |
| HanddrawArrow | stroke-dashoffset animation | 2s | ✅ | ✅ @media guard |
| HanddrawCircle | stroke-dashoffset animation | 1.5s | ✅ | ✅ @media guard |
| DepthSurface | transform on hover | 200ms | ✅ | ✅ global.css guard |
| Whisper-hover | translateY(-2px) | 200ms | ✅ | ✅ via global.css |

### 7.3 Size Gate Threshold

Current threshold in `scripts/size-gate.ts`: **60KB** (configurable via `--threshold`).
Hard budget: **85KB gzip** maximum per route chunk.

---

## 8. Manual Check Procedure

### Step-by-Step Manual Test

```bash
# Prerequisites: bun run build
# Start preview: bunx wrangler pages dev dist --port 9788
```

**1. Root Redirect**
- Open `/en` → should 302 redirect to `/en/n`
- Open `/fr` → should 302 redirect to `/fr/n`
- Open `/ja` → should 302 redirect to `/ja/n`
- Open `/zh` → should 302 redirect to `/zh/n`

**2. Niche Index**
- Open `/en/n` → should show niche cards grid
- Verify all niches render with correct localized titles
- Verify hreflang alternates in `<head>`

**3. Niche Landing**
- Click any niche card → should navigate to `/en/n/{slug}`
- Verify niche title and description in correct language
- Verify article list (or placeholder if empty)

**4. Content Article**
- Click any article → should navigate to `/en/n/{niche}/{slug}`
- Verify ArticleFrame, AdaptiveHeader, EditorialVerdict, QualityRing render
- Verify FrontmatterSlots metadata displays
- Verify SourceLedger shows referral links
- Verify JSON-LD structured data in `<head>`

**5. Invalid Locale → 404**
- Open `/xx/anything` → should return 404 page
- Verify NotFound component renders with i18n text
- Verify "back home" link works

**6. Invalid Route → 404**
- Open `/en/nonexistent-route` → should return 404
- Verify catchall route works

**7. Sidebar Links**
- Verify all sidebar links navigate to correct URLs
- Verify language switcher in sidebar shows all 8 locales
- Verify donation button links to BuyMeACoffee

**8. Language Switcher**
- Open dropdown → verify all 8 locales listed with native names
- Switch to each language → verify URL changes to `/{code}/n`
- Switch to Japanese → verify page renders
- Switch to Chinese → verify page renders

**9. Footer Links**
- Click Privacy → should navigate to `/privacy`
- Click Terms → should navigate to `/terms`
- Click Source → should open GitHub in new tab

**10. Mobile 320px**
- Resize browser to 320px width
- Verify no horizontal scroll
- Verify nav adapts (sidebar hidden on mobile)
- Verify language switcher remains functional

**11. Tab Navigation**
- Press Tab repeatedly → verify focus ring visible on each element
- Verify skip-to-content link appears on first Tab press
- Verify all interactive elements reachable

**12. Reduced Motion**
- Enable `prefers-reduced-motion: reduce` in DevTools
- Verify QualityRing does not animate
- Verify HanddrawArrow/Circle appear fully drawn
- Verify DopamineCard hover effects disabled

**13. Color Contrast Check**
- Use a color contrast analyzer on:
  - Body text (#f0e8d8 on #0d1117) → ~12.5:1 ✅
  - Muted text (#8b949e on #0d1117) → ~5.6:1 ✅
  - Links (#00e5ff on #0d1117) → ~7.0:1 ✅

**14. SSG Generation**
- Run `bun run build` → verify SSG generates correct number of pages
- Current: 19 pages (verify count matches `REGISTRY_PATHS`)

**15. Full Quality Gate**
```bash
bun run ship:check
```
- Verify all steps pass: lint → typecheck → test:unit → build → header → size → slug → content → sitemap → lighthouse → smoke → invalid-locale

---

## 9. Automation Commands

### 9.1 Full Quality Gate

```bash
# Run the complete pre-deploy verification pipeline
bun run ship:check

# This runs sequentially:
# 1. lint          — biome check
# 2. typecheck     — tsc --noEmit
# 3. test:unit     — vitest run
# 4. build         — qwik build (SSG)
# 5. header:single — verify CSP/security headers
# 6. size:check    — route size budget gate
# 7. slug:check    — slug lint
# 8. content:check — validate content .md files
# 9. sitemap:check — verify sitemap generation
# 10. lighthouse:check — Lighthouse audit on /en/n/
# 11. smoke:200s   — smoke test critical routes
# 12. invalid-locale-404 — verify invalid locale returns 404
```

### 9.2 Standalone Checks

```bash
# Linting
bun run lint                    # Biome static analysis

# Type checking
bun run typecheck               # TypeScript no-emit check

# Unit tests
bun run test:unit               # Vitest test suite

# Full build (includes content registry generation)
bun run build                   # generate:content-registry → qwik build

# Route size budget
bun run size:check              # Verifies each route chunk ≤ threshold

# Content validation
bun run content:check           # Validates all content/*.md files

# Slug validation
bun run slug:check              # Checks slug formatting consistency

# Sitemap
bun run scripts/check-sitemap.ts  # Verifies sitemap completeness

# Lighthouse audit
bun run lighthouse:check        # Performance/a11y/best-practices on /en/n/

# Smoke tests
bun run scripts/smoke-test.ts   # HTTP 200 checks on critical URLs

# Invalid locale 404 check
bun run scripts/check-invalid-locale.ts  # /xx/anything → 404

# E2E browser verification
bun run browser:verify          # Playwright smoke + visual tests

# Post-deploy check
bun run scripts/post-deploy-check.ts  # Live site verification

# Header verification (bash)
bash scripts/verify-headers.sh  # Security header verification
```

### 9.3 Custom Verification Scripts

```bash
# Visual regression (via Playwright)
npx playwright test tests/e2e/s05-shell-visual.spec.ts

# Accessibility audit with Lighthouse CI
bun run lighthouse:check --audit-path /en/n/

# Content package import verification
bun run import:package          # Verify imported content integrity
```

---

## 10. Reporting Template

### Visual Verification Report Template

```markdown
# UniTeia Visual Verification Report

**Date:** {YYYY-MM-DD}
**Build:** {commit-sha}
**Environment:** {production|staging|preview}
**Tester:** {name|ci-runner}

---

## Summary

| Area | Pass/Fail | Issues |
|---|---|---|
| Components | ✅/❌ | {count} |
| Routes | ✅/❌ | {count} |
| i18n | ✅/❌ | {count} |
| Link Integrity | ✅/❌ | {count} |
| Mobile/Responsive | ✅/❌ | {count} |
| Accessibility | ✅/❌ | {count} |
| Performance Budget | ✅/❌ | {count} |

---

## Component Results

| Component | data-testid | reduced-motion | Responsive | Contrast | Keyboard | CSS vars | aria | alt | href |
|---|---|---|---|---|---|---|---|---|---|
| SiteShell | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| ... | | | | | | | | | |

**Failed Components:** {list}

---

## Route Results

| Route | EN | PT | ES | FR | DE | IT | JA | ZH | /xx |
|---|---|---|---|---|---|---|---|---|---|
| / | 302 | 302 | 302 | 302 | 302 | 302 | 302 | 302 | — |
| /{lang} | 302 | 302 | 302 | 302 | 302 | 302 | 302 | 302 | 404 |
| /{lang}/n | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 404 |
| /{lang}/n/{niche} | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 404 |
| /{lang}/{slug} | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 404 |

**SSG Pages Generated:** {count}/19
**Failed Routes:** {list}

---

## i18n Results

| Locale | Nav | Footer | Error Pages | Article | Niche | Editorial | Layout |
|---|---|---|---|---|---|---|---|
| en | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| pt | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| es | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| fr | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| de | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| it | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ja | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| zh | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Localization Coverage:** {count}/8 locales complete
**Layout Breaks:** {list}

---

## Link Integrity Results

| Check | Pass/Fail | Details |
|---|---|---|
| href="" | ✅/❌ | {count} occurrences |
| href="#" | ✅/❌ | {count} occurrences |
| Broken internal | ✅/❌ | {count} |
| External valid | ✅/❌ | {count} |
| GitHub URL | ✅/❌ | {url} |
| Tencent URL | ✅/❌ | {url} |

---

## Accessibility Results

| Check | Pass/Fail | Violations |
|---|---|---|
| Skip-to-content | ✅/❌ | — |
| Focus-visible | ✅/❌ | {count} |
| Heading hierarchy | ✅/❌ | {count} |
| Color contrast | ✅/❌ | {count} |
| Touch targets | ✅/❌ | {count} |
| Reduced motion | ✅/❌ | {count} |
| aria attributes | ✅/❌ | {count} |
| Alt text | ✅/❌ | {count} |
| axe-core violations | ✅/❌ | {count} |

---

## Performance Budget

| Metric | Threshold | Actual | Pass/Fail |
|---|---|---|---|
| Bundle size (gzip) | 85KB | {size}KB | ✅/❌ |
| SSG build time | 3s | {time}s | ✅/❌ |
| Lighthouse performance | 90 | {score} | ✅/❌ |
| Lighthouse a11y | 90 | {score} | ✅/❌ |

---

## Issues Found

### P0 — Blocker
{list}

### P1 — High
{list}

### P2 — Medium
{list}

### P3 — Low
{list}

---

## Ship Check Report

```json
{paste ship:check output here}
```

---

## Sign-off

- [ ] Visual verification complete
- [ ] All P0/P1 issues resolved
- [ ] ship:check passes
- [ ] Signed off by: {name}
```

---

## Appendix A: Component File Inventory

Complete list of all component files (44 files across 22 component directories):

```
src/components/
├── adaptive-header/
│   └── index.tsx
├── article-frame/
│   └── index.tsx
├── depth-card/
│   └── index.tsx
├── depth-section/
│   └── index.tsx
├── depth/
│   └── types.ts
├── donation/
│   └── index.tsx
├── dopamine-card/
│   ├── index.tsx
│   └── types.ts
├── editorial-verdict/
│   ├── index.tsx
│   └── types.ts
├── error-pages/
│   ├── not-found.tsx
│   └── server-error.tsx
├── footer/
│   ├── index.tsx
│   └── types.ts
├── frontmatter-slots/
│   ├── index.tsx
│   └── types.ts
├── hud-label/
│   └── index.tsx
├── json-ld.tsx
├── jrpg/
│   └── quest-progress.tsx
├── lang-switcher/
│   ├── compact.tsx
│   ├── index.tsx
│   └── types.ts
├── lesson/
│   ├── analogy-box.tsx
│   ├── lesson-block.tsx
│   ├── lesson-hero.tsx
│   ├── next-lesson-card.tsx
│   └── summary-board.tsx
├── nav-tree/
│   └── index.tsx
├── niche-card/
│   ├── index.tsx
│   └── types.ts
├── niche-landing/
│   ├── index.tsx
│   └── types.ts
├── quality-ring/
│   ├── index.tsx
│   └── types.ts
├── router-head/
│   └── index.tsx
├── scratch-divider/
│   └── index.tsx
├── sidebar/
│   ├── index.tsx
│   ├── sidebar-nav.tsx
│   └── styles.css
├── site-shell/
│   ├── index.tsx
│   └── svg-filters.tsx
├── source-ledger/
│   └── index.tsx
└── visual/
    ├── handdraw-arrow.tsx
    └── handdraw-circle.tsx
```

## Appendix B: Route File Inventory

```
src/routes/
├── index.tsx                        → Root redirect / → /{lang}/n
├── layout.tsx                       → Root layout (nav, sidebar, footer)
├── [...catchall]/
│   └── index.tsx                    → 404 catchall
├── [lang]/
│   ├── layout.tsx                   → Locale validation middleware
│   ├── index.tsx                    → /{lang} redirect to /{lang}/n
│   ├── index.test.ts                → Route redirect tests
│   ├── n/
│   │   ├── index.tsx                → Niche index page
│   │   └── [niche]/
│   │       ├── index.tsx            → Niche landing page
│   │       └── types.ts             → Niche route data types
│   └── [...slug]/
│       ├── index.tsx                → Content article page
│       └── types.ts                 → Content route types
└── ops-lab/
    └── api-fixtures/
        └── dog-ceo/
            └── index.tsx            → Internal fixture (noindex)
```

## Appendix C: Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| @builder.io/qwik | ^1.19.2 | Framework |
| @builder.io/qwik-city | ^1.19.2 | Router + SSG |
| @fontsource-variable/inter | ^5.2.8 | Body font |
| @fontsource/geist-sans | ^5.2.5 | Display font |
| @fontsource/jetbrains-mono | ^5.2.8 | Monospace font |
| @modular-forms/qwik | ^0.24.0 | Forms |
| gray-matter | ^4.0.3 | MDX frontmatter parsing |
| marked | ^18.0.2 | Markdown rendering |
| zod | ^4.4.3 | Schema validation |
| tailwindcss | ^3 | Utility CSS |
| vitest | ^4.1.5 | Unit testing |
| @playwright/test | ^1.59.1 | E2E testing |
| lighthouse | ^13.1.0 | Performance audits |
