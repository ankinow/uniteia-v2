export interface Block {
  id: string
  kind: string
  title: string
  body: unknown
}

export const KNOWN_BLOCK_KINDS = new Set([
  'benefit-grid',
  'decision-map',
  'comparison-table',
  'feature-list',
  'architecture-diagram',
  'prose',
  'visual',
  'callout',
  'data-table',
])

export function validateBlocks(
  raw: unknown,
  allowedKinds: Set<string> | null
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!Array.isArray(raw)) {
    return { valid: false, errors: ['blocks must be an array'] }
  }

  const effectiveKinds = allowedKinds ?? KNOWN_BLOCK_KINDS

  for (let i = 0; i < raw.length; i++) {
    const block = raw[i]
    if (!block || typeof block !== 'object') {
      errors.push(`blocks[${i}] must be an object`)
      continue
    }

    const b = block as Record<string, unknown>
    if (!b.id || typeof b.id !== 'string') {
      errors.push(`blocks[${i}].id is required`)
    }
    if (!b.kind || typeof b.kind !== 'string') {
      errors.push(`blocks[${i}].kind is required`)
    } else if (!effectiveKinds.has(b.kind)) {
      errors.push(`blocks[${i}].kind "${b.kind}" not allowed for this layout`)
    }
    if (!b.title || typeof b.title !== 'string') {
      errors.push(`blocks[${i}].title is required`)
    }
  }

  return { valid: errors.length === 0, errors }
}
