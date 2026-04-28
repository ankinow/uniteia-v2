import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import yaml from 'yaml'
import {
  validateCoreFile,
  validateCoreObject,
  validateEvidenceBinding,
} from '../schema/validate-core'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GOLDEN = path.join(__dirname, 'golden', 'llm-agents-primer', 'core.yaml')

/** Load golden and return a mutable deep clone */
async function loadGolden(): Promise<Record<string, unknown>> {
  const raw = await fs.readFile(GOLDEN, 'utf8')
  return yaml.parse(raw) as Record<string, unknown>
}

describe('schema — positive', () => {
  it('validates the golden core.yaml', async () => {
    const r = await validateCoreFile(GOLDEN)
    expect(r.ok).toBe(true)
  })
})

describe('schema — negative: required fields', () => {
  it('rejects core missing required fields', () => {
    const bad = { spec: 'uniteia-invite-link-core/1', id: 'x' }
    const r = validateCoreObject(bad)
    expect(r.ok).toBe(false)
  })
})

describe('schema — negative: invite_link', () => {
  it('rejects invite_link missing disclosure', async () => {
    const parsed = await loadGolden()
    delete parsed.disclosure
    const r = validateCoreObject(parsed)
    expect(r.ok).toBe(false)
  })

  it('rejects invite_link with invalid rel', async () => {
    const parsed = await loadGolden()
    ;(parsed.invite_link as Record<string, unknown>).rel = 'dofollow'
    const r = validateCoreObject(parsed)
    expect(r.ok).toBe(false)
  })
})

describe('schema — negative: invite_link honesty', () => {
  it('rejects marketplace using official site label', async () => {
    const parsed = await loadGolden()
    const invite = parsed.invite_link as any
    invite.enabled = true
    invite.merchant_type = 'marketplace'
    invite.label_i18n.en = 'Official site' // matches canonical
    const r = await validateEvidenceBinding(parsed, path.dirname(GOLDEN))
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.errors.some(e => e.rule === 'invite_link:misleading_anchor')).toBe(true)
    }
  })

  it('accepts marketplace using authorized partner label', async () => {
    const parsed = await loadGolden()
    const invite = parsed.invite_link as any
    invite.enabled = true
    invite.merchant_type = 'marketplace'
    invite.label_i18n.en = 'Authorized partner'
    const r = await validateEvidenceBinding(parsed, path.dirname(GOLDEN))
    expect(r.ok).toBe(true)
  })
})

// ─── S02: Evidence binding deep ────────────────────────────────────────

describe('evidence binding — positive', () => {
  it('accepts golden core with known refs', async () => {
    const r = await validateCoreFile(GOLDEN)
    expect(r.ok).toBe(true)
  })
})

describe('evidence binding — negative: unknown ref', () => {
  it('fails when core string field references unknown evidence id', async () => {
    const parsed = await loadGolden()
    // Inject a ref to a non-existent evidence ID in a core string field
    ;(parsed.summaries as Record<string, unknown>).decision_summary =
      'This tool is great ref: ex_999 for many reasons and detailed analysis.'
    const r = await validateEvidenceBinding(parsed, path.dirname(GOLDEN))
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(
        r.errors.some(
          e => e.rule === 'evidence_binding:unknown_ref' && e.message.includes('ex_999')
        )
      ).toBe(true)
    }
  })
})
