import type { SupportedLanguage } from '../i18n/types'
import { SUPPORTED_LANGUAGES } from '../i18n/types'
import type { NicheConfig, NicheSlugs, NicheValidationError, NichesConfig } from '../types/niche'
import { validateSlug } from './url-validation'

/** All supported languages — derived from canonical i18n config */
const SUPPORTED_LANGS: SupportedLanguage[] = SUPPORTED_LANGUAGES.map(l => l.code)

const ROUTED_SLUG_LANGS: Array<keyof NicheSlugs> = ['pt', 'en']

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
    const slugValidation = validateSlug(slug)
    if (!slugValidation.valid) {
      errors.push(slugValidation.error ?? `slug "${slug}" is invalid`)
    }
  }

  // localized slug aliases validation
  if (!obj.slugs || typeof obj.slugs !== 'object' || Array.isArray(obj.slugs)) {
    errors.push('slugs is required and must be an object keyed by locale')
  } else {
    const slugs = obj.slugs as Record<string, unknown>
    for (const lang of ROUTED_SLUG_LANGS) {
      const localizedSlug = slugs[lang]
      if (typeof localizedSlug !== 'string' || localizedSlug.length === 0) {
        errors.push(`slugs.${lang} is required and must be a non-empty string`)
        continue
      }

      const localizedValidation = validateSlug(localizedSlug)
      if (!localizedValidation.valid) {
        errors.push(localizedValidation.error ?? `slugs.${lang} is invalid`)
      }
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
 * Resolve the active slug for a niche in a specific locale.
 * Falls back to the canonical slug for locales without an explicit alias.
 */
export function getNicheSlug(niche: NicheConfig, lang: SupportedLanguage): string {
  if (lang === 'en' || lang === 'pt') {
    return niche.slugs[lang]
  }

  return niche.slug
}

/**
 * Find a niche by its slug within a loaded config.
 * Canonical slug is checked first, then locale alias, then any alias.
 */
export function findNicheBySlug(
  niches: NichesConfig,
  slug: string,
  lang?: SupportedLanguage
): NicheConfig | undefined {
  const canonicalMatch = niches.find(n => n.slug === slug)
  if (canonicalMatch) return canonicalMatch

  if (lang === 'en' || lang === 'pt') {
    const localizedMatch = niches.find(n => n.slugs[lang] === slug)
    if (localizedMatch) return localizedMatch
  }

  return niches.find(n => n.slugs.pt === slug || n.slugs.en === slug)
}

/**
 * Load and validate the niches configuration from config/niches.yaml.
 *
 * Uses Vite's import.meta.glob with raw=true to bundle the YAML content.
 * This works in both Node.js (SSR/SSG) and Cloudflare Workers (Runtime).
 *
 * Returns NichesConfig (validated entries only). Logs warnings for entries
 * that fail validation and errors for read/parse failures. Returns an empty
 * array on total failure (graceful degradation).
 */
export async function loadNichesConfig(): Promise<NichesConfig> {
  try {
    const yaml = await import('js-yaml')

    const modules = import.meta.glob<string>('../../config/niches.yaml', {
      query: '?raw',
      import: 'default',
      eager: true,
    })
    const raw = modules['../../config/niches.yaml']

    if (!raw) {
      console.error('[niche-loader] niches.yaml not found in bundled modules')
      return []
    }

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
