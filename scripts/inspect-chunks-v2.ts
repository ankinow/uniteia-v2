import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const BUILD_DIR = './dist/build'

function quickInspect(chunkName: string) {
  const filePath = join(BUILD_DIR, chunkName)
  const content = readFileSync(filePath, 'utf-8')

  console.log(`\n=== ${chunkName} (${(content.length / 1024).toFixed(1)} KB) ===\n`)

  const keywords = [
    /contentGraph/i,
    /ContentGraph/i,
    /content.graph/i,
    /gray.?matter/i,
    /frontmatter/i,
    /MasterOpenCanvas/i,
    /VARIANT_CONFIG/i,
    /corkboard/i,
    /grain/i,
    /ink.?effect/i,
    /SUPPORTED_LANGUAGE/i,
    /getTranslation/i,
    /i18n/i,
    /marked/i,
    /markdown/i,
    /zod/i,
    /component\$/i,
    /useSignal/i,
    /useTask/i,
    /useVisibleTask/i,
    /DecisionMap/i,
    /DepthCard/i,
    /CinematicDepth/i,
    /siteShell/i,
    /SiteShell/i,
    /routeLoader/i,
  ]

  const found: string[] = []
  for (const pat of keywords) {
    const count = (content.match(new RegExp(pat.source, 'gi')) || []).length
    if (count > 0) found.push(`${pat.source.padEnd(28)} → ${count}`)
  }

  if (found.length > 0) {
    for (const f of found) console.log(`  ✅ ${f}`)
  } else {
    console.log('  (nenhuma keyword relevante)')
  }

  const strings = content.match(/["']([a-zA-Z0-9_/\-.]{8,})["']/g) || []
  const unique = [...new Set(strings)].map(s => s.slice(1, -1)).filter(s => s.includes('/'))
  if (unique.length > 0) {
    console.log(`\n  Strings com / (${unique.length}):`)
    for (const s of unique.slice(0, 10)) console.log(`    "${s}"`)
  }
}

quickInspect('q-DFOi4fal.js')
quickInspect('q-DaSwm3_Y.js')
quickInspect('q-CFJl-Hs6.js')
