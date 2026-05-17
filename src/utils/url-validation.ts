/** URL validation utilities for content slug enforcement */

// Base pattern for slugs: 1-6 hyphen-separated lowercase segments
const BASE_PATTERN = /^[a-z]+(-[a-z]+){0,5}$/

/**
 * Primary slug pattern used across the application
 * Includes _index as valid landing page slug
 */
export const SLUG_PATTERN = /^(_index|[a-z]+(-[a-z]+){1,5})$/

/** Banned slug terms that are reserved or problematic */
export const BANNED_SLUG_TERMS = new Set([
  // Reserved routes
  'admin',
  'api',
  'app',
  'assets',
  'blog',
  'cdn',
  'dashboard',
  'login',
  'logout',
  'privacy',
  'public',
  'search',
  'settings',
  'terms',
  'user',
  'users',
  'wiki',
  // Trademarked terms
  'galaxy-ai',
  'google-ai',
  'openai',
  'chatgpt',
  'meta-ai',
  'microsoft-ai',
  // Generic diluting terms
  'best',
  'cheap',
  'free',
  'top',
  'new',
  'latest',
])

/** Validates against base pattern only (not _index) */
export function isValidSlugPattern(slug: string): boolean {
  return BASE_PATTERN.test(slug)
}

/** Checks if a slug is banned */
export function findBannedSlugTerm(slug: string): string | null {
  const segments = slug.split('-')
  for (const segment of segments) {
    if (BANNED_SLUG_TERMS.has(segment) || BANNED_SLUG_TERMS.has(slug)) {
      return segment === slug ? slug : segment
    }
  }
  return null
}

/** Full slug validation with detailed error reporting */
export function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug || typeof slug !== 'string') {
    return { valid: false, error: 'Slug must be a non-empty string' }
  }
  // Special case: _index is valid for landing pages
  if (slug === '_index') {
    return { valid: true }
  }
  // Regular content slug validation
  if (!isValidSlugPattern(slug)) {
    return {
      valid: false,
      error: `Slug "${slug}" does not match pattern ${BASE_PATTERN.toString()}. Must be 1-6 lowercase hyphen-separated segments.`,
    }
  }
  const bannedTerm = findBannedSlugTerm(slug)
  if (bannedTerm) {
    return {
      valid: false,
      error: `Slug "${slug}" contains banned term "${bannedTerm}"`,
    }
  }
  return { valid: true }
}

/** Extracts slug segments for further processing */
export function parseSlugSegments(slug: string): string[] {
  if (!isValidSlugPattern(slug)) return []
  return slug.split('-')
}

/** Generates a suggested slug from a title */
export function suggestSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .split('-')
    .slice(0, 6)
    .join('-')
}
