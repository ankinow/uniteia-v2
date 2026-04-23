import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import addFormats from 'ajv-formats'
import Ajv2020, { type DefinedError } from 'ajv/dist/2020'

const SCHEMA_PATH = resolve(import.meta.dirname, '../../schemas/llm-wiki-v1.schema.json')

let ajvInstance: Ajv2020 | null = null

function getAjv() {
  if (!ajvInstance) {
    ajvInstance = new Ajv2020({ allErrors: true, strict: true })
    addFormats(ajvInstance)
    const schemaContent = readFileSync(SCHEMA_PATH, 'utf-8')
    const schema = JSON.parse(schemaContent)
    ajvInstance.addSchema(schema)
  }
  return ajvInstance
}

export function validateContent(data: unknown): { valid: boolean; errors: string[] } {
  const ajv = getAjv()
  const valid = ajv.validate('https://uniteia.com/schemas/llm-wiki-v1.schema.json', data)

  if (!valid) {
    const errors = (ajv.errors as DefinedError[]).map(err => {
      const path = err.instancePath || 'root'
      return `${path}: ${err.message}`
    })
    return { valid: false, errors }
  }

  return { valid: true, errors: [] }
}
