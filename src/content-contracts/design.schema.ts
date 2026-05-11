export interface DesignSpec {
  layout: string
  sections: string[]
  palette: string
  tone: string
  audienceNotes: string
}

export function validateDesign(raw: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!raw || typeof raw !== 'object') {
    return { valid: false, errors: ['design must be an object'] }
  }

  const d = raw as Record<string, unknown>

  if (!d.layout || typeof d.layout !== 'string') {
    errors.push('design.layout is required')
  }

  if (!Array.isArray(d.sections) || d.sections.length === 0) {
    errors.push('design.sections must be a non-empty array')
  }

  if (!d.palette || typeof d.palette !== 'string') {
    errors.push('design.palette is required')
  }

  if (!d.tone || typeof d.tone !== 'string') {
    errors.push('design.tone is required')
  }

  return { valid: errors.length === 0, errors }
}

export const REQUIRED_DESIGN_FIELDS = ['layout', 'sections', 'palette', 'tone', 'audienceNotes'] as const