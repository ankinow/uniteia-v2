# Imported Content Rendering Contract

> Boundary contract between the Content Factory (data generation) and the Site (rendering/layout). Defines responsibilities, prohibitions, and the Content Package Contract each imported module must satisfy.

---

## 1. Context

UniTeia-v2 operates on a strict **Factory → Site** pipeline:

```
Content Factory (generation)  ──►  Content Package  ──►  Site (rendering)
   [multi-agent, async]                [static JSON/MDX]        [Qwik, edge]
```

The Factory generates structured teaching content offline. The Site takes those static packages and renders them as web pages. **They must never leak responsibilities.**

---

## 2. Site Responsibilities (the Frontend)

The Site **MUST** handle:

| Responsibility | Description |
|----------------|-------------|
| **Render** | Convert static content packages into HTML/CSS/JS output |
| **Editorial Layout** | Arrange components (Hero, LessonBlock, AnalogyBox, SummaryBoard, NextLessonCard) according to the teaching structure |
| **Visual Components** | Instantiate DepthCard, HanddrawArrow, HanddrawCircle, Glass variants, 2.5D layers, Signal Grid, etc. |
| **i18n** | Route-based locale detection (`/en/`, `/pt/`, `/es/`), locale normalization, RTL if needed |
| **SEO** | `<title>`, `<meta name="description">`, Open Graph tags, structured data (JSON-LD), canonical URLs |
| **Validation (runtime)** | Check every `href` resolves; verify every `<img>` has `alt`; confirm no broken assets |
| **Accessibility** | Skip-to-content link, focus-visible rings, ARIA roles, keyboard nav, color contrast enforcement |
| **Performance** | Lazy-load below-fold components, code-split by route, honour reduced-motion |
| **Asset delivery** | Serve images, fonts, and icons with proper cache headers and responsive sizes |

---

## 3. Site Prohibitions (what the Frontend MUST NOT do)

The Site is **FORBIDDEN** from:

| Prohibition | Rationale |
|-------------|-----------|
| **Generate content from zero** | Content is produced by the Factory. The Site only renders what it receives. |
| **Decide fonts, colors, tokens** | Visual identity is defined in `design-dna.yaml` and the Design Cookbook — never hardcoded per page. |
| **Rewrite editorial copy** | No LLM calls, no summarization, no paraphrasing in the frontend runtime. |
| **Run multi-agent pipeline** | The Factory pipeline (`entity → core.yaml → blog.md + short.json`) runs offline only. |
| **Depend on Factory runtime** | The Site must never import code from `apps/content-factory/`. All communication is through the static Content Package. |
| **Execute JavaScript in content** | Gray-matter JS execution (`---js`) is disabled at every level. Content is static data. |

---

## 4. Content Package Contract

Every content module ingested by the Site **MUST** include these files at minimum:

```
content/<slug>/
├── manifest.json          # Package metadata, version, locale, timestamps
├── content.<lang>.mdx     # Primary article body (MDX with allowed component tags only)
├── design.md              # Visual overrides per module (optional, uses existing tokens)
├── quality.json           # Quality gate results (readability, coherence, anti-hallucination)
├── sources.json           # Source references and citations used in generation
├── tags.json              # Taxonomy tags for search and filtering
└── blocks/
    ├── hero.json          # LessonHero data
    ├── lesson-01.json     # LessonBlock data
    ├── analogy-01.json    # AnalogyBox data
    ├── summary.json       # SummaryBoard data
    └── next.json          # NextLessonCard data
```

### 4.1 manifest.json

```json
{
  "schema": "1.0",
  "slug": "neural-networks-explained",
  "locale": "en",
  "title": "Neural Networks Explained",
  "description": "Learn how neural networks work in 5 minutes.",
  "generatedAt": "2026-05-12T09:00:00Z",
  "version": "1",
  "factory": "uniteia-factory-v2"
}
```

### 4.2 content.<lang>.mdx

The main article body in MDX. Allowed components: `LessonBlock`, `AnalogyBox`, `SummaryBoard`, `DopamineCard`, `EditorialVerdict`, `NicheCard`, `HanddrawArrow`, `HanddrawCircle`.

**Forbidden in MDX:** raw `<script>` tags, inline styles overriding design tokens, `dangerouslySetInnerHTML`, custom HTML that bypasses components.

### 4.3 quality.json

Output of Factory quality gates:

```json
{
  "readability": { "fleschKincaid": 65, "target": ">= 60" },
  "coherence": { "score": 0.92, "threshold": 0.7 },
  "antiHallucination": { "passed": true },
  "linkIntegrity": { "allResolve": true },
  "assetCheck": { "allImagesHaveAlt": true }
}
```

### 4.4 sources.json

```json
{
  "sources": [
    { "title": "3Blue1Brown - Neural Networks", "url": "https://..." },
    { "title": "Stanford CS231n", "url": "https://..." }
  ]
}
```

### 4.5 tags.json

```json
{
  "tags": ["neural-networks", "deep-learning", "beginners"],
  "niche": "ai-agents"
}
```

---

## 5. Locale Normalization

All locales MUST be normalized **before** being used for routing or display.

| Raw Input | Normalized |
|-----------|------------|
| `pt_br` | `pt-BR` |
| `pt-br` | `pt-BR` |
| `PT-BR` | `pt-BR` |
| `en_us` | `en-US` |
| `en` | `en` |
| `pt` | `pt` |

### Rule

```typescript
function normalizeLocale(raw: string): string {
  const [lang, region] = raw.toLowerCase().split(/[-_]/);
  if (region) return `${lang}-${region.toUpperCase()}`;
  return lang;
}
```

---

## 6. Validation Pipeline (Site-side)

On every build and at runtime in development, the Site MUST run:

1. **Manifest integrity**: every expected file exists
2. **Link resolution**: all `href` values return 200 (or are valid external URLs)
3. **Alt text scan**: every `<img>` in MDX has non-empty `alt`
4. **Token compliance**: no hardcoded colors outside the SolarLanso palette
5. **a11y audit**: focus-visible, ARIA roles, skip-to-content present
6. **Mobile breakpoint test**: layout survives 320px viewport
7. **Block schema validation**: each `blocks/*.json` matches its component's prop interface

---

## 7. Error Boundaries

If a Content Package fails validation:

- **Development**: hard fail with a detailed error log listing every violation
- **Production**: soft fail — render a fallback UI that informs the user the content is temporarily unavailable, log the error, notify the Factory maintainers

---

## 8. Anti-Patterns

| Anti-Pattern | Why It's Harmful |
|---|---|
| Site calls Factory API at render time | Creates tight coupling; Factory should be offline |
| Content package references internal Factory paths | Breaks when package is moved or deployed standalone |
| Site parses MDX with JS execution enabled | Security risk; gray-matter execution must be disabled |
| Hardcoded fallback content in Site components | Masks validation failures; content should come from package |
| Locale stored only in cookie without URL fallback | Breaks SEO and deep linking |
