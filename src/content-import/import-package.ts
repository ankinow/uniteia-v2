import { existsSync, readFileSync } from 'node:fs'
import type { Manifest } from '../content-contracts/manifest.schema'
import type { ContentNode as ContractContentNode } from '@uniteia/content-node-contract'
import { contentNodeSchema } from '@uniteia/content-node-contract'

export interface ImportedPackage {
  manifest: Manifest
  packageDir: string
  factoryNodes: ContractContentNode[]
  importReport: {
    timestamp: string
    packageDir: string
    slug: string
    layoutId: string
    status: string
    canPublish: boolean
    shouldNoindex: boolean
    warnings: string[]
    nodeCount: number
    metadataOrigin: 'factory' | 're-derived'
  }
}

export function importPackage(packageDir: string, manifest: Manifest): ImportedPackage {
  const manifestQ = manifest.quality
  const canPublish =
    manifestQ.publishable && manifestQ.blockers.length === 0 && manifestQ.trustLevel !== 'low'
  const shouldNoindex = manifest.status === 'draft' || !canPublish

  // Read content-nodes.json if present (L2 bridge contract)
  const contentNodesPath = `${packageDir}/content-nodes.json`
  let factoryNodes: ContractContentNode[] = []
  let metadataOrigin: 'factory' | 're-derived' = 're-derived'

  if (existsSync(contentNodesPath)) {
    try {
      const raw = JSON.parse(readFileSync(contentNodesPath, 'utf-8'))
      if (Array.isArray(raw)) {
        factoryNodes = raw.map((n: unknown) => contentNodeSchema.parse(n)) as ContractContentNode[]
        metadataOrigin = 'factory'
      }
    } catch {
      // Invalid content-nodes.json — fall back to re-derived
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    packageDir,
    slug: manifest.canonicalSlug,
    layoutId: manifest.layout.layoutId,
    status: manifest.status,
    canPublish,
    shouldNoindex,
    warnings: manifestQ.warnings ?? [],
    nodeCount: factoryNodes.length,
    metadataOrigin,
  }

  return {
    manifest,
    packageDir,
    factoryNodes,
    importReport: report,
  }
}

export function getContentFile(packageDir: string, locale: string): string {
  return `${packageDir}/content.${locale}.mdx`
}

export function getFactoryNode(
  factoryNodes: ContractContentNode[],
  locale: string,
  canonicalSlug: string
): ContractContentNode | undefined {
  return factoryNodes.find(
    (n) => n.locale === locale && n.canonicalSlug === canonicalSlug
  )
}
