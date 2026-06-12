import type { ResolvedCell, ResolvedLayout } from '~/components/storyboard-grid/types'
import type { SupportedLanguage } from '~/i18n/types'
import type { TranslationStrings } from '~/i18n/types'
import tencentCaptions from './tencent-captions.json'

const KAWAII = '/assets/kawaii-vibecoder'
const VNE_PACK = '/assets/vne/tencent-cloud-deal-stack-builders/panels'

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

// JRPG hero variants for magica articles
const JRPG_MAGICA = '/assets/jrpg-magica'
const JRPG_MINI = `${JRPG_MAGICA}/mini`
const JRPG = {
  overview: { src: `${JRPG_MAGICA}/magica-overview-hero.jpg`, alt: 'JRPG AI command center' },
  quickstart: { src: `${JRPG_MAGICA}/magica-quickstart-hero.jpg`, alt: 'JRPG tutorial portal' },
  mcp: { src: `${JRPG_MAGICA}/magica-mcp-server-hero.jpg`, alt: 'JRPG server temple' },
}

// JRPG mini connector variants for magica articles
const JRPG_N = {
  intro: { src: `${JRPG_MINI}/mini-waving-goodbye.webp`, alt: 'JRPG waving hand' },
  countdown: { src: `${JRPG_MINI}/mini-countdown-4.webp`, alt: 'JRPG countdown 4' },
  pointing: { src: `${JRPG_MINI}/mini-pointing-right.webp`, alt: 'JRPG pointing right' },
  thinking: { src: `${JRPG_MINI}/mini-thinking-brain.webp`, alt: 'JRPG thinking brain' },
  routing: { src: `${JRPG_MINI}/mini-routing-arrows.webp`, alt: 'JRPG routing arrows' },
  dodging: { src: `${JRPG_MINI}/mini-dodging-x.webp`, alt: 'JRPG dodging shield' },
}

// Article slugs that use JRPG mini connectors
const JRPG_MINI_SLUGS = new Set(['magica-overview', 'magica-quickstart', 'magica-mcp-server'])

// ─── i18n: Vibecoder step labels ───

const STEPS: Record<SupportedLanguage, { step3: string; step4: string; step5: string }> = {
  en: { step3: 'Step 3 — Architecture', step4: 'Step 4 — The Command', step5: 'Step 5 — Done!' },
  pt: {
    step3: 'Passo 3 — A arquitetura',
    step4: 'Passo 4 — O comando',
    step5: 'Passo 5 — Pronto!',
  },
  es: {
    step3: 'Paso 3 — La arquitectura',
    step4: 'Paso 4 — El comando',
    step5: 'Paso 5 — ¡Listo!',
  },
  fr: {
    step3: "Étape 3 — L'architecture",
    step4: 'Étape 4 — La commande',
    step5: 'Étape 5 — Terminé!',
  },
  de: {
    step3: 'Schritt 3 — Architektur',
    step4: 'Schritt 4 — Der Befehl',
    step5: 'Schritt 5 — Fertig!',
  },
  it: {
    step3: "Passo 3 — L'architettura",
    step4: 'Passo 4 — Il comando',
    step5: 'Passo 5 — Fatto!',
  },
  ja: {
    step3: 'ステップ 3 — アーキテクチャ',
    step4: 'ステップ 4 — コマンド',
    step5: 'ステップ 5 — 完了!',
  },
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
    metric: {
      value: '4',
      label: 'passos ate sua primeira resposta',
      delta: '~90s do zero ao deploy',
    },
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

const ARTICLES_DE: Record<string, ArticleMeta> = {
  'magica-overview': {
    slug: 'magica-overview',
    title: 'Magica: KI ohne Expertenhut',
    body: 'Vier Schritte, ein Kaffee. Magica wählt die beste KI für Sie.',
    evidenceTitle: 'Wie es funktioniert',
    listItems: [
      'Sie sprechen mit Magica',
      'Sie prüft, welche KI am günstigsten ist',
      'Sie überspringt die defekten und nutzt die guten',
      'Sie erhalten die Antwort + die Kosten',
    ],
    diagram: 'vibecoder',
    metric: {
      value: '4',
      label: 'Schritte bis zur ersten Antwort',
      delta: '~90s vom Start bis zum Deploy',
    },
    ctaTitle: 'Jetzt ausprobieren',
    ctaBody: 'In Ihr Terminal einfügen und die erste Antwort erhalten.',
    ctaLabel: 'In Aktion sehen',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Kawaii-Charakter mit Post-its',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"ola"}]}\'',
  },
  'magica-quickstart': {
    slug: 'magica-quickstart',
    title: 'Vom Nullpunkt zum ersten Befehl',
    body: 'Konto erstellen, Key generieren, Aufruf machen. Keine endlosen Dokumentationen.',
    evidenceTitle: 'Einrichtung in 4 Schritten',
    listItems: [
      'Konto erstellen',
      'API-Key generieren',
      'Modell wählen (oder auto)',
      'Aufruf machen: curl oder Node.js',
    ],
    diagram: 'vibecoder',
    metric: { value: '~90s', label: 'vom Konto bis zur ersten Antwort', delta: 'Echter p50' },
    ctaTitle: 'Erste Schritte',
    ctaBody: 'Kostenlos. Keine Kreditkarte.',
    ctaLabel: 'Registrieren',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Kawaii zeigt die 4 Schritte',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"hello world"}]}\'',
  },
  'magica-mcp-server': {
    slug: 'magica-mcp-server',
    title: 'MCP: Das Protokoll, das KIs mit Tools verbindet',
    body: 'Model Context Protocol. 30 Zeilen. Ihre KI entdeckt Tools selbstständig.',
    evidenceTitle: 'Wie MCP funktioniert',
    listItems: [
      'JSON-RPC 2.0 über stdio oder SSE/HTTP',
      'Automatische Erkennung',
      'Sandbox mit Bearer-Authentifizierung',
      'Hot-Reload während der Entwicklung',
    ],
    diagram: 'vibecoder',
    metric: { value: '4', label: 'Schichten: Host → Client → Transport → Server' },
    ctaTitle: 'Mit MCP entwickeln',
    ctaBody: 'Bauen Sie noch heute MCP-Server.',
    ctaLabel: 'MCP-Dokumentation',
    ctaHref: 'https://modelcontextprotocol.io',
    alt: 'MCP-Architekturdiagramm',
    codeSnippet:
      'import { Server } from "@modelcontextprotocol/sdk/server/index.js";\nconst server = new Server({ name: "meu-servidor", version: "1.0" },\n  { capabilities: { tools: {} } });',
  },
  'tencent-cloud-deal-stack-builders': {
    slug: 'tencent-cloud-deal-stack-builders',
    title: 'Tencent Cloud Stack für Builder',
    body: 'Lighthouse, CVM, EdgeOne. Eine Abrechnung. Einheitliches IAM.',
    evidenceTitle: 'Stack-Übersicht',
    listItems: [
      'Lighthouse: WP, Ghost, n8n mit 1 Klick',
      'CVM: S5, SA2, GPU',
      'EdgeOne: HTTP/3, WAF, 280+ PoPs',
      'Bundle: 30% Rabatt',
    ],
    diagram: 'vibecoder',
    metric: { value: '30%', label: 'Bundle-Rabatt', delta: '12 Monate' },
    ctaTitle: 'Jetzt bereitstellen',
    ctaBody: 'Überprüfen Sie die aktuellen Angebote.',
    ctaLabel: 'Angebote ansehen',
    ctaHref: 'https://tencentcloud.com',
    alt: 'Tencent Cloud-Diagramm',
    codeSnippet: 'tccli lighthouse DescribeInstances --region ap-sao-paulo',
  },
}

const ARTICLES_ES: Record<string, ArticleMeta> = {
  'magica-overview': {
    slug: 'magica-overview',
    title: 'Magica: IA sin el sombrero de experto',
    body: 'Cuatro pasos, un café. Magica elige la mejor IA para ti.',
    evidenceTitle: 'Cómo funciona',
    listItems: [
      'Hablas con Magica',
      'Comprueba qué IA es más barata',
      'Omite las rotas, usa las buenas',
      'Recibes la respuesta + el costo',
    ],
    diagram: 'vibecoder',
    metric: {
      value: '4',
      label: 'pasos hasta tu primera respuesta',
      delta: '~90s desde cero hasta el despliegue',
    },
    ctaTitle: 'Pruébalo ahora',
    ctaBody: 'Pégalo en tu terminal y obtén tu primera respuesta.',
    ctaLabel: 'Ver en acción',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Personaje kawaii con post-its',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"ola"}]}\'',
  },
  'magica-quickstart': {
    slug: 'magica-quickstart',
    title: 'De cero al primer comando',
    body: 'Crea una cuenta, genera una clave, haz la llamada. Sin documentación infinita.',
    evidenceTitle: 'Configuración en 4 pasos',
    listItems: [
      'Crea tu cuenta',
      'Genera una API key',
      'Elige un modelo (o auto)',
      'Haz la llamada: curl o Node.js',
    ],
    diagram: 'vibecoder',
    metric: { value: '~90s', label: 'de la cuenta a la primera respuesta', delta: 'p50 real' },
    ctaTitle: 'Comenzar',
    ctaBody: 'Gratis. Sin tarjeta de crédito.',
    ctaLabel: 'Registrarse',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Kawaii mostrando los 4 pasos',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"hello world"}]}\'',
  },
  'magica-mcp-server': {
    slug: 'magica-mcp-server',
    title: 'MCP: El protocolo que conecta las IA con las herramientas',
    body: 'Model Context Protocol. 30 líneas. Tu IA descubre herramientas por sí sola.',
    evidenceTitle: 'Cómo funciona MCP',
    listItems: [
      'JSON-RPC 2.0 sobre stdio o SSE/HTTP',
      'Descubrimiento automático',
      'Sandbox con autenticación portador',
      'Recarga en caliente durante el desarrollo',
    ],
    diagram: 'vibecoder',
    metric: { value: '4', label: 'capas: Host → Cliente → Transporte → Servidor' },
    ctaTitle: 'Construir con MCP',
    ctaBody: 'Comienza a construir servidores MCP hoy.',
    ctaLabel: 'Docs de MCP',
    ctaHref: 'https://modelcontextprotocol.io',
    alt: 'Diagrama de arquitectura MCP',
    codeSnippet:
      'import { Server } from "@modelcontextprotocol/sdk/server/index.js";\nconst server = new Server({ name: "meu-servidor", version: "1.0" },\n  { capabilities: { tools: {} } });',
  },
  'tencent-cloud-deal-stack-builders': {
    slug: 'tencent-cloud-deal-stack-builders',
    title: 'Stack de Tencent Cloud para Builders',
    body: 'Lighthouse, CVM, EdgeOne. Una sola facturación. IAM unificado.',
    evidenceTitle: 'Resumen de la pila',
    listItems: [
      'Lighthouse: WP, Ghost, n8n en 1 clic',
      'CVM: S5, SA2, GPU',
      'EdgeOne: HTTP/3, WAF, 280+ PoPs',
      'Bundle: 30% de descuento',
    ],
    diagram: 'vibecoder',
    metric: { value: '30%', label: 'descuento de la pila', delta: '12 meses' },
    ctaTitle: 'Desplegar ahora',
    ctaBody: 'Consulta las ofertas actuales.',
    ctaLabel: 'Ver ofertas',
    ctaHref: 'https://tencentcloud.com',
    alt: 'Diagrama de Tencent Cloud',
    codeSnippet: 'tccli lighthouse DescribeInstances --region ap-sao-paulo',
  },
}

const ARTICLES_FR: Record<string, ArticleMeta> = {
  'magica-overview': {
    slug: 'magica-overview',
    title: "Magica : l'IA sans le chapeau d'expert",
    body: 'Quatre étapes, un café. Magica choisit la meilleure IA pour vous.',
    evidenceTitle: 'Comment ça marche',
    listItems: [
      'Vous parlez à Magica',
      'Elle vérifie quelle IA est la moins chère',
      'Elle ignore celles qui ne marchent pas et utilise les bonnes',
      'Vous obtenez la réponse + le coût',
    ],
    diagram: 'vibecoder',
    metric: {
      value: '4',
      label: 'étapes vers votre première réponse',
      delta: '~90s du départ au déploiement',
    },
    ctaTitle: 'Essayer maintenant',
    ctaBody: 'Collez dans votre terminal et obtenez votre première réponse.',
    ctaLabel: 'Voir en action',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Personnage kawaii avec des post-its',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"ola"}]}\'',
  },
  'magica-quickstart': {
    slug: 'magica-quickstart',
    title: 'De zéro au premier commande',
    body: "Créez un compte, générez une clé, passez l'appel. Pas de docs infinies.",
    evidenceTitle: 'Configuration en 4 étapes',
    listItems: [
      'Créez votre compte',
      'Générez une clé API',
      'Choisissez un modèle (ou auto)',
      "Passez l'appel : curl ou Node.js",
    ],
    diagram: 'vibecoder',
    metric: { value: '~90s', label: 'du compte à la première réponse', delta: 'p50 réel' },
    ctaTitle: 'Démarrer',
    ctaBody: 'Gratuit. Sans carte de crédit.',
    ctaLabel: "S'inscrire",
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Kawaii montrant les 4 étapes',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"hello world"}]}\'',
  },
  'magica-mcp-server': {
    slug: 'magica-mcp-server',
    title: 'MCP : le protocole qui connecte les IA aux outils',
    body: 'Model Context Protocol. 30 lignes. Votre IA découvre des outils par elle-même.',
    evidenceTitle: 'Comment fonctionne le MCP',
    listItems: [
      'JSON-RPC 2.0 sur stdio ou SSE/HTTP',
      'Découverte automatique',
      'Sandbox avec authentification par jeton',
      'Rechargement à chaud en cours de dév',
    ],
    diagram: 'vibecoder',
    metric: { value: '4', label: 'couches : Hôte → Client → Transport → Serveur' },
    ctaTitle: 'Bâtir avec MCP',
    ctaBody: "Commencez à construire des serveurs MCP aujourd'hui.",
    ctaLabel: 'Docs MCP',
    ctaHref: 'https://modelcontextprotocol.io',
    alt: "Diagramme d'architecture MCP",
    codeSnippet:
      'import { Server } from "@modelcontextprotocol/sdk/server/index.js";\nconst server = new Server({ name: "meu-servidor", version: "1.0" },\n  { capabilities: { tools: {} } });',
  },
  'tencent-cloud-deal-stack-builders': {
    slug: 'tencent-cloud-deal-stack-builders',
    title: 'Stack Tencent Cloud pour les Builders',
    body: 'Lighthouse, CVM, EdgeOne. Une seule facturation. IAM unifié.',
    evidenceTitle: 'Aperçu de la stack',
    listItems: [
      'Lighthouse : WP, Ghost, n8n en 1 clic',
      'CVM : S5, SA2, GPU',
      'EdgeOne : HTTP/3, WAF, 280+ PoPs',
      'Bundle : 30% de réduction',
    ],
    diagram: 'vibecoder',
    metric: { value: '30%', label: 'réduction du pack', delta: '12 mois' },
    ctaTitle: 'Déployer',
    ctaBody: 'Vérifiez les offres actuelles.',
    ctaLabel: 'Voir les offres',
    ctaHref: 'https://tencentcloud.com',
    alt: 'Diagramme Tencent Cloud',
    codeSnippet: 'tccli lighthouse DescribeInstances --region ap-sao-paulo',
  },
}

const ARTICLES_IT: Record<string, ArticleMeta> = {
  'magica-overview': {
    slug: 'magica-overview',
    title: "Magica: l'IA senza cappello da esperto",
    body: 'Quattro passaggi, un caffè. Magica sceglie la migliore IA per te.',
    evidenceTitle: 'Come funziona',
    listItems: [
      'Parli con Magica',
      'Controlla quale IA è la più economica',
      'Salta quelle rotte, usa quelle buone',
      'Ottieni la risposta + il costo',
    ],
    diagram: 'vibecoder',
    metric: {
      value: '4',
      label: 'passaggi fino alla prima risposta',
      delta: '~90s da zero al deployment',
    },
    ctaTitle: 'Provalo ora',
    ctaBody: 'Incolla nel tuo terminale e ricevi la prima risposta.',
    ctaLabel: 'Vedi in azione',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Personaggio kawaii con post-it',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"ola"}]}\'',
  },
  'magica-quickstart': {
    slug: 'magica-quickstart',
    title: 'Da zero al primo comando',
    body: 'Crea un account, genera una chiave, effettua la chiamata. Senza documentazione infinita.',
    evidenceTitle: 'Configurazione in 4 passaggi',
    listItems: [
      'Crea il tuo account',
      'Genera una chiave API',
      'Scegli un modello (o auto)',
      'Effettua la chiamata: curl o Node.js',
    ],
    diagram: 'vibecoder',
    metric: { value: '~90s', label: "dall'account alla prima resposta", delta: 'p50 reale' },
    ctaTitle: 'Inizia ora',
    ctaBody: 'Gratis. Senza carta di credito.',
    ctaLabel: 'Registrati',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Kawaii mostra i 4 passaggi',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"hello world"}]}\'',
  },
  'magica-mcp-server': {
    slug: 'magica-mcp-server',
    title: 'MCP: Il protocollo que connette le IA agli strumenti',
    body: 'Model Context Protocol. 30 righe. La tua IA scopre gli strumenti da sola.',
    evidenceTitle: 'Come funziona MCP',
    listItems: [
      'JSON-RPC 2.0 su stdio o SSE/HTTP',
      'Rilevamento automatico',
      'Sandbox con autenticazione bearer',
      'Hot-reload durante lo sviluppo',
    ],
    diagram: 'vibecoder',
    metric: { value: '4', label: 'strati: Host → Client → Transport → Server' },
    ctaTitle: 'Crea con MCP',
    ctaBody: 'Inizia a creare server MCP oggi.',
    ctaLabel: 'Docs MCP',
    ctaHref: 'https://modelcontextprotocol.io',
    alt: "Diagramma dell'architettura MCP",
    codeSnippet:
      'import { Server } from "@modelcontextprotocol/sdk/server/index.js";\nconst server = new Server({ name: "meu-servidor", version: "1.0" },\n  { capabilities: { tools: {} } });',
  },
  'tencent-cloud-deal-stack-builders': {
    slug: 'tencent-cloud-deal-stack-builders',
    title: 'Stack Tencent Cloud per i Builder',
    body: "Lighthouse, CVM, EdgeOne. Un'unica fatturazione. IAM unificato.",
    evidenceTitle: 'Panoramica dello stack',
    listItems: [
      'Lighthouse: WP, Ghost, n8n in 1 clic',
      'CVM: S5, SA2, GPU',
      'EdgeOne: HTTP/3, WAF, 280+ PoPs',
      'Bundle: 30% di sconto',
    ],
    diagram: 'vibecoder',
    metric: { value: '30%', label: 'sconto bundle', delta: '12 mesi' },
    ctaTitle: 'Distribuisci ora',
    ctaBody: 'Controlla le offerte attuali.',
    ctaLabel: 'Vedi offerte',
    ctaHref: 'https://tencentcloud.com',
    alt: 'Diagramma Tencent Cloud',
    codeSnippet: 'tccli lighthouse DescribeInstances --region ap-sao-paulo',
  },
}

const ARTICLES_JA: Record<string, ArticleMeta> = {
  'magica-overview': {
    slug: 'magica-overview',
    title: 'Magica: 専門知識不要 of AI',
    body: '4ステップ、コーヒー1杯。Magicaが最適なAIを自動選択します。',
    evidenceTitle: '仕組み',
    listItems: [
      'Magicaに話しかける',
      'どのAIが最も安いか確認する',
      '壊れたものをスキップし、正常なものを使用する',
      '回答とコストを取得する',
    ],
    diagram: 'vibecoder',
    metric: {
      value: '4',
      label: '最初の回答までのステップ数',
      delta: 'ゼロからデプロイまで約90秒',
    },
    ctaTitle: '今すぐ試す',
    ctaBody: 'ターミナルに貼り付けて、最初の回答を取得します。',
    ctaLabel: '動作を確認する',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: '付箋を持ったかわいいキャラクター',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"ola"}]}\'',
  },
  'magica-quickstart': {
    slug: 'magica-quickstart',
    title: 'ゼロから最初のコマンドまで',
    body: 'アカウント作成、キーの生成、呼び出し。長いドキュメントを読む必要はありません。',
    evidenceTitle: '4ステップのセットアップ',
    listItems: [
      'アカウントを作成する',
      'APIキーを生成する',
      'モデルを選択する（またはauto）',
      '呼び出しを行う: curlまたはNode.js',
    ],
    diagram: 'vibecoder',
    metric: { value: '~90秒', label: 'アカウント作成から最初の回答まで', delta: '実際のp50' },
    ctaTitle: '始める',
    ctaBody: '無料。クレジットカード不要。',
    ctaLabel: 'アカウント登録',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: '4つのステップを示すかわいいイラスト',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"hello world"}]}\'',
  },
  'magica-mcp-server': {
    slug: 'magica-mcp-server',
    title: 'MCP: AIとツールをつなぐプロトコル',
    body: 'Model Context Protocol。わずか30行。AIが自分でツールを発見します。',
    evidenceTitle: 'MCPの仕組み',
    listItems: [
      'stdioまたはSSE/HTTP上のJSON-RPC 2.0',
      '自動ディスカバリ',
      'ベアラ認証付きのサンドボックス',
      '開発中のホットリロード',
    ],
    diagram: 'vibecoder',
    metric: { value: '4', label: 'レイヤー: ホスト → クライアント → トランスポート → サーバー' },
    ctaTitle: 'MCPで構築する',
    ctaBody: '今日からMCPサーバーの構築を始めましょう。',
    ctaLabel: 'MCPドキュメント',
    ctaHref: 'https://modelcontextprotocol.io',
    alt: 'MCPアーキテクチャ図',
    codeSnippet:
      'import { Server } from "@modelcontextprotocol/sdk/server/index.js";\nconst server = new Server({ name: "meu-servidor", version: "1.0" },\n  { capabilities: { tools: {} } });',
  },
  'tencent-cloud-deal-stack-builders': {
    slug: 'tencent-cloud-deal-stack-builders',
    title: '開発者向けTencent Cloudスタック',
    body: 'Lighthouse、CVM、EdgeOne。支払いを一本化し、IAMを一元管理。',
    evidenceTitle: 'スタックの概要',
    listItems: [
      'Lighthouse: WP、Ghost、n8nを1クリック起動',
      'CVM: S5、SA2、GPUインスタンス',
      'EdgeOne: HTTP/3、WAF、280以上のPoP',
      'バンドル: 30%割引',
    ],
    diagram: 'vibecoder',
    metric: { value: '30%', label: 'バンドル割引', delta: '12ヶ月間' },
    ctaTitle: '今すぐデプロイ',
    ctaBody: '現在のキャンペーン情報をご確認ください。',
    ctaLabel: 'オファーを見る',
    ctaHref: 'https://tencentcloud.com',
    alt: 'Tencent Cloudの構成図',
    codeSnippet: 'tccli lighthouse DescribeInstances --region ap-sao-paulo',
  },
}

const ARTICLES_ZH: Record<string, ArticleMeta> = {
  'magica-overview': {
    slug: 'magica-overview',
    title: 'Magica：无需专业知识的 AI',
    body: '四个步骤，一杯咖啡。Magica 为您选择最佳 AI。',
    evidenceTitle: '工作原理',
    listItems: [
      '与 Magica 对话',
      '检查哪家 AI 最便宜',
      '跳过故障的，使用正常的',
      '获取回答 + 成本',
    ],
    diagram: 'vibecoder',
    metric: { value: '4', label: '获得首个回答的步骤', delta: '从零到部署仅需约90秒' },
    ctaTitle: '立即体验',
    ctaBody: '粘贴到终端，获取您的首个回答。',
    ctaLabel: '查看演示',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: '贴着便利贴的可爱角色',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"ola"}]}\'',
  },
  'magica-quickstart': {
    slug: 'magica-quickstart',
    title: '从零到首个命令',
    body: '注册账户，生成密钥，发起调用。无需阅读冗长的文档。',
    evidenceTitle: '四步完成设置',
    listItems: [
      '注册您的账户',
      '生成 API 密钥',
      '选择模型（或 auto）',
      '发起调用：curl 或 Node.js',
    ],
    diagram: 'vibecoder',
    metric: { value: '~90秒', label: '从注册到首个回答', delta: '真实 p50' },
    ctaTitle: '开始使用',
    ctaBody: '免费。无需信用卡。',
    ctaLabel: '立即注册',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: '展示四个步骤的可爱角色',
    codeSnippet:
      'curl -X POST https://api.magica.dev/v1/chat \\\n  -H "Authorization: Bearer $MAGICA_KEY" \\\n  -d \'{"model":"auto","messages":[{"role":"user","content":"hello world"}]}\'',
  },
  'magica-mcp-server': {
    slug: 'magica-mcp-server',
    title: 'MCP：连接 AI 与工具的协议',
    body: 'Model Context Protocol。仅需 30 行。您的 AI 会自行发现工具。',
    evidenceTitle: 'MCP 工作原理',
    listItems: [
      '基于 stdio 或 SSE/HTTP 的 JSON-RPC 2.0',
      '自动发现',
      '带 Bearer 认证的安全沙箱',
      '开发过程中的热重载',
    ],
    diagram: 'vibecoder',
    metric: { value: '4', label: '层级结构：Host → Client → Transport → Server' },
    ctaTitle: '构建 MCP 模块',
    ctaBody: '今天就开始构建您的 MCP 服务器。',
    ctaLabel: 'MCP 文档',
    ctaHref: 'https://modelcontextprotocol.io',
    alt: 'MCP 架构图',
    codeSnippet:
      'import { Server } from "@modelcontextprotocol/sdk/server/index.js";\nconst server = new Server({ name: "meu-servidor", version: "1.0" },\n  { capabilities: { tools: {} } });',
  },
  'tencent-cloud-deal-stack-builders': {
    slug: 'tencent-cloud-deal-stack-builders',
    title: '面向开发者的腾讯云技术栈',
    body: 'Lighthouse、CVM、EdgeOne。统一计费，统一 IAM 管理。',
    evidenceTitle: '技术栈概览',
    listItems: [
      'Lighthouse：一键部署 WP、Ghost、n8n',
      'CVM：S5、SA2、GPU 实例',
      'EdgeOne：支持 HTTP/3、WAF、拥有 280+ 边缘节点',
      '组合套餐：享受 30% 折扣',
    ],
    diagram: 'vibecoder',
    metric: { value: '30%', label: '套餐包折扣', delta: '12 个月' },
    ctaTitle: '立即部署',
    ctaBody: '查看当前最新的优惠活动。',
    ctaLabel: '查看优惠',
    ctaHref: 'https://tencentcloud.com',
    alt: '腾讯云技术栈架构图',
    codeSnippet: 'tccli lighthouse DescribeInstances --region ap-sao-paulo',
  },
}

const LOCALE_MAP: Record<SupportedLanguage, Record<string, ArticleMeta>> = {
  en: ARTICLES_EN,
  pt: ARTICLES_PT,
  de: ARTICLES_DE,
  es: ARTICLES_ES,
  fr: ARTICLES_FR,
  it: ARTICLES_IT,
  ja: ARTICLES_JA,
  zh: ARTICLES_ZH,
}

// ─── Locale-aware article lookup ───

function getArticleMeta(slug: string, lang: SupportedLanguage): ArticleMeta | undefined {
  const dict = LOCALE_MAP[lang] ?? ARTICLES_EN
  const primary = dict[slug]
  if (primary) return primary

  // Fallback chain: try EN first, then PT
  if (lang !== 'en' && ARTICLES_EN[slug]) return ARTICLES_EN[slug]
  if (lang !== 'pt' && ARTICLES_PT[slug]) return ARTICLES_PT[slug]
  return undefined
}

// ─── CELL BUILDERS ───

function metricCell(m: ArticleMeta): ResolvedCell {
  return { id: 'insight', variant: 'metric', gridArea: 'insight1', metric: m.metric }
}
function insightCell(m: ArticleMeta): ResolvedCell {
  return { id: 'insight-text', variant: 'insight', gridArea: 'insight2', body: m.body }
}
function introCell(slug: string): ResolvedCell {
  const img = JRPG_MINI_SLUGS.has(slug) ? JRPG_N.intro : N.intro
  return { id: 'intro', variant: 'mini', gridArea: 'intro1', image: img } as ResolvedCell
}
function evidenceCell(_m: ArticleMeta, _vibecoder: boolean): ResolvedCell {
  const heroImg =
    _m.slug === 'magica-overview'
      ? JRPG.overview
      : _m.slug === 'magica-quickstart'
        ? JRPG.quickstart
        : _m.slug === 'magica-mcp-server'
          ? JRPG.mcp
          : N.hero
  return {
    id: 'evidence',
    variant: 'evidence',
    gridArea: 'evidence1',
    title: _m.evidenceTitle,
    image: heroImg,
  }
}
function diagramCell(m: ArticleMeta, vibecoder: boolean, lang: SupportedLanguage): ResolvedCell {
  const s = STEPS[lang] ?? STEPS.en
  if (!vibecoder)
    return {
      id: 'diagram',
      variant: 'diagram',
      gridArea: 'diagram1',
      title: 'Architecture',
      list: m.listItems,
      diagram: m.diagram,
    }
  return {
    id: 'diagram',
    variant: 'evidence',
    gridArea: 'diagram1',
    title: s.step3,
    list: m.listItems,
    diagram: m.diagram,
    image: N.explainer,
  }
}
function codeCell(m: ArticleMeta, lang: SupportedLanguage): ResolvedCell | null {
  if (!m.codeSnippet) return null
  const s = STEPS[lang] ?? STEPS.en
  return {
    id: 'code',
    variant: 'diagram',
    gridArea: 'code1',
    title: s.step4,
    list: [m.codeSnippet],
    diagram: m.diagram,
  } as unknown as ResolvedCell
}
function closingCell(lang: SupportedLanguage): ResolvedCell {
  const s = STEPS[lang] ?? STEPS.en
  return {
    id: 'closing',
    variant: 'evidence',
    gridArea: 'closing',
    title: s.step5,
    image: N.closing,
  }
}
function mini(id: string, area: string, asset: { src: string; alt: string }): ResolvedCell {
  return { id, variant: 'mini', gridArea: area, image: asset } as ResolvedCell
}
function ctaCell(m: ArticleMeta): ResolvedCell {
  return {
    id: 'cta',
    variant: 'cta',
    gridArea: 'cta1',
    title: m.ctaTitle,
    body: m.ctaBody,
    cta: { label: m.ctaLabel, href: m.ctaHref, variant: 'primary' },
  }
}

function buildCells(m: ArticleMeta, lang: SupportedLanguage): ResolvedCell[] {
  const v = m.diagram === 'vibecoder'
  const isMagica = JRPG_MINI_SLUGS.has(m.slug)
  const cells: ResolvedCell[] = [introCell(m.slug), metricCell(m), insightCell(m)]
  if (v) cells.push(mini('beat-countdown', 'beat1', isMagica ? JRPG_N.countdown : N.countdown))
  cells.push(evidenceCell(m, v))
  if (v) cells.push(mini('beat-pointing', 'beat2', isMagica ? JRPG_N.pointing : N.pointing))
  cells.push(diagramCell(m, v, lang))
  if (v) {
    cells.push(mini('beat-routing', 'beat3', isMagica ? JRPG_N.routing : N.routing))
    const cc = codeCell(m, lang)
    if (cc) cells.push(cc)
    cells.push(mini('beat-dodging', 'beat4', isMagica ? JRPG_N.dodging : N.dodging))
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
  // metaTitle omitted — caller uses content.value.title (already i18n'd from markdown)
  return { version: '2.0', ...grid, cells: buildCells(m, lang) }
}

export function hasStoryboardLayout(slug: string): boolean {
  return (
    slug in ARTICLES_EN ||
    slug in ARTICLES_PT ||
    slug in ARTICLES_DE ||
    slug in ARTICLES_ES ||
    slug in ARTICLES_FR ||
    slug in ARTICLES_IT ||
    slug in ARTICLES_JA ||
    slug in ARTICLES_ZH
  )
}

// ─── MANGA LAYOUT (12-panel sequential with kawaii overlay) ───

/** Slugs that have VNE manga packs — add new packs here. */
const MANGA_SLUGS = new Set(['tencent-cloud-deal-stack-builders'])

export interface MangaPanel {
  id: string
  vneType:
    | 'hook'
    | 'myth'
    | 'promise'
    | 'analogy'
    | 'architecture'
    | 'code-peek'
    | 'decision'
    | 'warning'
    | 'benchmark'
    | 'hands-on'
    | 'result'
    | 'next-step'
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

export function getMangaLayout(slug: string, locale: string): MangaPanel[] | null {
  if (!MANGA_SLUGS.has(slug)) return null
  const T = 12
  const bg = (id: string) => `${VNE_PACK}/${id}.webp`
  const R = 'bottom-right' as const
  const L = 'bottom-left' as const

  const loc = ((tencentCaptions as Record<string, Record<string, string>>)[locale] ||
    (tencentCaptions as Record<string, Record<string, string>>).en) as Record<string, string>

  return [
    {
      id: '01-hook',
      vneType: 'hook',
      bgSrc: bg('01-hook'),
      bgAlt: 'Messy desk',
      kawaiiSrc: '',
      kawaiiAlt: '',
      kawaiiPos: R,
      step: 1,
      total: T,
      title: loc['P01-hook'] ?? '',
      body: '',
    },
    {
      id: '02-myth',
      vneType: 'myth',
      bgSrc: bg('02-myth'),
      bgAlt: 'Builder vs Corp',
      kawaiiSrc: '',
      kawaiiAlt: '',
      kawaiiPos: L,
      step: 2,
      total: T,
      title: loc['P02-myth'] ?? '',
      body: '',
    },
    {
      id: '03-promise',
      vneType: 'promise',
      bgSrc: bg('03-promise'),
      bgAlt: '3-layer stack',
      kawaiiSrc: '',
      kawaiiAlt: '',
      kawaiiPos: R,
      step: 3,
      total: T,
      title: loc['P03-promise'] ?? '',
      body: '',
    },
    {
      id: '04-analogy',
      vneType: 'analogy',
      bgSrc: bg('04-analogy'),
      bgAlt: 'Menu analogy',
      kawaiiSrc: '',
      kawaiiAlt: '',
      kawaiiPos: R,
      step: 4,
      total: T,
      title: loc['P04-analogy'] ?? '',
      body: '',
    },
    {
      id: '05-architecture',
      vneType: 'architecture',
      bgSrc: bg('05-architecture-(wide)'),
      bgAlt: 'Architecture',
      kawaiiSrc: '',
      kawaiiAlt: '',
      kawaiiPos: R,
      step: 5,
      total: T,
      wide: true,
      title: loc['P05-architecture-(wide)'] ?? '',
      list: ['Lighthouse: VPS', 'CVM: compute', 'EdgeOne: CDN', 'IAM: 1 account'],
    },
    {
      id: '06-code-peek',
      vneType: 'code-peek',
      bgSrc: bg('06-code-peek'),
      bgAlt: 'Terminal',
      kawaiiSrc: '',
      kawaiiAlt: '',
      kawaiiPos: L,
      step: 6,
      total: T,
      title: loc['P06-code-peek'] ?? '',
      codeSnippet:
        'tccli lighthouse CreateInstance --bundle bundle2022_gen_01 --blueprint wordpress',
    },
    {
      id: '07-decision',
      vneType: 'decision',
      bgSrc: bg('07-decision'),
      bgAlt: 'Checklist',
      kawaiiSrc: '',
      kawaiiAlt: '',
      kawaiiPos: R,
      step: 7,
      total: T,
      title: loc['P07-decision'] ?? '',
      list: ['VPS? Lighthouse', 'Scale? CVM', 'CDN? EdgeOne'],
    },
    {
      id: '08-warning',
      vneType: 'warning',
      bgSrc: bg('08-warning'),
      bgAlt: 'Warning',
      kawaiiSrc: '',
      kawaiiAlt: '',
      kawaiiPos: R,
      step: 8,
      total: T,
      title: loc['P08-warning'] ?? '',
      list: ['DONT over-provision', 'AVOID static', 'NEVER skip CDN'],
    },
    {
      id: '09-benchmark',
      vneType: 'benchmark',
      bgSrc: bg('09-benchmark'),
      bgAlt: 'Benchmark',
      kawaiiSrc: '',
      kawaiiAlt: '',
      kawaiiPos: L,
      step: 9,
      total: T,
      title: loc['P09-benchmark'] ?? '',
      list: ['S5: $12/mo', 'SA2: $18', 'GPU: $45', 'Bundle -30%'],
    },
    {
      id: '10-hands-on',
      vneType: 'hands-on',
      bgSrc: bg('10-hands-on-(wide)'),
      bgAlt: 'Tutorial',
      kawaiiSrc: '',
      kawaiiAlt: '',
      kawaiiPos: L,
      step: 10,
      total: T,
      wide: true,
      title: loc['P10-hands-on-(wide)'] ?? '',
      codeSnippet: 'tccli lighthouse CreateInstance\n# WordPress online em 30s',
    },
    {
      id: '11-result',
      vneType: 'result',
      bgSrc: bg('11-result'),
      bgAlt: 'Success',
      kawaiiSrc: '',
      kawaiiAlt: '',
      kawaiiPos: R,
      step: 11,
      total: T,
      title: loc['P11-result'] ?? '',
      body: '$3.27/mo. Public IP.',
    },
    {
      id: '12-next-step',
      vneType: 'next-step',
      bgSrc: bg('12-next-step'),
      bgAlt: 'Path',
      kawaiiSrc: '',
      kawaiiAlt: '',
      kawaiiPos: R,
      step: 12,
      total: T,
      title: loc['P12-next-step'] ?? '',
      body: 'Monitor. Scale. Dominate.',
    },
  ]
}
