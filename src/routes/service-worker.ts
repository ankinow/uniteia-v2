declare const self: ServiceWorkerGlobalScope

let validChunks: Set<string> | null = null
let storedManifestHash: string | null = null

self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(
    fetch('/q-manifest.json')
      .then(r => r.json() as Promise<{ manifestHash: string; bundles: Record<string, unknown> }>)
      .then(manifest => {
        validChunks = new Set(Object.keys(manifest.bundles))
        storedManifestHash = manifest.manifestHash
      })
      .catch(() => {
        // q-manifest not accessible yet; continue without chunk validation
      })
  )
})

self.addEventListener('activate', () => {
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  // Preloader/prefetch: let through without interception
  if (event.request.destination === '' || event.request.destination === 'modulepreload') {
    return
  }

  // Chunk validation for /build/q-*.js
  if (url.pathname.startsWith('/build/') && url.pathname.endsWith('.js')) {
    if (validChunks !== null) {
      const chunkName = url.pathname.split('/').pop() ?? ''
      if (chunkName !== '' && !validChunks.has(chunkName)) {
        // Stale CDN chunk: bypass cache to fetch fresh version
        event.respondWith(fetch(event.request, { cache: 'reload' }))
        return
      }
    }
    // Known chunk or manifest not loaded yet: let the browser handle it
    return
  }

  // Navigation: detect BUILD_ID mismatch and force cache invalidation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const response = await fetch(event.request)
        const html = await response.clone().text()
        const match = html.match(/q:manifest-hash="([^"]+)"/)
        if (match && storedManifestHash && match[1] !== storedManifestHash) {
          // BUILD_ID changed: clear all caches, reset chunk validation,
          // and force every client to reload with fresh assets
          validChunks = null
          storedManifestHash = match[1]
          await Promise.all([
            caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))),
            self.clients.claim(),
          ])
          const allClients = await self.clients.matchAll()
          for (const client of allClients) {
            client.navigate(client.url).catch(() => {})
          }
        }
        return response
      })()
    )
    return
  }
})
