import { describe, expect, test } from 'vitest'
import { replaceContentRegistryBlock } from '../../scripts/generate-content-registry'

describe('replaceContentRegistryBlock', () => {
  test('updates an existing inline registry block without requiring the original placeholder', () => {
    const source = [
      "import matter from 'gray-matter'",
      '',
      '// INLINE CONTENT REGISTRY — auto-generated. Run `bun run generate:content-registry`.',
      'export const contentRegistry: Record<string, string> = JSON.parse(\'{"./content/apex/pt/creator-tools.md":"old"}\')',
      'export const REGISTRY_PATHS = Object.keys(contentRegistry)',
      '',
      'export async function loadContent() {}',
    ].join('\n')

    const inlineCode = [
      '// INLINE CONTENT REGISTRY — auto-generated. Run `bun run generate:content-registry`.',
      'export const contentRegistry: Record<string, string> = JSON.parse(\'{"./content/apex/pt/creator-ai-tools.md":"new"}\')',
      'export const REGISTRY_PATHS = Object.keys(contentRegistry)',
    ].join('\n')

    const updated = replaceContentRegistryBlock(source, inlineCode)

    expect(updated).toContain('./content/apex/pt/creator-ai-tools.md')
    expect(updated).not.toContain('./content/apex/pt/creator-tools.md')
    expect(updated).toContain('export async function loadContent() {}')
  })
})
