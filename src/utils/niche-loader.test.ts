import { describe, expect, it } from 'vitest'
import type { NicheConfig, NichesConfig } from '~/types/niche'
import { findNicheBySlug, getNicheSlug, validateNicheConfig } from '~/utils/niche-loader'

function makeNiche(overrides: Partial<NicheConfig> = {}): NicheConfig {
  return {
    slug: 'ai-agents',
    slugs: {
      en: 'ai-agents',
      pt: 'agentes-de-ia',
    },
    icon: 'bot',
    title: {
      en: 'AI Agents',
      pt: 'Agentes de IA',
      es: 'Agentes de IA',
      ja: 'AIエージェント',
      zh: 'AI智能体',
    },
    description: {
      en: 'Autonomous AI systems that perceive, reason, and act to accomplish goals.',
      pt: 'Sistemas de IA autônomos que percebem, raciocinam e agem para atingir objetivos.',
      es: 'Sistemas de IA autónomos que perciben, razonan y actúan para lograr objetivos.',
      ja: '目標を達成するために知覚・推論・行動する自律的なAIシステム。',
      zh: '能够感知、推理和行动以实现目标的自主AI系统。',
    },
    ...overrides,
  }
}

describe('niche-loader slug aliases', () => {
  it('accepts a niche config with localized slugs', () => {
    expect(validateNicheConfig(makeNiche())).toBeNull()
  })

  it('rejects a niche config missing localized slugs', () => {
    const result = validateNicheConfig({
      ...makeNiche(),
      slugs: undefined as unknown as NicheConfig['slugs'],
    })

    expect(result).not.toBeNull()
    expect(result?.errors.some(error => error.includes('slugs is required'))).toBe(true)
  })

  it('resolves canonical and localized slugs', () => {
    const niches: NichesConfig = [
      makeNiche(),
      {
        slug: 'language-models',
        slugs: { en: 'language-models', pt: 'modelos-de-linguagem' },
        icon: 'message-square-text',
        title: {
          en: 'Language Models',
          pt: 'Modelos de Linguagem',
          es: 'Modelos de Lenguaje',
          ja: '言語モデル',
          zh: '语言模型',
        },
        description: {
          en: 'Large-scale models that understand and generate human language.',
          pt: 'Modelos de grande escala que compreendem e geram linguagem humana.',
          es: 'Modelos a gran escala que comprenden y generan lenguaje humano.',
          ja: '人間の言語を理解し生成する大規模モデル。',
          zh: '理解和生成人类语言的大规模模型。',
        },
      },
    ]

    expect(findNicheBySlug(niches, 'ai-agents', 'pt')?.slug).toBe('ai-agents')
    expect(findNicheBySlug(niches, 'agentes-de-ia', 'pt')?.slug).toBe('ai-agents')
    expect(findNicheBySlug(niches, 'agentes-de-ia', 'en')?.slug).toBe('ai-agents')
    expect(findNicheBySlug(niches, 'modelos-de-linguagem', 'en')?.slug).toBe('language-models')
  })

  it('returns localized slug for routed locales and canonical slug for others', () => {
    const niche = makeNiche()

    expect(getNicheSlug(niche, 'pt')).toBe('agentes-de-ia')
    expect(getNicheSlug(niche, 'en')).toBe('ai-agents')
    expect(getNicheSlug(niche, 'es')).toBe('ai-agents')
  })
})
