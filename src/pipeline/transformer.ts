import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { dump, load } from 'js-yaml'
import { validateContent } from '../utils/schema-validation'

export interface PipelineResult {
  blogMd: string
  shortJson: string
}

export async function transformCoreToOutputs(
  coreYaml: string,
  outputDir: string
): Promise<PipelineResult> {
  const data = load(coreYaml) as any

  const validation = validateContent(data)
  if (!validation.valid) {
    throw new Error(`Invalid core.yaml: ${validation.errors.join(', ')}`)
  }

  mkdirSync(outputDir, { recursive: true })

  const blogMdPath = join(outputDir, 'blog.md')
  const shortJsonPath = join(outputDir, 'short.json')

  // Create blog.md with frontmatter
  const { content, ...frontmatter } = data
  const blogMdContent = `---\n${dump(frontmatter)}---\n\n${content}`
  writeFileSync(blogMdPath, blogMdContent, 'utf-8')

  // Create short.json
  writeFileSync(shortJsonPath, JSON.stringify(data, null, 2), 'utf-8')

  return {
    blogMd: blogMdPath,
    shortJson: shortJsonPath,
  }
}
