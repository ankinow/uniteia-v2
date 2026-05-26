import matter from 'gray-matter'

export interface ParsedMarkdown {
  frontmatter: Record<string, unknown>
  body: string
}

export function parseFrontmatter(rawContent: string): ParsedMarkdown {
  const parsed = matter(rawContent, {
    engines: {
      js: () => {
        throw new Error('JS eval disabled')
      },
    },
  })
  return {
    frontmatter: parsed.data as Record<string, unknown>,
    body: parsed.content,
  }
}
