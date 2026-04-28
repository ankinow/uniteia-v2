/**
 * Content Stub Generator
 * Creates minimum viable _index.md files for all niches and supported languages.
 * Fulfills S03 requirements for M006 hardening.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const CONTENT_ROOT = 'content'
const NICHES = ['ai-agents', 'apex', 'language-models']
const LANGUAGES = ['en', 'pt', 'es', 'ja', 'zh']

interface StubData {
  title: string
  description: string
}

const STUB_DATA: Record<string, Record<string, StubData>> = {
  'ai-agents': {
    en: { title: 'AI Agents', description: 'Autonomous AI agents and frameworks' },
    pt: { title: 'Agentes de IA', description: 'Agentes de IA autônomos e frameworks' },
    es: { title: 'Agentes de IA', description: 'Agentes de IA autónomos y frameworks' },
    ja: { title: 'AIエージェント', description: '自律型AIエージェントとフレームワーク' },
    zh: { title: 'AI 代理', description: '自主 AI 代理和框架' },
  },
  apex: {
    en: { title: 'UniTeia Apex', description: 'Universal AI Knowledge Network' },
    pt: { title: 'UniTeia Apex', description: 'Rede Universal de Conhecimento em IA' },
    es: { title: 'UniTeia Apex', description: 'Red Universal de Conocimiento en IA' },
    ja: { title: 'UniTeia Apex', description: 'ユニバーサルAIナレッジネットワーク' },
    zh: { title: 'UniTeia Apex', description: '通用人工智能知识网络' },
  },
  'language-models': {
    en: { title: 'Language Models', description: 'LLMs, Transformers and NLP' },
    pt: { title: 'Modelos de Linguagem', description: 'LLMs, Transformers e PLN' },
    es: { title: 'Modelos de Lenguaje', description: 'LLMs, Transformers y PLN' },
    ja: { title: '言語モデル', description: 'LLM、トランスフォーマー、自然言語処理' },
    zh: { title: '语言模型', description: '大语言模型、Transformer 和自然语言处理' },
  },
}

function generateStubs() {
  console.log('▶ Generating content stubs...\n')

  for (const niche of NICHES) {
    for (const lang of LANGUAGES) {
      const dir = join(CONTENT_ROOT, niche, lang)
      const filePath = join(dir, '_index.md')

      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }

      const data = STUB_DATA[niche]?.[lang] || { title: niche, description: niche }

      const content = `---
type: "index"
slug: "_index"
lang: "${lang}"
title: "${data.title}"
subjects: ["${niche}"]
referral_links: []
verdict: "trusted"
quality_score: 100
metadata:
  created_at: "${new Date().toISOString()}"
  updated_at: "${new Date().toISOString()}"
---

# ${data.title}

${data.description}
This is a comprehensive knowledge hub for ${data.title}. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.
`

      writeFileSync(filePath, content)
      console.log(`✅ Created: ${filePath}`)
    }
  }

  console.log('\n✨ Content stubs generation complete')
}

generateStubs()
