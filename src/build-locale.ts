/**
 * Build-time locale constant.
 * Set via LOCALE environment variable during build (e.g., LOCALE=pt bun run build).
 * Falls back to 'en' when not set (dev server, typecheck, etc.).
 *
 * This is the single source of truth for the current build locale in the
 * single-locale multi-domain architecture. It replaces URL-path-based locale
 * detection (formerly [lang] route param).
 */
export const BUILD_LOCALE =
  (typeof process !== 'undefined' && (process.env?.LOCALE as string)) || 'en'
