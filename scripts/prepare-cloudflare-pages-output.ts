import {
  cpSync,
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'

const distDir = join(import.meta.dirname, '..', 'dist')
const serverDir = join(import.meta.dirname, '..', 'server')
const distServerDir = join(distDir, 'server')
const workerPath = join(distDir, '_worker.js')
const serverEntryPath = join(serverDir, 'entry.cloudflare-pages.js')
const routesPath = join(distDir, '_routes.json')

if (!existsSync(distDir)) {
  console.error('FATAL: dist/ does not exist. Run build first.')
  process.exit(1)
}
if (!existsSync(workerPath)) {
  console.error('FATAL: dist/_worker.js not found. Run build first.')
  process.exit(1)
}
if (!existsSync(serverEntryPath)) {
  console.error('FATAL: server/entry.cloudflare-pages.js not found. Run build first.')
  process.exit(1)
}

if (existsSync(distServerDir)) {
  rmSync(distServerDir, { recursive: true, force: true })
}

cpSync(serverDir, distServerDir, { recursive: true })

const workerContent = readFileSync(workerPath, 'utf-8')
const fixed = workerContent.replace('../server/', './server/')
writeFileSync(workerPath, fixed, 'utf-8')

const ssgExcludes: string[] = []
function findHtmlPages(dir: string, basePath: string): void {
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        findHtmlPages(full, `${basePath}/${entry}`)
      } else if (entry === 'index.html') {
        const path = basePath || '/'
        ssgExcludes.push(path)
      }
    }
  } catch {
    /* ignore frames-reference etc */
  }
}
findHtmlPages(distDir, '')

// Only route dynamic paths through Worker — SSG pages are static, served by CDN
const routes = {
  version: 1,
  include: ['/api/*', '/search'],
  exclude: [
    '/build/*',
    '/assets/*',
    '/favicon.ico',
    '/*.svg',
    '/content-registry.generated.ts',
    ...ssgExcludes,
  ],
}
writeFileSync(routesPath, JSON.stringify(routes, null, 2))

// Add no-slash variants to static paths set for ASSETS.fetch fallback
// Generate no-slash .html files for Cloudflare direct serving
// CF Pages serves /path/index.html at /path/ but NOT /path (no slash)
// Copy index.html to parent as slug.html for direct no-slash access
let noSlashCopies = 0
for (const path of ssgExcludes) {
  if (path === '/') continue
  const dir = join(distDir, path)
  const indexFile = join(dir, 'index.html')
  if (existsSync(indexFile)) {
    const parentDir = join(dir, '..')
    const slug = path.split('/').filter(Boolean).pop() || 'index'
    const targetFile = join(parentDir, `${slug}.html`)
    if (!existsSync(targetFile)) {
      cpSync(indexFile, targetFile)
      noSlashCopies++
    }
  }
}
if (noSlashCopies > 0) {
  console.log(`  Generated ${noSlashCopies} no-slash .html variants`)
}

const staticPathsPath = join(distServerDir, '@qwik-city-static-paths.js')
if (existsSync(staticPathsPath)) {
  const spContent = readFileSync(staticPathsPath, 'utf-8')
  const noSlashVariants: string[] = []
  const setRegex = /new Set\(\[([^\]]+)\]\)/
  const match = spContent.match(setRegex)
  if (match) {
    const entries = match[1].split(',').map(s => s.trim().replace(/^"/, '').replace(/"$/, ''))
    for (const entry of entries) {
      if (entry.endsWith('/') && entry !== '/') {
        noSlashVariants.push(entry.slice(0, -1))
      }
    }
    if (noSlashVariants.length > 0) {
      const allEntries = [...entries, ...noSlashVariants]
      const newSet = `new Set(["${allEntries.join('","')}"])`
      const newContent = spContent.replace(setRegex, newSet)
      writeFileSync(staticPathsPath, newContent, 'utf-8')
      console.log(`  Added ${noSlashVariants.length} no-slash variants to static paths`)
    }
  }
}

console.log(
  'Prep done: dist/server/ copied, dist/_worker.js path fixed, Worker handles only API+search, SSG pages served by CDN'
)
