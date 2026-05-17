import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import { importPackage, getFactoryNode } from '../src/content-import/import-package'
import { mapLayout } from '../src/content-import/map-layout'
import { validatePackage } from '../src/content-import/validate-package'
import type { ContentNode } from '@uniteia/content-node-contract'

const V2_ROOT = process.cwd()
const FACTORY_ROOT = join(V2_ROOT, '..', 'uniteia-mega-factory')

const CONTRACT_TO_V2_LOCALE: Record<string, string> = {
  'pt-BR': 'pt',
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  ja: 'ja',
  zh: 'zh',
}

const V2_TO_CONTRACT_LOCALE: Record<string, string> = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  ja: 'ja',
  zh: 'zh',
}

const NICHE = 'apex'

function buildFrontmatter(
  slug: string,
  lang: string,
  title: string,
  importReport: Record<string, unknown>,
  factoryNode?: ContentNode
): string {
  const qualityScore = factoryNode?.qualityScore ?? (importReport.canPublish === false ? 30 : 65)
  const trustScore = factoryNode?.trustScore ?? 35
  const verdict = factoryNode?.verdict ?? 'caution'
  const visibility = factoryNode?.visibility ?? 'draft'
  const lifecycle = factoryNode?.lifecycle ?? 'generated'
  const createdAt = factoryNode?.timestamps.createdAt ?? new Date().toISOString()
  const updatedAt = factoryNode?.timestamps.updatedAt ?? new Date().toISOString()
  const noindex = factoryNode?.seo.noindex ?? (importReport.canPublish === false)
  const seoPriority = factoryNode?.seo.priority ?? qualityScore

  return [
    '---',
    `slug: ${slug}`,
    `lang: ${lang}`,
    `title: ${JSON.stringify(title)}`,
    `verdict: ${verdict}`,
    `quality_score: ${qualityScore}`,
    `trust_score: ${trustScore}`,
    `visibility: ${visibility}`,
    `lifecycle: ${lifecycle}`,
    'subjects:',
    '  - cloud',
    '  - builders',
    '  - infrastructure',
    '  - tencent-cloud',
    'referral_links:',
    '  - url: https://www.tencentcloud.com/act/pro/promo',
    '    title: Tencent Cloud Promotions',
    '  - url: https://www.tencentcloud.com/products/lighthouse',
    '    title: Lighthouse Overview',
    '  - url: https://www.tencentcloud.com/products/cvm',
    '    title: CVM Overview',
    '  - url: https://www.tencentcloud.com/products/teo',
    '    title: EdgeOne Overview',
    '  - url: https://www.tencentcloud.com/act/pro/promo',
    '    title: Tencent Cloud Free Tier',
    'seo:',
    `  noindex: ${noindex}`,
    `  priority: ${seoPriority}`,
    'metadata:',
    `  created_at: "${createdAt}"`,
    `  updated_at: "${updatedAt}"`,
    '  author: UniTeia System',
    '  version: 1',
    '  importedFrom: uniteia-mega-factory',
    '  contentPackage: uniteia-content-package/v1',
    '---',
    '',
  ].join('\n')
}

function main(): void {
  const slug = process.argv[2] || 'tencent-cloud-deal-stack-builders'
  const packageDir = join(FACTORY_ROOT, 'exports', slug)

  if (!existsSync(packageDir)) {
    console.error(`Package not found: ${packageDir}`)
    process.exit(1)
  }

  console.log(`Importing package: ${slug}`)
  console.log(`Package dir: ${packageDir}`)

  // Phase 1 — Validate
  console.log('\n--- Phase 1: validatePackage ---')
  const validation = validatePackage(packageDir)
  for (const issue of validation.issues) {
    const icon = issue.severity === 'error' ? '✗' : '⚠'
    console.log(`  ${icon} [${issue.severity}] ${issue.path}: ${issue.message}`)
  }
  console.log(`  Result: ${validation.valid ? '✅ VALID' : '❌ INVALID'}`)

  if (!validation.valid) {
    process.exit(1)
  }

  // Phase 2 — Import
  console.log('\n--- Phase 2: importPackage ---')
  const manifestRaw = JSON.parse(readFileSync(join(packageDir, 'manifest.json'), 'utf-8'))
  const imported = importPackage(packageDir, manifestRaw)

  console.log(`  Slug: ${imported.importReport.slug}`)
  console.log(`  Layout: ${imported.importReport.layoutId}`)
  console.log(`  Status: ${imported.importReport.status}`)
  console.log(`  canPublish: ${imported.importReport.canPublish}`)
  console.log(`  shouldNoindex: ${imported.importReport.shouldNoindex}`)
  console.log(`  Factory nodes: ${imported.importReport.nodeCount}`)
  console.log(`  Metadata origin: ${imported.importReport.metadataOrigin}`)
  console.log(`  Warnings: ${imported.importReport.warnings.join(', ')}`)

  // Phase 3 — Map Layout
  console.log('\n--- Phase 3: mapLayout ---')
  const layoutMapping = mapLayout(manifestRaw)
  if (layoutMapping) {
    console.log(`  Layout: ${layoutMapping.layoutId} (${layoutMapping.label})`)
    console.log(
      `  Allowed blocks: ${layoutMapping.allowedBlocks.join(', ') || '(none restricted)'}`
    )
    console.log(`  Forbidden blocks: ${layoutMapping.forbiddenBlocks.join(', ') || '(none)'}`)
  } else {
    console.log('  ❌ Layout not found in registry')
    process.exit(1)
  }

  // Phase 4 — Copy content to site content/ directory with factory metadata
  console.log('\n--- Phase 4: Copy content to content/apex/ ---')
  const contentBase = join(V2_ROOT, 'content', NICHE)
  const assetDir = join(V2_ROOT, 'public', 'assets', 'wiki', slug)

  mkdirSync(contentBase, { recursive: true })
  mkdirSync(assetDir, { recursive: true })

  const titleByLang: Record<string, string> = {
    pt: 'Tencent Cloud Deal Stack: Cloud Barata para Builders',
    en: 'Tencent Cloud Deal Stack for Builders',
    es: 'Tencent Cloud Deal Stack para Creadores',
    fr: 'Tencent Cloud Deal Stack pour Builders',
    de: 'Tencent Cloud Deal Stack für Entwickler',
    it: 'Tencent Cloud Deal Stack per Creator',
    ja: 'Tencent Cloud Deal Stack for Builders',
    zh: 'Tencent Cloud Deal Stack for Builders',
  }

  for (const [contractLocale, v2Locale] of Object.entries(CONTRACT_TO_V2_LOCALE)) {
    const contentPath = join(packageDir, `content.${contractLocale}.mdx`)
    const targetDir = join(contentBase, v2Locale)
    const targetPath = join(targetDir, `${slug}.md`)

    mkdirSync(targetDir, { recursive: true })

    if (existsSync(contentPath)) {
      const rawMdx = readFileSync(contentPath, 'utf-8')
      // Strip any existing frontmatter (shouldn't exist, but safety)
      const cleanContent = rawMdx.replace(/^---[\s\S]*?---\n*/m, '')
      const title = titleByLang[v2Locale] || slug

      // Attempt to get factory-provided ContentNode for metadata
      const factoryNode = getFactoryNode(imported.factoryNodes, contractLocale, slug)

      const frontmatter = buildFrontmatter(
        slug,
        v2Locale,
        title,
        imported.importReport as unknown as Record<string, unknown>,
        factoryNode
      )
      writeFileSync(targetPath, `${frontmatter + cleanContent.trim()}\n`)
      console.log(`  ✓ ${NICHE}/${v2Locale}/${slug}.md${factoryNode ? ' (factory metadata)' : ' (re-derived metadata)'}`)
    } else {
      console.log(`  ✗ ${NICHE}/${v2Locale}/${slug}.md — content.${contractLocale}.mdx not found`)
    }
  }

  // Copy content-nodes.json to content metadata dir (for compiler consumption)
  const contentNodesSrc = join(packageDir, 'content-nodes.json')
  if (existsSync(contentNodesSrc)) {
    const contentNodesDir = join(V2_ROOT, 'content-metadata', slug)
    mkdirSync(contentNodesDir, { recursive: true })
    copyFileSync(contentNodesSrc, join(contentNodesDir, 'content-nodes.json'))
    console.log(`  ✓ content-metadata/${slug}/content-nodes.json`)
  }

  // Copy assets
  const assetsDir = join(packageDir, 'assets')
  if (existsSync(assetsDir)) {
    const files = readdirSync(assetsDir)
    for (const file of files) {
      copyFileSync(join(assetsDir, file), join(assetDir, file))
      console.log(`  ✓ assets/${file}`)
    }
  }

  // Write import report
  const reportDir = join(V2_ROOT, 'content-metadata', slug)
  mkdirSync(reportDir, { recursive: true })
  writeFileSync(
    join(reportDir, 'import-report.json'),
    JSON.stringify(
      {
        imported: imported.importReport,
        validation: {
          valid: validation.valid,
          issueCount: validation.issues.length,
        },
        layoutMapping,
        localeMap: CONTRACT_TO_V2_LOCALE,
        niche: NICHE,
        importedAt: new Date().toISOString(),
      },
      null,
      2
    )
  )
  console.log(`\n  ✓ Import report saved to content-metadata/${slug}/import-report.json`)

  console.log('\n✅ Import complete!')
  console.log(`  Content: content/${NICHE}/{lang}/${slug}.md`)
  console.log(`  Assets: public/assets/wiki/${slug}/`)
  console.log(`  Metadata: content-metadata/${slug}/`)
  console.log(`  Metadata origin: ${imported.importReport.metadataOrigin}`)
}

main()
