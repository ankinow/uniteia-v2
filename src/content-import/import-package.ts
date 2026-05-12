import type { Manifest } from '../content-contracts/manifest.schema'

export interface ImportedPackage {
  manifest: Manifest
  packageDir: string
  importReport: {
    timestamp: string
    packageDir: string
    slug: string
    layoutId: string
    status: string
    canPublish: boolean
    shouldNoindex: boolean
    warnings: string[]
  }
}

export function importPackage(packageDir: string, manifest: Manifest): ImportedPackage {
  const manifestQ = manifest.quality
  const canPublish =
    manifestQ.publishable && manifestQ.blockers.length === 0 && manifestQ.trustLevel !== 'low'
  const shouldNoindex = manifest.status === 'draft' || !canPublish

  const report = {
    timestamp: new Date().toISOString(),
    packageDir,
    slug: manifest.canonicalSlug,
    layoutId: manifest.layout.layoutId,
    status: manifest.status,
    canPublish,
    shouldNoindex,
    warnings: manifestQ.warnings ?? [],
  }

  return {
    manifest,
    packageDir,
    importReport: report,
  }
}

export function getContentFile(packageDir: string, locale: string): string {
  return `${packageDir}/content.${locale}.mdx`
}
