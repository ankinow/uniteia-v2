import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { validateBlocks } from '../content-contracts/blocks.schema'
import { validateDesign } from '../content-contracts/design.schema'
import { type Manifest, validateManifest } from '../content-contracts/manifest.schema'
import { validateQuality } from '../content-contracts/quality.schema'
import { validateTags } from '../content-contracts/tags.schema'
import { getAllowedBlockKinds, getForbiddenBlocks, hasLayout } from '../layouts/registry'
import { contentNodeSchema } from '@uniteia/content-node-contract'

export interface PackageValidationIssue {
  path: string
  message: string
  severity: 'error' | 'warning'
}

export interface PackageValidationResult {
  valid: boolean
  issues: PackageValidationIssue[]
  packageDir: string
}

export function validatePackage(packageDir: string): PackageValidationResult {
  const issues: PackageValidationIssue[] = []
  const path = packageDir

  // Read manifest.json
  let manifestRaw: unknown
  try {
    const manifestPath = `${path}/manifest.json`
    if (!existsSync(manifestPath)) {
      issues.push({ path: 'manifest.json', message: 'manifest.json not found', severity: 'error' })
      return { valid: false, issues, packageDir }
    }
    manifestRaw = JSON.parse(readFileSync(manifestPath, 'utf-8'))
  } catch (e: unknown) {
    issues.push({
      path: 'manifest.json',
      message: `cannot read manifest: ${(e as Error).message}`,
      severity: 'error',
    })
    return { valid: false, issues, packageDir }
  }

  // Validate manifest
  const manifestResult = validateManifest(manifestRaw)
  for (const err of manifestResult.errors) {
    issues.push({ path: 'manifest.json', message: err, severity: 'error' })
  }
  if (!manifestResult.valid) {
    return { valid: false, issues, packageDir }
  }

  const manifest = manifestRaw as Manifest

  // Validate content-nodes.json if present (L2 bridge contract)
  const contentNodesPath = `${path}/content-nodes.json`
  if (existsSync(contentNodesPath)) {
    try {
      const contentNodesRaw = JSON.parse(readFileSync(contentNodesPath, 'utf-8'))
      if (!Array.isArray(contentNodesRaw)) {
        issues.push({ path: 'content-nodes.json', message: 'content-nodes.json must be a JSON array', severity: 'error' })
      } else if (contentNodesRaw.length === 0) {
        issues.push({ path: 'content-nodes.json', message: 'content-nodes.json is empty', severity: 'warning' })
      } else {
        for (let i = 0; i < contentNodesRaw.length; i++) {
          try {
            contentNodeSchema.parse(contentNodesRaw[i])
          } catch (e: unknown) {
            issues.push({
              path: `content-nodes.json[${i}]`,
              message: `invalid ContentNode: ${(e as Error).message}`,
              severity: 'error',
            })
          }
        }
      }
    } catch {
      issues.push({ path: 'content-nodes.json', message: 'cannot parse content-nodes.json', severity: 'error' })
    }
  }

  // Check layoutId
  if (!hasLayout(manifest.layout.layoutId)) {
    issues.push({
      path: 'manifest.json',
      message: `unknown layoutId: ${manifest.layout.layoutId}`,
      severity: 'error',
    })
    return { valid: false, issues, packageDir }
  }

  // Read and validate design.md
  try {
    const designPath = `${path}/design.md`
    if (!existsSync(designPath)) {
      issues.push({ path: 'design.md', message: 'design.md not found', severity: 'error' })
      // Continue - we collect all issues
    } else {
      const designContent = readFileSync(designPath, 'utf-8')
      try {
        const designParsed = JSON.parse(designContent)
        const designResult = validateDesign(designParsed)
        for (const err of designResult.errors) {
          issues.push({ path: 'design.md', message: err, severity: 'error' })
        }
      } catch {
        // design.md is markdown, not JSON - check for YAML frontmatter or markdown content
        if (designContent.trim().length === 0) {
          issues.push({ path: 'design.md', message: 'design.md is empty', severity: 'error' })
        }
      }
    }
  } catch {
    issues.push({ path: 'design.md', message: 'design.md not found', severity: 'error' })
  }

  // Read and validate tags.json
  try {
    const tagsPath = `${path}/tags.json`
    if (!existsSync(tagsPath)) {
      issues.push({ path: 'tags.json', message: 'tags.json not found', severity: 'error' })
    } else {
      const tagsRaw = JSON.parse(readFileSync(tagsPath, 'utf-8'))
      const tagsResult = validateTags(tagsRaw)
      for (const err of tagsResult.errors) {
        issues.push({ path: 'tags.json', message: err, severity: 'error' })
      }
      for (const warn of tagsResult.warnings) {
        issues.push({ path: 'tags.json', message: warn, severity: 'warning' })
      }
    }
  } catch {
    issues.push({ path: 'tags.json', message: 'cannot read tags.json', severity: 'error' })
  }

  // Read and validate quality.json
  try {
    const qualityPath = `${path}/quality.json`
    if (!existsSync(qualityPath)) {
      issues.push({ path: 'quality.json', message: 'quality.json not found', severity: 'error' })
    } else {
      const qualityRaw = JSON.parse(readFileSync(qualityPath, 'utf-8'))
      const qualityResult = validateQuality(qualityRaw)
      for (const err of qualityResult.errors) {
        issues.push({ path: 'quality.json', message: err, severity: 'error' })
      }
    }
  } catch {
    issues.push({ path: 'quality.json', message: 'cannot read quality.json', severity: 'error' })
  }

  // Read and validate sources.json
  try {
    const sourcesPath = `${path}/sources.json`
    if (!existsSync(sourcesPath)) {
      issues.push({ path: 'sources.json', message: 'sources.json not found', severity: 'error' })
    }
  } catch {
    issues.push({ path: 'sources.json', message: 'cannot read sources.json', severity: 'error' })
  }

  // Validate locale files exist
  const validLocales = new Set(['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh', 'pt-BR'])
  for (const locale of manifest.locales) {
    if (!validLocales.has(locale)) {
      issues.push({
        path: 'manifest.json',
        message: `unknown locale: ${locale}`,
        severity: 'warning',
      })
    }
    try {
      const localeFile = `${path}/content.${locale}.mdx`
      if (!existsSync(localeFile)) {
        issues.push({
          path: `content.${locale}.mdx`,
          message: `missing locale file: ${locale}`,
          severity: 'error',
        })
      }
    } catch {
      issues.push({
        path: `content.${locale}.mdx`,
        message: `cannot check locale file: ${locale}`,
        severity: 'error',
      })
    }
  }

  // Validate blocks against layout
  const blocksDir = `${path}/blocks`
  try {
    if (existsSync(blocksDir)) {
      const blockFiles = readdirSync(blocksDir).filter((f: string) => f.endsWith('.json'))
      const forbidden = getForbiddenBlocks(manifest.layout.layoutId)

      for (const blockFile of blockFiles) {
        try {
          const blockRaw = JSON.parse(readFileSync(`${blocksDir}/${blockFile}`, 'utf-8'))
          const blockResult = validateBlocks(
            [blockRaw],
            getAllowedBlockKinds(manifest.layout.layoutId)
          )
          for (const err of blockResult.errors) {
            issues.push({ path: `blocks/${blockFile}`, message: err, severity: 'error' })
          }
          if (blockRaw.kind && forbidden.has(blockRaw.kind)) {
            issues.push({
              path: `blocks/${blockFile}`,
              message: `block kind "${blockRaw.kind}" is forbidden for layout "${manifest.layout.layoutId}"`,
              severity: 'error',
            })
          }
        } catch (e: unknown) {
          issues.push({
            path: `blocks/${blockFile}`,
            message: `cannot parse: ${(e as Error).message}`,
            severity: 'error',
          })
        }
      }
    }
  } catch {
    // blocks dir optional
  }

  // Draft protections
  if (manifest.status === 'draft') {
    issues.push({
      path: 'package',
      message: 'draft package: noindex must be applied',
      severity: 'warning',
    })
    issues.push({ path: 'package', message: 'draft package: not in sitemap', severity: 'warning' })
    issues.push({
      path: 'package',
      message: 'draft package: cannot be published',
      severity: 'warning',
    })
  }

  if (manifest.quality.publishable === false) {
    issues.push({
      path: 'package',
      message: 'publishable=false: cannot publish',
      severity: 'warning',
    })
  }

  const hasErrors = issues.some(i => i.severity === 'error')
  return { valid: !hasErrors, issues, packageDir }
}
