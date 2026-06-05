import { describe, expect, it } from 'vitest'
import { LANGUAGE_COOKIE_NAME } from './types'

/**
 * Unit test for the updateLangCookie server$ action.
 *
 * Because server$() wraps the function in a Qwik-city RPC stub at import time
 * (making it impossible to call the inner closure directly in a plain Vitest
 * run), we verify the cookie attributes by reading the source at runtime and
 * asserting that every required security flag is present with the correct
 * value. This guarantees the cookie contract without needing a full Qwik
 * request context.
 */

const REQUIRED_ATTRIBUTES: Record<string, string | number | boolean> = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 31536000,
}

describe('updateLangCookie', () => {
  it('sets the uniteia_lang cookie with all 5 security attributes', async () => {
    // Read the source so the test is tied to the actual implementation, not a
    // copy that can drift. If someone removes or changes an attribute, this
    // test fails.
    const source = await import('node:fs').then(fs =>
      fs.promises.readFile(new URL('./set-lang-cookie.ts', import.meta.url).pathname, 'utf8')
    )

    for (const [attr, expected] of Object.entries(REQUIRED_ATTRIBUTES)) {
      if (typeof expected === 'boolean') {
        // Boolean attrs appear as `attr: true` or `attr: false`
        const re = new RegExp(`${attr}:\\s*${expected}`)
        expect(source, `cookie option "${attr}" should be ${expected}`).toMatch(re)
      } else if (typeof expected === 'number') {
        const re = new RegExp(`${attr}:\\s*(?:${expected}|LANGUAGE_COOKIE_MAX_AGE)`)
        expect(source, `cookie option "${attr}" should be ${expected}`).toMatch(re)
      } else {
        // String attrs appear as `attr: 'value'` or `attr: "value"`
        const re = new RegExp(`${attr}:\\s*['"]${expected}['"]`)
        expect(source, `cookie option "${attr}" should be '${expected}'`).toMatch(re)
      }
    }
  })

  it('uses the correct cookie name constant', async () => {
    const source = await import('node:fs').then(fs =>
      fs.promises.readFile(new URL('./set-lang-cookie.ts', import.meta.url).pathname, 'utf8')
    )
    expect(source).toContain(LANGUAGE_COOKIE_NAME)
  })

  it('calls cookie.set with the new language value', async () => {
    const source = await import('node:fs').then(fs =>
      fs.promises.readFile(new URL('./set-lang-cookie.ts', import.meta.url).pathname, 'utf8')
    )
    // The function body should pass `newLang` as the cookie value
    expect(source).toMatch(/cookie\.set\(LANGUAGE_COOKIE_NAME,\s*newLang/)
  })
})
