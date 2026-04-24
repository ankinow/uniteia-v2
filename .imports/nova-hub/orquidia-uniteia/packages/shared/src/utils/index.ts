/**
 * @uniteia/shared - Utilities Module
 * SOTA 2026: Shared utility functions
 *
 * Pure functions with no side effects.
 * All utilities are tree-shakeable.
 */

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Generate a URL-safe slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '') // Remove combining marks
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return `${text.substring(0, maxLength - 3)}...`
}

/**
 * Extract keywords from text for SEO
 */
export function extractKeywords(text: string, maxKeywords = 10): string[] {
  const stopWords = new Set([
    'a',
    'an',
    'and',
    'are',
    'as',
    'at',
    'be',
    'by',
    'for',
    'from',
    'has',
    'he',
    'in',
    'is',
    'it',
    'its',
    'of',
    'on',
    'that',
    'the',
    'to',
    'was',
    'were',
    'will',
    'with',
    'o',
    'e',
    'de',
    'da',
    'do',
    'um',
    'uma',
    'para',
    'com',
    'em',
    'que',
    'no',
    'na',
    'os',
    'as',
  ])

  return text
    .toLowerCase()
    .replace(/[^a-záàâãéèêíïóôõöúçñ\s]/gi, '')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .slice(0, maxKeywords)
}

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

/**
 * Format currency for Brazilian Real
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(original: number, current: number): number {
  if (original <= 0 || current <= 0) {
    return 0
  }
  return Math.round(((original - current) / original) * 100)
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// ============================================================================
// DATE UTILITIES
// ============================================================================

/**
 * Get Unix timestamp (seconds)
 */
export function unixNow(): number {
  return Math.floor(Date.now() / 1000)
}

/**
 * Format Unix timestamp to ISO string
 */
export function formatUnixDate(unix: number): string {
  return new Date(unix * 1000).toISOString()
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(unix: number): string {
  const now = unixNow()
  const diff = now - unix

  if (diff < 60) {
    return 'agora mesmo'
  }
  if (diff < 3600) {
    return `${Math.floor(diff / 60)} min atrás`
  }
  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h atrás`
  }
  if (diff < 604800) {
    return `${Math.floor(diff / 86400)} dias atrás`
  }

  return new Date(unix * 1000).toLocaleDateString('pt-BR')
}

// ============================================================================
// HASH UTILITIES
// ============================================================================

/**
 * Generate a simple hash from string (non-cryptographic)
 */
export function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash &= hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Hash IP address for privacy (uses Web Crypto when available)
 */
export async function hashIP(ip: string, salt = 'uniteia-2026'): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder()
    const data = encoder.encode(ip + salt)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray
      .slice(0, 8)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
  // Fallback for non-crypto environments
  return simpleHash(ip + salt)
}

// ============================================================================
// URL UTILITIES
// ============================================================================

/**
 * Check if URL is valid
 */
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Extract product slug from URL
 */
export function extractSlugFromURL(url: string): string | null {
  try {
    const parsed = new URL(url)
    const pathParts = parsed.pathname.split('/').filter(Boolean)
    const lastPart = pathParts[pathParts.length - 1]
    if (lastPart) {
      return slugify(lastPart.replace(/-/g, ' '))
    }
    return null
  } catch {
    return null
  }
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Shuffle array (Fisher-Yates)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j] as T
    result[j] = temp as T
  }
  return result
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const groupKey = String(item[key])
      if (!acc[groupKey]) {
        acc[groupKey] = []
      }
      acc[groupKey].push(item)
      return acc
    },
    {} as Record<string, T[]>,
  )
}

/**
 * Remove duplicates by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set<unknown>()
  return array.filter((item) => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

// ============================================================================
// RETRY UTILITIES
// ============================================================================

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number
    baseDelay?: number
    maxDelay?: number
  } = {},
): Promise<T> {
  const { maxAttempts = 3, baseDelay = 1000, maxDelay = 30000 } = options

  let lastError: Error | undefined

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt < maxAttempts - 1) {
        const delay = Math.min(baseDelay * 2 ** attempt, maxDelay)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Check if value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

/**
 * Check if value is a valid number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)
}
