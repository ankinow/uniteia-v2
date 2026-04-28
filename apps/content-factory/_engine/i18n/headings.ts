export type SupportedLang = 'en' | 'pt' | 'es' | 'ja' | 'zh'

export type HeadingKey =
  | 'tldr'
  | 'what_it_is'
  | 'for_whom'
  | 'what_it_offers'
  | 'problems_solved'
  | 'where_it_fits'
  | 'where_it_falls_short'
  | 'editorial'
  | 'sources'
  | 'evidence'
  | 'bottom_line'
  | 'prompt_seed'
  | 'metadata'
  | 'pros_cons'
  | 'buyer_checklist'
  | 'alternatives'
  | 'who_should_buy'
  | 'who_should_skip'
  | 'final_verdict'
  | 'checklist_before_buying'

const HEADINGS: Record<SupportedLang, Record<HeadingKey, string>> = {
  en: {
    tldr: 'TL;DR',
    what_it_is: 'What it is',
    for_whom: 'For whom',
    what_it_offers: 'What it offers',
    problems_solved: 'Problems it solves',
    where_it_fits: 'Where it fits',
    where_it_falls_short: 'Where it falls short',
    editorial: 'Editorial',
    sources: 'Sources',
    evidence: 'Evidence',
    bottom_line: 'Bottom line',
    prompt_seed: 'Prompt seed',
    metadata: 'Metadata',
    pros_cons: 'Pros & Cons',
    buyer_checklist: 'Buyer Checklist',
    alternatives: 'Alternatives',
    who_should_buy: 'Who should buy',
    who_should_skip: 'Who should skip',
    final_verdict: 'Final Verdict',
    checklist_before_buying: 'Checklist before buying',
  },
  pt: {
    tldr: 'TL;DR',
    what_it_is: 'O que é',
    for_whom: 'Para quem é',
    what_it_offers: 'O que oferece',
    problems_solved: 'Problemas que resolve',
    where_it_fits: 'Onde se encaixa',
    where_it_falls_short: 'Onde fica aquém',
    editorial: 'Editorial',
    sources: 'Fontes',
    evidence: 'Evidências',
    bottom_line: 'Conclusão',
    prompt_seed: 'Prompt-seed',
    metadata: 'Metadados',
    pros_cons: 'Prós & Contras',
    buyer_checklist: 'Checklist de Compra',
    alternatives: 'Alternativas',
    who_should_buy: 'Para quem é',
    who_should_skip: 'Para quem não é',
    final_verdict: 'Veredito Final',
    checklist_before_buying: 'Checklist antes de comprar',
  },
  es: {
    tldr: 'TL;DR',
    what_it_is: 'Qué es',
    for_whom: 'Para quién es',
    what_it_offers: 'Qué ofrece',
    problems_solved: 'Problemas que resuelve',
    where_it_fits: 'Dónde encaja',
    where_it_falls_short: 'Dónde se queda corto',
    editorial: 'Editorial',
    sources: 'Fuentes',
    evidence: 'Evidencia',
    bottom_line: 'Conclusión',
    prompt_seed: 'Semilla de prompt',
    metadata: 'Metadatos',
    pros_cons: 'Pros y contras',
    buyer_checklist: 'Lista de compra',
    alternatives: 'Alternativas',
    who_should_buy: 'Para quién es',
    who_should_skip: 'Para quién no es',
    final_verdict: 'Veredicto final',
    checklist_before_buying: 'Lista antes de comprar',
  },
  ja: {
    tldr: 'TL;DR',
    what_it_is: '概要',
    for_whom: '対象読者',
    what_it_offers: '提供するもの',
    problems_solved: '解決する課題',
    where_it_fits: '適用領域',
    where_it_falls_short: '弱点・制約',
    editorial: 'エディトリアル',
    sources: '情報源',
    evidence: '根拠',
    bottom_line: '結論',
    prompt_seed: 'プロンプトシード',
    metadata: 'メタデータ',
    pros_cons: '長所と短所',
    buyer_checklist: '購入チェックリスト',
    alternatives: '代替案',
    who_should_buy: 'こんな人におすすめ',
    who_should_skip: 'おすすめしない人',
    final_verdict: '最終評価',
    checklist_before_buying: '購入前のチェックリスト',
  },
  zh: {
    tldr: 'TL;DR',
    what_it_is: '它是什么',
    for_whom: '适合谁',
    what_it_offers: '它提供什么',
    problems_solved: '它解决的问题',
    where_it_fits: '适用场景',
    where_it_falls_short: '不足之处',
    editorial: '编辑评述',
    sources: '来源',
    evidence: '证据',
    bottom_line: '结论',
    prompt_seed: '提示种子',
    metadata: '元数据',
    pros_cons: '优点和缺点',
    buyer_checklist: '购买清单',
    alternatives: '替代方案',
    who_should_buy: '适合谁',
    who_should_skip: '不适合谁',
    final_verdict: '最终结论',
    checklist_before_buying: '购买前清单',
  },
}

export function getHeadings(lang: SupportedLang): Record<HeadingKey, string> {
  const map = HEADINGS[lang]
  if (!map) throw new Error(`Unknown lang: ${lang}. Supported: en, pt, es, ja, zh`)
  return map
}

/** Get list of required combined sections for a given language */
export function getRequiredCombinedSections(lang: SupportedLang): string[] {
  const h = getHeadings(lang)
  return [
    h.tldr,
    h.what_it_is,
    h.who_should_buy,
    h.who_should_skip,
    h.pros_cons,
    h.checklist_before_buying,
    h.editorial,
    h.sources,
    h.evidence,
  ]
}

export const ALL_LANGS: SupportedLang[] = ['en', 'pt', 'es', 'ja', 'zh']
