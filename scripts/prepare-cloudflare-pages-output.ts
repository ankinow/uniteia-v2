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

const routes = {
  version: 1,
  include: ['/*'],
  exclude: [
    '/build/*',
    '/assets/*',
    '/sitemap.xml',
    '/robots.txt',
    '/favicon.ico',
    '/q-manifest.json',
    '/service-worker.js',
  ],
}
writeFileSync(routesPath, JSON.stringify(routes, null, 2))

// Adiciona variantes sem trailing slash ao Set de paths estáticos
// para que URLs como /pt/signals/apex/tencent-cloud-deal-stack-builders
// (sem / no final) sejam servidas via ASSETS.fetch em vez de cair no Worker SSR
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
  'Prep done: dist/server/ copied, dist/_worker.js path fixed, Worker handles all locale routes'
)
