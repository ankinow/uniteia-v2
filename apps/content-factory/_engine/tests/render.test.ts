import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { runRender } from '../phases/render'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GOLDEN_DIR = path.join(__dirname, 'golden', 'llm-agents-primer')
const TEMPLATES = path.join(__dirname, '..', 'templates')

let tmp: string
beforeAll(async () => {
  tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'factory-render-'))
})
afterAll(async () => {
  await fs.rm(tmp, { recursive: true, force: true })
})

describe('render', () => {
  it('produces 4 channel files from golden core.yaml', async () => {
    const r = await runRender({
      corePath: path.join(GOLDEN_DIR, 'core.yaml'),
      channels: ['blog', 'short', 'wiki', 'prompt-seed'],
      outDir: tmp,
      templatesDir: TEMPLATES,
    })
    expect(r.status).toBe('ok')
    if (r.status === 'ok') expect(r.written).toHaveLength(4)
  })

  it('is idempotent (same output on re-run)', async () => {
    const blog1 = await fs.readFile(path.join(tmp, 'blog.md'), 'utf8')
    await runRender({
      corePath: path.join(GOLDEN_DIR, 'core.yaml'),
      channels: ['blog'],
      outDir: tmp,
      templatesDir: TEMPLATES,
    })
    const blog2 = await fs.readFile(path.join(tmp, 'blog.md'), 'utf8')
    expect(blog2).toBe(blog1)
  })

  it('fails when core.yaml is missing', async () => {
    const r = await runRender({
      corePath: path.join(tmp, 'does-not-exist.yaml'),
      channels: ['blog'],
      outDir: tmp,
      templatesDir: TEMPLATES,
    })
    expect(r.status).toBe('fail')
  })
})
