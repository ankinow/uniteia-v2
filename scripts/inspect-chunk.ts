import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const CHUNK_NAME = 'q-CPvdBplO.js' // ← o gigante
const BUILD_DIR = './dist/build'

function inspectChunk() {
  const filePath = join(BUILD_DIR, CHUNK_NAME)
  const content = readFileSync(filePath, 'utf-8')

  console.log(`\n=== Analisando: ${CHUNK_NAME} ===\n`)
  console.log(`Tamanho bruto: ${(content.length / 1024).toFixed(1)} KB\n`)

  const importMatches = content.match(/from\s+["'][^"']+["']/g) || []
  const dynamicImports = content.match(/import\s*\(\s*["'][^"']+["']\s*\)/g) || []

  console.log('Possíveis imports encontrados:')
  const allImports = [...new Set([...importMatches, ...dynamicImports])]
  for (const imp of allImports.slice(0, 30)) {
    console.log('→', imp)
  }

  const suspects = ['content-graph', 'marked', 'gray-matter', 'zod', 'i18n', 'qwik']
  console.log('\n--- Suspeitos encontrados no chunk ---')
  for (const suspect of suspects) {
    if (content.includes(suspect)) {
      console.log(`✅ "${suspect}" aparece neste chunk`)
    }
  }
}

inspectChunk()
