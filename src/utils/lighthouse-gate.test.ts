import { describe, expect, it } from 'vitest'
import type { LighthouseCategoryEntry, LighthouseReportLike } from '~/utils/lighthouse-gate'
import {
  DEFAULT_LIGHTHOUSE_SCORE_THRESHOLD,
  evaluateLighthouseGate,
  formatLighthouseGateReport,
} from '~/utils/lighthouse-gate'

function createCategoryEntry(score: number | null | undefined): LighthouseCategoryEntry {
  return score === undefined ? {} : { score }
}

function createLighthouseReport(
  categories: Record<string, number | null | undefined>
): LighthouseReportLike {
  const categoryEntries: Record<string, LighthouseCategoryEntry> = {}

  for (const [name, score] of Object.entries(categories)) {
    categoryEntries[name] = createCategoryEntry(score)
  }

  return {
    finalDisplayedUrl: 'http://127.0.0.1:4173/en',
    categories: categoryEntries,
  }
}

describe('evaluateLighthouseGate', () => {
  it('passes when the required categories meet the 95 threshold exactly', () => {
    const evaluated = evaluateLighthouseGate(
      createLighthouseReport({
        performance: 0.95,
        accessibility: 0.95,
        'best-practices': 0.95,
        seo: 0.95,
      }),
      { auditedUrl: '/en' }
    )

    expect(DEFAULT_LIGHTHOUSE_SCORE_THRESHOLD).toBe(95)
    expect(evaluated.ok).toBe(true)
    expect(evaluated.auditedUrl).toBe('/en')
    expect(evaluated.categoryScores).toEqual({
      performance: 95,
      accessibility: 95,
      'best-practices': 95,
      seo: 95,
    })
    expect(evaluated.issues).toHaveLength(0)
    expect(formatLighthouseGateReport(evaluated)).toContain('/en')
  })

  it('fails when any required category falls below the threshold', () => {
    const evaluated = evaluateLighthouseGate(
      createLighthouseReport({
        performance: 0.3,
        accessibility: 0.97,
        'best-practices': 0.99,
        seo: 0.95,
      }),
      { auditedUrl: '/en' }
    )

    expect(evaluated.ok).toBe(false)
    expect(evaluated.issues).toHaveLength(1)
    expect(evaluated.issues[0]?.kind).toBe('category-below-threshold')
    expect(evaluated.issues[0]?.category).toBe('performance')
    expect(formatLighthouseGateReport(evaluated)).toContain('performance')
    expect(formatLighthouseGateReport(evaluated)).toContain('30.0')
  })

  it('reports malformed category data without throwing', () => {
    const evaluated = evaluateLighthouseGate(
      {
        finalDisplayedUrl: 'http://127.0.0.1:4173/en',
        categories: {
          performance: { score: 'bad-data' as unknown as number },
          accessibility: {},
        },
      },
      { auditedUrl: '/en' }
    )

    expect(evaluated.ok).toBe(false)
    expect(evaluated.issues.some(issue => issue.kind === 'invalid-report-data')).toBe(true)
    expect(evaluated.issues.some(issue => issue.category === 'best-practices')).toBe(true)
    expect(formatLighthouseGateReport(evaluated)).toContain('invalid report data')
  })
})
