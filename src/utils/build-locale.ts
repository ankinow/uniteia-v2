/**
 * Build-locale utility for per-locale SSG builds.
 *
 * When LOCALE=pt is set, only Portuguese routes/pages are generated in dist/.
 * Without LOCALE, defaults to 'en' for backwards compatibility.
 *
 * Usage in onStaticGenerate:
 *   import { getBuildLocale } from '~/utils/build-locale'
 *   const lang = getBuildLocale()
 *   return { params: [{ lang }] }
 */
export function getBuildLocale(): string {
  return process.env.LOCALE || 'en'
}
