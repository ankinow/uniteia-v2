import { type Page, expect, test } from '@playwright/test'

// ── Constants ──────────────────────────────────────────────────────────

const TRACKED_ROUTES = [
  '/en/signals',
  '/en/signals/apex/tencent-cloud-deal-stack-builders',
  '/en/signals/ai-agents',
] as const

interface FuzzCase {
  label: string
  path: string
  /** Expected behavior: 'no-crash' means the server handles it gracefully (normalizes or serves 4xx). 'strict-4xx' requires a 4xx response. */
  expectedHandling: 'no-crash' | 'strict-4xx'
}

const FUZZ_CASES: FuzzCase[] = [
  // UTF-8 emoji in path
  { label: 'emoji in path', path: '/en/signals/emoji-🔫-test', expectedHandling: 'strict-4xx' },
  { label: 'emoji in subdir', path: '/en/🔥/blazing-path', expectedHandling: 'no-crash' },

  // Directory traversal
  {
    label: 'double-dot traversal',
    path: '/en/signals/../../../etc/passwd',
    expectedHandling: 'strict-4xx',
  },
  {
    label: 'encoded traversal',
    path: '/en/signals/%2e%2e%2f%2e%2e%2f',
    expectedHandling: 'strict-4xx',
  },
  {
    label: 'deep traversal',
    path: '/en/../../../../../../../../etc/shadow',
    expectedHandling: 'strict-4xx',
  },

  // Malformed paths
  { label: 'double slash', path: '/en/signals//', expectedHandling: 'no-crash' },
  { label: 'dot segment', path: '/en/signals/./', expectedHandling: 'no-crash' },
  { label: 'null byte', path: '/en/signals/%00', expectedHandling: 'strict-4xx' },
  { label: 'con device (Windows)', path: '/en/signals/con', expectedHandling: 'strict-4xx' },

  // Query pollution
  {
    label: 'prototype pollution',
    path: '/en/signals/?__proto__[polluted]=true',
    expectedHandling: 'no-crash',
  },
  {
    label: 'xss in query',
    path: '/en/signals/?q=<script>alert(1)</script>',
    expectedHandling: 'no-crash',
  },
  {
    label: 'long query string',
    path: `/en/signals/?${'a'.repeat(5000)}=${'b'.repeat(5000)}`,
    expectedHandling: 'no-crash',
  },

  // HTML injection in path
  {
    label: 'script tag in path',
    path: '/en/signals/<script>alert(1)</script>',
    expectedHandling: 'strict-4xx',
  },
  {
    label: 'SQL injection',
    path: "/en/signals/'; DROP TABLE users--",
    expectedHandling: 'strict-4xx',
  },

  // Long paths
  { label: 'long path (500 chars)', path: `/en/${'a'.repeat(500)}`, expectedHandling: 'no-crash' },
  {
    label: 'very long path (2000 chars)',
    path: `/en/${'b'.repeat(2000)}`,
    expectedHandling: 'no-crash',
  },

  // Special characters
  { label: 'backslash in path', path: '/en/signals\\test', expectedHandling: 'strict-4xx' },
  { label: 'pipe in path', path: '/en/signals/echo|cat', expectedHandling: 'strict-4xx' },
  { label: 'whitespace in path', path: '/en/signals/ admin ', expectedHandling: 'strict-4xx' },
]

// ── Helpers ─────────────────────────────────────────────────────────────

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text()
      if (text.startsWith('Detected Layout Shift during page load')) {
        return
      }
      errors.push(text)
    }
  })
  return errors
}

// ── Fuzzing Tests ──────────────────────────────────────────────────────

test.describe('S05: Route Fuzzing', () => {
  for (const fuzz of FUZZ_CASES) {
    test(`fuzz: ${fuzz.label}`, async ({ page }) => {
      const errors = collectConsoleErrors(page)

      const response = await page.goto(fuzz.path, { timeout: 30_000 })
      expect(response, `No response for fuzz path: ${fuzz.path}`).not.toBeNull()

      const status = (response as NonNullable<typeof response>).status()

      if (fuzz.expectedHandling === 'strict-4xx') {
        expect(status, `Expected 4xx for ${fuzz.path}, got ${status}`).toBeGreaterThanOrEqual(400)
        expect(status, `Expected 4xx for ${fuzz.path}, got ${status}`).toBeLessThan(500)
      } else {
        // 'no-crash' — server may normalize, redirect, or serve the page
        // but must not crash (no 5xx, no blank screen)
        expect(status, `Expected no 5xx for ${fuzz.path}, got ${status}`).toBeLessThan(500)
      }

      // For 431 (Request Header Fields Too Large), the body is expected to be empty
      if (status !== 431) {
        const bodyText = await page.evaluate(() => document.body?.textContent ?? '')
        expect(bodyText.length, `Empty body for fuzz path: ${fuzz.path}`).toBeGreaterThan(0)
      }

      await page.waitForLoadState('networkidle')

      // Filter out expected resource errors
      const unexpectedErrors = errors.filter(
        e =>
          !e.includes('Failed to load resource') &&
          !e.includes('the server responded with a status of 404') &&
          !e.includes('the server responded with a status of 431') &&
          !e.includes('Service Worker') &&
          !e.includes('q-manifest') &&
          !e.includes('Navigation') &&
          !e.includes('Failed to fetch dynamically imported module') &&
          !e.includes('Failed to fetch dynamically imported script')
      )
      expect(
        unexpectedErrors,
        `Unexpected console errors for ${fuzz.path}: ${unexpectedErrors.join('; ')}`
      ).toHaveLength(0)
    })
  }
})

// ── Valid route cross-check — fuzzing should NOT break valid routes ────

test.describe('S05: Valid route resilience after fuzzing', () => {
  test('navigating to a valid route still works after fuzzing', async ({ page }) => {
    // Visit a fuzzing path first — collect errors from this but only assert page renders
    const _fuzzErrors = collectConsoleErrors(page)
    await page.goto('/en/signals/../../../etc/passwd')
    await page.waitForLoadState('networkidle')

    // Navigate to a valid page — collect fresh errors
    const validErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text()
        if (text.startsWith('Detected Layout Shift during page load')) return
        validErrors.push(text)
      }
    })

    const response = await page.goto(TRACKED_ROUTES[0])
    expect(response, 'Navigation to valid route after fuzzing failed').not.toBeNull()

    const validStatus = (response as NonNullable<typeof response>).status()
    expect(validStatus, 'Expected 200 for valid route after fuzzing').toBe(200)

    await expect(page.locator('[data-testid="niche-index"]')).toBeVisible()
    await page.waitForLoadState('networkidle')

    const unexpectedErrors = validErrors.filter(
      e =>
        !e.includes('Failed to load resource') &&
        !e.includes('the server responded with a status of 404') &&
        !e.includes('Service Worker') &&
        !e.includes('q-manifest') &&
        !e.includes('Failed to fetch dynamically imported module')
    )
    expect(
      unexpectedErrors,
      `Console errors after fuzzing then valid page: ${unexpectedErrors.join('; ')}`
    ).toHaveLength(0)
  })
})
