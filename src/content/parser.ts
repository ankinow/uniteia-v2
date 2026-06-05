import { load } from 'js-yaml'

export interface ParsedMarkdown {
  frontmatter: Record<string, unknown>
  body: string
}

/**
 * Match YAML frontmatter delimited by `---`.
 *
 * Robust: handles optional `\r\n` before closing `---`, and
 * closing `---` at end of file without trailing newline.
 *
 * Examples matched:
 *   ---\ntitle: Hello\n---\nbody
 *   ---\r\ntitle: Hello\r\n---\r\nbody
 *   ---\ntitle: Hello\n---\n\nbody
 *   ---\ntitle: Hello\n--- (EOF — no newline after closing ---)
 */
const YAML_FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export function parseFrontmatter(rawContent: string): ParsedMarkdown {
  const match = rawContent.match(YAML_FRONTMATTER_RE)
  if (!match) {
    return { frontmatter: {}, body: rawContent }
  }
  return {
    frontmatter: (load(match[1] ?? '') ?? {}) as Record<string, unknown>,
    body: rawContent.slice(match[0].length),
  }
}
