/**
 * Post-build script: compiles src/routes/service-worker.ts into dist/service-worker.js
 * using esbuild. Qwik City's auto-detection of service-worker.ts registers the SW
 * via ServiceWorkerRegister in root.tsx, but the bundler tree-shakes the dynamic
 * import. This script ensures the SW file is present in the output.
 */

import { access, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { build } from 'esbuild'

const distDir = join(import.meta.dirname, '..', 'dist')
const swSrc = join(import.meta.dirname, '..', 'src', 'routes', 'service-worker.ts')
const swOut = join(distDir, 'service-worker.js')

async function main() {
  // Only compile if the source file exists
  try {
    await access(swSrc)
  } catch {
    console.log('  [sw-build] src/routes/service-worker.ts not found, skipping')
    return
  }

  // Ensure dist directory exists
  await mkdir(distDir, { recursive: true })

  const result = await build({
    entryPoints: [swSrc],
    outfile: swOut,
    bundle: true,
    format: 'esm',
    target: 'es2022',
    platform: 'browser',
    minify: false,
    write: false,
  })

  const code = result.outputFiles[0].text

  // The `declare const self: ServiceWorkerGlobalScope` gets compiled to a
  // `var self` which shadows the global. Strip it — in ServiceWorkerGlobalScope
  // `self` is already the right type.
  const cleaned = code.replace(/^var self = .*;\n/m, '')

  await writeFile(swOut, cleaned, 'utf-8')
  console.log(`  [sw-build] Wrote ${swOut} (${cleaned.length} bytes)`)
}

main().catch(err => {
  console.error('  [sw-build] Failed:', err)
  process.exit(1)
})
