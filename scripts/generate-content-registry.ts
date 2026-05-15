import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const CONTENT_DIR = join(import.meta.dirname, '..', 'content')
const REGISTRY_OUT = join(import.meta.dirname, '..', 'src', 'content-registry.generated.ts')
const CONTENT_LOADER = join(import.meta.dirname, '..', 'src', 'utils', 'content-loader.ts')
const INLINE_REGISTRY_HEADER =
  '// INLINE CONTENT REGISTRY — auto-generated. Run `bun run generate:content-registry`.'
const INLINE_REGISTRY_END = 'export const REGISTRY_PATHS = Object.keys(contentRegistry)'

function collectFiles(dir: string, baseDir: string): Record<string, string> {
  const result: Record<string, string> = {}
  if (!existsSync(dir)) return result
  const entries = readdirSync(dir)
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    if (statSync(fullPath).isDirectory()) {
      const subResult = collectFiles(fullPath, baseDir)
      Object.assign(result, subResult)
    } else if (entry.endsWith('.md')) {
      result[relativePath(baseDir, fullPath)] = readFileSync(fullPath, 'utf-8')
    }
  }
  return result
}

function relativePath(fromDir: string, toPath: string): string {
  const fromParts = fromDir.replace(/\/$/, '').split('/')
  const toParts = toPath.replace(/\/$/, '').split('/')
  let i = 0
  while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) i++
  const ups = fromParts.length - i
  const downs = toParts.slice(i)
  return (ups > 0 ? '../'.repeat(ups) : './') + downs.join('/')
}

export function replaceContentRegistryBlock(loaderSource: string, inlineCode: string): string {
  if (loaderSource.includes('// __CONTENT_REGISTRY_IMPORT__')) {
    return loaderSource.replace('// __CONTENT_REGISTRY_IMPORT__', inlineCode)
  }

  const start = loaderSource.indexOf(INLINE_REGISTRY_HEADER)
  const endStart = loaderSource.indexOf(INLINE_REGISTRY_END, start)

  if (start === -1 || endStart === -1) {
    throw new Error('content-loader.ts is missing the inline registry block placeholder')
  }

  const end = endStart + INLINE_REGISTRY_END.length
  return `${loaderSource.slice(0, start)}${inlineCode}${loaderSource.slice(end)}`
}

function generateContentRegistry(): void {
  const allContent = collectFiles(CONTENT_DIR, join(import.meta.dirname, '..'))
  const jsonStr = JSON.stringify(allContent).replace(/\\/g, '\\\\').replace(/'/g, "\\'")

  const registryCode = [
    '// AUTO-GENERATED. Run `bun run generate:content-registry` to update.',
    `export const contentRegistry: Record<string, string> = JSON.parse('${jsonStr}')`,
    INLINE_REGISTRY_END,
  ].join('\n')

  writeFileSync(REGISTRY_OUT, registryCode)
  console.log(
    `Generated content registry: ${Object.keys(allContent).length} files -> ${REGISTRY_OUT}`
  )

  const inlineCode = [
    INLINE_REGISTRY_HEADER,
    `export const contentRegistry: Record<string, string> = JSON.parse('${jsonStr}')`,
    INLINE_REGISTRY_END,
  ].join('\n')

  const loaderSource = readFileSync(CONTENT_LOADER, 'utf-8')
  const updated = replaceContentRegistryBlock(loaderSource, inlineCode)
  writeFileSync(CONTENT_LOADER, updated)
  console.log(
    `Inlined content registry: ${Object.keys(allContent).length} files -> content-loader.ts`
  )
}

if (import.meta.main) {
  generateContentRegistry()
}
