import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { createServer } from 'node:http'
import { resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from '@playwright/test'
import lighthouse from 'lighthouse'

export const DEFAULT_LIGHTHOUSE_SCORE_THRESHOLD = 95
export const DEFAULT_LIGHTHOUSE_AUDIT_PATH = '/en'
export const DEFAULT_LIGHTHOUSE_PREVIEW_TIMEOUT_MS = 30_000
export const DEFAULT_LIGHTHOUSE_BROWSER_TIMEOUT_MS = 30_000

export const REQUIRED_LIGHTHOUSE_CATEGORIES = [
  'performance',
  'accessibility',
  'best-practices',
] as const

export type LighthouseCategoryKey = (typeof REQUIRED_LIGHTHOUSE_CATEGORIES)[number]
export type LighthouseLaunchPhase =
  | 'report-validation'
  | 'preview-server'
  | 'browser-startup'
  | 'lighthouse-audit'

export interface LighthouseCategoryEntry {
  score?: number | null
}

export interface LighthouseReportLike {
  finalDisplayedUrl?: string
  categories?: Record<string, LighthouseCategoryEntry | undefined>
}

export interface LighthouseGateIssue {
  kind: 'invalid-report-data' | 'category-below-threshold' | 'preview-server-failed' | 'browser-startup-failed' | 'lighthouse-audit-failed'
  message: string
  category?: LighthouseCategoryKey
  scorePercent?: number | null
  thresholdPercent?: number
  launchPhase: LighthouseLaunchPhase
}

export interface LighthouseGateReport {
  ok: boolean
  auditedUrl: string
  finalDisplayedUrl: string | null
  thresholdPercent: number
  launchPhase: LighthouseLaunchPhase
  categoryScores: Record<LighthouseCategoryKey, number | null>
  issues: LighthouseGateIssue[]
}

export interface EvaluateLighthouseGateOptions {
  auditedUrl?: string
  thresholdPercent?: number
  launchPhase?: LighthouseLaunchPhase
}

export interface RunLighthouseGateOptions {
  buildDir?: string
  auditedPath?: string
  thresholdPercent?: number
  previewTimeoutMs?: number
  browserTimeoutMs?: number
}

interface BufferedOutput {
  stdout: string[]
  stderr: string[]
}

interface PreviewServerHandle {
  process: ChildProcessWithoutNullStreams
  previewUrl: string
  close: () => Promise<void>
  logs: BufferedOutput
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeAuditedUrl(auditedUrl?: string): string {
  if (!auditedUrl || auditedUrl.length === 0) {
    return DEFAULT_LIGHTHOUSE_AUDIT_PATH
  }

  return auditedUrl.startsWith('/') ? auditedUrl : `/${auditedUrl}`
}

function formatPercent(scorePercent: number | null): string {
  return scorePercent === null ? 'unavailable' : `${scorePercent.toFixed(1)}%`
}

function bufferLines(target: string[], chunk: string): void {
  for (const line of chunk.split(/\r?\n/)) {
    if (line.length === 0) {
      continue
    }

    target.push(line)
    if (target.length > 25) {
      target.splice(0, target.length - 25)
    }
  }
}

async function findFreePort(): Promise<number> {
  return await new Promise((resolvePort, rejectPort) => {
    const server = createServer()
    server.on('error', rejectPort)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        server.close(() => rejectPort(new Error('Unable to allocate a preview port')))
        return
      }

      const port = address.port
      server.close(error => {
        if (error) {
          rejectPort(error)
          return
        }

        resolvePort(port)
      })
    })
  })
}

async function waitForPreviewServer(previewUrl: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs
  let lastError: unknown = null

  while (Date.now() < deadline) {
    try {
      const response = await fetch(previewUrl, { redirect: 'follow' })
      if (response.ok) {
        return
      }

      lastError = new Error(`Unexpected response status ${response.status}`)
    } catch (error) {
      lastError = error
    }

    await delay(250)
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError)
  throw new Error(`Preview server did not become ready within ${timeoutMs.toLocaleString('en-US')} ms: ${message}`)
}

function spawnPreviewServer(buildDir: string, port: number): PreviewServerHandle {
  const logs: BufferedOutput = { stdout: [], stderr: [] }
  const previewArgs = [
    'run',
    'preview',
    '--',
    '--host',
    '127.0.0.1',
    '--port',
    String(port),
    '--strictPort',
  ]

  const childProcess = spawn('bun', previewArgs, {
    cwd: process.cwd(),
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  childProcess.stdout.setEncoding('utf8')
  childProcess.stderr.setEncoding('utf8')
  childProcess.stdout.on('data', chunk => bufferLines(logs.stdout, String(chunk)))
  childProcess.stderr.on('data', chunk => bufferLines(logs.stderr, String(chunk)))

  return {
    process: childProcess,
    previewUrl: `http://127.0.0.1:${port}`,
    logs,
    close: async () => {
      if (childProcess.exitCode !== null || childProcess.signalCode !== null) {
        return
      }

      try {
        childProcess.kill('SIGTERM')
      } catch {
        return
      }

      await Promise.race([
        new Promise<void>(resolveClose => childProcess.once('close', () => resolveClose())),
        delay(2_000),
      ])

      if (childProcess.exitCode === null && childProcess.signalCode === null) {
        try {
          childProcess.kill('SIGKILL')
        } catch {
          // Ignore cleanup errors.
        }
      }
    },
  }
}

function readLighthouseCategoryScore(
  report: LighthouseReportLike,
  category: LighthouseCategoryKey
): number | null {
  const entry = report.categories?.[category]
  if (!entry || typeof entry.score !== 'number' || !Number.isFinite(entry.score)) {
    return null
  }

  return entry.score * 100
}

function summarizeCategoryScores(categoryScores: Record<LighthouseCategoryKey, number | null>): string {
  return REQUIRED_LIGHTHOUSE_CATEGORIES.map(category => `${category}=${formatPercent(categoryScores[category])}`).join(', ')
}

export function evaluateLighthouseGate(
  report: LighthouseReportLike,
  options: EvaluateLighthouseGateOptions = {}
): LighthouseGateReport {
  const thresholdPercent = options.thresholdPercent ?? DEFAULT_LIGHTHOUSE_SCORE_THRESHOLD
  const auditedUrl = normalizeAuditedUrl(options.auditedUrl ?? report.finalDisplayedUrl)
  const launchPhase = options.launchPhase ?? 'report-validation'
  const issues: LighthouseGateIssue[] = []

  const categoryScores = Object.fromEntries(
    REQUIRED_LIGHTHOUSE_CATEGORIES.map(category => [category, readLighthouseCategoryScore(report, category)])
  ) as Record<LighthouseCategoryKey, number | null>

  for (const category of REQUIRED_LIGHTHOUSE_CATEGORIES) {
    const scorePercent = categoryScores[category]
    if (scorePercent === null) {
      issues.push({
        kind: 'invalid-report-data',
        message: `Lighthouse report is missing a valid score for ${category}`,
        category,
        launchPhase,
      })
      continue
    }

    if (scorePercent < thresholdPercent) {
      issues.push({
        kind: 'category-below-threshold',
        message: `${category} is below the ${thresholdPercent.toLocaleString('en-US')} threshold at ${scorePercent.toFixed(1)}%`,
        category,
        scorePercent,
        thresholdPercent,
        launchPhase,
      })
    }
  }

  if (!isRecord(report.categories)) {
    issues.push({
      kind: 'invalid-report-data',
      message: 'Lighthouse report categories payload is missing or invalid',
      launchPhase,
    })
  }

  return {
    ok: issues.length === 0,
    auditedUrl,
    finalDisplayedUrl: report.finalDisplayedUrl ?? null,
    thresholdPercent,
    launchPhase,
    categoryScores,
    issues,
  }
}

export function formatLighthouseGateReport(report: LighthouseGateReport): string {
  const header = report.ok
    ? `✅ Lighthouse gate passed for ${report.auditedUrl}`
    : `❌ Lighthouse gate failed for ${report.auditedUrl}`

  const lines = [
    header,
    `Launch phase: ${report.launchPhase}`,
    `Threshold: ${report.thresholdPercent.toLocaleString('en-US')}%`,
    `Category scores: ${summarizeCategoryScores(report.categoryScores)}`,
  ]

  if (report.finalDisplayedUrl && report.finalDisplayedUrl !== report.auditedUrl) {
    lines.push(`Final displayed URL: ${report.finalDisplayedUrl}`)
  }

  if (report.issues.length > 0) {
    lines.push('', 'Issues:')
    for (const issue of report.issues) {
      const scoreSuffix = issue.scorePercent === undefined ? '' : ` | score: ${formatPercent(issue.scorePercent)}`
      const thresholdSuffix =
        issue.thresholdPercent === undefined
          ? ''
          : ` | threshold: ${issue.thresholdPercent.toLocaleString('en-US')}%`
      const categorySuffix = issue.category ? ` | category: ${issue.category}` : ''
      lines.push(`- ${issue.kind}: ${issue.message}${categorySuffix}${scoreSuffix}${thresholdSuffix} | phase: ${issue.launchPhase}`)
    }
  }

  return lines.join('\n')
}

async function launchPreviewServer(buildDir: string, timeoutMs: number): Promise<PreviewServerHandle> {
  const port = await findFreePort()
  const handle = spawnPreviewServer(buildDir, port)
  const previewUrl = `${handle.previewUrl}${DEFAULT_LIGHTHOUSE_AUDIT_PATH}`

  try {
    await waitForPreviewServer(previewUrl, timeoutMs)
    return handle
  } catch (error) {
    await handle.close()
    const previewLogs = [...handle.logs.stdout, ...handle.logs.stderr]
    const logSuffix = previewLogs.length > 0 ? ` | preview logs: ${previewLogs.join(' :: ')}` : ''
    throw new Error(`${error instanceof Error ? error.message : String(error)}${logSuffix}`)
  }
}

async function runLighthouseAudit(auditUrl: string, browserTimeoutMs: number): Promise<LighthouseReportLike> {
  const browserPort = await findFreePort()
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null

  try {
    browser = await chromium.launch({
      headless: true,
      timeout: browserTimeoutMs,
      args: [`--remote-debugging-port=${browserPort}`],
    })
  } catch (error) {
    throw new Error(`Chromium launch failed: ${error instanceof Error ? error.message : String(error)}`)
  }

  try {
    const result = await lighthouse(auditUrl, {
      port: browserPort,
      output: 'json',
      logLevel: 'error',
      onlyCategories: [...REQUIRED_LIGHTHOUSE_CATEGORIES],
    })

    const lhr = result.lhr as LighthouseReportLike
    return {
      finalDisplayedUrl: lhr.finalDisplayedUrl,
      categories: lhr.categories,
    }
  } catch (error) {
    throw new Error(`Lighthouse audit failed: ${error instanceof Error ? error.message : String(error)}`)
  } finally {
    await browser?.close().catch(() => undefined)
  }
}

export async function runLighthouseGate(
  options: RunLighthouseGateOptions = {}
): Promise<LighthouseGateReport> {
  const buildDir = options.buildDir ?? 'dist'
  const auditedPath = normalizeAuditedUrl(options.auditedPath)
  const thresholdPercent = options.thresholdPercent ?? DEFAULT_LIGHTHOUSE_SCORE_THRESHOLD
  const previewTimeoutMs = options.previewTimeoutMs ?? DEFAULT_LIGHTHOUSE_PREVIEW_TIMEOUT_MS
  const browserTimeoutMs = options.browserTimeoutMs ?? DEFAULT_LIGHTHOUSE_BROWSER_TIMEOUT_MS
  let previewServer: PreviewServerHandle | null = null

  try {
    previewServer = await launchPreviewServer(buildDir, previewTimeoutMs)
  } catch (error) {
    return {
      ok: false,
      auditedUrl: auditedPath,
      finalDisplayedUrl: null,
      thresholdPercent,
      launchPhase: 'preview-server',
      categoryScores: {
        performance: null,
        accessibility: null,
        'best-practices': null,
      },
      issues: [
        {
          kind: 'preview-server-failed',
          message: error instanceof Error ? error.message : String(error),
          launchPhase: 'preview-server',
        },
      ],
    }
  }

  try {
    const auditUrl = `${previewServer.previewUrl}${auditedPath}`
    const rawReport = await runLighthouseAudit(auditUrl, browserTimeoutMs)
    const evaluated = evaluateLighthouseGate(rawReport, {
      auditedUrl: auditedPath,
      thresholdPercent,
      launchPhase: 'lighthouse-audit',
    })

    return evaluated
  } catch (error) {
    return {
      ok: false,
      auditedUrl: auditedPath,
      finalDisplayedUrl: null,
      thresholdPercent,
      launchPhase: 'lighthouse-audit',
      categoryScores: {
        performance: null,
        accessibility: null,
        'best-practices': null,
      },
      issues: [
        {
          kind: 'lighthouse-audit-failed',
          message: error instanceof Error ? error.message : String(error),
          launchPhase: 'lighthouse-audit',
        },
      ],
    }
  } finally {
    await previewServer.close().catch(() => undefined)
  }
}
