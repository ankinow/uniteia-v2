import type { SupportedLanguage } from './types'

const MAP: Record<string, SupportedLanguage> = {
  // pt
  BR: 'pt',
  PT: 'pt',
  AO: 'pt',
  MZ: 'pt',
  // en
  US: 'en',
  GB: 'en',
  UK: 'en',
  CA: 'en',
  AU: 'en',
  NZ: 'en',
  IN: 'en',
  IE: 'en',
  ZA: 'en',
  // es
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  VE: 'es',
  EC: 'es',
  BO: 'es',
  PY: 'es',
  UY: 'es',
  CR: 'es',
  PA: 'es',
  GT: 'es',
  HN: 'es',
  NI: 'es',
  SV: 'es',
  DO: 'es',
  CU: 'es',
  PR: 'es',
  // fr
  FR: 'fr',
  BE: 'fr',
  LU: 'fr',
  MC: 'fr',
  CD: 'fr',
  CI: 'fr',
  SN: 'fr',
  CM: 'fr',
  MG: 'fr',
  // de
  DE: 'de',
  AT: 'de',
  CH: 'de',
  LI: 'de',
  // it
  IT: 'it',
  SM: 'it',
  VA: 'it',
  // ja
  JP: 'ja',
  // zh
  CN: 'zh',
  TW: 'zh',
  HK: 'zh',
  MO: 'zh',
  SG: 'zh',
}

export function countryToLang(code?: string | null): SupportedLanguage {
  if (!code) return 'en'
  return MAP[code.toUpperCase()] ?? 'en'
}
