import fs from 'node:fs/promises'
import path from 'node:path'
import addFormats from 'ajv-formats'
import Ajv from 'ajv/dist/2020.js'
import yaml from 'yaml'
import { isOfficialLabel } from '../i18n/cta'
import type { SupportedLang } from '../i18n/headings'
import schema from './core.schema.json' with { type: 'json' }

const ajv = new Ajv({ allErrors: true, strict: true })
addFormats(ajv)
const validateFn = ajv.compile(schema as object)

export type ValidationEntry = { rule: string; message: string; path?: string }
export type CoreValidationOk = {
  ok: true
  data: Record<string, unknown>
  warnings: ValidationEntry[]
}
export type CoreValidationFail = {
  ok: false
  errors: ValidationEntry[]
  warnings: ValidationEntry[]
}
export type CoreValidationResult = CoreValidationOk | CoreValidationFail

export function validateCoreObject(obj: unknown): CoreValidationResult {
  const ok = validateFn(obj)
  if (ok) return { ok: true, data: obj as Record<string, unknown>, warnings: [] }
  const errors = (validateFn.errors ?? []).map(e => ({
    rule: `schema:${e.instancePath || '/'}`,
    message: `${e.message ?? ''} ${e.params ? JSON.stringify(e.params) : ''}`.trim(),
  }))
  return { ok: false, errors, warnings: [] }
}

export async function validateCoreFile(corePath: string): Promise<CoreValidationResult> {
  const raw = await fs.readFile(corePath, 'utf8')
  let parsed: unknown
  try {
    parsed = yaml.parse(raw)
  } catch (e) {
    return {
      ok: false,
      errors: [{ rule: 'yaml:parse', message: (e as Error).message }],
      warnings: [],
    }
  }
  const schemaRes = validateCoreObject(parsed)
  if (!schemaRes.ok) return schemaRes
  return validateEvidenceBinding(schemaRes.data, path.dirname(corePath))
}

/** Matches [^ex_001], ref: ex_001, or standalone ex_001 */
const REF_RE = /\[\^(ex_\d{3,})\]|\bref:\s*(ex_\d{3,})\b|\b(ex_\d{3,})\b/g

/**
 * Recursively collect all string values from an object, skipping specified paths.
 * Returns tuples of [jsonPath, stringValue].
 */
function collectStrings(
  obj: unknown,
  currentPath: string,
  skipPaths: Set<string>
): Array<[string, string]> {
  const results: Array<[string, string]> = []
  if (obj === null || obj === undefined) return results

  if (typeof obj === 'string') {
    if (!skipPaths.has(currentPath)) {
      results.push([currentPath, obj])
    }
    return results
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      results.push(...collectStrings(obj[i], `${currentPath}[${i}]`, skipPaths))
    }
    return results
  }

  if (typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
      results.push(...collectStrings(val, `${currentPath}.${key}`, skipPaths))
    }
  }

  return results
}

/** Extract all evidence ref IDs from a string */
function extractRefs(text: string): Set<string> {
  const refs = new Set<string>()
  for (const m of text.matchAll(REF_RE)) {
    const id = m[1] ?? m[2] ?? m[3]
    if (id) refs.add(id)
  }
  return refs
}

export async function validateEvidenceBinding(
  core: Record<string, unknown>,
  workdir: string
): Promise<CoreValidationResult> {
  const evidence = core.evidence as Array<{ id: string }> | undefined
  if (!evidence || evidence.length === 0) return { ok: true, data: core, warnings: [] }

  const knownIds = new Set(evidence.map(e => e.id))
  const errors: ValidationEntry[] = []
  const warnings: ValidationEntry[] = []
  const usedIds = new Set<string>()

  // Phase 1: Scan all string fields in core.yaml itself
  // Skip evidence[].id fields themselves (they define IDs, not reference them)
  const skipPaths = new Set<string>()
  for (let i = 0; i < evidence.length; i++) {
    skipPaths.add(`.evidence[${i}].id`)
  }

  const coreStrings = collectStrings(core, '', skipPaths)
  for (const [fieldPath, text] of coreStrings) {
    const refs = extractRefs(text)
    for (const id of refs) {
      usedIds.add(id)
      if (!knownIds.has(id)) {
        errors.push({
          rule: 'evidence_binding:unknown_ref',
          message: `core field ${fieldPath} references ${id} but it is not declared in evidence[]`,
          path: fieldPath,
        })
      }
    }
  }

  // Phase 2: Scan rendered files (if they exist)
  const candidates = ['blog.md', 'wiki.md', 'short.json', 'prompt-seed.md']
  for (const file of candidates) {
    const p = path.join(workdir, file)
    let txt: string
    try {
      txt = await fs.readFile(p, 'utf8')
    } catch {
      continue
    }
    const refs = extractRefs(txt)
    for (const id of refs) {
      usedIds.add(id)
      if (!knownIds.has(id)) {
        errors.push({
          rule: 'evidence_binding:unknown_ref',
          message: `${file} references ${id} but it is not declared in core.yaml evidence[]`,
          path: file,
        })
      }
    }
  }

  // Phase 3: Warn about unused evidence IDs
  for (const id of knownIds) {
    if (!usedIds.has(id)) {
      warnings.push({
        rule: 'evidence_binding:unused_evidence',
        message: `evidence ${id} is declared but never referenced in core fields or rendered files`,
        path: `evidence[].id=${id}`,
      })
    }
  }

  // Phase 4: Invite Link Honesty Law
  const invite = core.invite_link as Record<string, any> | undefined
  if (invite && invite.enabled) {
    const merchantType = invite.merchant_type
    const labels = invite.label_i18n as Record<string, string> | undefined
    if (labels && (merchantType === 'marketplace' || merchantType === 'reseller')) {
      for (const [l, label] of Object.entries(labels)) {
        if (isOfficialLabel(l as SupportedLang, label)) {
          errors.push({
            rule: 'invite_link:misleading_anchor',
            message: `merchant_type is ${merchantType} but label for lang ${l} is "${label}" (must not use official site label for marketplace/reseller)`,
            path: `.invite_link.label_i18n.${l}`,
          })
        }
      }
    }
  }

  if (errors.length > 0) return { ok: false, errors, warnings }
  return { ok: true, data: core, warnings }
}
