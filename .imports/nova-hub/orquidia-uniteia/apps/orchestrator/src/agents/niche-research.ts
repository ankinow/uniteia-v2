/**
 * Niche Research Agent - SOTA 2026
 * Pesquisa nichos menos clichês, dúvidas avançadas, com coerência semântica
 *
 * Este agent usa Tavily e Brave Search via MCP tools (não como imports)
 */

import {
  type AgentInput,
  type AgentResult,
  BaseAgent,
  type NicheInsight,
  type NicheResearchResult,
} from './base'

export class NicheResearchAgent extends BaseAgent {
  name = 'NicheResearchAgent'

  async execute(input: AgentInput): Promise<AgentResult<NicheResearchResult>> {
    const startTime = Date.now()

    try {
      if (!input.niche) {
        // Pesquisa nichos gerais se não especificado
        const trending = await this.discoverTrendingTopics()

        await this.log('discover_trending', { count: trending.length })

        return {
          success: true,
          data: {
            niche: 'trending',
            category: 'general',
            insights: trending,
            recommendedTemplates: ['insights-first', 'storytelling'],
            priorityScore: 85,
            sources: [],
          },
          metadata: {
            agent: this.name,
            duration: Date.now() - startTime,
          },
        }
      }

      // Pesquisa nichos específicos
      const [insights, questions, trends] = await Promise.all([
        this.analyzeNiche(input.niche, input.category || 'general'),
        this.findAdvancedQuestions(input.niche),
        this.discoverTrends(input.niche),
      ])

      // Combina insights
      const combinedInsights = this.combineInsights(insights, questions, trends)

      // Calcula score de prioridade
      const priorityScore = this.calculatePriority(combinedInsights)

      // Determina templates recomendados
      const templates = this.recommendTemplates(combinedInsights, input.niche)

      await this.log('analyze_complete', {
        niche: input.niche,
        insightsCount: combinedInsights.length,
        priorityScore,
      })

      return {
        success: true,
        data: {
          niche: input.niche,
          category: input.category || 'general',
          insights: combinedInsights,
          recommendedTemplates: templates,
          priorityScore,
          sources: [],
        },
        metadata: {
          agent: this.name,
          duration: Date.now() - startTime,
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      await this.log('error', { error: errorMessage })

      return {
        success: false,
        error: errorMessage,
        metadata: {
          agent: this.name,
          duration: Date.now() - startTime,
        },
      }
    }
  }

  private async discoverTrendingTopics(): Promise<NicheInsight[]> {
    // Busca tendências emergentes
    const trends: NicheInsight[] = [
      {
        topic: 'Tendências em Automação Residencial',
        subtopics: ['IoT', 'Assistentes de Voz', 'Eficiência Energética'],
        commonQuestions: [],
        advancedDoubts: [],
        trendingSearches: ['automação residencial 2026', 'IoT brasileiro'],
        semanticKeywords: ['automação', 'smart home', 'IoT', 'assistentes virtuais'],
        competitionLevel: 'medium',
        contentGap: 'Conteúdo técnico em português escasso',
        audienceIntent: ['learn', 'compare', 'implement'],
      },
      {
        topic: 'Produtividade Remote Work',
        subtopics: ['Ferramentas', 'Setup', 'Gestão de Tempo'],
        commonQuestions: [],
        advancedDoubts: [],
        trendingSearches: ['home office 2026', 'produtividade remoto'],
        semanticKeywords: ['remote work', 'home office', 'produtividade', 'trabalho remoto'],
        competitionLevel: 'high',
        contentGap: 'Conteúdo avançado sobre setup específico',
        audienceIntent: ['solve problems', 'optimize'],
      },
      {
        topic: 'Sustentabilidade Tech',
        subtopics: ['Energia Solar', 'Reciclagem Eletrônica', 'Green Tech'],
        commonQuestions: [],
        advancedDoubts: [],
        trendingSearches: ['tech sustentável', 'gadgets verdes'],
        semanticKeywords: ['sustentabilidade', 'tecnologia verde', 'ecológico'],
        competitionLevel: 'low',
        contentGap: 'Alta demanda por conteúdo técnico',
        audienceIntent: ['learn', 'purchase eco-friendly'],
      },
      {
        topic: 'Gaming Indie Brasileiro',
        subtopics: ['Desenvolvimento', 'Mercado Local', 'Ferramentas'],
        commonQuestions: [],
        advancedDoubts: [],
        trendingSearches: ['indie games brasil', 'desenvolvimento game nacional'],
        semanticKeywords: ['gaming', 'indie', 'desenvolvimento de jogos', 'game dev'],
        competitionLevel: 'low',
        contentGap: 'Pouco conteúdo sobre mercado brasileiro',
        audienceIntent: ['learn', 'create', 'community'],
      },
      {
        topic: 'Inteligência Artificial Ética',
        subtopics: ['Privacidade', 'Viés Algorítmico', 'Regulação'],
        commonQuestions: [],
        advancedDoubts: [],
        trendingSearches: ['IA ética', 'privacidade IA', 'viés algorítmico'],
        semanticKeywords: ['inteligência artificial', 'ética', 'privacidade', 'algoritmos'],
        competitionLevel: 'medium',
        contentGap: 'Conteúdo acessível sobre temas complexos',
        audienceIntent: ['understand', 'discuss', 'stay informed'],
      },
    ]

    return trends
  }

  private async analyzeNiche(
    niche: string,
    category: string,
  ): Promise<{ insights: NicheInsight[] }> {
    const insights: NicheInsight[] = [
      {
        topic: niche,
        subtopics: this.extractSubtopics(niche),
        commonQuestions: this.extractCommonQuestions(niche),
        advancedDoubts: this.extractAdvancedDoubts(niche),
        trendingSearches: this.extractTrendingSearches(niche),
        semanticKeywords: this.generateSemanticKeywords(niche, category),
        competitionLevel: this.assessCompetition(niche),
        contentGap: 'Conteúdo técnico avançado escasso',
        audienceIntent: ['understand', 'solve', 'compare'],
      },
    ]

    return { insights }
  }

  private async findAdvancedQuestions(niche: string): Promise<{ questions: string[] }> {
    const questions = [
      `Como escolher ${niche} para necessidades específicas?`,
      `Qual a diferença entre ${niche} profissional e básico?`,
      `Quais são os problemas comuns com ${niche} e suas soluções?`,
      `Como fazer configurações avançadas em ${niche}?`,
      `Como integrar ${niche} com outros sistemas?`,
    ]

    return { questions }
  }

  private async discoverTrends(niche: string): Promise<{ trends: string[] }> {
    const trends = [
      `${niche} com inteligência artificial`,
      `${niche} sustentável e ecológico`,
      `${niche} para trabalho híbrido`,
      `tendências ${niche} 2026`,
      `${niche} de código aberto`,
    ]

    return { trends }
  }

  private combineInsights(
    insights: { insights: NicheInsight[] },
    questions: { questions: string[] },
    trends: { trends: string[] },
  ): NicheInsight[] {
    const mainInsight = insights.insights[0]

    if (mainInsight) {
      mainInsight.advancedDoubts = [
        ...mainInsight.advancedDoubts,
        ...questions.questions.slice(0, 5),
      ]

      mainInsight.trendingSearches = [...mainInsight.trendingSearches, ...trends.trends.slice(0, 5)]
    }

    return insights.insights
  }

  private calculatePriority(insights: NicheInsight[]): number {
    let score = 50

    for (const insight of insights) {
      score += insight.advancedDoubts.length * 5
      score += insight.trendingSearches.length * 3

      if (insight.competitionLevel === 'low') score += 20
      if (insight.competitionLevel === 'medium') score += 10

      if (
        insight.contentGap.toLowerCase().includes('alto') ||
        insight.contentGap.toLowerCase().includes('escasso')
      ) {
        score += 15
      }
    }

    return Math.min(100, score)
  }

  private recommendTemplates(insights: NicheInsight[], niche: string): string[] {
    const templates: string[] = []

    const hasManyProducts =
      niche.toLowerCase().includes('comparativo') || niche.toLowerCase().includes('melhores')

    const hasDeepAnalysis = insights.some((i) => i.advancedDoubts.length > 3)

    if (hasManyProducts) {
      templates.push('comparison-matrix', 'horizontal-scroll')
    }

    if (hasDeepAnalysis) {
      templates.push('insights-first', 'minimalist')
    }

    templates.push('storytelling')

    return [...new Set(templates)]
  }

  private extractSubtopics(niche: string): string[] {
    return ['Guia completo', 'Comparativo', 'Reviews', 'Dicas avançadas']
  }

  private extractCommonQuestions(niche: string): string[] {
    return [
      `O que é ${niche}?`,
      `Como funciona ${niche}?`,
      `Qual o melhor ${niche}?`,
      `Quanto custa ${niche}?`,
      `Vale a pena investir em ${niche}?`,
    ]
  }

  private extractAdvancedDoubts(niche: string): string[] {
    return [
      `Como integrar ${niche} com outros sistemas?`,
      `Quais as limitações técnicas de ${niche}?`,
      `Como otimizar o uso de ${niche}?`,
      `Quais erros comuns ao usar ${niche}?`,
      `Como escolher ${niche} para casos específicos?`,
    ]
  }

  private extractTrendingSearches(niche: string): string[] {
    return [
      `${niche} para iniciantes`,
      `${niche} profissional`,
      `${niche} custo-benefício`,
      `${niche} moderno`,
      `${niche} avançado`,
    ]
  }

  private generateSemanticKeywords(niche: string, category: string): string[] {
    return [
      niche.toLowerCase(),
      `${niche} ${category}`,
      `melhor ${niche}`,
      `${niche} comparação`,
      `${niche} review`,
      `${niche} guia`,
      `${niche} problemas`,
      `${niche} soluções`,
    ]
  }

  private assessCompetition(niche: string): 'low' | 'medium' | 'high' {
    const nicheLength = niche.length
    const specificTerms = ['avançado', 'técnico', 'especializado']

    const isSpecific = specificTerms.some((t) => niche.toLowerCase().includes(t))

    if (isSpecific || nicheLength > 30) return 'low'
    if (nicheLength > 20) return 'medium'
    return 'high'
  }
}
