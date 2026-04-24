import { describe, expect, it } from 'vitest'
import { resolveDocumentLanguageFromPathname } from '~/i18n/document-language'
import { DEFAULT_LANGUAGE } from '~/i18n/types'

describe('resolveDocumentLanguageFromPathname', () => {
  it('uses the leading supported path segment when one is present', () => {
    expect(resolveDocumentLanguageFromPathname('/en/n/')).toBe('en')
    expect(resolveDocumentLanguageFromPathname('/pt/blog')).toBe('pt')
    expect(resolveDocumentLanguageFromPathname('///ja///')).toBe('ja')
  })

  it('falls back to the default language for unsupported or empty paths', () => {
    expect(resolveDocumentLanguageFromPathname('/marketing')).toBe(DEFAULT_LANGUAGE)
    expect(resolveDocumentLanguageFromPathname('/')).toBe(DEFAULT_LANGUAGE)
    expect(resolveDocumentLanguageFromPathname(undefined)).toBe(DEFAULT_LANGUAGE)
  })
})
