import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROMPT_PATH = path.join(__dirname, '..', 'templates', 'build-core.prompt.hbs')
const SCHEMA_PATH = path.join(__dirname, '..', 'schema', 'core.schema.json')

describe('schema-prompt parity', () => {
  it('contains all required root fields in the prompt instructions', async () => {
    const schema = JSON.parse(await fs.readFile(SCHEMA_PATH, 'utf8'))
    const prompt = await fs.readFile(PROMPT_PATH, 'utf8')

    const required = schema.required as string[]
    for (const field of required) {
      // Basic check: field name should appear in the prompt
      expect(prompt, `Prompt missing required field: ${field}`).toContain(field)
    }
  })

  it('contains all supported languages in the prompt', async () => {
    const schema = JSON.parse(await fs.readFile(SCHEMA_PATH, 'utf8'))
    const prompt = await fs.readFile(PROMPT_PATH, 'utf8')

    const langs = schema.properties.lang.enum as string[]
    for (const lang of langs) {
      expect(prompt).toContain(lang)
    }
  })

  it('reflects the correct spec version', async () => {
    const schema = JSON.parse(await fs.readFile(SCHEMA_PATH, 'utf8'))
    const prompt = await fs.readFile(PROMPT_PATH, 'utf8')

    const spec = schema.properties.spec.const
    expect(prompt).toContain(spec)
  })
})
