type SWScope = typeof globalThis & {
  skipWaiting(): void
  clients: {
    claim(): Promise<void>
    matchAll(): Promise<Array<{ navigate(url: string | URL): Promise<void>; url: string }>>
  }
  addEventListener(type: 'install' | 'activate' | 'fetch', listener: (event: Event) => void): void
}

type SWFetchEvent = Event & {
  request: Request
  respondWith(response: Response | Promise<Response>): void
}

type SWInstallEvent = Event & {
  waitUntil(promise: Promise<unknown>): void
}

let validChunks: Set<string> | null = null
let storedManifestHash: string | null = null

const swSelf = self as unknown as SWScope

swSelf.addEventListener('install', (event: Event) => {
  swSelf.skipWaiting()
  ;(event as SWInstallEvent).waitUntil(
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

swSelf.addEventListener('activate', () => {
  swSelf.clients.claim()
})

swSelf.addEventListener('fetch', (event: Event) => {
  const fetchEvent = event as SWFetchEvent
  const url = new URL(fetchEvent.request.url)

  // Preloader/prefetch: let through without interception
  if (
    (fetchEvent.request.destination as string) === '' ||
    (fetchEvent.request.destination as string) === 'modulepreload'
  ) {
    return
  }

  // Chunk validation for /build/q-*.js
  if (url.pathname.startsWith('/build/') && url.pathname.endsWith('.js')) {
    if (validChunks !== null) {
      const chunkName = url.pathname.split('/').pop() ?? ''
      if (chunkName !== '' && !validChunks.has(chunkName)) {
        // Stale CDN chunk: bypass cache to fetch fresh version
        fetchEvent.respondWith(fetch(fetchEvent.request, { cache: 'reload' }))
        return
      }
    }
    // Known chunk or manifest not loaded yet: let the browser handle it
    return
  }

  // Navigation: detect BUILD_ID mismatch and force cache invalidation
  if (fetchEvent.request.mode === 'navigate') {
    fetchEvent.respondWith(
      (async () => {
        const response = await fetch(fetchEvent.request)
        const html = await response.clone().text()
        const match = html.match(/q:manifest-hash="([^"]+)"/)
        if (match && storedManifestHash && match[1] !== storedManifestHash) {
          // BUILD_ID changed: clear all caches, reset chunk validation,
          // and force every client to reload with fresh assets
          validChunks = null
          storedManifestHash = match[1] ?? storedManifestHash
          await Promise.all([
            caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))),
            swSelf.clients.claim(),
          ])
          const allClients = await swSelf.clients.matchAll()
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
