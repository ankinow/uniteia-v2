#!/usr/bin/env bun

import { type ChildProcess, spawn } from 'node:child_process'
import { createServer } from 'node:net'
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

/**
 * Finds an available port starting from the given port number.
 */
async function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.unref()
    server.on('error', err => {
      const error = err as { code?: string }
      if (error.code === 'EADDRINUSE') {
        resolve(findAvailablePort(startPort + 1))
      } else {
        reject(err)
      }
    })
    server.listen(startPort, () => {
      server.close(() => resolve(startPort))
    })
  })
}

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
  let previewProcess: ChildProcess | null = null
  try {
    const steps = createDefaultShipCheckSteps()

    // Split steps into before and after preview
    const needsPreview = ['lighthouse:check', 'browser:verify', 'smoke:200s', 'invalid-locale-404']

    const prePreviewSteps = steps.filter(s => !needsPreview.includes(s.name))
    const previewSteps = steps.filter(s => needsPreview.includes(s.name))

    // Run initial steps (including build)
    const report1 = await runShipCheck(prePreviewSteps, runner)
    if (!report1.ok) {
      console.error(formatShipCheckReport(report1))
      process.exit(report1.failure?.exitCode ?? 1)
    }

    // Start preview server for remaining checks
    const PREVIEW_PORT = await findAvailablePort(9788)
    const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`
    console.log(`▶ [ship-check] starting preview server on port ${PREVIEW_PORT}...`)
    previewProcess = spawn(
      'bunx',
      [
        'wrangler',
        'pages',
        'dev',
        'dist',
        '--compatibility-date=2026-04-01',
        `--port=${PREVIEW_PORT}`,
      ],
      {
        stdio: 'inherit',
        detached: false,
      }
    )

    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 15000))

    // Update commands with dynamic port
    for (const step of previewSteps) {
      if (step.name === 'smoke:200s' || step.name === 'invalid-locale-404') {
        step.command.push(PREVIEW_URL)
      }
    }

    // Run remaining steps
    const report2 = await runShipCheck(previewSteps, runner)

    // Combine reports for final output
    const finalReport = {
      ok: report2.ok,
      steps: [...report1.steps, ...report2.steps],
      failure: report2.failure,
    }

    const output = formatShipCheckReport(finalReport)
    console.log(output)
    process.exit(finalReport.ok ? 0 : (finalReport.failure?.exitCode ?? 1))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`❌ ship-check failed before execution: ${message}`)
    process.exit(1)
  } finally {
    if (previewProcess) {
      console.log('▶ [ship-check] stopping preview server...')
      previewProcess.kill()
    }
  }
}

await main()
