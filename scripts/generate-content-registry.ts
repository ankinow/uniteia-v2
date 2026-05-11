import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const CONTENT_DIR = join(import.meta.dirname, '..', 'content')
const OUTPUT_FILE = join(import.meta.dirname, '..', 'src', 'content-registry.generated.ts')

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
      const relPath = relative(baseDir, fullPath)
      const content = readFileSync(fullPath, 'utf-8')
      // Match import.meta.glob key format: ../../content/niche/lang/slug.md
      result[`../../${relPath}`] = content
    }
  }

  return result
}

const files = collectFiles(CONTENT_DIR, join(import.meta.dirname, '..'))
const source = `${[
  '// AUTO-GENERATED — do not edit. Run `bun run generate:content-registry`',
  'export const contentRegistry: Record<string, string> = {',
  ...Object.entries(files).map(([path, content]) => {
    const escaped = content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
    return `  '${path}': \`${escaped}\`,`
  }),
  '}',
  '',
  'export const REGISTRY_PATHS = Object.keys(contentRegistry)',
].join('\n')}\n`

writeFileSync(OUTPUT_FILE, source)
console.log(`Generated content registry: ${Object.keys(files).length} files -> ${OUTPUT_FILE}`)
