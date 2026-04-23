import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  DEFAULT_ROUTE_GZIP_BUDGET_BYTES,
  evaluateRouteSizeGate,
  formatRouteSizeGateReport,
} from '~/utils/size-gate'

function repeatWord(word: string, count: number): string {
  return Array.from({ length: count }, () => word).join('')
}

async function createFixtureBuild(layout: {
  manifestJson: string
  bundleGraphJson?: string
  bundles: Record<string, string>
}) {
  const rootDir = await mkdtemp(join(tmpdir(), 'uniteia-size-gate-'))
  const distDir = join(rootDir, 'dist')
  const buildDir = join(distDir, 'build')
  const assetsDir = join(distDir, 'assets')
  await mkdir(buildDir, { recursive: true })
  await mkdir(assetsDir, { recursive: true })

  await writeFile(join(distDir, 'q-manifest.json'), layout.manifestJson, 'utf-8')
  if (layout.bundleGraphJson !== undefined) {
    await writeFile(join(distDir, 'assets', 'bundle-graph.json'), layout.bundleGraphJson, 'utf-8')
  }

  await Promise.all(
    Object.entries(layout.bundles).map(([fileName, content]) =>
      writeFile(join(buildDir, fileName), content, 'utf-8')
    )
  )

  return {
    rootDir,
    distDir,
    cleanup: () => rm(rootDir, { recursive: true, force: true }),
  }
}

describe('evaluateRouteSizeGate', () => {
  it('computes route gzip footprints and reports exact-threshold and oversized routes', async () => {
    const fixture = await createFixtureBuild({
      manifestJson: JSON.stringify(
        {
          version: '1',
          manifestHash: 'fixture',
          bundleGraphAsset: 'assets/bundle-graph.json',
          bundles: {
            'q-route-pass.js': {
              imports: ['q-shared.js'],
              dynamicImports: [],
              origins: ['src/routes/pass/index.tsx'],
            },
            'q-route-exact.js': {
              imports: ['q-shared.js'],
              dynamicImports: ['q-exact-extra.js'],
              origins: ['src/routes/exact/index.tsx'],
            },
            'q-route-oversized.js': {
              imports: ['q-shared.js'],
              dynamicImports: ['q-oversized-extra.js'],
              origins: ['src/routes/oversized/index.tsx'],
            },
            'q-shared.js': {
              imports: [],
              dynamicImports: [],
              origins: ['src/routes/layout.tsx'],
            },
            'q-exact-extra.js': {
              imports: [],
              dynamicImports: [],
              origins: ['src/routes/exact/index.tsx_exact_component.js'],
            },
            'q-oversized-extra.js': {
              imports: [],
              dynamicImports: [],
              origins: ['src/routes/oversized/index.tsx_oversized_component.js'],
            },
          },
        },
        null,
        2
      ),
      bundleGraphJson: JSON.stringify({ nodes: ['fixture'] }, null, 2),
      bundles: {
        'q-route-pass.js': `export const pass = ${JSON.stringify(repeatWord('pass', 8))};`,
        'q-route-exact.js': `export const exact = ${JSON.stringify(repeatWord('exact', 24))};`,
        'q-route-oversized.js': `export const oversized = ${JSON.stringify(repeatWord('oversized', 64))};`,
        'q-shared.js': `export const shared = ${JSON.stringify(repeatWord('shared', 48))};`,
        'q-exact-extra.js': `export const exactExtra = ${JSON.stringify(repeatWord('extra', 32))};`,
        'q-oversized-extra.js': `export const oversizedExtra = ${JSON.stringify(repeatWord('extra', 128))};`,
      },
    })

    try {
      const analyzed = await evaluateRouteSizeGate({ buildDir: fixture.distDir, thresholdBytes: 1_000_000 })

      expect(analyzed.ok).toBe(true)
      expect(analyzed.routes).toHaveLength(3)
      const routeKeys = analyzed.routes.map(route => route.routeKey)
      expect(routeKeys).toEqual([
        '/exact',
        '/oversized',
        '/pass',
      ])

      const exactRoute = analyzed.routes.find(route => route.routeKey === '/exact')
      const oversizedRoute = analyzed.routes.find(route => route.routeKey === '/oversized')
      const passRoute = analyzed.routes.find(route => route.routeKey === '/pass')

      expect(exactRoute).toBeDefined()
      expect(oversizedRoute).toBeDefined()
      expect(passRoute).toBeDefined()
      expect(exactRoute?.gzipBytes).toBeTypeOf('number')
      expect(oversizedRoute?.gzipBytes).toBeGreaterThan(exactRoute?.gzipBytes ?? 0)
      expect(passRoute?.gzipBytes).toBeLessThanOrEqual(exactRoute?.gzipBytes ?? 0)

      const exactThreshold = exactRoute?.gzipBytes ?? DEFAULT_ROUTE_GZIP_BUDGET_BYTES
      const passedAtExactThreshold = await evaluateRouteSizeGate({
        buildDir: fixture.distDir,
        thresholdBytes: exactThreshold,
      })
      expect(passedAtExactThreshold.ok).toBe(true)
      expect(passedAtExactThreshold.issues).toHaveLength(0)
      expect(passedAtExactThreshold.routes.find(route => route.routeKey === '/exact')?.gzipBytes).toBe(
        exactThreshold
      )

      const failedJustBelow = await evaluateRouteSizeGate({
        buildDir: fixture.distDir,
        thresholdBytes: Math.max(0, exactThreshold - 1),
      })
      expect(failedJustBelow.ok).toBe(false)
      expect(failedJustBelow.issues.some(issue => issue.kind === 'route-over-budget')).toBe(true)
      expect(failedJustBelow.issues.some(issue => issue.routeKey === '/exact')).toBe(true)
      expect(failedJustBelow.issues.some(issue => issue.routeKey === '/oversized')).toBe(true)
      expect(failedJustBelow.issues.every(issue => issue.thresholdBytes === exactThreshold - 1 || issue.thresholdBytes === undefined)).toBe(true)

      const report = formatRouteSizeGateReport(failedJustBelow)
      expect(report).toContain('/exact')
      expect(report).toContain('/oversized')
      expect(report).toContain(String(Math.max(0, exactThreshold - 1)))
      expect(report).toContain('gzip')
      expect(report).toContain('q-route-exact.js')
    } finally {
      await fixture.cleanup()
    }
  })

  it('reports malformed build metadata without throwing a stack trace', async () => {
    const fixture = await createFixtureBuild({
      manifestJson: '{"version":',
      bundleGraphJson: JSON.stringify({ nodes: [] }),
      bundles: {},
    })

    try {
      const analyzed = await evaluateRouteSizeGate({ buildDir: fixture.distDir })

      expect(analyzed.ok).toBe(false)
      expect(analyzed.routes).toHaveLength(0)
      expect(analyzed.issues.some(issue => issue.kind === 'manifest-parse')).toBe(true)
      expect(formatRouteSizeGateReport(analyzed)).toContain('manifest')
    } finally {
      await fixture.cleanup()
    }
  })

  it('reports missing build artifacts clearly', async () => {
    const fixture = await createFixtureBuild({
      manifestJson: JSON.stringify(
        {
          version: '1',
          manifestHash: 'fixture',
          bundleGraphAsset: 'assets/bundle-graph.json',
          bundles: {
            'q-route-missing.js': {
              imports: ['q-shared.js'],
              dynamicImports: [],
              origins: ['src/routes/missing/index.tsx'],
            },
            'q-shared.js': {
              imports: [],
              dynamicImports: [],
              origins: ['src/routes/layout.tsx'],
            },
          },
        },
        null,
        2
      ),
      bundleGraphJson: JSON.stringify({ nodes: ['fixture'] }, null, 2),
      bundles: {
        'q-shared.js': `export const shared = ${JSON.stringify(repeatWord('shared', 32))};`,
      },
    })

    try {
      const analyzed = await evaluateRouteSizeGate({ buildDir: fixture.distDir })

      expect(analyzed.ok).toBe(false)
      expect(analyzed.issues.some(issue => issue.kind === 'missing-bundle')).toBe(true)
      expect(analyzed.issues.some(issue => issue.routeKey === '/missing')).toBe(true)
      expect(formatRouteSizeGateReport(analyzed)).toContain('q-route-missing.js')
    } finally {
      await fixture.cleanup()
    }
  })
})
