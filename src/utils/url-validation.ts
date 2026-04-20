/**
 * URL validation utilities for content slug enforcement
 * Ensures consistent URL structure across all multilingual content
 */

/**
 * Regex pattern for valid content slugs
 * - 2-6 hyphen-separated segments
 * - Lowercase ASCII letters only
 * - Examples: "solar-system", "ai-ethics", "climate-science-basics"
 */
export const SLUG_PATTERN = /^[a-z]+(-[a-z]+){1,5}$/;

/**
 * Banned slug terms that are reserved or problematic
 * - Reserved routes (admin, api, etc.)
 * - Trademarked terms that require legal approval
 * - SEO-diluting generic terms
 */
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
  'wiki', // Reserved for future use

  // Trademarked/legally sensitive terms
  'galaxy-ai', // Samsung trademark
  'google-ai',
  'openai',
  'chatgpt',
  'meta-ai',
  'microsoft-ai',

  // Generic/diluting terms
  'best',
  'cheap',
  'free',
  'top',
  'new',
  'latest',
]);

/**
 * Validates a slug against the pattern
 * @param slug - The slug to validate
 * @returns true if valid, false otherwise
 */
export function isValidSlugPattern(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

/**
 * Checks if a slug contains any banned terms
 * @param slug - The slug to check
 * @returns The banned term found, or null if clean
 */
export function findBannedSlugTerm(slug: string): string | null {
  const segments = slug.split('-');
  for (const segment of segments) {
    if (BANNED_SLUG_TERMS.has(segment) || BANNED_SLUG_TERMS.has(slug)) {
      return segment === slug ? slug : segment;
    }
  }
  return null;
}

/**
 * Full slug validation with detailed error reporting
 * @param slug - The slug to validate
 * @returns Validation result with error details
 */
export function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug || typeof slug !== 'string') {
    return { valid: false, error: 'Slug must be a non-empty string' };
  }

  if (!isValidSlugPattern(slug)) {
    return {
      valid: false,
      error: `Slug "${slug}" does not match pattern ${SLUG_PATTERN.toString()}. Must be 2-6 lowercase hyphen-separated segments.`,
    };
  }

  const bannedTerm = findBannedSlugTerm(slug);
  if (bannedTerm) {
    return {
      valid: false,
      error: `Slug "${slug}" contains banned term "${bannedTerm}"`,
    };
  }

  return { valid: true };
}

/**
 * Extracts slug segments for further processing
 * @param slug - The slug to parse
 * @returns Array of segments, or empty array if invalid
 */
export function parseSlugSegments(slug: string): string[] {
  if (!isValidSlugPattern(slug)) return [];
  return slug.split('-');
}

/**
 * Generates a suggested slug from a title
 * @param title - The title to convert
 * @returns Suggested slug (may need manual review)
 */
export function suggestSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .split('-')
    .slice(0, 6)
    .join('-');
}
