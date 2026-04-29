import { expect, test } from '@playwright/test'

test.use({
  timezoneId: 'UTC',
  viewport: { width: 1440, height: 1200 },
})

test.describe('S07 dopamine budget store', () => {
  test('re-seeds the route whisper budget when navigating between shell routes', async ({
    page,
  }) => {
    await page.goto('/en/n/ai-agents', { waitUntil: 'domcontentloaded' })

    const shell = page.locator('[data-testid="site-shell"]')
    const cards = page.locator('[data-testid="dopamine-card"]')

    await expect(shell).toHaveAttribute('data-dopamine-shell-whisper-state', 'ready')
    await expect(shell).toHaveAttribute('data-dopamine-shell-route-remaining', '0')
    await expect(cards).toHaveCount(4)
    await expect(cards.first()).toHaveAttribute('data-dopamine-whisper-state', 'armed')
    await expect(cards.nth(1)).toHaveAttribute('data-dopamine-whisper-state', 'armed')

    await cards.nth(2).click() // language-models
    await page.waitForURL(/\/en\/n\/language-models/)

    await expect(shell).toHaveAttribute('data-dopamine-shell-path', '/en/n/language-models')
    await expect(shell).toHaveAttribute('data-dopamine-shell-whisper-state', 'ready')
    await expect(shell).toHaveAttribute('data-dopamine-shell-route-remaining', '0')
    await expect(page.locator('[data-testid="dopamine-card"]')).toHaveCount(4)
    await expect(page.locator('[data-testid="dopamine-card"]').first()).toHaveAttribute(
      'data-dopamine-whisper-state',
      'armed'
    )
  })

  test('re-seeds the session whisper budget for a fresh browser page', async ({ page }) => {
    await page.goto('/en/test-article', { waitUntil: 'networkidle' })

    const shell = page.locator('[data-testid="site-shell"]')
    const ring = page.locator('[data-testid="quality-ring"]')

    await expect(shell).toHaveAttribute('data-dopamine-shell-whisper-state', 'ready')
    await expect(shell).toHaveAttribute('data-dopamine-shell-session-remaining', '0')
    await expect(ring).toHaveAttribute('data-dopamine-whisper-scope', 'session')
    await expect(ring).toHaveAttribute('data-dopamine-whisper-state', 'armed')

    const freshPage = await page.context().newPage()
    try {
      await freshPage.goto('/en/test-article', { waitUntil: 'domcontentloaded' })

      const freshShell = freshPage.locator('[data-testid="site-shell"]')
      const freshRing = freshPage.locator('[data-testid="quality-ring"]')

      await expect(freshShell).toHaveAttribute('data-dopamine-shell-whisper-state', 'ready')
      await expect(freshShell).toHaveAttribute('data-dopamine-shell-session-remaining', '0')
      await expect(freshRing).toHaveAttribute('data-dopamine-whisper-scope', 'session')
      await expect(freshRing).toHaveAttribute('data-dopamine-whisper-state', 'armed')
    } finally {
      await freshPage.close()
    }
  })
})
