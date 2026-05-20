import { CONTENT_GRAPH_SCHEMA_VERSION } from '@uniteia/content-node-contract'
import { describe, expect, it } from 'vitest'
import { importPackage } from '../content-import/import-package'
import { mapLayout } from '../content-import/map-layout'
import { validatePackage } from '../content-import/validate-package'
import { getForbiddenBlocks, hasLayout, listLayoutIds } from '../layouts/registry'
import { validateBlocks } from './blocks.schema'
import { validateDesign } from './design.schema'
import { validateManifest } from './manifest.schema'
import { validateQuality } from './quality.schema'
import { validateTags } from './tags.schema'

describe('manifest.schema', () => {
  it('accepts valid manifest', () => {
    const result = validateManifest({
      schemaVersion: 'uniteia-content-package/v1',
      contentId: 'test-001',
      status: 'draft',
      contentType: 'opportunity_map',
      locales: ['pt-BR'],
      layout: {
        layoutId: 'opportunity-map-v1',
        designProfile: 'default',
        density: 'comfortable',
        audience: 'technical',
      },
      quality: {
        publishable: false,
        sourceCount: 1,
        trustLevel: 'medium' as const,
        blockers: [],
        warnings: [],
      },
      hashes: { contentHash: 'abc', manifestHash: 'def' },
      provenance: { exportedAt: '2026-01-01', exportTool: 'test' },
    })
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects unknown schemaVersion', () => {
    const result = validateManifest({
      schemaVersion: 'wrong/v2',
      contentId: 'test',
      layout: { layoutId: 'test' },
      quality: { publishable: false },
      locales: ['pt-BR'],
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('schemaVersion'))).toBe(true)
  })

  it('rejects missing layout', () => {
    const result = validateManifest({
      schemaVersion: 'uniteia-content-package/v1',
      contentId: 'test',
      quality: { publishable: false },
      locales: ['pt-BR'],
    })
    expect(result.valid).toBe(false)
  })

  it('rejects missing quality', () => {
    const result = validateManifest({
      schemaVersion: 'uniteia-content-package/v1',
      contentId: 'test',
      layout: { layoutId: 'test' },
      locales: ['pt-BR'],
    })
    expect(result.valid).toBe(false)
  })

  it('rejects non-object', () => {
    expect(validateManifest(null).valid).toBe(false)
    expect(validateManifest('string').valid).toBe(false)
  })
})

describe('tags.schema', () => {
  it('accepts valid tags', () => {
    const result = validateTags({
      topic: ['cloud-computing'],
      intent: ['teach-opportunity'],
      audience: ['developers'],
      pipeline: ['fixture'],
    })
    expect(result.valid).toBe(true)
  })

  it('rejects forbidden intent tags', () => {
    const result = validateTags({ intent: ['referral-marketing'] })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('forbidden'))).toBe(true)
  })

  it('rejects unknown pipeline tag', () => {
    const result = validateTags({ pipeline: ['non-existent-pipeline'] })
    expect(result.valid).toBe(false)
  })

  it('rejects forbidden risk tag', () => {
    const result = validateTags({ risk: ['unverified-pricing-claim'] })
    expect(result.valid).toBe(false)
  })

  it('warns on unknown format tag', () => {
    const result = validateTags({ format: ['unknown-format'] })
    expect(result.valid).toBe(true)
    expect(result.warnings.some(w => w.includes('format'))).toBe(true)
  })

  it('warns on unknown category', () => {
    const result = validateTags({ unknown_category: ['test'] })
    expect(result.valid).toBe(true)
    expect(result.warnings.length).toBeGreaterThan(0)
  })
})

describe('quality.schema', () => {
  it('accepts valid quality', () => {
    expect(
      validateQuality({
        publishable: false,
        sourceCount: 1,
        trustLevel: 'medium' as const,
        blockers: [],
      }).valid
    ).toBe(true)
  })

  it('rejects publishable with low trust', () => {
    const result = validateQuality({
      publishable: true,
      sourceCount: 5,
      trustLevel: 'low' as const,
      blockers: [],
    })
    expect(result.valid).toBe(false)
  })

  it('rejects publishable with blockers', () => {
    const result = validateQuality({
      publishable: true,
      sourceCount: 5,
      trustLevel: 'high' as const,
      blockers: ['some blocker'],
    })
    expect(result.valid).toBe(false)
  })

  it('rejects publishable with less than 3 sources', () => {
    const result = validateQuality({
      publishable: true,
      sourceCount: 1,
      trustLevel: 'high' as const,
      blockers: [],
    })
    expect(result.valid).toBe(false)
  })
})

describe('design.schema', () => {
  it('accepts valid design', () => {
    expect(
      validateDesign({
        layout: 'test',
        sections: ['intro'],
        palette: 'blue',
        tone: 'formal',
        audienceNotes: 'devs',
      }).valid
    ).toBe(true)
  })

  it('rejects missing layout', () => {
    expect(validateDesign({ sections: ['intro'], palette: 'blue', tone: 'formal' }).valid).toBe(
      false
    )
  })

  it('rejects empty sections', () => {
    expect(
      validateDesign({ layout: 'test', sections: [], palette: 'blue', tone: 'formal' }).valid
    ).toBe(false)
  })
})

describe('blocks.schema', () => {
  it('accepts valid blocks', () => {
    const result = validateBlocks([{ id: 'b1', kind: 'benefit-grid', title: 'Benefits' }], null)
    expect(result.valid).toBe(true)
  })

  it('rejects unknown block kind with restricted set', () => {
    const result = validateBlocks(
      [{ id: 'b1', kind: 'unknown-block', title: 'Test' }],
      new Set(['benefit-grid'])
    )
    expect(result.valid).toBe(false)
  })

  it('rejects ReferralCTA block', () => {
    const result = validateBlocks([{ id: 'b1', kind: 'ReferralCTA', title: 'Referral' }], null)
    expect(result.valid).toBe(false)
  })

  it('rejects empty array', () => {
    expect(validateBlocks([], null).valid).toBe(true)
  })

  it('rejects non-array', () => {
    expect(validateBlocks(null, null).valid).toBe(false)
  })
})

describe('layout registry', () => {
  it('has expected layouts', () => {
    expect(hasLayout('opportunity-map-v1')).toBe(true)
    expect(hasLayout('visual-explainer-v1')).toBe(true)
    expect(hasLayout('comparison-v1')).toBe(true)
    expect(hasLayout('ops-lab-fixture-v1')).toBe(true)
    expect(hasLayout('non-existent')).toBe(false)
  })

  it('forbids ReferralCTA in opportunity-map-v1', () => {
    expect(getForbiddenBlocks('opportunity-map-v1').has('ReferralCTA')).toBe(true)
    expect(getForbiddenBlocks('opportunity-map-v1').has('FakeUrgencyBanner')).toBe(true)
  })

  it('allows blocks in visual-explainer', () => {
    expect(getForbiddenBlocks('visual-explainer-v1').size).toBe(0)
  })

  it('lists all layout IDs', () => {
    const ids = listLayoutIds()
    expect(ids).toContain('visual-explainer-v1')
    expect(ids).toContain('opportunity-map-v1')
  })
})

describe('import-package', () => {
  it('creates import report with noindex for draft', () => {
    const manifest = {
      schemaVersion: 'uniteia-content-package/v1',
      contentId: 'test',
      sourceProject: 'test',
      targetProject: 'test',
      status: 'draft' as const,
      contentType: 'guide',
      canonicalSlug: 'test-slug',
      title: { en: 'Test' },
      description: { en: 'Test' },
      locales: ['en'],
      layout: {
        layoutId: 'visual-explainer-v1',
        designProfile: 'default',
        density: 'comfortable' as const,
        audience: 'devs',
      },
      tags: {},
      quality: {
        publishable: false,
        sourceCount: 1,
        trustLevel: 'low' as const,
        blockers: [],
        warnings: [],
      },
      sources: [],
      hashes: { contentHash: 'a', manifestHash: 'b' },
      provenance: { exportedAt: '', exportTool: 'test' },
    }
    const result = importPackage('/tmp/test', manifest)
    expect(result.importReport.shouldNoindex).toBe(true)
    expect(result.importReport.canPublish).toBe(false)
  })

  it('sets canPublish for high trust publishable package', () => {
    const manifest = {
      schemaVersion: 'uniteia-content-package/v1',
      contentId: 'test',
      sourceProject: 'test',
      targetProject: 'test',
      status: 'published' as const,
      contentType: 'guide',
      canonicalSlug: 'test-slug',
      title: { en: 'Test' },
      description: { en: 'Test' },
      locales: ['en'],
      layout: {
        layoutId: 'visual-explainer-v1',
        designProfile: 'default',
        density: 'comfortable' as const,
        audience: 'devs',
      },
      tags: {},
      quality: {
        publishable: true,
        sourceCount: 5,
        trustLevel: 'high' as const,
        blockers: [],
        warnings: [],
      },
      sources: [{ title: 'S1', url: 'https://example.com' }],
      hashes: { contentHash: 'a', manifestHash: 'b' },
      provenance: { exportedAt: '', exportTool: 'test' },
    }
    const result = importPackage('/tmp/test', manifest)
    expect(result.importReport.canPublish).toBe(true)
    expect(result.importReport.shouldNoindex).toBe(false)
  })
})

describe('validate-package', () => {
  it('validates real fixture package', () => {
    const pkgDir = 'fixtures/content-packages/tecent-vm-benefits'
    const result = validatePackage(pkgDir)
    expect(result.valid).toBe(true)
  })

  it('fails for non-existent directory', () => {
    const result = validatePackage('/tmp/non-existent-package')
    expect(result.valid).toBe(false)
    expect(result.issues.some(i => i.path === 'manifest.json')).toBe(true)
  })
})

describe('map-layout', () => {
  it('maps known layoutId', () => {
    const manifest = {
      schemaVersion: 'uniteia-content-package/v1',
      contentId: 'test',
      sourceProject: 'test',
      targetProject: 'test',
      status: 'draft' as const,
      contentType: 'guide',
      canonicalSlug: 'test',
      title: { en: 'T' },
      description: { en: 'T' },
      locales: ['en'],
      layout: {
        layoutId: 'visual-explainer-v1',
        designProfile: 'default',
        density: 'comfortable' as const,
        audience: 'devs',
      },
      tags: {},
      quality: {
        publishable: false,
        sourceCount: 1,
        trustLevel: 'medium' as const,
        blockers: [],
        warnings: [],
      },
      sources: [],
      hashes: { contentHash: 'a', manifestHash: 'b' },
      provenance: { exportedAt: '', exportTool: 'test' },
    }
    const result = mapLayout(manifest)
    expect(result).not.toBeNull()
    expect(result?.layoutId).toBe('visual-explainer-v1')
  })

  it('returns null for unknown layoutId', () => {
    const manifest = {
      schemaVersion: 'uniteia-content-package/v1',
      contentId: 'test',
      sourceProject: 'test',
      targetProject: 'test',
      status: 'draft' as const,
      contentType: 'guide',
      canonicalSlug: 'test',
      title: { en: 'T' },
      description: { en: 'T' },
      locales: ['en'],
      layout: {
        layoutId: 'non-existent-layout',
        designProfile: 'default',
        density: 'comfortable' as const,
        audience: 'devs',
      },
      tags: {},
      quality: {
        publishable: false,
        sourceCount: 1,
        trustLevel: 'medium' as const,
        blockers: [],
        warnings: [],
      },
      sources: [],
      hashes: { contentHash: 'a', manifestHash: 'b' },
      provenance: { exportedAt: '', exportTool: 'test' },
    }
    const result = mapLayout(manifest)
    expect(result).toBeNull()
  })
})

describe('contract version gate', () => {
  it('CONTENT_GRAPH_SCHEMA_VERSION matches v2 expected version', () => {
    expect(CONTENT_GRAPH_SCHEMA_VERSION).toBe('content-graph.v1')
  })
})
