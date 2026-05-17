import { readFile } from 'node:fs/promises'
import { type IncomingMessage, type ServerResponse, createServer } from 'node:http'
import { extname, resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'
import lighthouse from 'lighthouse'

export const DEFAULT_LIGHTHOUSE_AUDIT_PATH = '/en'
export const DEFAULT_LIGHTHOUSE_PREVIEW_TIMEOUT_MS = 60_000
export const DEFAULT_LIGHTHOUSE_BROWSER_TIMEOUT_MS = 60_000

export const REQUIRED_LIGHTHOUSE_CATEGORIES = [
  'performance',
  'accessibility',
  'best-practices',
  'seo',
] as const

export const DEFAULT_CATEGORY_THRESHOLDS = {
  performance: 35,
  accessibility: 95,
  'best-practices': 95,
  seo: 95,
} as const

export const DEFAULT_LIGHTHOUSE_SCORE_THRESHOLD = 95

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
  kind:
    | 'invalid-report-data'
    | 'category-below-threshold'
    | 'preview-server-failed'
    | 'browser-startup-failed'
    | 'lighthouse-audit-failed'
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
  categoryThresholds: Record<LighthouseCategoryKey, number>
  launchPhase: LighthouseLaunchPhase
  categoryScores: Record<LighthouseCategoryKey, number | null>
  issues: LighthouseGateIssue[]
}

export interface LighthouseCategoryThresholds {
  performance?: number
  accessibility?: number
  bestPractices?: number
  seo?: number
}

export interface EvaluateLighthouseGateOptions {
  auditedUrl?: string
  categoryThresholds?: LighthouseCategoryThresholds
  launchPhase?: LighthouseLaunchPhase
}

export interface RunLighthouseGateOptions {
  buildDir?: string
  auditedPath?: string
  categoryThresholds?: LighthouseCategoryThresholds
  previewTimeoutMs?: number
  browserTimeoutMs?: number
}

interface PreviewServerHandle {
  previewUrl: string
  close: () => Promise<void>
}

interface WorkerModule {
  fetch: (
    request: Request,
    env: Record<string, unknown>,
    context: { waitUntil: (promise: Promise<unknown>) => void }
  ) => Promise<Response>
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

async function findFreePort(): Promise<number> {
  return await new Promise((resolvePort, rejectPort) => {
    const server = createServer()
    server.once('error', rejectPort)
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
      if (response.status < 500) {
        return
      }

      lastError = new Error(`Unexpected response status ${response.status}`)
    } catch (error) {
      lastError = error
    }

    await delay(250)
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError)
  throw new Error(
    `Preview server did not become ready within ${timeoutMs.toLocaleString('en-US')} ms: ${message}`
  )
}

function contentTypeForPath(filePath: string): string {
  switch (extname(filePath).toLowerCase()) {
    case '.js':
      return 'text/javascript; charset=utf-8'
    case '.css':
      return 'text/css; charset=utf-8'
    case '.json':
      return 'application/json; charset=utf-8'
    case '.svg':
      return 'image/svg+xml'
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.woff':
      return 'font/woff'
    case '.woff2':
      return 'font/woff2'
    case '.html':
      return 'text/html; charset=utf-8'
    default:
      return 'application/octet-stream'
  }
}

function isInsideDirectory(filePath: string, directory: string): boolean {
  const resolvedFilePath = resolve(filePath)
  const resolvedDirectory = resolve(directory)
  return (
    resolvedFilePath === resolvedDirectory || resolvedFilePath.startsWith(`${resolvedDirectory}/`)
  )
}

async function serveStaticAsset(distDir: string, request: Request): Promise<Response> {
  const url = new URL(request.url)
  const pathname = decodeURIComponent(url.pathname)
  const relativePath = pathname.startsWith('/') ? `.${pathname}` : pathname
  const filePath = resolve(distDir, relativePath)

  if (!isInsideDirectory(filePath, distDir)) {
    return new Response('Not Found', { status: 404 })
  }

  try {
    let contents: Buffer
    let finalPath = filePath
    try {
      contents = await readFile(filePath)
    } catch {
      finalPath = resolve(filePath, 'index.html')
      contents = await readFile(finalPath)
    }
    return new Response(contents, {
      status: 200,
      headers: {
        'content-type': contentTypeForPath(finalPath),
      },
    })
  } catch {
    return new Response('Not Found', { status: 404 })
  }
}

async function loadPreviewWorker(): Promise<WorkerModule> {
  const workerUrl = pathToFileURL(resolve(process.cwd(), 'server/entry.cloudflare-pages.js')).href
  return (await import(workerUrl)) as WorkerModule
}

const SUPPORTED_LANGUAGES = new Set(['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'])

function rewritePreviewPathname(pathname: string): string {
  const trimmedPathname =
    pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname
  if (SUPPORTED_LANGUAGES.has(trimmedPathname.slice(1)) && !trimmedPathname.endsWith('/signals')) {
    return `${trimmedPathname}/signals`
  }

  return pathname
}

function createPreviewRequest(request: IncomingMessage, port: number): Request {
  const url = new URL(request.url ?? '/', `http://localhost:${port}`)
  url.pathname = rewritePreviewPathname(url.pathname)
  const headers = new Headers()

  for (const [key, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) {
      headers.set(key, value.join(', '))
    } else if (typeof value === 'string') {
      headers.set(key, value)
    }
  }

  return new Request(url, {
    method: request.method ?? 'GET',
    headers,
  })
}

async function writePreviewResponse(response: Response, res: ServerResponse): Promise<void> {
  res.statusCode = response.status
  res.statusMessage = response.statusText

  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })

  if (!response.body) {
    res.end()
    return
  }

  res.end(Buffer.from(await response.arrayBuffer()))
}

async function startPreviewServer(distDir: string, port: number): Promise<PreviewServerHandle> {
  const worker = await loadPreviewWorker()
  const server = createServer(async (request, response) => {
    try {
      const previewRequest = createPreviewRequest(request, port)

      // 1. Try static asset first (emulate Cloudflare Pages CDN)
      const staticResponse = await serveStaticAsset(distDir, previewRequest)
      if (staticResponse.status === 200) {
        await writePreviewResponse(staticResponse, response)
        return
      }

      // 2. Fall back to Worker SSR
      const previewResponse = await worker.fetch(
        previewRequest,
        {
          ASSETS: {
            fetch: (assetRequest: Request) => serveStaticAsset(distDir, assetRequest),
          },
        },
        { waitUntil: () => undefined }
      )

      await writePreviewResponse(previewResponse, response)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      response.statusCode = 500
      response.setHeader('content-type', 'text/plain; charset=utf-8')
      response.end(message)
    }
  })

  await new Promise<void>((resolveListen, rejectListen) => {
    const onError = (error: Error) => rejectListen(error)
    server.once('error', onError)
    server.listen(port, '127.0.0.1', () => {
      server.off('error', onError)
      resolveListen()
    })
  })

  return {
    previewUrl: `http://localhost:${port}`,
    close: async () => {
      await new Promise<void>(resolveClose => {
        server.close(() => resolveClose())
      })
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

function summarizeCategoryScores(
  categoryScores: Record<LighthouseCategoryKey, number | null>
): string {
  return REQUIRED_LIGHTHOUSE_CATEGORIES.map(
    category => `${category}=${formatPercent(categoryScores[category])}`
  ).join(', ')
}

export function evaluateLighthouseGate(
  report: LighthouseReportLike,
  options: EvaluateLighthouseGateOptions = {}
): LighthouseGateReport {
  const categoryThresholds: Record<LighthouseCategoryKey, number> = {
    performance: options.categoryThresholds?.performance ?? DEFAULT_CATEGORY_THRESHOLDS.performance,
    accessibility:
      options.categoryThresholds?.accessibility ?? DEFAULT_CATEGORY_THRESHOLDS.accessibility,
    'best-practices':
      options.categoryThresholds?.bestPractices ?? DEFAULT_CATEGORY_THRESHOLDS['best-practices'],
    seo: options.categoryThresholds?.seo ?? DEFAULT_CATEGORY_THRESHOLDS.seo,
  }

  const auditedUrl = normalizeAuditedUrl(options.auditedUrl ?? report.finalDisplayedUrl)
  const launchPhase = options.launchPhase ?? 'report-validation'

  const issues: LighthouseGateIssue[] = []
  const categoryScores = Object.fromEntries(
    REQUIRED_LIGHTHOUSE_CATEGORIES.map(category => [
      category,
      readLighthouseCategoryScore(report, category),
    ])
  ) as Record<LighthouseCategoryKey, number | null>

  for (const category of REQUIRED_LIGHTHOUSE_CATEGORIES) {
    const scorePercent = categoryScores[category]
    const threshold = categoryThresholds[category]

    if (scorePercent === null) {
      issues.push({
        kind: 'invalid-report-data',
        message: `Lighthouse report is missing a valid score for ${category}`,
        category,
        launchPhase,
      })
      continue
    }

    if (scorePercent < threshold) {
      issues.push({
        kind: 'category-below-threshold',
        message: `${category} is below the ${threshold}% threshold at ${scorePercent.toFixed(1)}%`,
        category,
        scorePercent,
        thresholdPercent: threshold,
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
    categoryThresholds,
    launchPhase,
    categoryScores,
    issues,
  }
}

export function formatLighthouseGateReport(report: LighthouseGateReport): string {
  const header = report.ok
    ? `✅ Lighthouse gate passed for ${report.auditedUrl}`
    : `❌ Lighthouse gate failed for ${report.auditedUrl}`

  const thresholdLines = REQUIRED_LIGHTHOUSE_CATEGORIES.map(
    category => `- ${category}: ${report.categoryThresholds[category]}%`
  )

  const lines = [
    header,
    `Launch phase: ${report.launchPhase}`,
    'Thresholds:',
    ...thresholdLines,
    `Category scores: ${summarizeCategoryScores(report.categoryScores)}`,
  ]

  if (report.finalDisplayedUrl && report.finalDisplayedUrl !== report.auditedUrl) {
    lines.push(`Final displayed URL: ${report.finalDisplayedUrl}`)
  }

  if (report.issues.length > 0) {
    lines.push('', 'Issues:')
    for (const issue of report.issues) {
      const issueLabel = issue.kind.replaceAll('-', ' ')
      const scoreSuffix =
        issue.scorePercent === undefined ? '' : ` | score: ${formatPercent(issue.scorePercent)}`
      const thresholdSuffix =
        issue.thresholdPercent === undefined
          ? ''
          : ` | threshold: ${issue.thresholdPercent.toLocaleString('en-US')}%`
      const categorySuffix = issue.category ? ` | category: ${issue.category}` : ''
      lines.push(
        `- ${issueLabel}: ${issue.message}${categorySuffix}${scoreSuffix}${thresholdSuffix} | phase: ${issue.launchPhase}`
      )
    }
  }

  return lines.join('\n')
}

async function launchPreviewServer(
  buildDir: string,
  timeoutMs: number
): Promise<PreviewServerHandle> {
  const port = await findFreePort()
  const distDir = resolve(process.cwd(), buildDir)
  const handle = await startPreviewServer(distDir, port)
  const previewUrl = `${handle.previewUrl}${DEFAULT_LIGHTHOUSE_AUDIT_PATH}`

  try {
    await waitForPreviewServer(previewUrl, timeoutMs)
    return handle
  } catch (error) {
    await handle.close()
    throw new Error(error instanceof Error ? error.message : String(error))
  }
}

async function runLighthouseAudit(
  auditUrl: string,
  browserTimeoutMs: number
): Promise<LighthouseReportLike> {
  const browserPort = await findFreePort()
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null

  try {
    browser = await chromium.launch({
      headless: true,
      timeout: browserTimeoutMs,
      args: [`--remote-debugging-port=${browserPort}`],
    })
  } catch (error) {
    throw new Error(
      `Chromium launch failed: ${error instanceof Error ? error.message : String(error)}`
    )
  }

  try {
    const result = await lighthouse(auditUrl, {
      port: browserPort,
      output: 'json',
      logLevel: 'error',
      onlyCategories: [...REQUIRED_LIGHTHOUSE_CATEGORIES],
    })

    if (!result?.lhr || !isRecord(result.lhr)) {
      throw new Error('Lighthouse did not return a valid report payload')
    }

    const lhr = result.lhr as LighthouseReportLike & {
      runtimeError?: { message?: string } | string | null
    }
    if (lhr.runtimeError) {
      const runtimeErrorMessage =
        typeof lhr.runtimeError === 'string'
          ? lhr.runtimeError
          : (lhr.runtimeError.message ?? 'Unknown Lighthouse runtime error')
      throw new Error(`Lighthouse runtime error: ${runtimeErrorMessage}`)
    }

    const report: LighthouseReportLike = {}

    if (typeof lhr.finalDisplayedUrl === 'string') {
      report.finalDisplayedUrl = lhr.finalDisplayedUrl
    }

    if (isRecord(lhr.categories)) {
      report.categories = lhr.categories as Record<string, LighthouseCategoryEntry | undefined>
    }

    return report
  } catch (error) {
    throw new Error(
      `Lighthouse audit failed: ${error instanceof Error ? error.message : String(error)}`
    )
  } finally {
    await browser?.close().catch(() => undefined)
  }
}

export async function runLighthouseGate(
  options: RunLighthouseGateOptions = {}
): Promise<LighthouseGateReport> {
  const buildDir = options.buildDir ?? 'dist'
  const auditedPath = normalizeAuditedUrl(options.auditedPath)
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
      categoryThresholds: {
        performance:
          options.categoryThresholds?.performance ?? DEFAULT_CATEGORY_THRESHOLDS.performance,
        accessibility:
          options.categoryThresholds?.accessibility ?? DEFAULT_CATEGORY_THRESHOLDS.accessibility,
        'best-practices':
          options.categoryThresholds?.bestPractices ??
          DEFAULT_CATEGORY_THRESHOLDS['best-practices'],
        seo: options.categoryThresholds?.seo ?? DEFAULT_CATEGORY_THRESHOLDS.seo,
      },
      launchPhase: 'preview-server',
      categoryScores: {
        performance: null,
        accessibility: null,
        'best-practices': null,
        seo: null,
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
    const evaluateOptions: EvaluateLighthouseGateOptions = {
      auditedUrl: auditedPath,
      launchPhase: 'lighthouse-audit',
    }
    if (options.categoryThresholds) {
      evaluateOptions.categoryThresholds = options.categoryThresholds
    }
    return evaluateLighthouseGate(rawReport, evaluateOptions)
  } catch (error) {
    return {
      ok: false,
      auditedUrl: auditedPath,
      finalDisplayedUrl: null,
      categoryThresholds: {
        performance:
          options.categoryThresholds?.performance ?? DEFAULT_CATEGORY_THRESHOLDS.performance,
        accessibility:
          options.categoryThresholds?.accessibility ?? DEFAULT_CATEGORY_THRESHOLDS.accessibility,
        'best-practices':
          options.categoryThresholds?.bestPractices ??
          DEFAULT_CATEGORY_THRESHOLDS['best-practices'],
        seo: options.categoryThresholds?.seo ?? DEFAULT_CATEGORY_THRESHOLDS.seo,
      },
      launchPhase: 'lighthouse-audit',
      categoryScores: {
        performance: null,
        accessibility: null,
        'best-practices': null,
        seo: null,
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
