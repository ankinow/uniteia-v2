import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

export const DEFAULT_ROUTE_GZIP_BUDGET_BYTES = 85 * 1024

// ── Sub-budgets (M003 S05) ─────────────────────────────────────────────

export const SUB_BUDGET_HTML_GZIP = 20 * 1024 // 20 KB — initial HTML per route
export const SUB_BUDGET_ENTRY_GZIP = 15 * 1024 // 15 KB — first interaction chunk
export const SUB_BUDGET_TOTAL_GZIP = 50 * 1024 // 50 KB — total critical path

export interface SubBudgetResult {
  htmlGzipBytes: number | null
  htmlWithinBudget: boolean
  entryGzipBytes: number | null
  entryWithinBudget: boolean
  totalGzipBytes: number | null
  totalWithinBudget: boolean
  violations: string[]
}

interface ManifestBundle {
  imports?: string[]
  dynamicImports?: string[]
  origins?: string[]
}

interface ManifestShape {
  bundleGraphAsset?: string
  bundles?: Record<string, ManifestBundle>
}

export interface RouteSizeReport {
  routeKey: string
  entryBundle: string
  artifactPaths: string[]
  gzipBytes: number | null
  subBudgets?: SubBudgetResult
}

export interface SizeGateIssue {
  kind:
    | 'manifest-missing'
    | 'manifest-parse'
    | 'manifest-invalid'
    | 'bundle-graph-missing'
    | 'bundle-graph-parse'
    | 'missing-bundle'
    | 'route-over-budget'
    | 'no-routes-found'
  message: string
  routeKey?: string
  entryBundle?: string
  artifactPaths?: string[]
  bytes?: number | null
  thresholdBytes?: number
}

export interface SizeGateReport {
  ok: boolean
  buildDir: string
  thresholdBytes: number
  routes: RouteSizeReport[]
  issues: SizeGateIssue[]
}

export interface RouteSizeGateOptions {
  buildDir?: string
  thresholdBytes?: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeRouteKey(origin: string): string | null {
  if (!origin.startsWith('src/routes/')) {
    return null
  }

  if (
    origin === 'src/routes/layout.tsx' ||
    origin.includes('_component_') ||
    origin.includes('_layout_')
  ) {
    return null
  }

  if (origin !== 'src/routes/index.tsx' && !origin.endsWith('/index.tsx')) {
    return null
  }

  const routePath = origin.slice('src/routes'.length).replace(/\/index\.tsx$/, '')
  return routePath.length === 0 ? '/' : routePath
}

function isRouteBundle(bundle: ManifestBundle): bundle is ManifestBundle {
  return (
    Array.isArray(bundle.origins) &&
    bundle.origins.some(origin => normalizeRouteKey(origin) !== null)
  )
}

function collectBundleClosure(
  entryBundle: string,
  bundles: Record<string, ManifestBundle>
): {
  bundleNames: string[]
  missingBundleNames: string[]
} {
  const seen = new Set<string>()
  const missing = new Set<string>()
  const stack = [entryBundle]

  while (stack.length > 0) {
    const bundleName = stack.pop()
    if (!bundleName || seen.has(bundleName)) {
      continue
    }

    seen.add(bundleName)
    const bundle = bundles[bundleName]
    if (!bundle) {
      missing.add(bundleName)
      continue
    }

    for (const dependency of [...(bundle.imports ?? []), ...(bundle.dynamicImports ?? [])]) {
      if (!seen.has(dependency)) {
        stack.push(dependency)
      }
    }
  }

  return {
    bundleNames: [...seen].sort(),
    missingBundleNames: [...missing].sort(),
  }
}

async function readText(
  filePath: string
): Promise<{ ok: true; value: string } | { ok: false; error: Error }> {
  try {
    return { ok: true, value: await readFile(filePath, 'utf8') }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error : new Error(String(error)) }
  }
}

function parseJson<T>(
  text: string,
  fallbackMessage: string
): { ok: true; value: T } | { ok: false; error: Error } {
  try {
    return { ok: true, value: JSON.parse(text) as T }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error(fallbackMessage),
    }
  }
}

function routeKeyFromBundle(bundle: ManifestBundle): string | null {
  for (const origin of bundle.origins ?? []) {
    const routeKey = normalizeRouteKey(origin)
    if (routeKey) {
      return routeKey
    }
  }
  return null
}

function joinArtifactPaths(buildDir: string, bundleNames: string[]): string[] {
  return bundleNames.map(bundleName => join(buildDir, 'build', bundleName))
}

function formatBytes(bytes: number | null): string {
  return bytes === null ? 'unavailable' : `${bytes.toLocaleString('en-US')} gzip bytes`
}

/**
 * Evaluate sub-budgets for a route: HTML size, entry bundle size, and total size.
 * Returns the sub-budget result with violation messages.
 */
export async function evaluateSubBudgets(
  buildDir: string,
  routeKey: string,
  entryBundle: string,
  _artifactPaths: string[],
  totalGzipBytes: number | null
): Promise<SubBudgetResult> {
  const violations: string[] = []
  let htmlGzipBytes: number | null = null
  let entryGzipBytes: number | null = null
  let htmlWithinBudget = false
  let entryWithinBudget = false
  let totalWithinBudget = false

  // Measure HTML file: dist/{locale}/{route}/index.html or dist/{locale}/index.html
  const htmlPath = join(buildDir, routeKey.slice(1), 'index.html')
  const altHtmlPath = join(buildDir, routeKey.slice(1).replace(/\/[^/]+$/, ''), 'index.html')

  for (const hp of [htmlPath, altHtmlPath]) {
    if (existsSync(hp)) {
      try {
        const htmlContent = await readFile(hp, 'utf-8')
        htmlGzipBytes = gzipSync(htmlContent).length
        break
      } catch {
        // continue to next path
      }
    }
  }

  // Measure entry bundle
  const entryPath = join(buildDir, 'build', entryBundle)
  try {
    const entryContent = await readFile(entryPath, 'utf-8')
    entryGzipBytes = gzipSync(entryContent).length
  } catch {
    // entry bundle not found
  }

  htmlWithinBudget = htmlGzipBytes !== null && htmlGzipBytes <= SUB_BUDGET_HTML_GZIP
  entryWithinBudget = entryGzipBytes !== null && entryGzipBytes <= SUB_BUDGET_ENTRY_GZIP
  totalWithinBudget = totalGzipBytes !== null && totalGzipBytes <= SUB_BUDGET_TOTAL_GZIP

  if (htmlGzipBytes !== null && !htmlWithinBudget) {
    violations.push(
      `Route ${routeKey} HTML exceeds ${SUB_BUDGET_HTML_GZIP.toLocaleString('en-US')} gzip bytes: ${htmlGzipBytes.toLocaleString('en-US')} bytes`
    )
  }

  if (entryGzipBytes !== null && !entryWithinBudget) {
    violations.push(
      `Route ${routeKey} entry bundle "${entryBundle}" exceeds ${SUB_BUDGET_ENTRY_GZIP.toLocaleString('en-US')} gzip bytes: ${entryGzipBytes.toLocaleString('en-US')} bytes`
    )
  }

  if (totalGzipBytes !== null && !totalWithinBudget) {
    violations.push(
      `Route ${routeKey} total critical path exceeds ${SUB_BUDGET_TOTAL_GZIP.toLocaleString('en-US')} gzip bytes: ${totalGzipBytes.toLocaleString('en-US')} bytes`
    )
  }

  return {
    htmlGzipBytes,
    htmlWithinBudget,
    entryGzipBytes,
    entryWithinBudget,
    totalGzipBytes,
    totalWithinBudget,
    violations,
  }
}

export async function evaluateRouteSizeGate(
  options: RouteSizeGateOptions = {}
): Promise<SizeGateReport> {
  const buildDir = resolve(options.buildDir ?? 'dist')
  const thresholdBytes = options.thresholdBytes ?? DEFAULT_ROUTE_GZIP_BUDGET_BYTES
  const issues: SizeGateIssue[] = []
  const routes: RouteSizeReport[] = []

  const manifestPath = join(buildDir, 'q-manifest.json')
  const manifestResult = await readText(manifestPath)
  if (!manifestResult.ok) {
    issues.push({
      kind: manifestResult.error.message.includes('ENOENT') ? 'manifest-missing' : 'manifest-parse',
      message: `Unable to read ${manifestPath}: ${manifestResult.error.message}`,
    })
    return {
      ok: false,
      buildDir,
      thresholdBytes,
      routes,
      issues,
    }
  }

  const manifestParse = parseJson<ManifestShape>(
    manifestResult.value,
    'Unable to parse q-manifest.json'
  )
  if (!manifestParse.ok) {
    issues.push({
      kind: 'manifest-parse',
      message: `Unable to parse ${manifestPath}: ${manifestParse.error.message}`,
    })
    return {
      ok: false,
      buildDir,
      thresholdBytes,
      routes,
      issues,
    }
  }

  const manifest = manifestParse.value
  if (!isRecord(manifest) || !isRecord(manifest.bundles)) {
    issues.push({
      kind: 'manifest-invalid',
      message: `${manifestPath} does not expose a valid bundles map`,
    })
    return {
      ok: false,
      buildDir,
      thresholdBytes,
      routes,
      issues,
    }
  }

  if (typeof manifest.bundleGraphAsset !== 'string' || manifest.bundleGraphAsset.length === 0) {
    issues.push({
      kind: 'bundle-graph-missing',
      message: `${manifestPath} does not declare a bundleGraphAsset`,
    })
  } else {
    const bundleGraphPath = join(buildDir, manifest.bundleGraphAsset)
    const bundleGraphResult = await readText(bundleGraphPath)
    if (!bundleGraphResult.ok) {
      issues.push({
        kind: bundleGraphResult.error.message.includes('ENOENT')
          ? 'bundle-graph-missing'
          : 'bundle-graph-parse',
        message: `Unable to read ${bundleGraphPath}: ${bundleGraphResult.error.message}`,
      })
    } else {
      const bundleGraphParse = parseJson<unknown>(
        bundleGraphResult.value,
        'Unable to parse bundle graph'
      )
      if (!bundleGraphParse.ok) {
        issues.push({
          kind: 'bundle-graph-parse',
          message: `Unable to parse ${bundleGraphPath}: ${bundleGraphParse.error.message}`,
        })
      }
    }
  }

  const bundles = manifest.bundles as Record<string, ManifestBundle>
  const routeBundles = Object.entries(bundles)
    .map(([entryBundle, bundle]) => ({ entryBundle, bundle }))
    .filter(({ bundle }) => isRouteBundle(bundle))
    .map(({ entryBundle, bundle }) => {
      const routeKey = routeKeyFromBundle(bundle)
      return routeKey ? { entryBundle, bundle, routeKey } : null
    })
    .filter(
      (value): value is { entryBundle: string; bundle: ManifestBundle; routeKey: string } =>
        value !== null
    )
    .sort((left, right) => left.routeKey.localeCompare(right.routeKey))

  for (const route of routeBundles) {
    const closure = collectBundleClosure(route.entryBundle, bundles)
    const artifactPaths = joinArtifactPaths(buildDir, closure.bundleNames)
    const routeReport: RouteSizeReport = {
      routeKey: route.routeKey,
      entryBundle: route.entryBundle,
      artifactPaths,
      gzipBytes: null,
    }

    if (closure.missingBundleNames.length > 0) {
      issues.push({
        kind: 'missing-bundle',
        message: `Missing bundle metadata for ${closure.missingBundleNames.join(', ')} while resolving ${route.routeKey}`,
        routeKey: route.routeKey,
        entryBundle: route.entryBundle,
        artifactPaths: joinArtifactPaths(buildDir, closure.missingBundleNames),
      })
      routes.push(routeReport)
      continue
    }

    let totalBytes = 0
    let missingArtifact: string | null = null

    for (const artifactPath of artifactPaths) {
      const artifactResult = await readText(artifactPath)
      if (!artifactResult.ok) {
        missingArtifact = artifactPath
        break
      }

      totalBytes += gzipSync(artifactResult.value).length
    }

    if (missingArtifact) {
      issues.push({
        kind: 'missing-bundle',
        message: `Missing bundle artifact ${missingArtifact} for route ${route.routeKey}`,
        routeKey: route.routeKey,
        entryBundle: route.entryBundle,
        artifactPaths: [missingArtifact, ...artifactPaths.filter(path => path !== missingArtifact)],
      })
      routes.push(routeReport)
      continue
    }

    routeReport.gzipBytes = totalBytes

    // Evaluate sub-budgets (M003 S05)
    const subResult = await evaluateSubBudgets(
      buildDir,
      route.routeKey,
      route.entryBundle,
      artifactPaths,
      totalBytes
    )
    routeReport.subBudgets = subResult

    for (const violation of subResult.violations) {
      issues.push({
        kind: 'route-over-budget',
        message: violation,
        routeKey: route.routeKey,
        entryBundle: route.entryBundle,
        artifactPaths,
      })
    }

    if (totalBytes > thresholdBytes) {
      issues.push({
        kind: 'route-over-budget',
        message: `Route ${route.routeKey} exceeds the ${thresholdBytes.toLocaleString('en-US')} gzip-byte budget with ${totalBytes.toLocaleString('en-US')} gzip bytes`,
        routeKey: route.routeKey,
        entryBundle: route.entryBundle,
        artifactPaths,
        bytes: totalBytes,
        thresholdBytes,
      })
    }

    routes.push(routeReport)
  }

  if (routeBundles.length === 0) {
    issues.push({
      kind: 'no-routes-found',
      message: `No route bundles were discovered in ${manifestPath}`,
    })
  }

  return {
    ok: issues.length === 0,
    buildDir,
    thresholdBytes,
    routes,
    issues,
  }
}

export function formatRouteSizeGateReport(report: SizeGateReport): string {
  const header = report.ok
    ? `✅ Route size gate passed (${report.routes.length} routes, overall threshold ${report.thresholdBytes.toLocaleString('en-US')} gzip bytes, sub-budgets: HTML < 20KB | Entry < 15KB | Total < 50KB)`
    : `❌ Route size gate failed (${report.issues.length} issue${report.issues.length === 1 ? '' : 's'})`

  const routeLines = report.routes.map(route => {
    const sb = route.subBudgets
    const subBudgetLine = sb
      ? ` [HTML: ${formatBytes(sb.htmlGzipBytes)}${sb.htmlWithinBudget ? ' ✅' : ' ❌'}` +
        ` | Entry: ${formatBytes(sb.entryGzipBytes)}${sb.entryWithinBudget ? ' ✅' : ' ❌'}` +
        ` | Total: ${formatBytes(sb.totalGzipBytes)}${sb.totalWithinBudget ? ' ✅' : ' ❌'}]`
      : ''
    const artifactSuffix =
      route.artifactPaths.length > 0 ? ` [${route.artifactPaths.join(', ')}]` : ''
    return `- ${route.routeKey}: ${formatBytes(route.gzipBytes)}${subBudgetLine}${artifactSuffix}`
  })

  const issueLines = report.issues.map(issue => {
    const pathSuffix =
      issue.artifactPaths && issue.artifactPaths.length > 0
        ? ` | artifacts: ${issue.artifactPaths.join(', ')}`
        : ''
    const routeSuffix = issue.routeKey ? ` | route: ${issue.routeKey}` : ''
    const bytesSuffix =
      issue.bytes === null || issue.bytes === undefined
        ? ''
        : ` | bytes: ${issue.bytes.toLocaleString('en-US')}`
    const thresholdSuffix =
      issue.thresholdBytes !== undefined
        ? ` | threshold: ${issue.thresholdBytes.toLocaleString('en-US')}`
        : ''
    return `- ${issue.kind}: ${issue.message}${routeSuffix}${bytesSuffix}${thresholdSuffix}${pathSuffix}`
  })

  return [
    header,
    '',
    `Build directory: ${report.buildDir}`,
    `Threshold: ${report.thresholdBytes.toLocaleString('en-US')} gzip bytes`,
  ]
    .concat(routeLines.length > 0 ? ['', 'Routes:', ...routeLines] : [])
    .concat(issueLines.length > 0 ? ['', 'Issues:', ...issueLines] : [])
    .join('\n')
}
