#!/usr/bin/env bun

import { spawn } from 'node:child_process'
import {
  type ShipCheckRunner,
  type ShipCheckStep,
  createDefaultShipCheckSteps,
  formatShipCheckReport,
  runShipCheck,
} from '../src/utils/ship-check'

const runner: ShipCheckRunner = async (step: ShipCheckStep) => {
  console.log(`▶ [ship-check] ${step.name}: ${step.command.join(' ')}`)
  const startedAt = Date.now()

  return await new Promise((resolve, reject) => {
    const [command, ...args] = step.command
    if (!command) {
      reject(new Error(`ship-check step ${step.name} has no command`))
      return
    }

    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'inherit',
    })

    child.once('error', reject)
    child.once('exit', code => {
      resolve({
        exitCode: code ?? 1,
        durationMs: Date.now() - startedAt,
      })
    })
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
