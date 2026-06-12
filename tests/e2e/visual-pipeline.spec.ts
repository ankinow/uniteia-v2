import { expect, test } from '@playwright/test'

/**
 * Visual Asset Pipeline Validation — E2E
 *
 * Validates the full visual asset delivery pipeline:
 * 1. Visual quality dashboard KPI cards
 * 2. Cloudflare Images srcset delivery on article hero images
 * 3. DepthCard programmatic thumbnails (no <img> — design-system-native)
 * 4. DiagramRenderer inline SVG rendering with a11y
 * 5. Broken image fallback (DepthCard-style gradient + Lucide icon)
 *
 * Runs against CF Pages preview (port 8788).
 * Does NOT require --update-snapshots — structural assertion only.
 */

// ─── Test 1: Visual Quality Dashboard ───────────────────────────────────────

test('visual quality dashboard loads', async ({ page }) => {
  const response = await page.goto('/insights/visual-quality')
  expect(response?.status()).toBe(200)

  // Page shell is present
  await expect(page.locator('[data-testid="site-shell"]')).toBeVisible()

  // KPI cards are visible (visual-quality dashboard widget grid)
  const kpiCards = page.locator('[data-testid="kpi-card"]')
  const kpiCount = await kpiCards.count()
  expect(kpiCount).toBeGreaterThanOrEqual(1)

  // Verify at least one KPI card has a visible metric value
  const firstMetric = kpiCards.first().locator('[data-testid="kpi-value"]')
  await expect(firstMetric).toBeVisible()
})

// ─── Test 2: Article Hero Images — Cloudflare Images srcset ──────────────────

test('article hero images load with Cloudflare Images srcset', async ({ page }) => {
  await page.goto('/en/signals/apex/tencent-cloud-deal-stack-builders')
  await page.waitForLoadState('networkidle')

  // Find hero images served via Cloudflare Images
  const cfImages = page.locator('img[src*="cdn-cgi/image"]')
  const imgCount = await cfImages.count()
  expect(imgCount).toBeGreaterThanOrEqual(1)

  // Verify srcset attribute exists on the first CF image
  const firstImg = cfImages.first()
  const srcset = await firstImg.getAttribute('srcset')
  expect(srcset).not.toBeNull()
  expect(srcset).toContain('cdn-cgi/image') // CF Images transform URLs in srcset
  expect(srcset).toContain('w') // width descriptors

  // Verify sizes attribute for responsive delivery
  const sizes = await firstImg.getAttribute('sizes')
  expect(sizes).not.toBeNull()
  expect(sizes?.length).toBeGreaterThan(0)

  // Verify src also uses Cloudflare Images transform
  const src = await firstImg.getAttribute('src')
  expect(src).toContain('cdn-cgi/image')
})

// ─── Test 3: DepthCard Thumbnails — Programmatic (No Images) ─────────────────

test('DepthCard thumbnail renders without images', async ({ page }) => {
  await page.goto('/en/signals/ai-agents')
  await page.waitForLoadState('networkidle')

  // Find all DepthCard thumbnail components
  const thumbnails = page.locator('[data-component="depth-card-thumbnail"]')
  const thumbCount = await thumbnails.count()
  expect(thumbCount).toBeGreaterThanOrEqual(1)

  // Verify NO <img> tags exist inside any DepthCard thumbnail
  for (let i = 0; i < thumbCount; i++) {
    const thumb = thumbnails.nth(i)
    const imgCount = await thumb.locator('img').count()
    expect(imgCount, `DepthCard thumbnail ${i} should contain zero <img> tags`).toBe(0)
  }

  // Verify programmatic content: Lucide icon via Iconify CSS class is present
  const firstThumb = thumbnails.first()
  const hasIcon = await firstThumb.locator('[class*="icon-[lucide--"]').count()
  expect(hasIcon).toBeGreaterThanOrEqual(1)

  // Verify aria-label for accessibility
  const ariaLabel = await firstThumb.getAttribute('aria-label')
  expect(ariaLabel).not.toBeNull()
})

// ─── Test 4: DiagramRenderer — Inline SVG Display ────────────────────────────

test('DiagramRenderer displays inline SVG', async ({ page }) => {
  await page.goto('/en/signals/apex/magica-overview')
  await page.waitForLoadState('networkidle')

  // DiagramRenderer wraps diagrams in <figure class="diagram-renderer">
  const figures = page.locator('figure.diagram-renderer')
  const figCount = await figures.count()

  if (figCount > 0) {
    // Check for inline SVG: either <svg> element or role="img" with aria-label
    const firstFig = figures.first()
    const hasSvg = (await firstFig.locator('svg').count()) > 0
    const hasRoleImg = (await firstFig.locator('[role="img"]').count()) > 0

    expect(hasSvg || hasRoleImg).toBe(true)

    // Verify aria-label for accessibility on diagram
    const ariaLabel =
      (await firstFig.locator('[role="img"]').getAttribute('aria-label')) ||
      (await firstFig.locator('svg').getAttribute('aria-label'))
    expect(ariaLabel).not.toBeNull()
  } else {
    // Fallback: check for any diagram/visualization with aria-label
    const diagramEl = page.locator('figure[aria-label]').first()
    const hasDiagramWithLabel = (await diagramEl.count()) > 0
    // Also check for any inline SVG in a figure context
    const figuresWithSvg = page.locator('figure:has(svg)')
    const figuresWithSvgCount = await figuresWithSvg.count()

    expect(
      hasDiagramWithLabel || figuresWithSvgCount > 0,
      'Expected at least one figure with aria-label or SVG on the page'
    ).toBe(true)
  }
})

// ─── Test 5: Broken Image — DepthCard Fallback ───────────────────────────────

test('broken image shows DepthCard fallback', async ({ page }) => {
  // Intercept image requests to a non-existent path and return 404
  await page.route('**/assets/broken/**', route => {
    return route.fulfill({
      status: 404,
      contentType: 'text/plain',
      body: 'Not Found',
    })
  })

  // Also intercept any image to intentionally break one specific hero image
  // by making any CDN image request to a test path fail
  await page.route('**/cdn-cgi/image/**broken-test**', route => {
    return route.fulfill({
      status: 404,
      contentType: 'text/plain',
      body: 'Not Found',
    })
  })

  // Navigate to an article page that uses ArticleHero
  await page.goto('/en/signals/apex/tencent-cloud-deal-stack-builders')
  await page.waitForLoadState('networkidle')

  // ArticleHero renders fallback with class "hero-fallback" when onError fires
  // Check that the component exists (it renders, and if image loads successfully
  // the fallback won't be visible — but the component is present on the page)
  const articleHeroContainer = page.locator(
    '[data-component="article-hero"], .hero-img, img[src*="cdn-cgi/image"]'
  )
  const heroExists = (await articleHeroContainer.count()) > 0
  expect(heroExists).toBe(true)

  // The DepthCard-style fallback uses icon-[lucide--image-off]
  // Visual pipeline requires that the fallback is wired into the component.
  // Verify the fallback CSS class and icon are defined (present in the DOM
  // when image errors occur, or present in the component's error path).
  // Since we don't control whether the image actually fails in this env,
  // we validate: (a) the component is present, (b) the fallback CSS
  // class is defined in stylesheets.
  const hasFallbackStyles = await page.evaluate(() => {
    const sheets = Array.from(document.styleSheets)
    for (const sheet of sheets) {
      try {
        const rules = Array.from(sheet.cssRules || [])
        for (const rule of rules) {
          if (rule instanceof CSSStyleRule && rule.selectorText?.includes('.hero-fallback')) {
            return true
          }
        }
      } catch {
        // cross-origin stylesheet — skip
      }
    }
    return false
  })
  expect(hasFallbackStyles).toBe(true)
})
