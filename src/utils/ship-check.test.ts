import { describe, expect, it } from 'vitest'
import {
  createDefaultShipCheckSteps,
  formatShipCheckReport,
  runShipCheck,
} from '~/utils/ship-check'

describe('runShipCheck', () => {
  it('stops at the first failing step and preserves the subcommand name and exit code', async () => {
    const seen: string[] = []

    const report = await runShipCheck(
      [
        { name: 'lint', command: ['bun', 'run', 'lint'] },
        { name: 'typecheck', command: ['bun', 'run', 'typecheck'] },
        { name: 'build', command: ['bun', 'run', 'build'] },
        { name: 'slug:check', command: ['bun', 'run', 'slug:check'] },
      ],
      async step => {
        seen.push(step.name)
        return {
          exitCode: step.name === 'build' ? 2 : 0,
          durationMs: step.name === 'build' ? 125 : 40,
        }
      }
    )

    expect(seen).toEqual(['lint', 'typecheck', 'build'])
    expect(report.ok).toBe(false)
    expect(report.failure).toEqual({
      stepName: 'build',
      command: 'bun run build',
      exitCode: 2,
      durationMs: 125,
    })

    const output = formatShipCheckReport(report)
    expect(output).toContain('build')
    expect(output).toContain('bun run build')
    expect(output).toContain('exit 2')
  })

  it('reports a timed-out step distinctly', async () => {
    const report = await runShipCheck(
      [{ name: 'build', command: ['bun', 'run', 'build'], timeoutMs: 1_000 }],
      async () => ({
        exitCode: 124,
        durationMs: 1_000,
        timedOut: true,
        timeoutMs: 1_000,
        terminationSignal: 'SIGTERM',
      })
    )

    expect(report.ok).toBe(false)
    expect(report.failure).toEqual({
      stepName: 'build',
      command: 'bun run build',
      exitCode: 124,
      durationMs: 1_000,
      timedOut: true,
      timeoutMs: 1_000,
      terminationSignal: 'SIGTERM',
    })

    const output = formatShipCheckReport(report)
    expect(output).toContain('timed out')
    expect(output).toContain('SIGTERM')
  })

  it('reports a full passing sequence when every step succeeds', async () => {
    const report = await runShipCheck(
      [
        { name: 'lint', command: ['bun', 'run', 'lint'] },
        { name: 'typecheck', command: ['bun', 'run', 'typecheck'] },
      ],
      async () => ({ exitCode: 0, durationMs: 25 })
    )

    expect(report.ok).toBe(true)
    expect(report.failure).toBeUndefined()
    expect(report.steps).toHaveLength(2)
    expect(report.steps.map(step => step.name)).toEqual(['lint', 'typecheck'])
    expect(formatShipCheckReport(report)).toContain('2 step(s) passed')
  })

  it('contains the browser verification step in the default steps', () => {
    const steps = createDefaultShipCheckSteps()
    const browserStep = steps.find(step => step.name === 'browser:verify')

    expect(browserStep).toEqual({
      name: 'browser:verify',
      command: ['bun', 'run', 'browser:verify'],
    })
    expect(steps.map(step => step.name)).toEqual([
      'lint',
      'typecheck',
      'test:unit',
      'build',
      'size:check',
      'lighthouse:check',
      'browser:verify',
      'slug:check',
      'content:check',
    ])
  })
})
