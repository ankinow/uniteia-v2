# 2.5D Editorial Content System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight 2.5D editorial depth system to one real content surface without introducing virtualisation, height caching, or a heavier rendering architecture.

**Architecture:** Build CSS-first depth primitives in `src/global.css`, expose them through two focused Qwik wrappers (`DepthSection` and `DepthCard`), and pilot them only on `NicheLanding` (`/[lang]/n/[niche]`). Keep the existing niche index simple, keep search/indexing concerns out of scope, and preserve all current routes and content loaders.

**Tech Stack:** Bun, Qwik, Qwik City, Tailwind CSS, Playwright, Vitest, Cloudflare Pages.

---

## File Map

- Create: `src/components/depth/types.ts` - shared `DepthPlane` union used by both depth wrappers.
- Create: `src/components/depth-section/index.tsx` - semantic `section` wrapper with `data-depth` markers.
- Create: `src/components/depth-card/index.tsx` - semantic `div` wrapper for grouped editorial surfaces.
- Modify: `src/global.css` - shared depth surfaces, reduced-motion fallback, and `content-visibility` enhancement.
- Modify: `src/components/niche-landing/index.tsx` - pilot the new depth primitives on one real landing page.
- Create: `tests/e2e/s08-editorial-depth.spec.ts` - red-to-green Playwright coverage for the pilot route.
- Create: `tests/e2e/s08-editorial-depth.spec.ts-snapshots/niche-landing-ai-agents-depth-chromium-linux.png` - screenshot baseline for the pilot page.
- Create: `docs/adr/2026-05-08-2p5d-editorial-depth.md` - decision record for the CSS-first depth system and its out-of-scope boundaries.

## Scope Notes

- Do **not** add virtualisation, height caching, scroll observers, or infinite scroll.
- Do **not** touch `src/routes/[lang]/n/index.tsx`; the niche index stays a simple grid.
- Do **not** start the future `ArticleSearch` work in this plan.

### Task 1: Lock the pilot surface with a failing browser spec

**Files:**
- Create: `tests/e2e/s08-editorial-depth.spec.ts`
- Create: `tests/e2e/s08-editorial-depth.spec.ts-snapshots/niche-landing-ai-agents-depth-chromium-linux.png` (generated later when the snapshot is approved)

- [ ] **Step 1: Write the failing test**

```ts
import { expect, test } from '@playwright/test'

test.use({
  viewport: { width: 1440, height: 1200 },
  timezoneId: 'UTC',
})

test.describe('S08 2.5D editorial depth', () => {
  test('niche landing exposes depth planes and stable rendering', async ({ page }) => {
    await page.goto('/en/n/ai-agents', { waitUntil: 'networkidle' })
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    await expect(page.locator('[data-testid="depth-section-front"]')).toBeVisible()
    await expect(page.locator('[data-testid="depth-section-mid"]')).toBeVisible()
    await expect(page.locator('[data-testid="depth-section-back"]')).toBeVisible()

    await expect(page.locator('[data-testid="niche-landing-ai-agents"]')).toHaveScreenshot(
      'niche-landing-ai-agents-depth.png',
      {
        animations: 'disabled',
        maxDiffPixelRatio: 0.01,
      }
    )
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails now**

Run: `bun run test:e2e -- tests/e2e/s08-editorial-depth.spec.ts`

Expected: FAIL because the `data-testid="depth-section-*"` markers do not exist yet and the screenshot baseline is not generated yet.

- [ ] **Step 3: Commit the red test**

```bash
git add tests/e2e/s08-editorial-depth.spec.ts
git commit -m "test(e2e): add depth baseline for niche landing"
```

### Task 2: Add the depth primitives and shared CSS surfaces

**Files:**
- Create: `src/components/depth/types.ts`
- Create: `src/components/depth-section/index.tsx`
- Create: `src/components/depth-card/index.tsx`
- Modify: `src/global.css`

- [ ] **Step 1: Write the new components and shared type**

```ts
// src/components/depth/types.ts
export type DepthPlane = 'front' | 'mid' | 'back'
```

```tsx
// src/components/depth-section/index.tsx
import { type ClassList, Slot, component$ } from '@builder.io/qwik'
import type { DepthPlane } from '~/components/depth/types'

export interface DepthSectionProps {
  depth?: DepthPlane
  class?: ClassList
}

export const DepthSection = component$<DepthSectionProps>(({ depth = 'mid', class: classList }) => {
  return (
    <section
      data-testid={`depth-section-${depth}`}
      data-depth={depth}
      class={['depth-section', classList]}
    >
      <Slot />
    </section>
  )
})
```

```tsx
// src/components/depth-card/index.tsx
import { type ClassList, Slot, component$ } from '@builder.io/qwik'
import type { DepthPlane } from '~/components/depth/types'

export interface DepthCardProps {
  depth?: DepthPlane
  class?: ClassList
}

export const DepthCard = component$<DepthCardProps>(({ depth = 'mid', class: classList }) => {
  return (
    <div data-testid="depth-card" data-depth={depth} class={['depth-card', classList]}>
      <Slot />
    </div>
  )
})
```

```css
/* src/global.css */
@layer utilities {
  .depth-section,
  .depth-card {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--cyan) 12%, transparent);
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--deep) 40%, transparent),
      color-mix(in srgb, var(--void) 92%, transparent)
    );
    box-shadow: 0 18px 40px color-mix(in srgb, black 30%, transparent);
  }

  .depth-section[data-depth='front'] {
    border-color: color-mix(in srgb, var(--cyan) 18%, transparent);
  }

  .depth-section[data-depth='mid'] {
    border-color: color-mix(in srgb, var(--bronze) 16%, transparent);
  }

  .depth-section[data-depth='back'] {
    border-color: color-mix(in srgb, var(--bone-muted) 22%, transparent);
    opacity: 0.98;
  }

  .depth-card {
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--raised) 24%, transparent),
      color-mix(in srgb, var(--void) 90%, transparent)
    );
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, white 5%, transparent),
      0 12px 24px color-mix(in srgb, black 24%, transparent);
  }

  .depth-card[data-depth='front'] {
    border-color: color-mix(in srgb, var(--cyan) 16%, transparent);
  }

  .depth-card[data-depth='mid'] {
    border-color: color-mix(in srgb, var(--bronze) 14%, transparent);
  }

  .depth-card[data-depth='back'] {
    border-color: color-mix(in srgb, var(--bone-muted) 18%, transparent);
  }

  @supports (content-visibility: auto) {
    .depth-section {
      content-visibility: auto;
      contain-intrinsic-size: 1px 640px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .depth-section,
    .depth-card {
      transition: none;
      transform: none;
    }
  }
}
```

- [ ] **Step 2: Run typecheck and lint on the new primitives**

Run:
```bash
bun run typecheck
bun run lint
```

Expected: both exit 0. The E2E spec from Task 1 should still be red until the pilot page uses the new wrappers.

- [ ] **Step 3: Commit the new foundation**

```bash
git add src/components/depth/ src/components/depth-section/ src/components/depth-card/ src/global.css
git commit -m "feat(depth): add editorial depth primitives"
```

### Task 3: Apply the depth system to the niche landing pilot

**Files:**
- Modify: `src/components/niche-landing/index.tsx`

- [ ] **Step 1: Update the pilot page to use the new wrappers**

```tsx
import { DepthCard } from '~/components/depth-card'
import { DepthSection } from '~/components/depth-section'

// ...inside the component render...

<div
  data-testid={`niche-landing-${niche.slug}`}
  class={['max-w-4xl mx-auto px-4 py-8', classList]}
>
  <DepthSection depth="front" class="mb-10">
    <header>
      <div class="flex items-center gap-4 mb-4">
        {iconClass && <div class={iconClass} aria-hidden="true" />}
        <h1 class="text-3xl font-bold text-bone leading-tight">{niche.title[lang]}</h1>
      </div>
      <p class="text-bone-muted text-lg leading-relaxed max-w-2xl">{niche.description[lang]}</p>
    </header>
  </DepthSection>

  <DepthSection depth="mid" class="mb-12" aria-label={t.niche.topicsLabel}>
    <h2 class="text-xl font-semibold text-bone mb-4">
      {t.niche.articleCount.replace('{count}', localizedArticles.length.toString())}
    </h2>
    {localizedArticles.length > 0 ? (
      <DepthCard depth="mid" class="mt-4 p-4 md:p-6">
        <div class="grid grid-cols-1 gap-4">
          {localizedArticles.map(article => (
            <DopamineCard
              key={article.slug}
              title={article.title}
              description={article.summary ?? ''}
              href={`/${lang}/n/${niche.slugs[lang]}/${article.slug}`}
              lang={lang}
              data-testid="article-card"
            />
          ))}
        </div>
      </DepthCard>
    ) : (
      <DepthCard depth="back" class="mt-4 p-8 text-center text-bone-muted">
        <p>{t.niche.exploreNiche.replace('{niche}', niche.title[lang])}</p>
      </DepthCard>
    )}
  </DepthSection>

  {otherNiches.length > 0 && (
    <DepthSection depth="back" aria-label={t.niche.allNiches}>
      <h2 class="text-xl font-semibold text-bone mb-4">{t.niche.allNiches}</h2>
      <DepthCard depth="back" class="mt-4 p-4 md:p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {otherNiches.map(related => (
            <DopamineCard
              key={related.slug}
              title={related.title[lang]}
              description={related.description[lang]}
              href={`/${lang}/n/${getNicheSlug(related, lang)}`}
              icon={related.icon}
              lang={lang}
            />
          ))}
        </div>
      </DepthCard>
    </DepthSection>
  )}
</div>
```

- [ ] **Step 2: Run the browser test and accept the new screenshot baseline**

Run: `bun run test:e2e -- tests/e2e/s08-editorial-depth.spec.ts -u`

Expected: PASS, and the screenshot snapshot file is created under `tests/e2e/s08-editorial-depth.spec.ts-snapshots/`.

- [ ] **Step 3: Commit the pilot integration**

```bash
git add src/components/niche-landing/index.tsx tests/e2e/s08-editorial-depth.spec.ts tests/e2e/s08-editorial-depth.spec.ts-snapshots/
git commit -m "feat(niche-landing): apply 2.5d editorial depth"
```

### Task 4: Record the decision and run the release gates

**Files:**
- Create: `docs/adr/2026-05-08-2p5d-editorial-depth.md`

- [ ] **Step 1: Write the decision record**

```md
# 2.5D Editorial Depth (UniTeia)

## Decision
Use CSS-first depth surfaces (`DepthSection` and `DepthCard`) and pilot them only on `src/components/niche-landing/index.tsx`.

## Why
The repository has only 3 niches, so virtualisation, height caching, and scroll observers are unnecessary and would add cost without solving a real problem.

## Consequences
- `src/global.css` owns the shared visual language.
- `src/components/niche-landing/index.tsx` is the only initial pilot.
- Search and future article indexing stay in a separate plan.
- Existing routes and loaders stay unchanged.
```

- [ ] **Step 2: Run the final validation gates**

Run:
```bash
bun run lint
bun run typecheck
bun run test:e2e -- tests/e2e/s08-editorial-depth.spec.ts
bun run browser:verify
bun run build
bun run size:check
```

Expected: all commands exit 0, existing shell/smoke baselines stay green, and bundle size remains within the current gate.

- [ ] **Step 3: Commit the documentation and verification artefacts**

```bash
git add docs/adr/2026-05-08-2p5d-editorial-depth.md
git commit -m "docs(adr): record 2.5d editorial depth decision"
```

## Spec Coverage Check

- The file map covers the shared depth types, two focused wrappers, global CSS, the pilot landing page, a browser regression test, and the ADR.
- The plan stays scoped to one real page and explicitly excludes virtualisation, height caching, and future search indexing.
- Test strategy is concrete: first a failing Playwright spec, then implementation, then screenshot acceptance, then release gates.
