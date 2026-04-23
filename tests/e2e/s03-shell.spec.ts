import { expect, test } from '@playwright/test'

test.describe('S03: SolarLanso SiteShell & Typography', () => {
  test('should have void background and bone text', async ({ page }) => {
    await page.goto('/')
    
    // Check background color of the shell
    const shell = page.locator('.site-shell')
    await expect(shell).toHaveCSS('background-color', 'rgb(13, 17, 23)')
    
    // Check text color
    await expect(shell).toHaveCSS('color', 'rgb(240, 232, 216)')
  })

  test('should use Geist Sans for headings', async ({ page }) => {
    await page.goto('/')
    
    // We need at least one heading to check. If there's none on the home page, 
    // we might need to navigate or check a specific component.
    // Assuming there's a heading somewhere.
    const heading = page.locator('h1, h2, h3').first()
    if (await heading.isVisible()) {
      const fontFamily = await heading.evaluate((el) => window.getComputedStyle(el).fontFamily)
      expect(fontFamily).toContain('Geist Sans')
    }
  })

  test('should use Inter for body text', async ({ page }) => {
    await page.goto('/')
    
    const body = page.locator('body')
    const fontFamily = await body.evaluate((el) => window.getComputedStyle(el).fontFamily)
    expect(fontFamily).toContain('Inter')
  })

  test('should have 90 degree corners (brutalist reset)', async ({ page }) => {
    await page.goto('/')
    
    // Check a few elements that might typically have rounded corners
    const elements = page.locator('button, input, [class*="card"], [class*="btn"]')
    const count = await elements.count()
    for (let i = 0; i < Math.min(count, 5); i++) {
      const borderRadius = await elements.nth(i).evaluate((el) => window.getComputedStyle(el).borderRadius)
      expect(borderRadius).toBe('0px')
    }
  })
})
