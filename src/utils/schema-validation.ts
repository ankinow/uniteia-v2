import addFormats from 'ajv-formats'
import Ajv2020, { type DefinedError } from 'ajv/dist/2020'
import matter from 'gray-matter'
import schema from '../../schemas/llm-wiki-v1.schema.json' with { type: 'json' }
import { validateSlug } from './url-validation'

const SCHEMA_ID = 'https://uniteia.com/schemas/llm-wiki-v1.schema.json'

let ajvInstance: Ajv2020 | null = null
let schemaLoadIssue: ValidationIssue | null = null

// Clear AJV cache on module load to ensure fresh schema (for development)
export function clearAjvCache(): void {
  ajvInstance = null
  schemaLoadIssue = null
}

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

function getAjv(): Ajv2020 | null {
  if (ajvInstance || schemaLoadIssue) {
    return ajvInstance
  }

  try {
    ajvInstance = new Ajv2020({ allErrors: true, strict: true })
    addFormats(ajvInstance)
    ajvInstance.addSchema(schema)
    return ajvInstance
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    schemaLoadIssue = {
      filePath: 'schema',
      field: 'schema',
      message: `Schema load failed: ${message}`,
    }
    ajvInstance = null
    return null
  }
}

function normalizeInstancePath(instancePath: string): string {
  if (!instancePath) {
    return 'root'
  }

  return instancePath.replace(/^\//, '').replaceAll('/', '.') || 'root'
}

function normalizeAjvError(error: DefinedError, filePath: string): ValidationIssue {
  if (error.keyword === 'required') {
    const missingProperty = error.params.missingProperty
    const parentPath = normalizeInstancePath(error.instancePath)
    const field = parentPath === 'root' ? missingProperty : `${parentPath}.${missingProperty}`

    return {
      filePath,
      field,
      message: `Missing required property "${missingProperty}"`,
    }
  }

  if (error.keyword === 'additionalProperties') {
    return {
      filePath,
      field: normalizeInstancePath(error.instancePath),
      message: `Unexpected property "${error.params.additionalProperty}"`,
    }
  }

  return {
    filePath,
    field: normalizeInstancePath(error.instancePath),
    message: error.message ?? `Validation failed (${error.keyword})`,
  }
}

function validateSlugField(value: unknown, filePath: string): ValidationIssue[] {
  if (typeof value !== 'string') {
    return []
  }

  const slugValidation = validateSlug(value)
  if (!slugValidation.valid) {
    return [
      {
        filePath,
        field: 'slug',
        message: slugValidation.error ?? 'Invalid slug',
      },
    ]
  }

  return []
}

export function validateContent(
  data: unknown,
  filePath = 'content',
  options: ValidationOptions = {}
): ValidationReport {
  const ajv = getAjv()
  if (!ajv) {
    return {
      valid: false,
      errors: schemaLoadIssue ? [schemaLoadIssue] : [],
    }
  }

  const valid = ajv.validate(SCHEMA_ID, data)
  const errors: ValidationIssue[] = []

  if (!valid) {
    errors.push(
      ...((ajv.errors as DefinedError[] | null | undefined) ?? []).map(error =>
        normalizeAjvError(error, filePath)
      )
    )
  }

  if (!options.skipSlugValidation) {
    const slug =
      data && typeof data === 'object' && !Array.isArray(data)
        ? (data as Record<string, unknown>).slug
        : undefined
    errors.push(...validateSlugField(slug, filePath))
  }

  return {
    valid: errors.length === 0,
    errors,
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
  // Skip slug validation for _index.md landing page files
  // These are internal files that map to directory roots, not content slugs
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
