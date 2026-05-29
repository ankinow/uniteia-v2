#!/usr/bin/env bun
/**
 * generate-component-metadata.ts
 *
 * Scans all Qwik components in src/components/, extracts TypeScript interface info,
 * and generates src/component-metadata.generated.json — a structured metadata
 * file for AI-readiness (Electroplix-style per-component JSON).
 *
 * Uses only Bun/Node.js built-ins + regex — zero npm dependencies.
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

// ─── Types ───────────────────────────────────────────────────────────────────

interface PropInfo {
  name: string
  type: string
  required: boolean
  description?: string
}

interface ComponentMeta {
  name: string
  path: string
  category: string
  description: string
  props: Record<string, PropInfo>
  variants: string[]
  exports: string[]
}

interface OutputMeta {
  components: ComponentMeta[]
  generatedAt: string
  totalComponents: number
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ROOT = join(import.meta.dirname, '..')
const COMPONENTS_DIR = join(ROOT, 'src', 'components')
const OUTPUT_PATH = join(ROOT, 'src', 'component-metadata.generated.json')

// ─── Category Helpers ────────────────────────────────────────────────────────

function guessCategory(compName: string): string {
  const name = compName.toLowerCase()
  if (
    name.includes('card') ||
    name.includes('tile') ||
    name.includes('grid') ||
    name.includes('cluster') ||
    name.includes('masonry')
  )
    return 'card'
  if (
    name.includes('header') ||
    name.includes('footer') ||
    name.includes('shell') ||
    name.includes('nav') ||
    name.includes('sidebar') ||
    name.includes('layout') ||
    name.includes('tree')
  )
    return 'layout'
  if (
    name.includes('depth') ||
    name.includes('tilt') ||
    name.includes('scroll') ||
    name.includes('parallax') ||
    name.includes('aether') ||
    name.includes('cinematic') ||
    name.includes('canvas')
  )
    return 'effects'
  if (name.includes('error') || name.includes('boundary') || name.includes('fallback'))
    return 'error-handling'
  if (
    name.includes('button') ||
    name.includes('badge') ||
    name.includes('chip') ||
    name.includes('label') ||
    name.includes('hud')
  )
    return 'data-display'
  if (name.includes('search') || name.includes('filter')) return 'navigation'
  if (name.includes('dialog') || name.includes('modal') || name.includes('overlay'))
    return 'overlay'
  if (name.includes('form') || name.includes('input') || name.includes('select')) return 'form'
  if (
    name.includes('donation') ||
    name.includes('onboarding') ||
    name.includes('playground') ||
    name.includes('sketch')
  )
    return 'interactive'
  if (
    name.includes('seo') ||
    name.includes('json') ||
    name.includes('ld') ||
    name.includes('head') ||
    name.includes('meta')
  )
    return 'seo'
  if (name.includes('avatar') || name.includes('icon') || name.includes('image')) return 'media'
  if (
    name.includes('article') ||
    name.includes('frame') ||
    name.includes('renderer') ||
    name.includes('hero')
  )
    return 'content'
  if (
    name.includes('verdict') ||
    name.includes('quality') ||
    name.includes('score') ||
    name.includes('signal')
  )
    return 'trust-indicator'
  if (name.includes('curation') || name.includes('homepage') || name.includes('landing'))
    return 'curation'
  return 'general'
}

// ─── File Discovery ──────────────────────────────────────────────────────────

function findEntryFiles(dirPath: string, dirName: string): string[] {
  const candidates = ['index.tsx', 'index.ts', `${dirName}.tsx`, `${dirName}.ts`]
  const found: string[] = []
  for (const c of candidates) {
    const f = join(dirPath, c)
    if (existsSync(f) && statSync(f).isFile()) found.push(f)
  }
  return found
}

function findAllTsxFiles(dirPath: string): string[] {
  const files: string[] = []
  try {
    for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.tsx') && !entry.name.endsWith('.test.tsx')) {
        files.push(join(dirPath, entry.name))
      }
    }
  } catch {
    /* ignore */
  }
  return files
}

function findTypesFile(dirPath: string): string | null {
  const f = join(dirPath, 'types.ts')
  return existsSync(f) && statSync(f).isFile() ? f : null
}

// ─── Text Helpers ────────────────────────────────────────────────────────────

function cleanComment(comment: string): string {
  return comment
    .replace(/\/\*\*?/, '')
    .replace(/\*\//, '')
    .split('\n')
    .map(line =>
      line
        .replace(/^\s*\*/, '')
        .replace(/^\s*/, '')
        .trim()
    )
    .filter(Boolean)
    .join(' ')
    .trim()
}

function extractDescription(comment: string): string {
  if (!comment) return ''
  const first = comment.split(/\.\s/)[0]
  return first.replace(/^-\s*/, '').trim()
}

function toPascalCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

// ─── Interface / Type Extraction ─────────────────────────────────────────────

function parseInterfaceProperties(ifaceBlock: string): Record<string, PropInfo> {
  const props: Record<string, PropInfo> = {}

  const body = ifaceBlock
    .replace(/^export\s+interface\s+\w+\s*(?:extends\s+[^{]+)?\s*\{?/, '')
    .replace(/\}\s*$/, '')
    .trim()

  const lines = body.split('\n')
  let currentComment = ''
  let inMultiLineComment = false

  for (const line of lines) {
    const trimmed = line.trim()

    // Start of a JSDoc comment
    if (trimmed.startsWith('/**')) {
      if (trimmed.endsWith('*/')) {
        // Single-line JSDoc: /** ... */
        currentComment = cleanComment(trimmed)
        inMultiLineComment = false
      } else {
        inMultiLineComment = true
        currentComment = trimmed.replace('/**', '').trim()
      }
      continue
    }

    // Continuation of multi-line JSDoc
    if (inMultiLineComment) {
      if (trimmed.includes('*/')) {
        const part = trimmed
          .replace('*/', '')
          .replace(/^\s*\*/, '')
          .trim()
        currentComment = `${currentComment} ${part}`
        currentComment = cleanComment(currentComment)
        inMultiLineComment = false
      } else {
        currentComment = `${currentComment} ${trimmed.replace(/^\s*\*/, '').trim()}`
      }
      continue
    }

    // Skip closing braces and empty lines
    if (trimmed.startsWith('}') || trimmed === '') continue

    // Single-line // comment
    if (trimmed.startsWith('//')) {
      currentComment = trimmed.replace(/^\/\/\/?\s*/, '').trim()
      continue
    }

    // Property definition: name? : type
    const propMatch = trimmed.match(/^(?:readonly\s+)?(\w+)(\??)\s*:\s*(.+?)(?:;|$)/)
    if (propMatch && !trimmed.startsWith('[')) {
      const [, propName, maybeOptional, propType] = propMatch
      props[propName] = {
        name: propName,
        required: maybeOptional !== '?',
        type: propType.trim(),
        description: currentComment ? extractDescription(currentComment) : undefined,
      }
      currentComment = ''
      continue
    }

    // Unrecognized line — reset comment accumulation
    currentComment = ''
  }

  return props
}

function extractUnionMembers(typeStr: string): string[] {
  const members: string[] = []
  const literalRegex = /'([^']+)'/g
  let m: RegExpExecArray | null
  while ((m = literalRegex.exec(typeStr)) !== null) {
    members.push(m[1])
  }
  return members
}

function parseSourceFile(content: string): {
  interfaces: { name: string; props: Record<string, PropInfo>; description: string }[]
  typeUnions: { name: string; members: string[]; description: string }[]
  variants: string[]
  exports: string[]
  componentName: string | null
} {
  const interfaces: { name: string; props: Record<string, PropInfo>; description: string }[] = []
  const typeUnions: { name: string; members: string[]; description: string }[] = []
  const variantSet = new Set<string>()
  const exportsList: string[] = []
  let componentName: string | null = null

  // ALL_VARIANTS arrays
  const allVariantsRegex =
    /export\s+(?:const|let|var)\s+ALL_VARIANTS\s*(?::\s*[^=]+)?=\s*\[([\s\S]*?)\]/g
  let avMatch: RegExpExecArray | null
  while ((avMatch = allVariantsRegex.exec(content)) !== null) {
    const items = avMatch[1].match(/'([^']+)'/g)
    if (items) {
      for (const item of items) variantSet.add(item.replace(/'/g, ''))
    }
  }

  // component$() call → component name
  const compRegex = /export\s+(const|var|let)\s+(\w+)\s*=\s*component\$/g
  let compMatch: RegExpExecArray | null
  while ((compMatch = compRegex.exec(content)) !== null) {
    componentName = compMatch[2]
  }

  // Export statements
  const exportRegex = /export\s+(?:const|function|class|type|interface|let|var|enum)\s+(\w+)/g
  let eMatch: RegExpExecArray | null
  while ((eMatch = exportRegex.exec(content)) !== null) {
    exportsList.push(eMatch[1])
  }

  // Named re-exports: export { Name, ... }
  const reexportRegex = /export\s+\{\s*(\w+(?:\s*,\s*\w+)*)\s*\}/g
  let reMatch: RegExpExecArray | null
  while ((reMatch = reexportRegex.exec(content)) !== null) {
    for (const n of reMatch[1]
      .split(',')
      .map(n => n.trim())
      .filter(Boolean)) {
      if (!exportsList.includes(n)) exportsList.push(n)
    }
  }

  // Interfaces: optional JSDoc + export interface Name { ... }
  const ifaceRegex =
    /(\/\*\*[\s\S]*?\*\/\s*)?export\s+interface\s+(\w+)\s*(?:extends\s+[^{]+)?\s*\{/g
  let iMatch: RegExpExecArray | null
  while ((iMatch = ifaceRegex.exec(content)) !== null) {
    const rawComment = iMatch[1] || ''
    const ifaceName = iMatch[2]
    const startIdx = iMatch.index + iMatch[0].length

    // Find matching closing brace (handle nested braces)
    let braceDepth = 1
    let endIdx = startIdx
    while (braceDepth > 0 && endIdx < content.length) {
      const char = content[endIdx]
      if (char === '{') braceDepth++
      else if (char === '}') braceDepth--
      endIdx++
    }
    const ifaceBody = content.slice(startIdx, endIdx - 1)
    const props = parseInterfaceProperties(`export interface ${ifaceName} {\n${ifaceBody}\n}`)
    const description = rawComment ? extractDescription(cleanComment(rawComment)) : ''
    interfaces.push({ name: ifaceName, props, description })
  }

  // Type unions: export type XxxVariant = 'a' | 'b' | 'c'
  const typeRegex = /(\/\*\*[\s\S]*?\*\/\s*)?export\s+type\s+(\w+)\s*=\s*([^;]+?);/g
  let tMatch: RegExpExecArray | null
  while ((tMatch = typeRegex.exec(content)) !== null) {
    const rawComment = tMatch[1] || ''
    const typeName = tMatch[2]
    const typeDef = tMatch[3].trim()

    if (typeDef.includes('|') && typeDef.includes("'")) {
      const members = extractUnionMembers(typeDef)
      const description = rawComment ? extractDescription(cleanComment(rawComment)) : ''
      typeUnions.push({ name: typeName, members, description })

      if (typeName.endsWith('Variant')) {
        for (const m of members) variantSet.add(m)
      }
    }
  }

  return {
    interfaces,
    typeUnions,
    variants: [...variantSet],
    exports: [...new Set(exportsList)],
    componentName,
  }
}

// ─── Component Assembly ──────────────────────────────────────────────────────

function pickComponentName(
  parsedComponentName: string | null,
  interfaces: { name: string }[],
  dirName: string
): string {
  if (parsedComponentName) return parsedComponentName
  const propsIface = interfaces.find(i => i.name.endsWith('Props'))
  if (propsIface) return propsIface.name.replace(/Props$/, '')
  return toPascalCase(dirName)
}

function pickDescription(
  propsInterface: { description: string } | undefined,
  entryContent: string,
  interfaces: { description: string }[]
): string {
  if (propsInterface?.description) return propsInterface.description

  const compJsdocMatch = entryContent.match(
    /\/\*\*[\s\S]*?\*\/[\s\S]*?export\s+const\s+\w+\s*=\s*component\$/
  )
  if (compJsdocMatch) {
    const jsdoc = `${compJsdocMatch[0].split('*/')[0]}*/`
    const desc = extractDescription(cleanComment(jsdoc))
    if (desc) return desc
  }

  for (const iface of interfaces) {
    if (iface.description) return iface.description
  }

  return ''
}

function processComponent(dirName: string, dirPath: string): ComponentMeta | null {
  let entryFiles = findEntryFiles(dirPath, dirName)
  if (entryFiles.length === 0) {
    entryFiles = findAllTsxFiles(dirPath)
  }
  if (entryFiles.length === 0) {
    console.warn(`[warn] No entry file found for component '${dirName}' in ${dirPath}`)
    return null
  }

  const typesFile = findTypesFile(dirPath)
  const typesContent = typesFile ? readFileSync(typesFile, 'utf-8') : ''

  const allResults = entryFiles.map(f => ({
    file: f,
    result: parseSourceFile(readFileSync(f, 'utf-8')),
  }))

  const typesResult = typesContent ? parseSourceFile(typesContent) : null

  // Merge all parsed data
  const allExports = new Set<string>()
  const allVariants = new Set<string>()
  const allInterfaces: { name: string; props: Record<string, PropInfo>; description: string }[] = []

  for (const { result } of allResults) {
    for (const e of result.exports) allExports.add(e)
    for (const v of result.variants) allVariants.add(v)
    allInterfaces.push(...result.interfaces)
  }

  if (typesResult) {
    for (const e of typesResult.exports) allExports.add(e)
    for (const v of typesResult.variants) allVariants.add(v)
    allInterfaces.push(...typesResult.interfaces)
  }

  const propsInterface = allInterfaces.find(i => i.name.endsWith('Props'))
  const entryContent = readFileSync(entryFiles[0], 'utf-8')
  const primaryResult = allResults[0].result

  const compName = pickComponentName(primaryResult.componentName, allInterfaces, dirName)
  const description = pickDescription(propsInterface, entryContent, allInterfaces)

  return {
    name: compName,
    path: `${relative(ROOT, dirPath)}/`,
    category: guessCategory(compName),
    description,
    props: propsInterface?.props || {},
    variants: [...allVariants],
    exports: [...allExports].sort(),
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const components: ComponentMeta[] = []
  const entries = readdirSync(COMPONENTS_DIR, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(COMPONENTS_DIR, entry.name)

    if (entry.isDirectory()) {
      const meta = processComponent(entry.name, fullPath)
      if (meta) components.push(meta)
    } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
      const content = readFileSync(fullPath, 'utf-8')
      const entryName = entry.name.replace(/\.tsx$/, '')
      const result = parseSourceFile(content)
      const propsInterface = result.interfaces.find(i => i.name.endsWith('Props'))
      const compName = pickComponentName(result.componentName, result.interfaces, entryName)
      const description = pickDescription(propsInterface, content, result.interfaces)

      components.push({
        name: compName,
        path: relative(ROOT, fullPath),
        category: guessCategory(compName),
        description,
        props: propsInterface?.props || {},
        variants: result.variants,
        exports: result.exports,
      })
    }
  }

  components.sort((a, b) => a.name.localeCompare(b.name))

  const output: OutputMeta = {
    components,
    generatedAt: new Date().toISOString(),
    totalComponents: components.length,
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8')
  console.log(`✓ Generated ${OUTPUT_PATH}`)
  console.log(`  Total components: ${components.length}`)
  console.log(`  Generated at: ${output.generatedAt}`)
}

main()
