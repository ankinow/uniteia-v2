import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { runLint } from '../lint/lint'

const RULES_PATH = path.join(__dirname, '..', 'lint', 'rules.yaml')

let workdir: string

beforeAll(async () => {
  workdir = await fs.mkdtemp(path.join(os.tmpdir(), 'factory-lint-work-'))
})
afterAll(async () => {
  await fs.rm(workdir, { recursive: true, force: true })
})

async function setupFile(name: string, content: string) {
  await fs.writeFile(path.join(workdir, name), content)
}

describe('lint v0.2', () => {
  it('passes valid content with evidence', async () => {
    await setupFile(
      'blog.md',
      `
# Test
This is a great tool ex_001.
It has 100 features ex_002.
Recently released in 2025 ref: ex_003.

${'word '.repeat(850)}
    `
    )
    const r = await runLint({ workdir, rulesPath: RULES_PATH, channel: 'blog' })
    expect(r.status).toBe('ok')
  })

  it('rejects banned terms', async () => {
    await setupFile('blog.md', `This is revolucionário.`)
    const r = await runLint({ workdir, rulesPath: RULES_PATH, channel: 'blog' })
    expect(r.failures.some(f => f.rule === 'banned_term')).toBe(true)
  })

  it('rejects numbers without nearby evidence', async () => {
    await setupFile('blog.md', `It costs 500 dollars.`)
    const r = await runLint({ workdir, rulesPath: RULES_PATH, channel: 'blog' })
    expect(r.failures.some(f => f.rule === 'require_evidence:number')).toBe(true)
  })

  it('rejects superlatives without nearby evidence', async () => {
    await setupFile('blog.md', `This is the best model.`)
    const r = await runLint({ workdir, rulesPath: RULES_PATH, channel: 'blog' })
    expect(r.failures.some(f => f.rule === 'require_evidence:superlative')).toBe(true)
  })

  it('rejects dated claims without nearby evidence', async () => {
    await setupFile('blog.md', `Released recently in 2025.`)
    const r = await runLint({ workdir, rulesPath: RULES_PATH, channel: 'blog' })
    expect(r.failures.some(f => f.rule === 'require_evidence:date')).toBe(true)
  })

  it('rejects low density', async () => {
    await setupFile(
      'blog.md',
      `
      10 ex_001
      20
      30
      40
    `
    )
    // 4 claims, 1 ref = 0.25 density < 0.65
    const r = await runLint({ workdir, rulesPath: RULES_PATH, channel: 'blog' })
    expect(r.failures.some(f => f.rule === 'min_density')).toBe(true)
  })

  it('validates short.json structure', async () => {
    await setupFile(
      'short.json',
      JSON.stringify({
        hook: 'Too long hook with more than fourteen words to trigger the lint failure rule effectively.',
        beats: ['One ex_001'],
        payoff: 'Value',
      })
    )
    const r = await runLint({ workdir, rulesPath: RULES_PATH, channel: 'short' })
    expect(r.failures.some(f => f.rule === 'hook_max_words')).toBe(true)
    expect(r.failures.some(f => f.rule === 'beats:min')).toBe(true) // needs 3
  })

  it('passes valid short.json', async () => {
    await setupFile(
      'short.json',
      JSON.stringify({
        hook: 'Subtle official site.',
        beats: ['One ex_001', 'Two', 'Three'],
        payoff: 'Value',
      })
    )
    const r = await runLint({ workdir, rulesPath: RULES_PATH, channel: 'short' })
    expect(r.status).toBe('ok')
  })

  it('checks i18n sections in combined channel', async () => {
    const combinedPath = path.join(workdir, 'combined.md')
    const content = [
      '## TL;DR',
      '## What it is',
      '## Who should buy',
      '## Who should skip',
      '## Pros & Cons',
      '## Checklist before buying',
      '## Editorial',
      '## Sources',
      '## Evidence',
      'word '.repeat(1000),
    ].join('\n')
    await fs.writeFile(combinedPath, content)

    // Valid for 'en'
    const rEn = await runLint({
      workdir,
      rulesPath: RULES_PATH,
      channel: 'combined',
      lang: 'en',
      combinedPath,
    })
    expect(rEn.status).toBe('ok')

    // Invalid for 'pt' (sections should be in PT)
    const rPt = await runLint({
      workdir,
      rulesPath: RULES_PATH,
      channel: 'combined',
      lang: 'pt',
      combinedPath,
    })
    expect(rPt.status).toBe('fail')
    expect(rPt.failures.some(f => f.rule === 'required_section' && f.detail === 'O que é')).toBe(
      true
    )
  })
})
