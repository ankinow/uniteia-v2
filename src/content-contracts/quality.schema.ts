export interface Quality {
  publishable: boolean
  sourceCount: number
  trustLevel: 'high' | 'medium' | 'low'
  blockers: string[]
  warnings: string[]
}

export function validateQuality(raw: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!raw || typeof raw !== 'object') {
    return { valid: false, errors: ['quality must be an object'] }
  }

  const q = raw as Record<string, unknown>

  if (typeof q.publishable !== 'boolean') {
    errors.push('quality.publishable must be a boolean')
  }

  if (typeof q.sourceCount !== 'number') {
    errors.push('quality.sourceCount must be a number')
  } else if (q.publishable === true && q.sourceCount < 3) {
    errors.push('publishable packages need at least 3 sources')
  }

  if (q.trustLevel && !['high', 'medium', 'low'].includes(q.trustLevel as string)) {
    errors.push(`invalid trustLevel: ${q.trustLevel}`)
  }

  if (q.trustLevel === 'low' && q.publishable === true) {
    errors.push('low trust level cannot be publishable')
  }

  if (!Array.isArray(q.blockers)) {
    errors.push('quality.blockers must be an array')
  }

  if (Array.isArray(q.blockers) && q.blockers.length > 0) {
    if (q.publishable === true) {
      errors.push('publishable packages must have no blockers')
    }
  }

  if (q.warnings !== undefined && !Array.isArray(q.warnings)) {
    errors.push('quality.warnings must be an array')
  }

  return { valid: errors.length === 0, errors }
}