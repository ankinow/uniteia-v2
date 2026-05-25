#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const CONTENT = resolve(ROOT, 'content')

const LOCALES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'] as const

interface NicheInfo {
  titles: Record<string, string>
  subtitles: Record<string, string>
  subject: string
}

const NICHES: Record<string, NicheInfo> = {
  'ai-agents': {
    subject: 'ai-agents',
    titles: {
      en: 'AI Agents',
      pt: 'Agentes de IA',
      es: 'Agentes de IA',
      fr: "Agents d'IA",
      de: 'KI-Agenten',
      it: 'Agenti AI',
      ja: 'AIエージェント',
      zh: 'AI 代理',
    },
    subtitles: {
      en: 'Autonomous AI systems that perceive, reason, and act to achieve goals',
      pt: 'Sistemas de IA autônomos que percebem, raciocinam e agem para atingir objetivos',
      es: 'Sistemas de IA autónomos que perciben, razonan y actúan para lograr objetivos',
      fr: "Systèmes d'IA autonomes qui perçoivent, raisonnent et agissent pour atteindre des objectifs",
      de: 'Autonome KI-Systeme, die wahrnehmen, schlussfolgern und handeln, um Ziele zu erreichen',
      it: 'Sistemi AI autonomi che percepiscono, ragionano e agiscono per raggiungere obiettivi',
      ja: '目標を達成するために知覚、推論、行動する自律型AIシステム',
      zh: '能够感知、推理和行动以实现目标的自主AI系统',
    },
  },
  'prompt-engineering': {
    subject: 'prompt-engineering',
    titles: {
      en: 'Prompt Engineering',
      pt: 'Engenharia de Prompts',
      es: 'Ingeniería de Prompts',
      fr: 'Ingénierie du Prompt',
      de: 'Prompt-Engineering',
      it: 'Ingegneria dei Prompt',
      ja: 'プロンプトエンジニアリング',
      zh: '提示工程',
    },
    subtitles: {
      en: 'Techniques for creating effective prompts to guide AI model outputs',
      pt: 'Técnicas para criar prompts eficazes para orientar as saídas dos modelos de IA',
      es: 'Técnicas para crear prompts efectivos para guiar las salidas de los modelos de IA',
      fr: "Techniques pour créer des prompts efficaces afin d'orienter les sorties des modèles d'IA",
      de: 'Techniken zur Erstellung effektiver Prompts zur Steuerung von KI-Modellausgaben',
      it: 'Tecniche per creare prompt efficaci per guidare le uscite dei modelli AI',
      ja: 'AIモデルの出力を導く効果的なプロンプトを作成するためのテクニック',
      zh: '创建有效提示以指导AI模型输出的技术',
    },
  },
  apex: {
    subject: 'apex',
    titles: {
      en: 'UniTeia Apex',
      pt: 'UniTeia Apex',
      es: 'UniTeia Apex',
      fr: 'UniTeia Apex',
      de: 'UniTeia Apex',
      it: 'UniTeia Apex',
      ja: 'UniTeia エイペックス',
      zh: 'UniTeia 巅峰',
    },
    subtitles: {
      en: 'Emerging signals at the frontier of AI research and industry',
      pt: 'Sinais emergentes na fronteira da pesquisa e indústria de IA',
      es: 'Señales emergentes en la frontera de la investigación y la industria de la IA',
      fr: "Signaux émergents à la frontière de la recherche et de l'industrie de l'IA",
      de: 'Aufkommende Signale an der Grenze zwischen KI-Forschung und -Industrie',
      it: "Segnali emergenti alla frontiera della ricerca e dell'industria dell'IA",
      ja: 'AI研究と産業の最前線における新興シグナル',
      zh: 'AI研究和产业前沿的新兴信号',
    },
  },
  'language-models': {
    subject: 'language-models',
    titles: {
      en: 'Language Models',
      pt: 'Modelos de Linguagem',
      es: 'Modelos de Lenguaje',
      fr: 'Modèles de Langage',
      de: 'Sprachmodelle',
      it: 'Modelli Linguistici',
      ja: '言語モデル',
      zh: '语言模型',
    },
    subtitles: {
      en: 'Large-scale models that understand and generate human language',
      pt: 'Modelos em grande escala que compreendem e geram linguagem humana',
      es: 'Modelos a gran escala que comprenden y generan lenguaje humano',
      fr: 'Modèles à grande échelle qui comprennent et génèrent le langage humain',
      de: 'Großskalige Modelle, die menschliche Sprache verstehen und generieren',
      it: 'Modelli su larga scala che comprendono e generano il linguaggio umano',
      ja: '人間の言語を理解し生成する大規模モデル',
      zh: '理解和生成人类语言的大规模模型',
    },
  },
}

function indexBody(title: string, _subtitle: string, lang: string): string {
  const boilerplates: Record<string, string> = {
    en: `This is a comprehensive knowledge hub for ${title}. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.`,
    pt: `Este é um hub de conhecimento abrangente para ${title}. Exploramos frameworks autônomos, ferramentas e as pesquisas mais recentes neste empolgante campo da inteligência artificial. Nosso objetivo é fornecer um repositório central de informações facilmente acessível e sempre atualizado para pesquisadores e desenvolvedores.`,
    es: `Este es un centro de conocimiento integral para ${title}. Exploramos frameworks autónomos, herramientas y las investigaciones más recientes en este emocionante campo de la inteligencia artificial. Nuestro objetivo es proporcionar un repositorio central de información fácilmente accesible y siempre actualizada para investigadores y desarrolladores.`,
    fr: `Ceci est un hub de connaissances complet pour ${title}. Nous explorons les frameworks autonomes, les outils et les recherches les plus récentes dans ce domaine passionnant de l'intelligence artificielle. Notre objectif est de fournir un référentiel central d'informations facilement accessible et toujours à jour pour les chercheurs et les développeurs.`,
    de: `Dies ist ein umfassendes Wissensportal für ${title}. Wir erkunden autonome Frameworks, Tools und die neuesten Forschungsergebnisse in diesem spannenden Bereich der künstlichen Intelligenz. Unser Ziel ist es, ein zentrales Informationsrepository bereitzustellen, das für Forscher und Entwickler leicht zugänglich und stets aktuell ist.`,
    it: `Questo è un hub di conoscenza completo per ${title}. Esploriamo framework autonomi, strumenti e le ricerche più recenti in questo entusiasmante campo dell'intelligenza artificiale. Il nostro obiettivo è fornire un repository centrale di informazioni facilmente accessibile e sempre aggiornato per ricercatori e sviluppatori.`,
    ja: `これは${title}のための包括的なナレッジハブです。私たちは、自律型フレームワーク、ツール、そしてこのエキサイティングな人工知能の分野における最新の研究を探求しています。私たちの目標は、研究者や開発者が容易にアクセスでき、常に最新の情報を提供する中央リポジトリを提供することです。`,
    zh: `这是一个面向${title}的综合知识中心。我们探索自主框架、工具以及这一激动人心的人工智能领域的最新研究。我们的目标是提供一个易于访问、始终最新的中央信息存储库，供研究人员和开发人员使用。`,
  }
  return boilerplates[lang] || boilerplates.en
}

function writeIndex(niche: string, lang: string) {
  const info = NICHES[niche]
  const dir = resolve(CONTENT, niche, lang)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

  const title = info.titles[lang]
  const subtitle = info.subtitles[lang]
  const body = indexBody(title, lang)

  const content = `---
type: "index"
slug: "_index"
lang: "${lang}"
title: "${title}"
subjects: ["${info.subject}"]
referral_links: []
verdict: "trusted"
quality_score: 100
metadata:
  created_at: "2026-04-28T08:59:36.892Z"
  updated_at: "2026-04-28T08:59:36.892Z"
---

# ${title}

${subtitle}
${body}
`
  writeFileSync(resolve(dir, '_index.md'), content)
  console.log(`  ✓ ${niche}/${lang}/_index.md`)
}

function fixExistingIndex(niche: string, lang: string) {
  const info = NICHES[niche]
  const path = resolve(CONTENT, niche, lang, '_index.md')
  if (!existsSync(path)) {
    writeIndex(niche, lang)
    return
  }

  const existing = readFileSync(path, 'utf-8')
  const title = info.titles[lang]
  const subtitle = info.subtitles[lang]
  const body = indexBody(title, lang)
  const newBody = `\n# ${title}\n\n${subtitle}\n${body}\n`

  // Update title in frontmatter if wrong
  let fixed = existing.replace(/title: ".*"/, `title: "${title}"`)
  // Replace body after frontmatter
  const bodyStart = fixed.indexOf('\n---\n', 3)
  if (bodyStart !== -1) {
    fixed = fixed.substring(0, bodyStart + 5) + newBody
  }

  if (fixed !== existing) {
    writeFileSync(path, fixed)
    console.log(`  ✎ ${niche}/${lang}/_index.md (fixed body)`)
  } else {
    console.log(`  · ${niche}/${lang}/_index.md (ok)`)
  }
}

function main() {
  console.log('=== Fixing content i18n in uniteia-v2 ===\n')

  // 1. Create missing prompt-engineering niche (all 8 locales)
  console.log('\n📁 prompt-engineering (new)')
  for (const lang of LOCALES) {
    writeIndex('prompt-engineering', lang)
  }

  // 2. Create missing ai-agents locales (fr, de, it)
  console.log('\n📁 ai-agents (missing locales)')
  for (const lang of ['fr', 'de', 'it'] as const) {
    writeIndex('ai-agents', lang)
  }

  // 3. Fix existing _index.md files with EN boilerplate
  console.log('\n📝 Fixing existing _index.md files...')

  for (const niche of ['ai-agents', 'language-models', 'apex'] as const) {
    console.log(`\n  ${niche}:`)
    for (const lang of LOCALES) {
      fixExistingIndex(niche, lang)
    }
  }

  console.log('\n✅ Done!')
}

main()
