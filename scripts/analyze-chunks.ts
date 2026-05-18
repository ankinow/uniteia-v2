import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const BUILD_DIR = './dist/build'

function analyzeChunks() {
  const files = readdirSync(BUILD_DIR)
    .filter(f => f.endsWith('.js'))
    .map(file => {
      const filePath = join(BUILD_DIR, file)
      const size = statSync(filePath).size
      return { file, sizeKB: (size / 1024).toFixed(1) }
    })
    .sort((a, b) => Number.parseFloat(b.sizeKB) - Number.parseFloat(a.sizeKB))

  console.log('\n=== Maiores chunks (gzip aproximado) ===\n')
  for (const f of files.slice(0, 20)) {
    console.log(`${f.file.padEnd(25)} → ${f.sizeKB} KB`)
  }

  const total = files.reduce((sum, f) => sum + Number.parseFloat(f.sizeKB), 0)
  console.log(`\nTotal de chunks: ${files.length}`)
  console.log(`Soma aproximada: ${total.toFixed(1)} KB\n`)
}

analyzeChunks()
