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
    { name: 'lint', command: ['bun', 'run', 'lint'] },
    { name: 'typecheck', command: ['bun', 'run', 'typecheck'] },
    { name: 'test:unit', command: ['bun', 'run', 'test:unit'] },
    { name: 'build', command: ['bun', 'run', 'build'] },
    { name: 'size:check', command: ['bun', 'run', 'size:check'] },
    { name: 'lighthouse:check', command: ['bun', 'run', 'lighthouse:check'] },
    {
      name: 'browser:verify',
      command: ['bun', 'run', 'browser:verify'],
    },
    { name: 'slug:check', command: ['bun', 'run', 'slug:check'] },
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
      env: process.env,
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

  return {
    ok: true,
    steps: completed,
  }
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
