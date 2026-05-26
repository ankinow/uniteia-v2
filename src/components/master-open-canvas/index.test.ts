import { describe, expect, it, vi } from 'vitest'

// Qwik's component$() throws outside of the optimizer transform (vitest runs in Node.js).
// We mock it at the module level so importing ./index doesn't trigger the error.
vi.mock('@builder.io/qwik', () => ({
  component$: <T>(fn: T) => fn,
  useSignal: <T>(val: T) => ({ value: val }),
  useVisibleTask$: (_fn: unknown) => {},
}))
vi.mock('~/components/lesson/decision-map', () => ({
  DecisionMap: () => null,
}))

import { type MasterOpenCanvasVariant, VARIANT_CONFIG } from './index'

const ALL_VARIANTS: MasterOpenCanvasVariant[] = [
  'subtle',
  'medium',
  'rich',
  'parchment',
  'obsidian',
]

const REQUIRED_FIELDS: (keyof (typeof VARIANT_CONFIG)['subtle'])[] = [
  'corkboardIntensity',
  'paperVisible',
  'inkIntensity',
  'grainOpacity',
  'tiltMax',
  'shadowPlane',
  'isStatic',
  'zone',
]

describe('VARIANT_CONFIG', () => {
  it('exports exactly 3 variants', () => {
    expect(Object.keys(VARIANT_CONFIG)).toEqual(ALL_VARIANTS)
  })

  it.each(ALL_VARIANTS)('variant "%s" has all required fields', variant => {
    const entry = VARIANT_CONFIG[variant]
    for (const field of REQUIRED_FIELDS) {
      expect(entry, `variant "${variant}" is missing field "${field}"`).toHaveProperty(field)
    }
  })

  it.each(ALL_VARIANTS)(
    'variant "%s" has non-negative grainOpacity string formatted as a decimal',
    variant => {
      const opacity = Number.parseFloat(VARIANT_CONFIG[variant].grainOpacity)
      expect(opacity).not.toBeNaN()
      expect(opacity).toBeGreaterThanOrEqual(0)
      expect(opacity).toBeLessThanOrEqual(1)
    }
  )

  describe('tiltMax values', () => {
    it('subtle tiltMax is 3', () => {
      expect(VARIANT_CONFIG.subtle.tiltMax).toBe(3)
    })

    it('medium tiltMax is 5', () => {
      expect(VARIANT_CONFIG.medium.tiltMax).toBe(5)
    })

    it('rich tiltMax is 8', () => {
      expect(VARIANT_CONFIG.rich.tiltMax).toBe(8)
    })
  })

  describe('shadowPlane is only true for rich', () => {
    it('subtle shadowPlane is false', () => {
      expect(VARIANT_CONFIG.subtle.shadowPlane).toBe(false)
    })

    it('medium shadowPlane is false', () => {
      expect(VARIANT_CONFIG.medium.shadowPlane).toBe(false)
    })

    it('rich shadowPlane is true', () => {
      expect(VARIANT_CONFIG.rich.shadowPlane).toBe(true)
    })
  })

  describe('paperVisible expectations', () => {
    it('subtle paperVisible is false', () => {
      expect(VARIANT_CONFIG.subtle.paperVisible).toBe(false)
    })

    it('medium paperVisible is true', () => {
      expect(VARIANT_CONFIG.medium.paperVisible).toBe(true)
    })

    it('rich paperVisible is true', () => {
      expect(VARIANT_CONFIG.rich.paperVisible).toBe(true)
    })
  })

  describe('corkboardIntensity values', () => {
    it('subtle corkboardIntensity is "none"', () => {
      expect(VARIANT_CONFIG.subtle.corkboardIntensity).toBe('none')
    })

    it('medium corkboardIntensity is "medium"', () => {
      expect(VARIANT_CONFIG.medium.corkboardIntensity).toBe('medium')
    })

    it('rich corkboardIntensity is "rich"', () => {
      expect(VARIANT_CONFIG.rich.corkboardIntensity).toBe('rich')
    })
  })

  describe('inkIntensity values', () => {
    it('subtle inkIntensity is "none"', () => {
      expect(VARIANT_CONFIG.subtle.inkIntensity).toBe('none')
    })

    it('medium inkIntensity is "medium"', () => {
      expect(VARIANT_CONFIG.medium.inkIntensity).toBe('medium')
    })

    it('rich inkIntensity is "rich"', () => {
      expect(VARIANT_CONFIG.rich.inkIntensity).toBe('rich')
    })
  })

  describe('grainOpacity progression', () => {
    it('subtle has minimal grain', () => {
      expect(VARIANT_CONFIG.subtle.grainOpacity).toBe('0.02')
    })

    it('medium has moderate grain', () => {
      expect(VARIANT_CONFIG.medium.grainOpacity).toBe('0.04')
    })

    it('rich has strongest grain', () => {
      expect(VARIANT_CONFIG.rich.grainOpacity).toBe('0.06')
    })
  })

  describe('variant config interface contract', () => {
    it('subtle corkboard + paper + ink are all "off" (none/false)', () => {
      const s = VARIANT_CONFIG.subtle
      expect(s.corkboardIntensity).toBe('none')
      expect(s.paperVisible).toBe(false)
      expect(s.inkIntensity).toBe('none')
    })

    it('rich has all features enabled', () => {
      const r = VARIANT_CONFIG.rich
      expect(r.corkboardIntensity).toBe('rich')
      expect(r.paperVisible).toBe(true)
      expect(r.inkIntensity).toBe('rich')
      expect(r.shadowPlane).toBe(true)
    })

    describe('parchment/obsidian static variants', () => {
      it('parchment is static with zone=parchment', () => {
        const p = VARIANT_CONFIG.parchment
        expect(p.isStatic).toBe(true)
        expect(p.zone).toBe('parchment')
        expect(p.tiltMax).toBe(0)
      })

      it('obsidian is static with zone=chrome', () => {
        const o = VARIANT_CONFIG.obsidian
        expect(o.isStatic).toBe(true)
        expect(o.zone).toBe('chrome')
        expect(o.tiltMax).toBe(0)
      })
    })
  })
})
