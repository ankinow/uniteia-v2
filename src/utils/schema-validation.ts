import matter from 'gray-matter'
import { validateSlug } from './url-validation'

export interface ValidationIssue {
  filePath: string
  field: string
  message: string
}

export interface ValidationReport {
  valid: boolean
  errors: ValidationIssue[]
}

export interface ValidationOptions {
  skipSlugValidation?: boolean
}

export function clearAjvCache(): void {
  // No-op: runtime validation is manual to stay worker-safe.
}

const VALID_LANGS = new Set(['en', 'pt', 'es', 'ja', 'zh'])
const VALID_VERDICTS = new Set(['trusted', 'caution', 'flagged'])
const VALID_TOP_LEVEL_KEYS = new Set([
  'type',
  'slug',
  'lang',
  'title',
  'content',
  'subjects',
  'referral_links',
  'verdict',
  'quality_score',
  'metadata',
])

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isValidDateTime(value: string): boolean {
  const timestamp = Date.parse(value)
  return Number.isFinite(timestamp)
}

function addIssue(
  issues: ValidationIssue[],
  filePath: string,
  field: string,
  message: string
): void {
  issues.push({ filePath, field, message })
}

function normalizeInstancePath(instancePath: string): string {
  if (!instancePath) {
    return 'root'
  }

  return instancePath.replace(/^\//, '').replaceAll('/', '.') || 'root'
}

function validateSubjects(subjects: unknown, filePath: string, issues: ValidationIssue[]): void {
  if (!Array.isArray(subjects)) {
    addIssue(issues, filePath, 'subjects', 'Must be an array')
    return
  }

  if (subjects.length < 1) {
    addIssue(issues, filePath, 'subjects', 'Must not have fewer than 1 items')
  }

  if (subjects.length > 10) {
    addIssue(issues, filePath, 'subjects', 'Must not have more than 10 items')
  }

  subjects.forEach((subject, index) => {
    if (typeof subject !== 'string') {
      addIssue(issues, filePath, `subjects.${index}`, 'Must be a string')
      return
    }

    if (subject.length < 1) {
      addIssue(issues, filePath, `subjects.${index}`, 'Must not be shorter than 1 character')
    }

    if (subject.length > 50) {
      addIssue(issues, filePath, `subjects.${index}`, 'Must not be longer than 50 characters')
    }
  })
}

function validateReferralLinks(
  referralLinks: unknown,
  filePath: string,
  issues: ValidationIssue[]
): void {
  if (!Array.isArray(referralLinks)) {
    addIssue(issues, filePath, 'referral_links', 'Must be an array')
    return
  }

  if (referralLinks.length > 5) {
    addIssue(issues, filePath, 'referral_links', 'Must not have more than 5 items')
  }

  referralLinks.forEach((link, index) => {
    if (!isPlainObject(link)) {
      addIssue(issues, filePath, `referral_links.${index}`, 'Must be an object')
      return
    }

    const allowedKeys = new Set(['url', 'title', 'description'])
    for (const key of Object.keys(link)) {
      if (!allowedKeys.has(key)) {
        addIssue(issues, filePath, `referral_links.${index}`, `Unexpected property "${key}"`)
      }
    }

    if (link.url === undefined) {
      addIssue(issues, filePath, `referral_links.${index}.url`, 'Missing required property "url"')
    } else if (typeof link.url !== 'string') {
      addIssue(issues, filePath, `referral_links.${index}.url`, 'Must be a string')
    } else {
      try {
        new URL(link.url)
      } catch {
        addIssue(issues, filePath, `referral_links.${index}.url`, 'Must match format "uri"')
      }
    }

    if (link.title === undefined) {
      addIssue(
        issues,
        filePath,
        `referral_links.${index}.title`,
        'Missing required property "title"'
      )
    } else if (typeof link.title !== 'string') {
      addIssue(issues, filePath, `referral_links.${index}.title`, 'Must be a string')
    } else {
      if (link.title.length < 1) {
        addIssue(
          issues,
          filePath,
          `referral_links.${index}.title`,
          'Must not be shorter than 1 character'
        )
      }

      if (link.title.length > 100) {
        addIssue(
          issues,
          filePath,
          `referral_links.${index}.title`,
          'Must not be longer than 100 characters'
        )
      }
    }

    if (link.description !== undefined) {
      if (typeof link.description !== 'string') {
        addIssue(issues, filePath, `referral_links.${index}.description`, 'Must be a string')
      } else if (link.description.length > 200) {
        addIssue(
          issues,
          filePath,
          `referral_links.${index}.description`,
          'Must not be longer than 200 characters'
        )
      }
    }
  })
}

function validateMetadata(metadata: unknown, filePath: string, issues: ValidationIssue[]): void {
  if (!isPlainObject(metadata)) {
    addIssue(issues, filePath, 'metadata', 'Must be an object')
    return
  }

  if (metadata.created_at !== undefined) {
    if (typeof metadata.created_at !== 'string') {
      addIssue(issues, filePath, 'metadata.created_at', 'Must be a string')
    } else if (!isValidDateTime(metadata.created_at)) {
      addIssue(issues, filePath, 'metadata.created_at', 'Must match format "date-time"')
    }
  }

  if (metadata.updated_at !== undefined) {
    if (typeof metadata.updated_at !== 'string') {
      addIssue(issues, filePath, 'metadata.updated_at', 'Must be a string')
    } else if (!isValidDateTime(metadata.updated_at)) {
      addIssue(issues, filePath, 'metadata.updated_at', 'Must match format "date-time"')
    }
  }

  if (metadata.author !== undefined) {
    if (typeof metadata.author !== 'string') {
      addIssue(issues, filePath, 'metadata.author', 'Must be a string')
    } else if (metadata.author.length > 100) {
      addIssue(issues, filePath, 'metadata.author', 'Must not be longer than 100 characters')
    }
  }

  if (metadata.version !== undefined) {
    if (!Number.isInteger(metadata.version)) {
      addIssue(issues, filePath, 'metadata.version', 'Must be an integer')
    } else if (metadata.version < 1) {
      addIssue(issues, filePath, 'metadata.version', 'Must be >= 1')
    }
  }
}

export function validateContent(
  data: unknown,
  filePath = 'content',
  options: ValidationOptions = {}
): ValidationReport {
  const issues: ValidationIssue[] = []

  if (!isPlainObject(data)) {
    addIssue(issues, filePath, 'root', 'Must be an object')
    return { valid: false, errors: issues }
  }

  for (const key of Object.keys(data)) {
    if (!VALID_TOP_LEVEL_KEYS.has(key)) {
      addIssue(issues, filePath, normalizeInstancePath(`/${key}`), `Unexpected property "${key}"`)
    }
  }

  if (data.type !== undefined) {
    if (typeof data.type !== 'string') {
      addIssue(issues, filePath, 'type', 'Must be a string')
    } else if (data.type !== 'article' && data.type !== 'index') {
      addIssue(issues, filePath, 'type', 'Must be equal to one of the allowed values')
    }
  }

  if (data.slug === undefined) {
    addIssue(issues, filePath, 'slug', 'Missing required property "slug"')
  } else if (typeof data.slug !== 'string') {
    addIssue(issues, filePath, 'slug', 'Must be a string')
  } else if (!options.skipSlugValidation) {
    const slugValidation = validateSlug(data.slug)
    if (!slugValidation.valid) {
      addIssue(issues, filePath, 'slug', slugValidation.error ?? 'Invalid slug')
    }
  }

  if (data.lang === undefined) {
    addIssue(issues, filePath, 'lang', 'Missing required property "lang"')
  } else if (typeof data.lang !== 'string') {
    addIssue(issues, filePath, 'lang', 'Must be a string')
  } else if (!VALID_LANGS.has(data.lang)) {
    addIssue(issues, filePath, 'lang', 'Must be equal to one of the allowed values')
  }

  if (data.title === undefined) {
    addIssue(issues, filePath, 'title', 'Missing required property "title"')
  } else if (typeof data.title !== 'string') {
    addIssue(issues, filePath, 'title', 'Must be a string')
  } else {
    if (data.title.length < 1) {
      addIssue(issues, filePath, 'title', 'Must not be shorter than 1 character')
    }

    if (data.title.length > 200) {
      addIssue(issues, filePath, 'title', 'Must not be longer than 200 characters')
    }
  }

  if (data.content === undefined) {
    addIssue(issues, filePath, 'content', 'Missing required property "content"')
  } else if (typeof data.content !== 'string') {
    addIssue(issues, filePath, 'content', 'Must be a string')
  } else if (data.content.length < 100) {
    addIssue(issues, filePath, 'content', 'Must not be shorter than 100 characters')
  }

  if (data.subjects === undefined) {
    addIssue(issues, filePath, 'subjects', 'Missing required property "subjects"')
  } else {
    validateSubjects(data.subjects, filePath, issues)
  }

  if (data.referral_links === undefined) {
    addIssue(issues, filePath, 'referral_links', 'Missing required property "referral_links"')
  } else {
    validateReferralLinks(data.referral_links, filePath, issues)
  }

  if (data.verdict !== undefined) {
    if (typeof data.verdict !== 'string') {
      addIssue(issues, filePath, 'verdict', 'Must be a string')
    } else if (!VALID_VERDICTS.has(data.verdict)) {
      addIssue(issues, filePath, 'verdict', 'Must be equal to one of the allowed values')
    }
  }

  if (data.quality_score !== undefined) {
    if (!Number.isInteger(data.quality_score)) {
      addIssue(issues, filePath, 'quality_score', 'Must be an integer')
    } else {
      if (data.quality_score < 0) {
        addIssue(issues, filePath, 'quality_score', 'Must be >= 0')
      }

      if (data.quality_score > 100) {
        addIssue(issues, filePath, 'quality_score', 'Must be <= 100')
      }
    }
  }

  if (data.metadata !== undefined) {
    validateMetadata(data.metadata, filePath, issues)
  }

  return {
    valid: issues.length === 0,
    errors: issues,
  }
}

export function validateMarkdownFrontmatter(markdown: string, filePath: string): ValidationReport {
  const issues: ValidationIssue[] = []

  let parsed: matter.GrayMatterFile<string>
  try {
    parsed = matter(markdown, {
      engines: {
        js: () => {
          throw new Error('JS eval disabled')
        },
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      valid: false,
      errors: [
        {
          filePath,
          field: 'frontmatter',
          message: `Failed to parse frontmatter: ${message}`,
        },
      ],
    }
  }

  const fileSlug = filePath.split('/').pop()?.replace(/\.md$/, '') || ''
  const isIndexFile = fileSlug === '_index'

  const fileSlugValidation = validateSlug(fileSlug)
  if (!isIndexFile && !fileSlugValidation.valid) {
    issues.push({
      filePath,
      field: 'fileSlug',
      message: fileSlugValidation.error ?? `Invalid slug in ${filePath}`,
    })
  }

  const frontmatterSlug = parsed.data.slug
  if (typeof frontmatterSlug !== 'string' || frontmatterSlug.length === 0) {
    issues.push({
      filePath,
      field: 'slug',
      message: `Missing frontmatter slug in ${filePath}.`,
    })
  } else {
    const frontmatterSlugValidation = validateSlug(frontmatterSlug)
    if (!frontmatterSlugValidation.valid) {
      issues.push({
        filePath,
        field: 'slug',
        message: frontmatterSlugValidation.error ?? `Invalid frontmatter slug in ${filePath}`,
      })
    }

    if (frontmatterSlug !== fileSlug) {
      issues.push({
        filePath,
        field: 'slug',
        message: `Frontmatter slug "${frontmatterSlug}" does not match file slug "${fileSlug}".`,
      })
    }
  }

  const contentValidation = validateContent(
    {
      ...parsed.data,
      content: parsed.content.trim(),
    },
    filePath,
    {
      skipSlugValidation: true,
    }
  )

  issues.push(...contentValidation.errors)

  return {
    valid: issues.length === 0,
    errors: issues,
  }
}
