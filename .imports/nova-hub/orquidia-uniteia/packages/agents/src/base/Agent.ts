import { z } from 'zod'

/**
 * Base Agent interface for all content pipeline agents.
 * Every agent must implement process() and healthCheck().
 */
export abstract class BaseAgent {
  /** Unique identifier for the agent */
  abstract readonly name: string

  /** Agent description for logging and health reports */
  abstract readonly description: string

  /**
   * Process an input payload and return a structured result.
   * Each subclass defines its own input/output via generic types.
   */
  abstract process(input: unknown): Promise<AgentOutput>

  /**
   * Lightweight health probe. Returns true when the agent is
   * able to handle requests.
   */
  abstract healthCheck(): Promise<boolean>

  /**
   * Helper: wrap any operation in the standard { success, data, metadata, errors } envelope.
   */
  protected async run<T>(
    operation: () => Promise<T>,
    metadata?: Record<string, unknown>,
  ): Promise<AgentOutput> {
    try {
      const data = await operation()
      return {
        success: true,
        data: data as Record<string, unknown>,
        metadata: { agent: this.name, ...(metadata ?? {}) },
        errors: [],
      }
    } catch (error) {
      return {
        success: false,
        metadata: { agent: this.name, ...(metadata ?? {}) },
        errors: [`[${this.name}] ${error instanceof Error ? error.message : String(error)}`],
      }
    }
  }
}

/** Alias for backwards compatibility — ResearchAgent imports this */
export const Agent = BaseAgent

/** Standard output envelope shared by every agent */
export interface AgentOutput {
  success: boolean
  data?: Record<string, unknown>
  confidence?: number
  metadata?: Record<string, unknown>
  errors?: string[]
}

/** Zod schema for validating agent output at runtime */
export const AgentOutputSchema: z.ZodType<AgentOutput> = z.object({
  success: z.boolean(),
  metadata: z.record(z.unknown()).optional(),
  errors: z.array(z.string()).optional(),
})
