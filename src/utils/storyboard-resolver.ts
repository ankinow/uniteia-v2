import type { ResolvedCell, ResolvedLayout } from '~/components/storyboard-grid/types'
import type { SupportedLanguage } from '~/i18n/types'
import type { TranslationStrings } from '~/i18n/types'

const WHITEBOARD = '/assets/whiteboard/articles'
const KAWAII = '/assets/kawaii-vibecoder'

type ArticleMeta = {
  slug: string
  title: string
  body: string
  evidenceTitle: string
  listItems: string[]
  diagram: 'magica-arch' | 'quickstart-flow' | 'mcp-arch' | 'tencent-stack' | 'vibecoder'
  metric: { value: string; label: string; delta?: string }
  ctaTitle: string
  ctaBody: string
  ctaLabel: string
  ctaHref: string
  alt: string
  codeSnippet?: string
}

const A = (name: string) => ({
  src: `${KAWAII}/mini/mini-${name}.webp`,
  alt: `Kawaii ${name.replace(/-/g, ' ')}`,
})

// 12 narrative beats — single source of truth
const N = {
  hero: { src: `${KAWAII}/hero-postit-collage.webp`, alt: 'Personagem kawaii com post-its' },
  explainer: {
    src: `${KAWAII}/explainer-lousa-giz.webp`,
    alt: 'Quadro branco do roteamento Magica',
  },
  closing: { src: `${KAWAII}/closing-success-collage.webp`, alt: 'Personagem celebrando sucesso' },
  intro: A('waving-goodbye'),
  countdown: A('countdown-4'),
  pointing: A('pointing-right'),
  thinking: A('thinking-brain'),
  routing: A('routing-arrows'),
  architect: A('architect-working'),
  dodging: A('dodging-x'),
  success: A('success-arms-up'),
  ctaPoint: A('pointing-cta'),
  energetic: A('energetic-jump'),
}

// ─── i18n: Vibecoder step labels ───

const STEPS: Record<SupportedLanguage, { step3: string; step4: string; step5: string }> = {
  en: { step3: 'Step 3 — Architecture', step4: 'Step 4 — The Command', step5: 'Step 5 — Done!' },
  pt: { step3: 'Passo 3 — A arquitetura', step4: 'Passo 4 — O comando', step5: 'Passo 5 — Pronto!' },
  es: { step3: 'Paso 3 — La arquitectura', step4: 'Paso 4 — El comando', step5: 'Paso 5 — ¡Listo!' },
  fr: { step3: 'Étape 3 — L\'architecture', step4: 'Étape 4 — La commande', step5: 'Étape 5 — Terminé!' },
  de: { step3: 'Schritt 3 — Architektur', step4: 'Schritt 4 — Der Befehl', step5: 'Schritt 5 — Fertig!' },
  it: { step3: 'Passo 3 — L\'architettura', step4: 'Passo 4 — Il comando', step5: 'Passo 5 — Fatto!' },
  ja: { step3: 'ステップ 3 — アーキテクチャ', step4: 'ステップ 4 — コマンド', step5: 'ステップ 5 — 完了!' },
  zh: { step3: '步骤 3 — 架构', step4: '步骤 4 — 命令', step5: '步骤 5 — 完成!' },
}

// ─── i18n: Article metadata per locale ───

const ARTICLES_PT: Record<string, ArticleMeta> = {
  'magica-overview': {
    slug: 'magica-overview',
    title: 'Magica: IA sem chapeu de expert',
    body: 'Quatro passos, um cafe. A Magica escolhe sozinha qual IA usar.',
    evidenceTitle: 'Como funciona',
    listItems: [
      'Voce fala com a Magica',
      'Ela ve qual IA ta mais barata',
      'Ela pula a quebrada e usa a boa',
      'Voce recebe a resposta + o custo',
    ],
    diagram: 'vibecoder',
    metric: { value: '4', label: 'passos ate sua primeira resposta', delta: '~90s do zero ao deploy' },
    ctaTitle: 'Testar agora',
    ctaBody: 'Cole no terminal e receba sua primeira resposta.',
    ctaLabel: 'Ver em acao',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Personagem kawaii com post-its',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"ola"}]}\'',
  },
  'magica-quickstart': {
    slug: 'magica-quickstart',
    title: 'Do zero ao primeiro comando',
    body: 'Cria a conta, gera a chave, faz a chamada. Sem docs infinitas.',
    evidenceTitle: 'Setup em 4 passos',
    listItems: [
      'Cria tua conta',
      'Gera uma API key',
      'Escolhe o modelo (ou auto)',
      'Faz a chamada: curl ou Node.js',
    ],
    diagram: 'vibecoder',
    metric: { value: '~90s', label: 'da conta a primeira resposta', delta: 'p50 real' },
    ctaTitle: 'Comecar agora',
    ctaBody: 'Gratis. Sem cartao.',
    ctaLabel: 'Abrir conta',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Kawaii mostrando os 4 passos',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"hello world"}]}\'',
  },
  'magica-mcp-server': {
    slug: 'magica-mcp-server',
    title: 'MCP: O protocolo que conecta IAs a ferramentas',
    body: 'Model Context Protocol. 30 linhas. Tua IA descobre ferramentas sozinha.',
    evidenceTitle: 'Como o MCP funciona',
    listItems: [
      'JSON-RPC 2.0 sobre stdio ou SSE/HTTP',
      'Discovery automatico',
      'Sandbox com bearer auth',
      'Hot-reload durante dev',
    ],
    diagram: 'vibecoder',
    metric: { value: '4', label: 'camadas: Host → Client → Transport → Server' },
    ctaTitle: 'Construir com MCP',
    ctaBody: 'Comece a construir servidores MCP hoje.',
    ctaLabel: 'MCP Docs',
    ctaHref: 'https://modelcontextprotocol.io',
    alt: 'Diagrama de arquitetura MCP',
    codeSnippet:
      'import { Server } from "@modelcontextprotocol/sdk/server/index.js";\nconst server = new Server({ name: "meu-servidor", version: "1.0" },\n  { capabilities: { tools: {} } });',
  },
  'tencent-cloud-deal-stack-builders': {
    slug: 'tencent-cloud-deal-stack-builders',
    title: 'Stack Tencent Cloud para builders',
    body: 'Lighthouse, CVM, EdgeOne. Um so billing. IAM unificado.',
    evidenceTitle: 'Visao geral da stack',
    listItems: [
      'Lighthouse: WP, Ghost, n8n em 1 clique',
      'CVM: S5, SA2, GPU',
      'EdgeOne: HTTP/3, WAF, 280+ PoPs',
      'Bundle: 30% off',
    ],
    diagram: 'vibecoder',
    metric: { value: '30%', label: 'desconto no bundle', delta: '12 meses' },
    ctaTitle: 'Deploy agora',
    ctaBody: 'Confira as promocoes atuais.',
    ctaLabel: 'Ver ofertas',
    ctaHref: 'https://tencentcloud.com',
    alt: 'Diagrama Tencent Cloud',
    codeSnippet: 'tccli lighthouse DescribeInstances --region ap-sao-paulo',
  },
}

const ARTICLES_EN: Record<string, ArticleMeta> = {
  'magica-overview': {
    slug: 'magica-overview',
    title: 'Magica: AI without the expert hat',
    body: 'Four steps, one coffee. Magica picks the best AI for you.',
    evidenceTitle: 'How it works',
    listItems: [
      'You talk to Magica',
      'It checks which AI is cheapest',
      'It skips the broken ones, uses the good ones',
      'You get the answer + the cost',
    ],
    diagram: 'vibecoder',
    metric: { value: '4', label: 'steps to your first answer', delta: '~90s from zero to deploy' },
    ctaTitle: 'Try it now',
    ctaBody: 'Paste in your terminal and get your first answer.',
    ctaLabel: 'See it in action',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Kawaii character with post-its',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"hello"}]}\'',
  },
  'magica-quickstart': {
    slug: 'magica-quickstart',
    title: 'From zero to first command',
    body: 'Create an account, generate a key, make the call. No endless docs.',
    evidenceTitle: 'Setup in 4 steps',
    listItems: [
      'Create your account',
      'Generate an API key',
      'Pick a model (or auto)',
      'Make the call: curl or Node.js',
    ],
    diagram: 'vibecoder',
    metric: { value: '~90s', label: 'from account to first answer', delta: 'real p50' },
    ctaTitle: 'Get started',
    ctaBody: 'Free. No credit card.',
    ctaLabel: 'Sign up',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Kawaii showing the 4 steps',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"hello world"}]}\'',
  },
  'magica-mcp-server': {
    slug: 'magica-mcp-server',
    title: 'MCP: The protocol that connects AIs to tools',
    body: 'Model Context Protocol. 30 lines. Your AI discovers tools on its own.',
    evidenceTitle: 'How MCP works',
    listItems: [
      'JSON-RPC 2.0 over stdio or SSE/HTTP',
      'Automatic discovery',
      'Sandbox with bearer auth',
      'Hot-reload during dev',
    ],
    diagram: 'vibecoder',
    metric: { value: '4', label: 'layers: Host → Client → Transport → Server' },
    ctaTitle: 'Build with MCP',
    ctaBody: 'Start building MCP servers today.',
    ctaLabel: 'MCP Docs',
    ctaHref: 'https://modelcontextprotocol.io',
    alt: 'MCP architecture diagram',
    codeSnippet:
      'import { Server } from "@modelcontextprotocol/sdk/server/index.js";\nconst server = new Server({ name: "my-server", version: "1.0" },\n  { capabilities: { tools: {} } });',
  },
  'tencent-cloud-deal-stack-builders': {
    slug: 'tencent-cloud-deal-stack-builders',
    title: 'Tencent Cloud Stack for Builders',
    body: 'Lighthouse, CVM, EdgeOne. One billing. Unified IAM.',
    evidenceTitle: 'Stack overview',
    listItems: [
      'Lighthouse: WP, Ghost, n8n in 1 click',
      'CVM: S5, SA2, GPU',
      'EdgeOne: HTTP/3, WAF, 280+ PoPs',
      'Bundle: 30% off',
    ],
    diagram: 'vibecoder',
    metric: { value: '30%', label: 'bundle discount', delta: '12 months' },
    ctaTitle: 'Deploy now',
    ctaBody: 'Check the current deals.',
    ctaLabel: 'See offers',
    ctaHref: 'https://tencentcloud.com',
    alt: 'Tencent Cloud diagram',
    codeSnippet: 'tccli lighthouse DescribeInstances --region ap-sao-paulo',
  },
}

// ─── Locale-aware article lookup ───

function getArticleMeta(slug: string, lang: SupportedLanguage): ArticleMeta | undefined {
  // Default to EN for non-PT locales; fallback to PT if EN not available
  const primary = lang === 'pt' ? ARTICLES_PT[slug] : ARTICLES_EN[slug]
  if (primary) return primary
  // Fallback: try the other locale
  return lang === 'pt' ? ARTICLES_EN[slug] : ARTICLES_PT[slug]
}

// ─── CELL BUILDERS ───

function metricCell(m: ArticleMeta): ResolvedCell {
  return { id: 'insight', variant: 'metric', gridArea: 'insight1', metric: m.metric }
}
function insightCell(m: ArticleMeta): ResolvedCell {
  return { id: 'insight-text', variant: 'insight', gridArea: 'insight2', body: m.body }
}
function introCell(): ResolvedCell {
  return { id: 'intro', variant: 'mini', gridArea: 'intro1', image: N.intro } as ResolvedCell
}
function evidenceCell(m: ArticleMeta, vibecoder: boolean): ResolvedCell {
  const img = vibecoder ? N.hero : { src: `${WHITEBOARD}/${m.slug}/hero-insight.webp`, alt: m.alt }
  return { id: 'evidence', variant: 'evidence', gridArea: 'evidence1', title: m.evidenceTitle, image: img }
}
function diagramCell(m: ArticleMeta, vibecoder: boolean, lang: SupportedLanguage): ResolvedCell {
  const s = STEPS[lang] ?? STEPS.en
  if (!vibecoder)
    return { id: 'diagram', variant: 'diagram', gridArea: 'diagram1', title: 'Architecture', list: m.listItems, diagram: m.diagram }
  return {
    id: 'diagram', variant: 'evidence', gridArea: 'diagram1',
    title: s.step3, list: m.listItems, diagram: m.diagram, image: N.explainer,
  }
}
function codeCell(m: ArticleMeta, lang: SupportedLanguage): ResolvedCell | null {
  if (!m.codeSnippet) return null
  const s = STEPS[lang] ?? STEPS.en
  return {
    id: 'code', variant: 'diagram', gridArea: 'code1',
    title: s.step4, list: [m.codeSnippet], diagram: m.diagram,
  } as unknown as ResolvedCell
}
function closingCell(lang: SupportedLanguage): ResolvedCell {
  const s = STEPS[lang] ?? STEPS.en
  return { id: 'closing', variant: 'evidence', gridArea: 'closing', title: s.step5, image: N.closing }
}
function mini(id: string, area: string, asset: { src: string; alt: string }): ResolvedCell {
  return { id, variant: 'mini', gridArea: area, image: asset } as ResolvedCell
}
function ctaCell(m: ArticleMeta): ResolvedCell {
  return { id: 'cta', variant: 'cta', gridArea: 'cta1', title: m.ctaTitle, body: m.ctaBody, cta: { label: m.ctaLabel, href: m.ctaHref, variant: 'primary' } }
}

function buildCells(m: ArticleMeta, lang: SupportedLanguage): ResolvedCell[] {
  const v = m.diagram === 'vibecoder'
  const cells: ResolvedCell[] = [introCell(), metricCell(m), insightCell(m)]
  if (v) cells.push(mini('beat-countdown', 'beat1', N.countdown))
  cells.push(evidenceCell(m, v))
  if (v) cells.push(mini('beat-pointing', 'beat2', N.pointing))
  cells.push(diagramCell(m, v, lang))
  if (v) {
    cells.push(mini('beat-routing', 'beat3', N.routing))
    const cc = codeCell(m, lang)
    if (cc) cells.push(cc)
    cells.push(mini('beat-dodging', 'beat4', N.dodging))
    cells.push(closingCell(lang))
    cells.push(mini('beat-success', 'beat5', N.success))
  }
  cells.push(ctaCell(m))
  if (v) {
    cells.push(mini('beat-cta', 'beat6', N.ctaPoint))
    cells.push(mini('beat-energetic', 'beat7', N.energetic))
  }
  return cells
}

// ─── GRID TEMPLATE ───

const VIBECODER_GRID = {
  gridTemplate:
    '"intro1 intro1 intro1" ' +
    '"insight1 insight2 evidence1" ' +
    '"beat1 beat1 beat1" ' +
    '"diagram1 diagram1 diagram1" ' +
    '"beat2 beat2 beat2" ' +
    '"beat3 beat3 beat3" ' +
    '"code1 code1 code1" ' +
    '"beat4 beat4 beat4" ' +
    '"closing closing closing" ' +
    '"beat5 beat5 beat5" ' +
    '"beat6 beat6 beat6" ' +
    '"cta1 cta1 cta1" ' +
    '"beat7 beat7 beat7"',
  gridColumns: 'auto 1fr 1fr',
  gridRows: 'auto auto 56px auto 56px 56px auto 56px auto 56px 56px auto 56px',
}

const DEFAULT_GRID = {
  gridTemplate: '"insight1 insight2 evidence1" "diagram1 diagram1 diagram1" "cta1 cta1 cta1"',
  gridColumns: 'auto 1fr 1fr',
  gridRows: 'auto auto auto',
}

export function getStoryboardLayout(
  slug: string,
  lang: SupportedLanguage,
  _t: TranslationStrings
): ResolvedLayout | null {
  const m = getArticleMeta(slug, lang)
  if (!m) return null
  const grid = m.diagram === 'vibecoder' ? VIBECODER_GRID : DEFAULT_GRID
  return { version: '2.0', ...grid, cells: buildCells(m, lang), metaTitle: m.title }
}

export function hasStoryboardLayout(slug: string): boolean {
  return slug in ARTICLES_EN || slug in ARTICLES_PT
}

// ─── MANGA LAYOUT (12-panel sequential with kawaii overlay) ───

export interface MangaPanel {
  id: string
  vneType: 'hook' | 'myth' | 'promise' | 'analogy' | 'architecture' | 'code-peek' | 'decision' | 'warning' | 'benchmark' | 'hands-on' | 'result' | 'next-step'
  bgSrc: string
  bgAlt: string
  kawaiiSrc: string
  kawaiiAlt: string
  kawaiiPos: 'bottom-right' | 'bottom-left'
  step: number
  total: number
  wide?: boolean
  bgIsCss?: boolean
  title: string
  body?: string
  list?: string[]
  codeSnippet?: string
}

export function getMangaLayout(slug: string): MangaPanel[] | null {
  if (slug !== 'tencent-cloud-deal-stack-builders') return null
  const T = 12
  const bg = (id: string) => `/assets/manga-bg/tencent-cloud-deal/bg-${id}.webp`
  const kw = (name: string) => `/assets/kawaii-vibecoder/mini/mini-${name}.webp`
  const R = 'bottom-right' as const
  const L = 'bottom-left' as const

  return [
    { id: '01-hook', vneType: 'hook', bgSrc: bg('01-hook'), bgAlt: 'Messy desk', kawaiiSrc: kw('confused-hand-chin'), kawaiiAlt: 'Confused', kawaiiPos: R, step: 1, total: T, bgIsCss: true, title: 'Nuvem demais', body: 'AWS? GCP? Azure? Relaxa.' },
    { id: '02-myth', vneType: 'myth', bgSrc: bg('02-context'), bgAlt: 'Builder vs Corp', kawaiiSrc: kw('thinking-brain'), kawaiiAlt: 'Skeptical', kawaiiPos: L, step: 2, total: T, title: 'Mito: só enterprise usa cloud', body: 'Builders solo também.' },
    { id: '03-promise', vneType: 'promise', bgSrc: bg('03-mechanism'), bgAlt: '3-layer stack', kawaiiSrc: kw('presenting-open-arms'), kawaiiAlt: 'Excited', kawaiiPos: R, step: 3, total: T, title: '3 peças, 1 stack', body: 'Lighthouse → CVM → EdgeOne.' },
    { id: '04-analogy', vneType: 'analogy', bgSrc: bg('04-detail-a'), bgAlt: 'Menu analogy', kawaiiSrc: kw('architect-working'), kawaiiAlt: 'Explaining', kawaiiPos: R, step: 4, total: T, title: 'Cardápio de cloud', body: 'Escolhe o que precisa. Só.' },
    { id: '05-architecture', vneType: 'architecture', bgSrc: bg('05-architecture-wide'), bgAlt: 'Architecture', kawaiiSrc: kw('looking-up'), kawaiiAlt: 'Blueprint', kawaiiPos: R, step: 5, total: T, wide: true, title: 'A arquitetura', list: ['Lighthouse: VPS', 'CVM: compute', 'EdgeOne: CDN', 'IAM: 1 conta'] },
    { id: '06-code-peek', vneType: 'code-peek', bgSrc: bg('06-code'), bgAlt: 'Terminal', kawaiiSrc: kw('typing-keyboard'), kawaiiAlt: 'Typing', kawaiiPos: L, step: 6, total: T, title: '1 comando, no ar', codeSnippet: 'tccli lighthouse CreateInstance --bundle bundle2022_gen_01 --blueprint wordpress' },
    { id: '07-decision', vneType: 'decision', bgSrc: bg('08-validation'), bgAlt: 'Checklist', kawaiiSrc: kw('thinking-brain'), kawaiiAlt: 'Weighing', kawaiiPos: R, step: 7, total: T, title: 'Checklist de decisão', list: ['✓ VPS? Lighthouse', '✓ Escala? CVM', '☐ CDN? EdgeOne'] },
    { id: '08-warning', vneType: 'warning', bgSrc: bg('07-warning'), bgAlt: 'Warning', kawaiiSrc: kw('dodging-x'), kawaiiAlt: 'Alarmed', kawaiiPos: R, step: 8, total: T, bgIsCss: true, title: '3 erros que custam', list: ['DONT over-provision', 'AVOID static', 'NEVER skip CDN'] },
    { id: '09-benchmark', vneType: 'benchmark', bgSrc: bg('05-detail-b'), bgAlt: 'Benchmark', kawaiiSrc: kw('pointing-right'), kawaiiAlt: 'Analyzing', kawaiiPos: L, step: 9, total: T, title: 'Números reais', list: ['S5: $12/mês', 'SA2: $18', 'GPU: $45', 'Bundle -30%'] },
    { id: '10-hands-on', vneType: 'hands-on', bgSrc: bg('10-hands-on-wide'), bgAlt: 'Tutorial', kawaiiSrc: kw('typing-keyboard'), kawaiiAlt: 'Building', kawaiiPos: L, step: 10, total: T, wide: true, title: 'Mão na massa', codeSnippet: 'tccli lighthouse CreateInstance\n# WordPress online em 30s' },
    { id: '11-result', vneType: 'result', bgSrc: bg('09-result'), bgAlt: 'Success', kawaiiSrc: kw('success-arms-up'), kawaiiAlt: 'Celebrating', kawaiiPos: R, step: 11, total: T, title: 'Sua stack está viva!', body: '$3.27/mês. IP público.' },
    { id: '12-next-step', vneType: 'next-step', bgSrc: bg('12-meta'), bgAlt: 'Path', kawaiiSrc: kw('energetic-jump'), kawaiiAlt: 'Forward', kawaiiPos: R, step: 12, total: T, title: 'Próximo passo', body: 'Monitora. Escala. Domina.' },
  ]
}
