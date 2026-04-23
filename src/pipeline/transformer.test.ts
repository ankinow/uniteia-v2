import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { transformCoreToOutputs } from './transformer'

/**
 * TDD for R001: Implement deterministic pipeline: core.yaml -> blog.md + short.json
 */

describe('Pipeline Transformer', () => {
  it('should transform a valid core.yaml into blog.md and short.json', async () => {
    const coreYaml = `
slug: test-pipeline-entity
lang: en
title: Test Pipeline Entity
content: This is a test content that must be at least one hundred characters long to pass the validation schema requirements.
subjects:
  - pipeline
  - testing
referral_links:
  - url: https://example.com
    title: Example
verdict: trusted
quality_score: 95
metadata:
  author: PipelineBot
  version: 1
`
    const outputDir = '/tmp/pipeline-test'

    // We expect the function to return the paths of the created files
    const result = await transformCoreToOutputs(coreYaml, outputDir)

    expect(result.blogMd).toContain('blog.md')
    expect(result.shortJson).toContain('short.json')

    // Verify blog.md content (should have frontmatter)
    const blogMdContent = readFileSync(result.blogMd, 'utf-8')
    expect(blogMdContent).toContain('---')
    expect(blogMdContent).toContain('title: Test Pipeline Entity')
    expect(blogMdContent).toContain('This is a test content')

    // Verify short.json content
    const shortJsonContent = JSON.parse(readFileSync(result.shortJson, 'utf-8'))
    expect(shortJsonContent.slug).toBe('test-pipeline-entity')
    expect(shortJsonContent.quality_score).toBe(95)
  })

  it('should throw an error if the core.yaml is invalid', async () => {
    const invalidYaml = `
slug: invalid slug with spaces
lang: fr
title: Short
`
    const outputDir = '/tmp/pipeline-test-invalid'

    await expect(transformCoreToOutputs(invalidYaml, outputDir)).rejects.toThrow()
  })
})
