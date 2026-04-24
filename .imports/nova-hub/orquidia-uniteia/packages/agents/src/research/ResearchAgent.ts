/**
 * Agente de Pesquisa - Coleta informacoes para criacao de conteudo em Portugues Brasileiro
 */

import { BaseAgent as Agent, AgentOutput } from '../base/Agent.js'
import type { ResearchInput, ResearchOutput } from '../types.js'

export interface ResearchRequest {
  prompt: string
  contentType: string
  targetAudience: string
  keywords?: string[]
}

export interface ResearchResultData {
  sources: string[]
  keyFacts: string[]
  statistics: Record<string, number>
  trendingTopics: string[]
  competitorAnalysis: string[]
  visualElements: string[]
}

export class ResearchAgent extends Agent {
  readonly name = 'ResearchAgent'
  readonly description = 'Coleta informacoes para criacao de conteudo em Portugues Brasileiro'

  constructor() {
    super()
  }

  async process(input: unknown): Promise<AgentOutput> {
    const request = input as ResearchInput | ResearchRequest
    const prompt = (request as ResearchInput)?.prompt ?? (request as ResearchRequest).prompt ?? ''
    const contentType = (request as ResearchInput)?.contentType ?? (request as ResearchRequest).contentType ?? ''
    const targetAudience = (request as ResearchInput)?.targetAudience ?? (request as ResearchRequest).targetAudience ?? ''
    const keywords = (request as ResearchInput)?.keywords ?? (request as ResearchRequest).keywords

    return this.run(async () => {
      const researchData = await this.gatherInformation({
        prompt,
        contentType,
        targetAudience,
        keywords,
      })

      return {
        researchData,
        sourceCount: researchData.sources.length,
        factCount: researchData.keyFacts.length,
      }
    })
  }

  async healthCheck(): Promise<boolean> {
    return true
  }

  private async gatherInformation(request: ResearchRequest): Promise<ResearchResultData> {
    return {
      sources: ['fonte-confiavel-1.com.br', 'fonte-confiavel-2.com.br'],
      keyFacts: [
        'UniTV oferece streaming movel sem necessidade de TV Box',
        'O conteudo foca em valor educacional e entretenimento de qualidade',
        'Publico-alvo prefere recomendacoes independentes e de alta qualidade',
        'Integracao perfeita entre celular e Smart TV na mesma rede WiFi',
      ],
      statistics: {
        engajamentoUsuario: 0.85,
        pontuacaoQualidade: 0.92,
        desempenhoSEO: 0.78,
      },
      trendingTopics: [
        'streaming movel',
        'integracao smart tv',
        'analises independentes',
        'dicas tecnologia',
        'entretenimento em casa',
      ],
      competitorAnalysis: [
        'Concorrente A foca em analises de hardware',
        'Concorrente B enfatiza comparacoes de preco',
        'Nosso diferencial: conteudo educativo + perspectiva independente',
      ],
      visualElements: [
        'imagens de smartphones com app UniTV',
        'Smart TVs exibindo conteudo UniTV',
        'diagramas de conexao WiFi',
        'icones de streaming e entretenimento',
        'fotos de pessoas assistindo em familia',
        'graficos de comparacao de qualidade',
      ],
    }
  }
}
