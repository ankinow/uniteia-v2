#!/usr/bin/env bun
/**
 * UniTeia v2 — Full Project Report Server
 * Serves the interactive project dashboard on localhost:4040
 */
import { readFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'

const PORT = 4040
const PUBLIC_DIR = resolve(import.meta.dir, 'public')

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
}

const _server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)
    let path = url.pathname

    if (path === '/' || path === '') path = '/index.html'

    const filePath = resolve(PUBLIC_DIR, path.startsWith('/') ? path.slice(1) : path)

    // Security: prevent path traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
      return new Response('Forbidden', { status: 403 })
    }

    try {
      const content = readFileSync(filePath)
      const ext = extname(filePath)
      const contentType = MIME_TYPES[ext] || 'application/octet-stream'
      return new Response(content, {
        headers: { 'Content-Type': contentType },
      })
    } catch {
      return new Response('Not Found', { status: 404 })
    }
  },
})

console.log('\n  ╔══════════════════════════════════════════════════╗')
console.log('  ║   📊 UniTeia v2 — Full Project Report          ║')
console.log('  ║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║')
console.log(`  ║   🌐 URL: http://localhost:${PORT}              ║`)
console.log(`  ║   📂 Serving: ${PUBLIC_DIR}`)
console.log('  ║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║')
console.log('  ║   Press Ctrl+C to stop                         ║')
console.log('  ╚══════════════════════════════════════════════════╝\n')
