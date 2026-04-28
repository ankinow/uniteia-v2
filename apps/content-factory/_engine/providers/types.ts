export type LLMProviderName = 'stub' | 'nvidia'

export type LLMMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type LLMGenerateInput = {
  messages: LLMMessage[]
  temperature?: number
  maxTokens?: number
  model?: string
}

export type LLMGenerateOutput = {
  text: string
  model: string
  provider: LLMProviderName
  usage?: {
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
  }
}

export interface LLMProvider {
  name: LLMProviderName
  generate(input: LLMGenerateInput): Promise<LLMGenerateOutput>
}
