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
  exclude: ['/build/*', '/assets/*', '/sitemap.xml', '/robots.txt', '/favicon.ico', ...ssgExcludes],
}
writeFileSync(routesPath, JSON.stringify(routes, null, 2))

console.log(
  `Prep done: dist/server/ copied, dist/_worker.js path fixed, ${ssgExcludes.length} SSG paths excluded from Worker`
)
