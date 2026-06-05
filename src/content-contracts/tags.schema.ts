export const TAG_CATEGORIES = new Set([
  'topic',
  'intent',
  'audience',
  'vendor',
  'format',
  'risk',
  'pipeline',
])

// APEX cluster: the umbrella signal at the frontier of AI. Every
// topic below feeds the APEX summary. New APEX derivatives should
// be added here AND in config/niches.yaml + src/components/icon-set.
export const KNOWN_TOPIC_TAGS = new Set([
  'apex',
  'apex-overview',
  'apex-quickstart',
  'apex-flow',
  'mcp',
  'magica',
  'cloud-computing',
  'virtual-machines',
  'ai-agents',
  'llm-comparison',
])

export const KNOWN_INTENT_TAGS = new Set([
  'teach-opportunity',
  'cost-saving',
  'cloud-benefits',
  'tutorial',
  'reference',
  'comparison',
])

export const KNOWN_AUDIENCE_TAGS = new Set([
  'devops-engineers',
  'developers',
  'architects',
  'beginners',
  'researchers',
])

export const KNOWN_VENDOR_TAGS = new Set([
  'tencent-cloud',
  'aws',
  'azure',
  'google-cloud',
  'nvidia',
])

export const KNOWN_FORMAT_TAGS = new Set([
  'comparison',
  'guide',
  'reference',
  'overview',
  'tutorial',
])

export const KNOWN_RISK_TAGS = new Set(['low-risk', 'medium-risk', 'high-risk', 'unverified-claim'])

export const KNOWN_PIPELINE_TAGS = new Set(['curated', 'auto-generated', 'human-review', 'fixture'])

export const FORBIDDEN_INTENT_TAGS = new Set([
  'referral-marketing',
  'affiliate-conversion',
  'fake-urgency',
])

export const FORBIDDEN_RISK_TAGS = new Set(['unverified-pricing-claim'])

export function validateTags(raw: unknown): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  if (!raw || typeof raw !== 'object') {
    return { valid: false, errors: ['tags must be an object'], warnings: [] }
  }

  const tags = raw as Record<string, string[]>

  for (const category of Object.keys(tags)) {
    if (!TAG_CATEGORIES.has(category)) {
      warnings.push(`unknown tag category: ${category}`)
      continue
    }

    if (!Array.isArray(tags[category])) {
      errors.push(`tags.${category} must be an array`)
      continue
    }

    for (const tag of tags[category]) {
      if (category === 'intent' && FORBIDDEN_INTENT_TAGS.has(tag)) {
        errors.push(`forbidden intent tag: ${tag}`)
      }
      if (category === 'risk' && FORBIDDEN_RISK_TAGS.has(tag)) {
        errors.push(`forbidden risk tag: ${tag}`)
      }
      if (category === 'pipeline') {
        if (!KNOWN_PIPELINE_TAGS.has(tag)) {
          errors.push(`unknown pipeline tag: ${tag}`)
        }
      }
      if (category === 'format') {
        if (!KNOWN_FORMAT_TAGS.has(tag)) {
          warnings.push(`unknown format tag: ${tag}`)
        }
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings }
}
