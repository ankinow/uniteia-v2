import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { runExport } from '../phases/export'
import { runRender } from '../phases/render'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GOLDEN_DIR = path.join(__dirname, 'golden', 'llm-agents-primer')
const TEMPLATES = path.join(__dirname, '..', 'templates')

let workdir: string
let publish: string

beforeAll(async () => {
  workdir = await fs.mkdtemp(path.join(os.tmpdir(), 'factory-export-work-'))
  publish = await fs.mkdtemp(path.join(os.tmpdir(), 'factory-export-pub-'))
  // copy golden core.yaml into workdir
  await fs.copyFile(path.join(GOLDEN_DIR, 'core.yaml'), path.join(workdir, 'core.yaml'))
  // render blog.md (export depends on it)
  await runRender({
    corePath: path.join(workdir, 'core.yaml'),
    channels: ['blog'],
    outDir: workdir,
    templatesDir: TEMPLATES,
  })
})
afterAll(async () => {
  await fs.rm(workdir, { recursive: true, force: true })
  await fs.rm(publish, { recursive: true, force: true })
})

describe('export', () => {
  it('produces llm-wiki-uniteia/en/llm-agents-primer.md', async () => {
    const r = await runExport({
      slug: 'llm-agents-primer',
      lang: 'en',
      workdir,
      publishDir: publish,
      templatesDir: TEMPLATES,
    })
    expect(r.status).toBe('ok')
    if (r.status === 'ok') {
      const out = await fs.readFile(r.output_path, 'utf8')
      expect(out).toMatch(/^---\n/) // frontmatter
      expect(out).toMatch(/## TL;DR/)
      expect(out).toMatch(/## Editorial/)
      expect(out).toMatch(/## Sources/)
      expect(out).toMatch(/## Evidence/)
      expect(out).toMatch(/ex_001/)
    }
  })

  it('is idempotent', async () => {
    const first = await fs.readFile(path.join(publish, 'en', 'llm-agents-primer.md'), 'utf8')
    await runExport({
      slug: 'llm-agents-primer',
      lang: 'en',
      workdir,
      publishDir: publish,
      templatesDir: TEMPLATES,
    })
    const second = await fs.readFile(path.join(publish, 'en', 'llm-agents-primer.md'), 'utf8')
    expect(second).toBe(first)
  })

  it('fails when blog.md is missing', async () => {
    const empty = await fs.mkdtemp(path.join(os.tmpdir(), 'factory-export-empty-'))
    await fs.copyFile(path.join(GOLDEN_DIR, 'core.yaml'), path.join(empty, 'core.yaml'))
    const r = await runExport({
      slug: 'llm-agents-primer',
      lang: 'en',
      workdir: empty,
      publishDir: publish,
      templatesDir: TEMPLATES,
    })
    expect(r.status).toBe('fail')
    await fs.rm(empty, { recursive: true, force: true })
  })
})
