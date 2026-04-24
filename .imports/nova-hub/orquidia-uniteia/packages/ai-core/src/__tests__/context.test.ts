/**
 * @orquestra/ai-core - Context Test Suite
 * SOTA 2026: Tests for global context system
 */

import { describe, expect, test } from 'bun:test'
import { GLOBAL_CONTEXT, buildGlobalSystemPrompt, validateContext } from '../context'

// =============================================================================
// GLOBAL_CONTEXT
// =============================================================================

describe('GLOBAL_CONTEXT', () => {
  test('has correct platform', () => {
    expect(GLOBAL_CONTEXT.platform).toBe('UniTeiaAI Orchestrator')
  })

  test('has pt-BR language', () => {
    expect(GLOBAL_CONTEXT.language).toBe('pt-BR')
  })

  test('has Sao Paulo timezone', () => {
    expect(GLOBAL_CONTEXT.timezone).toBe('America/Sao_Paulo')
  })

  test('has expected capabilities', () => {
    expect(GLOBAL_CONTEXT.capabilities).toContain('content-orchestration')
    expect(GLOBAL_CONTEXT.capabilities).toContain('uniteia-platform-knowledge')
    expect(GLOBAL_CONTEXT.capabilities).toContain('educational-content')
    expect(GLOBAL_CONTEXT.capabilities).toContain('seo-content-generation')
    expect(GLOBAL_CONTEXT.capabilities).toContain('multi-agent-orchestration')
    expect(GLOBAL_CONTEXT.capabilities.length).toBeGreaterThanOrEqual(7)
  })

  test('has expected constraints', () => {
    expect(GLOBAL_CONTEXT.constraints).toContain(
      'Always respond in Brazilian Portuguese unless explicitly asked otherwise',
    )
    expect(GLOBAL_CONTEXT.constraints).toContain('Never fabricate information or data')
    expect(GLOBAL_CONTEXT.constraints.length).toBeGreaterThanOrEqual(5)
  })
})

// =============================================================================
// buildGlobalSystemPrompt
// =============================================================================

describe('buildGlobalSystemPrompt', () => {
  test('includes platform info', () => {
    const prompt = buildGlobalSystemPrompt()
    expect(prompt).toContain('UniTeiaAI Orchestrator Context')
    expect(prompt).toContain('UniTeiaAI Orchestrator')
    expect(prompt).toContain('pt-BR')
    expect(prompt).toContain('America/Sao_Paulo')
  })

  test('includes capabilities', () => {
    const prompt = buildGlobalSystemPrompt()
    expect(prompt).toContain('content-orchestration')
    expect(prompt).toContain('uniteia-platform-knowledge')
    expect(prompt).toContain('educational-content')
    expect(prompt).toContain('seo-content-generation')
  })

  test('includes constraints', () => {
    const prompt = buildGlobalSystemPrompt()
    expect(prompt).toContain('Operating Constraints')
    expect(prompt).toContain('Never fabricate information or data')
  })

  test('includes timestamp', () => {
    const prompt = buildGlobalSystemPrompt()
    // Should contain an ISO timestamp
    expect(prompt).toMatch(/\d{4}-\d{2}-\d{2}T/)
  })

  test('includes additional context when provided', () => {
    const prompt = buildGlobalSystemPrompt('Product analysis for smartphones')
    expect(prompt).toContain('Additional Context')
    expect(prompt).toContain('Product analysis for smartphones')
  })

  test('does not include additional context section when not provided', () => {
    const prompt = buildGlobalSystemPrompt()
    expect(prompt).not.toContain('Additional Context')
  })

  test('does not include additional context section for empty string', () => {
    const prompt = buildGlobalSystemPrompt('')
    expect(prompt).not.toContain('Additional Context')
  })
})

// =============================================================================
// validateContext
// =============================================================================

describe('validateContext', () => {
  test('passes for prompt with context', () => {
    const prompt = buildGlobalSystemPrompt()
    expect(() => validateContext(prompt)).not.toThrow()
  })

  test('throws for prompt without context marker', () => {
    expect(() => validateContext('Hello, this is a regular prompt')).toThrow('[CONTEXT_MISSING]')
  })

  test('throws for empty string', () => {
    expect(() => validateContext('')).toThrow('[CONTEXT_MISSING]')
  })

  test('error message suggests buildGlobalSystemPrompt', () => {
    try {
      validateContext('no context here')
      expect(true).toBe(false) // should not reach here
    } catch (error) {
      expect((error as Error).message).toContain('buildGlobalSystemPrompt()')
    }
  })
})
