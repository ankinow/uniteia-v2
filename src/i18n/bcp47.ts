/**
 * BCP47 locale tag mapping for og:locale, hreflang, and Schema.org inLanguage.
 * Maps our 2-letter internal codes to proper BCP47 tags for SEO and GEO-LLM.
 *
 * Used by: router-head, article routes, schema generators
 */
export const BCP47_MAP: Record<string, string> = {
  en: 'en-US',
  pt: 'pt-BR',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  ja: 'ja-JP',
  zh: 'zh-CN',
}

/** Convert a 2-letter locale code to BCP47, falling back to the code itself */
export function toBcp47(code: string): string {
  return BCP47_MAP[code] || code
}
