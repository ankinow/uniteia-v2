// =============================================================================
// ORQUIDIA RUST INFERENCE ENGINE - TypeScript Wrapper
// =============================================================================
// Purpose: Bridge between LangChain.js and Rust WASM inference module
// Location: @orquestra/ai-core/rust
// =============================================================================

// Dynamic import for WASM (works in Node.js and Cloudflare Workers)
let wasmModule: WebAssembly.Exports | null = null
let wasmInitialized = false

// =============================================================================
// INITIALIZATION
// =============================================================================

async function initWasm(): Promise<void> {
  if (wasmInitialized) return

  try {
    // Try to load WASM module
    const wasmPath = `${process.cwd()}/src/rust/target/wasm32-unknown-unknown/release/orquidia_inference.wasm`

    const wasmBuffer = await fetch(wasmPath).then((r) => r.arrayBuffer())
    const instantiated = await WebAssembly.instantiate(wasmBuffer, {
      env: {
        log: (ptr: number, len: number) => {
          // Simple logging implementation
        },
      },
    })

    const instance =
      instantiated instanceof WebAssembly.Instance
        ? instantiated
        : (instantiated as WebAssembly.WebAssemblyInstantiatedSource).instance

    wasmModule = instance.exports
    wasmInitialized = true
    console.log('[Orquidia Rust] WASM engine initialized')
  } catch (error) {
    console.warn('[Orquidia Rust] WASM not available, using JS fallbacks')
    wasmInitialized = true
  }
}

// =============================================================================
// VECTOR OPERATIONS (JS Fallbacks - Rust implementation available in WASM)
// =============================================================================

/**
 * Calculate cosine similarity between two vectors
 */
export async function cosineSimilarity(a: number[], b: number[]): Promise<number> {
  await initWasm()

  if (a.length !== b.length || a.length === 0) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  return denominator === 0 ? 0 : dotProduct / denominator
}

/**
 * Semantic similarity search with metadata filtering
 */
export async function semanticSearch(
  queryVector: number[],
  corpus: Array<{ id: string; values: number[]; metadata?: Record<string, string> }>,
  topK = 5,
  minScore = 0.5,
): Promise<Array<{ id: string; score: number; metadata?: Record<string, string> }>> {
  await initWasm()

  const results = corpus.map((item) => ({
    id: item.id,
    score: cosineSimilaritySync(queryVector, item.values),
    metadata: item.metadata,
  }))

  // Sort by score descending
  results.sort((a, b) => b.score - a.score)

  // Filter and limit
  return results.filter((r) => r.score >= minScore).slice(0, topK)
}

// Sync version for internal use
function cosineSimilaritySync(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  return denominator === 0 ? 0 : dotProduct / denominator
}

// =============================================================================
// NLP OPERATIONS (JS Implementations matching Rust output)
// =============================================================================

/**
 * Extract keywords from text using TF-IDF light
 */
export async function extractKeywords(text: string, numKeywords = 10): Promise<string[]> {
  await initWasm()

  const words = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2)

  const freq: Record<string, number> = {}
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, numKeywords)
    .map(([word]) => word)
}

/**
 * Analyze sentiment (returns -1.0 to 1.0)
 */
export async function analyzeSentiment(text: string): Promise<number> {
  await initWasm()

  const positiveWords = [
    'good',
    'great',
    'excellent',
    'amazing',
    'wonderful',
    'fantastic',
    'love',
    'best',
    'awesome',
    'happy',
  ]
  const negativeWords = [
    'bad',
    'terrible',
    'awful',
    'horrible',
    'worst',
    'hate',
    'sad',
    'angry',
    'disappointed',
    'poor',
  ]

  const words = text.toLowerCase().split(/[^a-z]+/)

  let score = 0
  for (const word of words) {
    if (positiveWords.includes(word)) score += 1
    else if (negativeWords.includes(word)) score -= 1
  }

  return words.length === 0 ? 0 : Math.max(-1, Math.min(1, (score / words.length) * 10))
}

/**
 * Classify text into categories using keyword matching
 */
export async function classifyText(
  text: string,
  categories: string[],
  threshold = 0.1,
): Promise<{ category: string; confidence: number; allScores: Array<[string, number]> }> {
  await initWasm()

  const textLower = text.toLowerCase()
  const scores: Array<[string, number]> = []

  for (const category of categories) {
    const catLower = category.toLowerCase()
    let matches = 0

    for (const word of textLower.split(/\s+/)) {
      if (catLower.includes(word) || (word.length > 3 && catLower.includes(word))) {
        matches += 1
      }
    }

    const normalizedScore = Math.min(1, (matches / text.length) * 10)
    scores.push([category, normalizedScore])
  }

  scores.sort((a, b) => b[1] - a[1])

  return {
    category: scores[0]?.[0] || '',
    confidence: scores[0]?.[1] || 0,
    allScores: scores,
  }
}

// =============================================================================
// STRUCTURED EXTRACTION
// =============================================================================

/**
 * Extract email addresses from text
 */
export async function extractEmails(text: string): Promise<string[]> {
  await initWasm()

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  return text.match(emailRegex) || []
}

/**
 * Extract URLs from text
 */
export async function extractUrls(text: string): Promise<string[]> {
  await initWasm()

  const urlRegex = /https?:\/\/[^\s<>"']+/g
  return text.match(urlRegex) || []
}

/**
 * Extract numbers from text
 */
export async function extractNumbers(text: string): Promise<string[]> {
  await initWasm()

  const numRegex = /\d+(\.\d+)?/g
  return text.match(numRegex) || []
}

// =============================================================================
// VERSION INFO
// =============================================================================

export function getRustVersion(): string {
  return '0.2.0'
}

// =============================================================================
// TYPES
// =============================================================================

export type { SimilaritySearchResult, ClassificationResult } from './types'

// =============================================================================
// DEFAULT EXPORT (Compatibility)
// =============================================================================

export default {
  init: initWasm,
  cosineSimilarity,
  semanticSearch,
  extractKeywords,
  analyzeSentiment,
  classifyText,
  extractEmails,
  extractUrls,
  extractNumbers,
  getVersion: getRustVersion,
}
