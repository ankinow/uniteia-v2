import type { SupportedLanguage } from '../i18n/types'
import type { NicheConfig, NicheValidationError, NichesConfig } from '../types/niche'

/** All supported languages — used to validate that title/description maps are complete */
const SUPPORTED_LANGS: SupportedLanguage[] = ['en', 'pt', 'es', 'ja', 'zh']

/**
 * Validate a single niche config entry.
 * Checks: required fields present, slug matches pattern, icon is a string,
 * title and description have all 5 languages.
 * Returns null if valid, or a NicheValidationError describing what's wrong.
 */
export function validateNicheConfig(entry: unknown): NicheValidationError | null {
  const errors: string[] = []

  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return { errors: ['Entry must be a non-array object'] }
  }

  const obj = entry as Record<string, unknown>

  // slug validation
  const slug = obj.slug
  if (typeof slug !== 'string' || slug.length === 0) {
    errors.push('slug is required and must be a non-empty string')
  } else {
    // Dynamic import of url-validation would be async; import the pattern inline for sync validation
    const SLUG_PATTERN = /^[a-z]+(-[a-z]+){1,5}$/
    if (!SLUG_PATTERN.test(slug)) {
      errors.push(
        `slug "${slug}" does not match pattern ${SLUG_PATTERN.toString()}. Must be 2-6 lowercase hyphen-separated segments.`,
      )
    }
  }

  // icon validation
  if (typeof obj.icon !== 'string' || (obj.icon as string).length === 0) {
    errors.push('icon is required and must be a non-empty string (Lucide icon name)')
  }

  // title validation
  if (!obj.title || typeof obj.title !== 'object' || Array.isArray(obj.title)) {
    errors.push('title is required and must be an object keyed by language codes')
  } else {
    const title = obj.title as Record<string, unknown>
    for (const lang of SUPPORTED_LANGS) {
      if (typeof title[lang] !== 'string' || (title[lang] as string).length === 0) {
        errors.push(`title.${lang} is required and must be a non-empty string`)
      }
    }
  }

  // description validation
  if (!obj.description || typeof obj.description !== 'object' || Array.isArray(obj.description)) {
    errors.push('description is required and must be an object keyed by language codes')
  } else {
    const desc = obj.description as Record<string, unknown>
    for (const lang of SUPPORTED_LANGS) {
      if (typeof desc[lang] !== 'string' || (desc[lang] as string).length === 0) {
        errors.push(`description.${lang} is required and must be a non-empty string`)
      }
    }
  }

  if (errors.length > 0) {
    const result: NicheValidationError = { errors }
    if (typeof slug === 'string') {
      result.slug = slug
    }
    return result
  }

  return null
}

/**
 * Find a niche by its slug within a loaded config.
 * Returns the NicheConfig if found, or undefined.
 */
export function findNicheBySlug(niches: NichesConfig, slug: string): NicheConfig | undefined {
  return niches.find(n => n.slug === slug)
}

/**
 * Load and validate the niches configuration from config/niches.yaml.
 *
 * Uses dynamic `await import()` for all Node.js modules (D001) so this
 * code is tree-shaken from the client bundle when used inside routeLoader$.
 *
 * Returns NichesConfig (validated entries only). Logs warnings for entries
 * that fail validation and errors for read/parse failures. Returns an empty
 * array on total failure (graceful degradation).
 */
export async function loadNichesConfig(): Promise<NichesConfig> {
  try {
    // D001: dynamic imports for all Node.js / server-only modules
    const nodePath = await import('node:path')
    const nodeUrl = await import('node:url')
    const nodeFs = await import('node:fs/promises')
    const yaml = await import('js-yaml')

    const __dirname = nodePath.dirname(nodeUrl.fileURLToPath(import.meta.url))
    const configPath = nodePath.resolve(__dirname, '..', '..', 'config', 'niches.yaml')

    const raw = await nodeFs.readFile(configPath, 'utf-8')
    const parsed = yaml.load(raw)

    if (!Array.isArray(parsed)) {
      console.error('[niche-loader] niches.yaml did not parse into an array — got', typeof parsed)
      return []
    }

    const validNiches: NichesConfig = []

    for (const entry of parsed) {
      const err = validateNicheConfig(entry)
      if (err) {
        const label = err.slug ?? '<missing slug>'
        console.warn(`[niche-loader] Skipping invalid niche "${label}": ${err.errors.join('; ')}`)
      } else {
        validNiches.push(entry as NicheConfig)
      }
    }

    return validNiches
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[niche-loader] Failed to load niches.yaml: ${message}`)
    return []
  }
}
