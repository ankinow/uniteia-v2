import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { LLMGenerateInput, LLMGenerateOutput, LLMProvider } from './types'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GOLDEN_PATH = path.join(__dirname, '..', 'tests', 'golden', 'llm-agents-primer', 'core.yaml')

/**
 * Stub provider for offline/test use.
 * Returns the golden core.yaml content as if the LLM generated it.
 * Deterministic — same input always produces same output.
 */
export function createStubProvider(): LLMProvider {
  let cachedGolden: string | null = null

  return {
    name: 'stub',
    async generate(_input: LLMGenerateInput): Promise<LLMGenerateOutput> {
      if (!cachedGolden) {
        cachedGolden = await fs.readFile(GOLDEN_PATH, 'utf8')
      }
      return {
        text: cachedGolden,
        model: 'stub-golden',
        provider: 'stub',
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      }
    },
  }
}
