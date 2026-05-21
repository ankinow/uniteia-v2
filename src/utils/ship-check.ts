import { spawn } from 'node:child_process'

export interface ShipCheckStep {
  name: string
  command: string[]
  timeoutMs?: number
}

export interface ShipCheckStepOutcome {
  name: string
  command: string
  exitCode: number
  durationMs: number
  timedOut?: boolean
  timeoutMs?: number
  terminationSignal?: NodeJS.Signals
}

export interface ShipCheckFailure {
  stepName: string
  command: string
  exitCode: number
  durationMs: number
  timedOut?: boolean
  timeoutMs?: number
  terminationSignal?: NodeJS.Signals
}

export interface ShipCheckReport {
  ok: boolean
  steps: ShipCheckStepOutcome[]
  failure?: ShipCheckFailure
}

export interface ShipCheckRunnerResult {
  exitCode: number
  durationMs: number
  timedOut?: boolean
  timeoutMs?: number
  terminationSignal?: NodeJS.Signals
}

export type ShipCheckRunner = (step: ShipCheckStep) => Promise<ShipCheckRunnerResult>

export interface ShipCheckStepExecutionOptions {
  timeoutMs?: number
  killGraceMs?: number
  timeoutSignal?: NodeJS.Signals
  killSignal?: NodeJS.Signals
}

export const DEFAULT_SHIP_CHECK_STEP_TIMEOUT_MS = 15 * 60 * 1000
export const DEFAULT_SHIP_CHECK_KILL_GRACE_MS = 5_000

export function createDefaultShipCheckSteps(): ShipCheckStep[] {
  return [
    // Group A — Static analysis
    { name: 'lint', command: ['bun', 'run', 'lint'] },
    { name: 'typecheck', command: ['bun', 'run', 'typecheck'] },
    { name: 'test:unit', command: ['bun', 'run', 'test:unit'] },
    { name: 'build', command: ['bun', 'run', 'build'] },
    { name: 'header:single', command: ['bun', 'run', 'scripts/check-single-header.ts'] },
    { name: 'size:check', command: ['bun', 'run', 'size:check'] },
    { name: 'slug:check', command: ['bun', 'run', 'slug:check'] },
    { name: 'content:check', command: ['bun', 'run', 'content:check'] },
    { name: 'sitemap:check', command: ['bun', 'run', 'scripts/check-sitemap.ts'] },
    // M003 — Linkgraph + SEO
    { name: 'linkgraph:report', command: ['bun', 'run', 'generate:linkgraph-report'] },
    { name: 'seo:verification', command: ['bun', 'run', 'generate:seo-verification'] },
    // M003 — Performance sub-budgets
    { name: 'size:sub-budgets', command: ['bun', 'run', 'size:check', '--threshold', '133120'] },

    // Group B — Preview-required QA (runs after preview server starts)
    { name: 'edge:chaos', command: ['bun', 'run', 'edge:chaos'] },
    {
      name: 'route:fuzzing',
      command: ['bun', 'run', 'test:e2e', 'tests/e2e/s05-route-fuzzing.spec.ts'],
    },
    {
      name: 'hydration:resilience',
      command: ['bun', 'run', 'test:e2e', 'tests/e2e/s03-hydration-resilience.spec.ts'],
    },
    {
      name: 'm011-visual-dna',
      command: ['bun', 'run', 'test:e2e', 'tests/e2e/m011-visual-dna.spec.ts'],
    },
    { name: 'visual:qa', command: ['bun', 'run', 'test:e2e', 'tests/e2e/s06-visual-qa.spec.ts'] },
    {
      name: 'm013-onboarding-visual',
      command: ['bun', 'run', 'test:e2e', 'tests/e2e/m013-onboarding-visual.spec.ts'],
    },
    {
      name: 'm014-visual-regression',
      command: ['bun', 'run', 'test:e2e', 'tests/e2e/m014-visual-regression.spec.ts'],
    },

    // Legacy steps
    { name: 'lighthouse:check', command: ['bun', 'run', 'lighthouse:check'] },
    { name: 'smoke:200s', command: ['bun', 'run', 'scripts/smoke-test.ts'] },
    { name: 'invalid-locale-404', command: ['bun', 'run', 'scripts/check-invalid-locale.ts'] },
  ]
}

export async function runShipCheckStep(
  step: ShipCheckStep,
  options: ShipCheckStepExecutionOptions = {}
): Promise<ShipCheckRunnerResult> {
  const [command, ...args] = step.command
  if (!command) {
    throw new Error(`ship-check step ${step.name} has no command`)
  }

  const startedAt = Date.now()
  const timeoutMs = options.timeoutMs ?? step.timeoutMs ?? DEFAULT_SHIP_CHECK_STEP_TIMEOUT_MS
  const killGraceMs = options.killGraceMs ?? DEFAULT_SHIP_CHECK_KILL_GRACE_MS
  const timeoutSignal = options.timeoutSignal ?? 'SIGTERM'
  const killSignal = options.killSignal ?? 'SIGKILL'

  return await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: {
        PATH: process.env.PATH,
        NODE_ENV: process.env.NODE_ENV,
        CF_PAGES: process.env.CF_PAGES,
        SITE_URL: process.env.SITE_URL,
        BUILD_ID: process.env.BUILD_ID,
      },
      stdio: 'inherit',
    })

    let settled = false
    let timedOut = false
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null
    let killGraceHandle: ReturnType<typeof setTimeout> | null = null

    const cleanup = () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle)
        timeoutHandle = null
      }
      if (killGraceHandle) {
        clearTimeout(killGraceHandle)
        killGraceHandle = null
      }
    }

    const settle = (result: ShipCheckRunnerResult) => {
      if (settled) {
        return
      }
      settled = true
      cleanup()
      resolve(result)
    }

    child.once('error', error => {
      if (settled) {
        return
      }
      settled = true
      cleanup()
      reject(error)
    })

    child.once('exit', (code, signal) => {
      settle({
        exitCode: code ?? (timedOut ? 124 : 1),
        durationMs: Date.now() - startedAt,
        ...(timedOut ? { timedOut: true, timeoutMs } : {}),
        ...(signal ? { terminationSignal: signal } : {}),
      })
    })

    timeoutHandle = setTimeout(() => {
      if (settled) {
        return
      }
      timedOut = true
      child.kill(timeoutSignal)
      killGraceHandle = setTimeout(() => {
        if (settled) {
          return
        }
        child.kill(killSignal)
      }, killGraceMs)
    }, timeoutMs)
  })
}

export async function runShipCheck(
  steps: ShipCheckStep[],
  runner: ShipCheckRunner
): Promise<ShipCheckReport> {
  const completed: ShipCheckStepOutcome[] = []
  for (const step of steps) {
    const result = await runner(step)
    const outcome: ShipCheckStepOutcome = {
      name: step.name,
      command: formatCommand(step.command),
      exitCode: result.exitCode,
      durationMs: result.durationMs,
      ...(result.timedOut ? { timedOut: true } : {}),
      ...(result.timeoutMs !== undefined ? { timeoutMs: result.timeoutMs } : {}),
      ...(result.terminationSignal ? { terminationSignal: result.terminationSignal } : {}),
    }
    completed.push(outcome)
    if (result.exitCode !== 0) {
      return {
        ok: false,
        steps: completed,
        failure: {
          stepName: step.name,
          command: outcome.command,
          exitCode: outcome.exitCode,
          durationMs: outcome.durationMs,
          ...(outcome.timedOut ? { timedOut: true } : {}),
          ...(outcome.timeoutMs !== undefined ? { timeoutMs: outcome.timeoutMs } : {}),
          ...(outcome.terminationSignal ? { terminationSignal: outcome.terminationSignal } : {}),
        },
      }
    }
  }
  return { ok: true, steps: completed }
}

export function formatShipCheckReport(report: ShipCheckReport): string {
  const stepLines = report.steps.map(step => {
    const status = step.timedOut
      ? `timed out${step.timeoutMs ? ` after ${step.timeoutMs.toLocaleString('en-US')}ms` : ''}`
      : `exit ${step.exitCode}`
    const signalSuffix = step.terminationSignal ? `, signal ${step.terminationSignal}` : ''
    return `- ${step.name}: ${step.command} (${status}${signalSuffix}, ${step.durationMs}ms)`
  })

  if (report.ok) {
    return ['✅ ship-check passed.', `${report.steps.length} step(s) passed.`, ...stepLines].join(
      '\n'
    )
  }

  const failure = report.failure
  if (!failure) {
    return ['❌ ship-check failed.', ...stepLines].join('\n')
  }

  const failureSummary = failure.timedOut
    ? `The failing step exceeded the ${failure.timeoutMs?.toLocaleString('en-US') ?? 'configured'} ms timeout and was terminated with ${failure.terminationSignal ?? 'SIGTERM'}.`
    : `The failing step exited with exit ${failure.exitCode} after ${failure.durationMs}ms.`

  return [
    `❌ ship-check stopped at ${failure.stepName}.`,
    `Failed subcommand: ${failure.command}`,
    failureSummary,
    ...stepLines,
  ].join('\n')
}

function formatCommand(command: string[]): string {
  return command
    .map(segment => (segment.includes(' ') ? JSON.stringify(segment) : segment))
    .join(' ')
}
