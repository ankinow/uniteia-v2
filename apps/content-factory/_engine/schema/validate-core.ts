import fs from 'node:fs/promises'
import path from 'node:path'
import addFormats from 'ajv-formats'
import Ajv from 'ajv/dist/2020.js'
import yaml from 'yaml'
import schema from './core.schema.json' with { type: 'json' }

const ajv = new Ajv({ allErrors: true, strict: true })
addFormats(ajv)
const validateFn = ajv.compile(schema as object)

export type CoreValidationOk = { ok: true; data: Record<string, unknown> }
export type CoreValidationFail = {
  ok: false
  errors: Array<{ rule: string; message: string }>
}
export type CoreValidationResult = CoreValidationOk | CoreValidationFail

export function validateCoreObject(obj: unknown): CoreValidationResult {
  const ok = validateFn(obj)
  if (ok) return { ok: true, data: obj as Record<string, unknown> }
  const errors = (validateFn.errors ?? []).map(e => ({
    rule: `schema:${e.instancePath || '/'}`,
    message: `${e.message ?? ''} ${e.params ? JSON.stringify(e.params) : ''}`.trim(),
  }))
  return { ok: false, errors }
}

export async function validateCoreFile(corePath: string): Promise<CoreValidationResult> {
  const raw = await fs.readFile(corePath, 'utf8')
  let parsed: unknown
  try {
    parsed = yaml.parse(raw)
  } catch (e) {
    return { ok: false, errors: [{ rule: 'yaml:parse', message: (e as Error).message }] }
  }
  const schemaRes = validateCoreObject(parsed)
  if (!schemaRes.ok) return schemaRes
  return validateEvidenceBinding(schemaRes.data, path.dirname(corePath))
}

const REF_RE = /\[\^(ex_\d{3,})\]|ref:\s*(ex_\d{3,})/g

export async function validateEvidenceBinding(
  core: Record<string, unknown>,
  workdir: string
): Promise<CoreValidationResult> {
  const evidence = core.evidence as Array<{ id: string }> | undefined
  if (!evidence) return { ok: true, data: core }
  const knownIds = new Set(evidence.map(e => e.id))
  const errors: Array<{ rule: string; message: string }> = []
  const candidates = ['blog.md', 'wiki.md', 'short.json', 'prompt-seed.md']
  for (const file of candidates) {
    const p = path.join(workdir, file)
    let txt: string
    try {
      txt = await fs.readFile(p, 'utf8')
    } catch {
      continue
    }
    const seen = new Set<string>()
    for (const m of txt.matchAll(REF_RE)) {
      const id = m[1] ?? m[2]
      if (id) seen.add(id)
    }
    for (const id of seen) {
      if (!knownIds.has(id)) {
        errors.push({
          rule: 'evidence_binding:unknown_ref',
          message: `${file} references ${id} but it is not declared in core.yaml evidence[]`,
        })
      }
    }
  }
  if (errors.length === 0) return { ok: true, data: core }
  return { ok: false, errors }
}
