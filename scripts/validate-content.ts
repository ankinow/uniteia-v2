#!/usr/bin/env bun

import { globSync, readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { validateMarkdownFrontmatter } from '../src/utils/schema-validation'

const ROOT_DIR = resolve(import.meta.dir, '..')

interface ValidationResult {
  file: string
  valid: boolean
  errors: string[]
}

function validateFile(filePath: string): ValidationResult {
  const relativePath = relative(ROOT_DIR, filePath)
  try {
    const content = readFileSync(filePath, 'utf-8')
    const report = validateMarkdownFrontmatter(content, filePath)

    return {
      file: relativePath,
      valid: report.valid,
      errors: report.errors.map(e => `[${e.field}] ${e.message}`),
    }
  } catch (error) {
    return {
      file: relativePath,
      valid: false,
      errors: [`Unexpected error: ${error instanceof Error ? error.message : String(error)}`],
    }
  }
}

function main(args: string[]): void {
  const patterns = args.length > 0 ? args : ['content/**/*.md']

  // Expand glob patterns
  const files = patterns.flatMap(pattern => {
    if (pattern.includes('*')) {
      return globSync(pattern, { cwd: ROOT_DIR, absolute: true })
    }
    return [resolve(ROOT_DIR, pattern)]
  })

  // Filter out directories (globSync might return them if not restricted)
  const validFiles = files.filter(f => {
    if (!f.endsWith('.md')) return false

    // Ignore known test fixtures that are intentionally invalid
    const relativePath = relative(ROOT_DIR, f)
    if (relativePath.includes('test/')) return false

    return true
  })

  if (validFiles.length === 0) {
    console.error('❌ No markdown files found matching patterns:', patterns)
    process.exit(2)
  }

  console.log(`📋 Validating ${validFiles.length} content file(s) against schema...`)
  console.log('')

  let passCount = 0
  let failCount = 0

  for (const file of validFiles) {
    const result = validateFile(file)
    if (result.valid) {
      passCount++
      console.log(`✅ ${result.file}`)
    } else {
      failCount++
      console.log(`❌ ${result.file}`)
      for (const error of result.errors) {
        console.log(`   - ${error}`)
      }
    }
  }

  console.log('')
  console.log(`📊 Results: ${passCount} passed, ${failCount} failed`)

  if (failCount > 0) {
    console.log('')
    console.error('❌ Content validation failed')
    process.exit(1)
  }

  console.log('✅ All content validated successfully')
  process.exit(0)
}

main(process.argv.slice(2))
