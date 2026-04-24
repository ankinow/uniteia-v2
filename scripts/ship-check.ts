#!/usr/bin/env bun

import {
  DEFAULT_SHIP_CHECK_KILL_GRACE_MS,
  DEFAULT_SHIP_CHECK_STEP_TIMEOUT_MS,
  type ShipCheckRunner,
  type ShipCheckStep,
  createDefaultShipCheckSteps,
  formatShipCheckReport,
  runShipCheck,
  runShipCheckStep,
} from '../src/utils/ship-check'

const runner: ShipCheckRunner = async (step: ShipCheckStep) => {
  const timeoutMs = step.timeoutMs ?? DEFAULT_SHIP_CHECK_STEP_TIMEOUT_MS
  console.log(
    `▶ [ship-check] ${step.name}: ${step.command.join(' ')} (timeout ${timeoutMs.toLocaleString('en-US')}ms)`
  )

  return await runShipCheckStep(step, {
    timeoutMs,
    killGraceMs: DEFAULT_SHIP_CHECK_KILL_GRACE_MS,
  })
}

async function main(): Promise<void> {
  try {
    const report = await runShipCheck(createDefaultShipCheckSteps(), runner)
    const output = formatShipCheckReport(report)

    if (report.ok) {
      console.log(output)
      process.exit(0)
    }

    console.error(output)
    process.exit(report.failure?.exitCode ?? 1)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`❌ ship-check failed before execution: ${message}`)
    process.exit(1)
  }
}

await main()
