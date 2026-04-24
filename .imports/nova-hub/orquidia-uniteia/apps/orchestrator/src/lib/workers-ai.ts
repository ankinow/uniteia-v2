/**
 * Workers AI Wrapper - SOTA 2026
 * Multi-model wrapper using @orquestra/ai-core
 */

import {
  type ProviderConfig,
  WORKERS_AI_MODELS,
  type WorkersAIModel,
  type WorkersAIProvider,
} from '@orquestra/ai-core/providers'

import { type GeminiProvider, createProvider } from '@orquestra/ai-core/providers'

// ============================================================================
// TYPES
// ============================================================================

export interface WorkersAIConfig {
  primaryModel: string
  complexModel: string
  embeddingModel: string
  fallbackModel: string
}

export interface GenerationConfig {
  prompt: string
  model?: string
  maxTokens?: number
  temperature?: number
  stream?: boolean
  systemPrompt?: string
}

export interface GenerationResult {
  text: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
}

// ============================================================================
// DEFAULT CONFIG
// ============================================================================

export const DEFAULT_AI_CONFIG: WorkersAIConfig = {
  primaryModel: WORKERS_AI_MODELS.LLAMA_3_8B,
  complexModel: WORKERS_AI_MODELS.LLAMA_3_70B,
  embeddingModel: '@cf/baai/bge-m3',
  fallbackModel: WORKERS_AI_MODELS.LLAMA_3_8B,
}

// ============================================================================
// SYSTEM PROMPTS
// ============================================================================

export const SYSTEM_PROMPTS = {
  professional: `Você é um especialista em conteúdo SEO em português do Brasil.
  Seu objetivo é criar conteúdo útil, detalhado e bem estruturado.`,

  casual: `Você é um criador de conteúdo friendly em português do Brasil.
  Crie conteúdo leve, informativo e envolvente.`,

  enthusiastic: `Você é um especialista em conteúdo SEO em português do Brasil.
  Crie conteúdo envolvente e empolgante!`,

  informative: `Você é um especialista em conteúdo SEO em português do Brasil.
  Crie conteúdo informativo e objetivo.`,
}

// ============================================================================
// WRAPPER CLASS
// ============================================================================

export class WorkersAIWrapper {
  private config: WorkersAIConfig
  private provider: WorkersAIProvider | null = null
  private geminiProvider: GeminiProvider | null = null
  private useFallback = false

  constructor(config?: Partial<WorkersAIConfig>) {
    this.config = { ...DEFAULT_AI_CONFIG, ...config }
  }

  private getProvider(): WorkersAIProvider {
    if (!this.provider) {
      const providerConfig: ProviderConfig = {
        workersAIAccountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
        workersAIToken: process.env.CLOUDFLARE_API_KEY || '',
        temperature: 0.7,
        maxTokens: 4096,
      }
      this.provider = createProvider('workers-ai', providerConfig) as WorkersAIProvider
    }
    return this.provider
  }

  private getGeminiProvider(): GeminiProvider | null {
    if (!this.geminiProvider && process.env.GEMINI_API_KEY) {
      const providerConfig: ProviderConfig = {
        geminiApiKey: process.env.GEMINI_API_KEY,
        temperature: 0.7,
        maxTokens: 4096,
      }
      this.geminiProvider = createProvider('gemini', providerConfig) as GeminiProvider
    }
    return this.geminiProvider
  }

  async generate(config: GenerationConfig): Promise<GenerationResult> {
    const model = this.selectModel(config)
    const workersAI = this.getProvider()

    try {
      const systemPrompt = config.systemPrompt || SYSTEM_PROMPTS.professional

      const messages = [{ role: 'user' as const, content: `${systemPrompt}\n\n${config.prompt}` }]

      const result = await workersAI.chat(messages, {
        model: model as WorkersAIModel,
        maxTokens: config.maxTokens || 4000,
        temperature: config.temperature || 0.7,
      })

      return {
        text: result.content,
        usage: result.tokensUsed
          ? {
              promptTokens: result.tokensUsed.prompt,
              completionTokens: result.tokensUsed.completion,
              totalTokens: result.tokensUsed.total,
            }
          : undefined,
        model: result.model,
      }
    } catch (error) {
      console.error(`[WorkersAI] Error with model ${model}:`, error)

      const gemini = this.getGeminiProvider()
      if (!this.useFallback && gemini) {
        this.useFallback = true
        return this.generateWithGemini(config)
      }

      this.useFallback = false
      throw error
    }
  }

  private async generateWithGemini(config: GenerationConfig): Promise<GenerationResult> {
    const gemini = this.getGeminiProvider()
    if (!gemini) {
      throw new Error('[WorkersAI] Gemini fallback failed: No provider available')
    }

    const systemPrompt = config.systemPrompt || SYSTEM_PROMPTS.professional

    const messages = [{ role: 'user' as const, content: `${systemPrompt}\n\n${config.prompt}` }]

    const result = await gemini.chat(messages)

    return {
      text: result.content,
      usage: result.tokensUsed
        ? {
            promptTokens: result.tokensUsed.prompt,
            completionTokens: result.tokensUsed.completion,
            totalTokens: result.tokensUsed.total,
          }
        : undefined,
      model: result.model,
    }
  }

  private selectModel(config: GenerationConfig): string {
    if (config.model) return config.model

    const promptLength = config.prompt.length
    if (promptLength > 5000) {
      return this.config.complexModel
    }

    return this.config.primaryModel
  }
}

export function createAI(config?: Partial<WorkersAIConfig>): WorkersAIWrapper {
  return new WorkersAIWrapper(config)
}

export interface ContentGenerationInput {
  niche: string
  category: string
  keywords: string[]
  tone?: 'professional' | 'casual' | 'enthusiastic' | 'informative'
  productsCount?: number
}

export async function generateContentPage(
  ai: WorkersAIWrapper,
  input: ContentGenerationInput,
): Promise<{
  title: string
  content: string
  metaDescription: string
  keywords: string[]
}> {
  const productsCount = input.productsCount || 7
  const tone = input.tone || 'professional'

  const prompt = `Gere um guia sobre "${input.niche}" em português brasileiro.`

  const result = await ai.generate({
    prompt,
    systemPrompt: SYSTEM_PROMPTS[tone],
    maxTokens: 4000,
    temperature: 0.7,
  })

  return {
    title: input.niche,
    content: result.text,
    metaDescription: result.text.substring(0, 160),
    keywords: input.keywords,
  }
}
