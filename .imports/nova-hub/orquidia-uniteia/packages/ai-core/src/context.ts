/**
 * @orquestra/ai-core - Global Context System
 * SOTA 2026: Ensures context is ALWAYS passed to AI providers
 *
 * This module defines the global context that must be included in every AI request.
 * The context provides essential information about the UniTeiaAI platform.
 */

export interface GlobalContext {
  platform: string
  version: string
  language: string
  timezone: string
  capabilities: string[]
  constraints: string[]
}

/**
 * Default global context for UniTeiaAI Orchestrator
 * This context is ALWAYS injected into system prompts
 */
export const GLOBAL_CONTEXT: GlobalContext = {
  platform: 'UniTeiaAI Orchestrator',
  version: '0.1.0-SOTA',
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  capabilities: [
    'content-orchestration',
    'uniteia-platform-knowledge',
    'educational-content',
    'seo-content-generation',
    'trend-detection',
    'multi-agent-orchestration',
    'semantic-search',
  ],
  constraints: [
    'Always respond in Brazilian Portuguese unless explicitly asked otherwise',
    'Focus on educational and informative content',
    'Prioritize accuracy over speed for educational recommendations',
    'Never fabricate information or data',
    'Always include source attribution when citing data',
  ],
}

/**
 * Builds the global system prompt with context
 * This is prepended to ALL AI requests
 */
export function buildGlobalSystemPrompt(additionalContext?: string): string {
  const contextBlock = `
# UniTeiaAI Orchestrator Context

## Platform Information
- Platform: ${GLOBAL_CONTEXT.platform}
- Version: ${GLOBAL_CONTEXT.version}
- Language: ${GLOBAL_CONTEXT.language}
- Timezone: ${GLOBAL_CONTEXT.timezone}

## Capabilities
${GLOBAL_CONTEXT.capabilities.map((c) => `- ${c}`).join('\n')}

## Operating Constraints
${GLOBAL_CONTEXT.constraints.map((c) => `- ${c}`).join('\n')}

## Current Context
- Timestamp: ${new Date().toISOString()}
- Environment: ${typeof globalThis !== 'undefined' && (globalThis as Record<string, unknown>).ENVIRONMENT ? String((globalThis as Record<string, unknown>).ENVIRONMENT) : 'development'}
${additionalContext ? `\n## Additional Context\n${additionalContext}` : ''}
`.trim()

  return contextBlock
}

/**
 * Validates that context is present in a request
 * Throws if context is missing (fail-fast approach)
 */
export function validateContext(systemPrompt: string): void {
  if (!systemPrompt.includes('UniTeiaAI Orchestrator Context')) {
    throw new Error(
      '[CONTEXT_MISSING] Global context not found in system prompt. ' +
        'Use buildGlobalSystemPrompt() to ensure context is always included.',
    )
  }
}
