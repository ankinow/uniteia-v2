export interface ShipCheckStep {
  name: string
  command: string[]
}

export interface ShipCheckStepOutcome {
  name: string
  command: string
  exitCode: number
  durationMs: number
}

export interface ShipCheckFailure {
  stepName: string
  command: string
  exitCode: number
  durationMs: number
}

export interface ShipCheckReport {
  ok: boolean
  steps: ShipCheckStepOutcome[]
  failure?: ShipCheckFailure
}

export interface ShipCheckRunnerResult {
  exitCode: number
  durationMs: number
}

export type ShipCheckRunner = (step: ShipCheckStep) => Promise<ShipCheckRunnerResult>

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
  const stepLines = report.steps.map(
    step => `- ${step.name}: ${step.command} (exit ${step.exitCode}, ${step.durationMs}ms)`
  )

  if (report.ok) {
    return ['✅ ship-check passed.', `${report.steps.length} step(s) passed.`, ...stepLines].join(
      '\n'
    )
  }

  const failure = report.failure
  if (!failure) {
    return ['❌ ship-check failed.', ...stepLines].join('\n')
  }

  return [
    `❌ ship-check stopped at ${failure.stepName}.`,
    `Failed subcommand: ${failure.command}`,
    `The failing step exited with exit ${failure.exitCode} after ${failure.durationMs}ms.`,
    ...stepLines,
  ].join('\n')
}

function formatCommand(command: string[]): string {
  return command
    .map(segment => (segment.includes(' ') ? JSON.stringify(segment) : segment))
    .join(' ')
}
