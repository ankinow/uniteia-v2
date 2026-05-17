import { expect, test } from '@playwright/test'

test.use({
  timezoneId: 'UTC',
  viewport: { width: 1440, height: 1200 },
})

test.describe('S07 dopamine budget store', () => {
  test('re-seeds the route whisper budget when navigating between shell routes', async ({
    page,
  }) => {
    await page.goto('/en/signals/ai-agents', { waitUntil: 'domcontentloaded' })

    const shell = page.locator('[data-testid="site-shell"]')
    const cards = page.locator('[data-testid="dopamine-card"]')

    await expect(shell).toHaveAttribute('data-dopamine-shell-whisper-state', 'ready')
    await expect(shell).toHaveAttribute('data-dopamine-shell-route-remaining', '0')
    await expect(cards).toHaveCount(4)
    await expect(cards.first()).toHaveAttribute('data-dopamine-whisper-state', 'armed')
    await expect(cards.nth(1)).toHaveAttribute('data-dopamine-whisper-state', 'armed')

    await cards.nth(1).click() // language-models
    await page.waitForURL(/\/en\/signals\/language-models/)

    await expect(shell).toHaveAttribute('data-dopamine-shell-path', '/en/signals/language-models')
    await expect(shell).toHaveAttribute('data-dopamine-shell-whisper-state', 'ready')
    await expect(shell).toHaveAttribute('data-dopamine-shell-route-remaining', '0')
    await expect(page.locator('[data-testid="dopamine-card"]')).toHaveCount(4)
    await expect(page.locator('[data-testid="dopamine-card"]').first()).toHaveAttribute(
      'data-dopamine-whisper-state',
      'armed'
    )
  })

  test('re-seeds the session whisper budget for a fresh browser page', async ({ page }) => {
    await page.goto('/en/signals/apex/tencent-cloud-deal-stack-builders', {
      waitUntil: 'networkidle',
    })

    const shell = page.locator('[data-testid="site-shell"]')

    await expect(shell).toHaveAttribute('data-dopamine-shell-whisper-state', 'ready')
    await expect(shell).toHaveAttribute('data-dopamine-shell-session-remaining', '1')

    const freshPage = await page.context().newPage()
    try {
      await freshPage.goto('/en/signals/apex/tencent-cloud-deal-stack-builders', {
        waitUntil: 'domcontentloaded',
      })

      const freshShell = freshPage.locator('[data-testid="site-shell"]')

      await expect(freshShell).toHaveAttribute('data-dopamine-shell-whisper-state', 'ready')
      await expect(freshShell).toHaveAttribute('data-dopamine-shell-session-remaining', '1')
    } finally {
      await freshPage.close()
    }
  })
})
