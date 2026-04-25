import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import yaml from 'yaml'
import { validateCoreFile, validateCoreObject } from '../schema/validate-core'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GOLDEN = path.join(__dirname, 'golden', 'llm-agents-primer', 'core.yaml')

describe('schema', () => {
  it('validates the golden core.yaml', async () => {
    const r = await validateCoreFile(GOLDEN)
    expect(r.ok).toBe(true)
  })

  it('rejects core missing required fields', () => {
    const bad = { spec: 'core/1', id: 'x' }
    const r = validateCoreObject(bad)
    expect(r.ok).toBe(false)
  })

  it('rejects invalid lang', async () => {
    const raw = await fs.readFile(GOLDEN, 'utf8')
    const parsed = yaml.parse(raw)
    parsed.lang = 'fr' // not in enum
    const r = validateCoreObject(parsed)
    expect(r.ok).toBe(false)
  })
})
