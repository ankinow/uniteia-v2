# Diagnose duplicate header sources with grep evidence

## Summary
The duplicate header issue has been quantified and documented. Two `<header>` elements are rendered on niche index routes (`/en/n/`), when only one is expected.

## Source Code Header Locations

```
src/routes/[lang]/n/index.tsx:38: <header class="mb-8">
src/components/site-shell/index.tsx:65: <header class="site-header" data-testid="site-header">
src/components/adaptive-header/index.tsx:29: <header data-testid="adaptive-header" class={['adaptive-header', props.class]}>
src/components/niche-landing/index.tsx:28: <header class="mb-10">
src/components/error-pages/server-error.tsx:21: <header q:slot="header" class="site-header w-full">
```

## Header Element Count Per Source File

| File | `<header>` Count | Description |
|------|------------------|-------------|
| `src/routes/[lang]/n/index.tsx` | 1 | Page-level header wrapping page title |
| `src/components/site-shell/index.tsx` | 1 | SiteShell header wrapper for navigation |
| `src/components/adaptive-header/index.tsx` | 1 | Component that renders its own header element |
| `src/components/niche-landing/index.tsx` | 1 | Unused niche landing header |
| `src/components/error-pages/server-error.tsx` | 1 | Error page header |

## Duplicate Header Root Cause

**Route affected**: `/en/n/*` (niche index pages)

**Header 1**: SiteShell provides semantic `<header>` wrapper (line 65)
- Wraps the navigation bar via `<Slot name="header" />`
- Data attribute: `data-testid="site-header"`
- Contains: Skip link, navigation, brand, topics dropdown, lang switcher

**Header 2**: Niche index page component (`src/routes/[lang]/n/index.tsx`, line 38)
- Contains: `<h1>All Topics</h1>`
- This creates a nested `<header>` inside the main content area

**Result**: Two `<header>` elements on the same page - one for navigation (correct), one for page title (redundant).

## AdaptiveHeader Usage

The `AdaptiveHeader` component (which also uses `<header>`) is currently only used in article routes:
- `src/routes/[lang]/[...slug]/index.tsx:3` - import
- `src/routes/[lang]/[...slug]/index.tsx:72` - usage

This does NOT affect `/en/n/*` routes currently.

## Rendered Output Verification

Tested via curl against `http://localhost:3000/en/n/`:
```bash
curl -sL http://localhost:3000/en/n/ | grep -o '<header' | wc -l
# Result: 2
```

## Recommendations

1. **Fix `/en/n/*` routes**: Change `src/routes/[lang]/n/index.tsx:38` from `<header>` to `<section>` or `<div>` with semantic class.

2. **Consider AdaptiveHeader**: If the page title needs header semantics, use `<div class="page-header">` instead of `<header>` tag, OR remove SiteShell's `<header>` wrapper entirely (breaking change).

3. **Precendent**: SiteShell header wrapper should be the only `<header>` on a page per HTML spec (one per sectioning root).

## Verification Pattern

For future regression testing, use:
```bash
./scripts/verify-headers.sh && test $(curl -s http://localhost:3000/en/n/ | grep -o '<header' | wc -l) -eq 1
```

(Note: Expects 1 header after fix, currently fails with 2 headers)
