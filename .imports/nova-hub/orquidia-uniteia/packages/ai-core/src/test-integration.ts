/**
 * @orquestra/ai-core - Integration Test
 * Run: bun run packages/ai-core/src/test-integration.ts
 */

import { OrchestratorAgent } from './agents/orchestrator'
import { GLOBAL_CONTEXT, buildGlobalSystemPrompt } from './context'
import { GEMINI_MODELS, GeminiProvider } from './providers/gemini'
import { OPENROUTER_FREE_MODELS, OpenRouterProvider } from './providers/openrouter'

// Load .env
const envFile = Bun.file('.env')
if (await envFile.exists()) {
  const envContent = await envFile.text()
  for (const line of envContent.split('\n')) {
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=')
      const value = valueParts.join('=').replace(/^["']|["']$/g, '')
      if (key && value) {
        process.env[key.trim()] = value.trim()
      }
    }
  }
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

console.log('='.repeat(60))
console.log('ORQUESTRA AI-CORE INTEGRATION TEST')
console.log('='.repeat(60))

// Test 1: Context System
console.log('\n[TEST 1] Context System')
console.log('-'.repeat(40))
console.log('Global Context:', JSON.stringify(GLOBAL_CONTEXT, null, 2))
const systemPrompt = buildGlobalSystemPrompt('Test context addition')
console.log(
  'System prompt includes context:',
  systemPrompt.includes('UniTeiaAI Orchestrator Context'),
)
console.log('System prompt length:', systemPrompt.length, 'chars')

// Test 2: API Keys Check
console.log('\n[TEST 2] API Keys')
console.log('-'.repeat(40))
console.log(`GEMINI_API_KEY: ${GEMINI_API_KEY ? `${GEMINI_API_KEY.slice(0, 10)}...` : 'NOT SET'}`)
console.log(
  `OPENROUTER_API_KEY: ${OPENROUTER_API_KEY ? `${OPENROUTER_API_KEY.slice(0, 15)}...` : 'NOT SET'}`,
)

// Test 3: Gemini Provider Direct
if (GEMINI_API_KEY) {
  console.log('\n[TEST 3] GeminiProvider Direct Test')
  console.log('-'.repeat(40))
  try {
    const provider = new GeminiProvider({
      apiKey: GEMINI_API_KEY,
      model: GEMINI_MODELS.FLASH_2_0,
      temperature: 0.3,
      maxTokens: 256,
    })

    console.log('Provider model info:', provider.getModelInfo())

    const response = await provider.chat([
      { role: 'user', content: 'Diga "Gemini OK" em uma linha.' },
    ])

    console.log(`Response: ${response.content.slice(0, 100)}`)
    console.log(`Model used: ${response.model}`)
    console.log('Tokens:', response.tokensUsed)
    console.log(`Latency: ${response.latencyMs.toFixed(0)} ms`)
    console.log('Gemini test: PASSED')
  } catch (error) {
    console.error('Gemini test FAILED:', error instanceof Error ? error.message : error)
  }
} else {
  console.log('\n[TEST 3] GeminiProvider - SKIPPED (no API key)')
}

// Test 4: OpenRouter Provider Direct
if (OPENROUTER_API_KEY) {
  console.log('\n[TEST 4] OpenRouterProvider Direct Test')
  console.log('-'.repeat(40))
  try {
    const provider = new OpenRouterProvider({
      apiKey: OPENROUTER_API_KEY,
      model: OPENROUTER_FREE_MODELS.KIMI_K2, // Kimi K2 (free via OpenRouter)
      temperature: 0.3,
      maxTokens: 256,
    })

    console.log('Provider model info:', provider.getModelInfo())

    const response = await provider.chat([
      { role: 'system', content: 'You are helpful.' },
      { role: 'user', content: 'Diga "OpenRouter OK" em uma linha.' },
    ])

    console.log(`Response: ${response.content.slice(0, 100)}`)
    console.log(`Model used: ${response.model}`)
    console.log('Tokens:', response.tokensUsed)
    console.log(`Latency: ${response.latencyMs.toFixed(0)} ms`)
    console.log('OpenRouter test: PASSED')
  } catch (error) {
    console.error('OpenRouter test FAILED:', error instanceof Error ? error.message : error)
  }
} else {
  console.log('\n[TEST 4] OpenRouterProvider - SKIPPED (no API key)')
}

// Test 5: OrchestratorAgent with auto-fallback
console.log('\n[TEST 5] OrchestratorAgent Auto-Provider Test')
console.log('-'.repeat(40))
try {
  const agent = new OrchestratorAgent({
    geminiApiKey: GEMINI_API_KEY,
    openrouterApiKey: OPENROUTER_API_KEY,
    temperature: 0.5,
    maxTokens: 512,
  })

  agent.initialize()
  const providerInfo = agent.getProviderInfo()
  console.log(`Active provider: ${providerInfo.provider}`)
  console.log(`Agent ready: ${providerInfo.isReady}`)

  if (providerInfo.isReady) {
    const result = await agent.process(
      'Olá! Me diga brevemente o que você sabe sobre a UniTeiaAI baseado no seu contexto.',
    )

    console.log(`Response: ${result.content.slice(0, 200)}...`)
    console.log(`Model: ${result.model}`)
    console.log(`Provider: ${result.provider}`)
    console.log(`Tokens used: ${result.tokensUsed}`)
    console.log(`Context included: ${result.contextIncluded}`)
    console.log(`Latency: ${result.latencyMs.toFixed(0)} ms`)
    console.log('OrchestratorAgent test: PASSED')
  } else {
    console.log('OrchestratorAgent test: SKIPPED (no provider available)')
  }
} catch (error) {
  console.error('OrchestratorAgent test FAILED:', error instanceof Error ? error.message : error)
}

// Test 6: Task Execution
console.log('\n[TEST 6] Task Execution Test')
console.log('-'.repeat(40))
try {
  const agent = new OrchestratorAgent({
    geminiApiKey: GEMINI_API_KEY,
    openrouterApiKey: OPENROUTER_API_KEY,
  })
  agent.initialize()

  if (agent.isReady()) {
    const taskResult = await agent.executeTask(
      'summarize',
      'A UniTeiaAI é uma plataforma baseada em IA que orquestra conhecimento em rede para criar conteúdo educativo e informativo de qualidade.',
    )

    console.log(`Task success: ${taskResult.success}`)
    console.log(`Output: ${taskResult.output.slice(0, 150)}...`)
    console.log('Metadata:', taskResult.metadata)
    console.log('Task test: PASSED')
  } else {
    console.log('Task test: SKIPPED (no provider)')
  }
} catch (error) {
  console.error('Task test FAILED:', error instanceof Error ? error.message : error)
}

// Test 7: Streaming
console.log('\n[TEST 7] Streaming Test')
console.log('-'.repeat(40))
try {
  const agent = new OrchestratorAgent({
    geminiApiKey: GEMINI_API_KEY,
    openrouterApiKey: OPENROUTER_API_KEY,
  })
  agent.initialize()

  if (agent.isReady()) {
    process.stdout.write('Streaming: ')
    let chunks = 0
    for await (const chunk of agent.stream('Conte de 1 a 3 em português.')) {
      process.stdout.write(chunk.content)
      chunks++
      if (chunk.done) break
    }
    console.log(`\nReceived ${chunks} chunks`)
    console.log('Streaming test: PASSED')
  } else {
    console.log('Streaming test: SKIPPED (no provider)')
  }
} catch (error) {
  console.error('Streaming test FAILED:', error instanceof Error ? error.message : error)
}

console.log(`\n${'='.repeat(60)}`)
console.log('ALL TESTS COMPLETED')
console.log('='.repeat(60))
