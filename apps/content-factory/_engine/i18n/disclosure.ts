import type { SupportedLang } from './headings'

const DISCLOSURES: Record<SupportedLang, string> = {
  en: 'Some links may be invite links. If you purchase through them, UniTeia may earn a commission at no extra cost to you.',
  pt: 'Alguns links podem ser links de convite. Ao realizar uma aquisição por eles, você apoia o UniTeia sem custo extra.',
  es: 'Algunos enlaces pueden ser de invitación. Si realiza una compra a través de ellos, UniTeia puede recibir una comisión sin costo adicional para usted.',
  ja: '一部のリンクは招待リンクです。これらを通じて購入すると、追加費用なしでUniTeiaを支援できます。',
  zh: '部分链接可能是邀请链接。通过这些链接购买时，UniTeia 可能获得佣金，且不会增加您的费用。',
}

export function getDisclosure(lang: SupportedLang): string {
  const text = DISCLOSURES[lang]
  if (!text) throw new Error(`Unknown lang for disclosure: ${lang}`)
  return text
}
