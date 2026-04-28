import type { SupportedLang } from './headings'

export type CtaType = 'official' | 'partner'

const CTA_LABELS: Record<SupportedLang, Record<CtaType, string>> = {
  en: {
    official: 'Official site',
    partner: 'Authorized partner',
  },
  pt: {
    official: 'Site oficial',
    partner: 'Parceiro autorizado',
  },
  es: {
    official: 'Sitio oficial',
    partner: 'Socio autorizado',
  },
  ja: {
    official: '公式サイト',
    partner: '認定パートナー',
  },
  zh: {
    official: '官方网站',
    partner: '授权合作伙伴',
  },
}

export function getCtaLabel(lang: SupportedLang, type: CtaType): string {
  const map = CTA_LABELS[lang]
  if (!map) throw new Error(`Unknown lang for CTA: ${lang}`)
  return map[type]
}

/** Check if a given label matches the 'official' anchor for that language */
export function isOfficialLabel(lang: SupportedLang, label: string): boolean {
  return label.trim().toLowerCase() === CTA_LABELS[lang].official.toLowerCase()
}
