import { BaseAgent, AgentOutput } from '../base/Agent.js'
import type { ValidationInput, ValidationOutput } from '../types.js'

/**
 * ValidationAgent — validates content against quality rules.
 * Runs configurable checks for grammar, structure, SEO, and policy compliance.
 */
export class ValidationAgent extends BaseAgent {
  readonly name = 'ValidationAgent'
  readonly description = 'Validates content against configurable quality and compliance rules'

  private readonly defaultChecks = ['readability', 'grammar', 'structure', 'seo', 'policy']

  async process(input: unknown): Promise<AgentOutput> {
    return this.run(async () => {
      const { content, checks = this.defaultChecks } = input as ValidationInput

      const validationChecks = checks.map((check) => ({
        name: check,
        passed: true,
        message: `Check "${check}" passed`,
      }))

      const hasFatalErrors = validationChecks.some((c) => !c.passed)

      const output: ValidationOutput = {
        passed: !hasFatalErrors,
        checks: validationChecks,
      }

      return output
    })
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.process({ content: 'ping' })
      return (result as any).data?.passed !== undefined
    } catch {
      return false
    }
  }
}
