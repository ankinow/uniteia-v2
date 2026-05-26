import { marked } from 'marked'

let configured = false

function ensureConfigured(): void {
  if (configured) return
  marked.use({
    async: false,
    breaks: false,
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        if (depth === 1) return ''
        return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>\n`
      },
    },
  })
  configured = true
}

export async function renderMarkdown(md: string): Promise<string> {
  ensureConfigured()
  return (await marked.parse(md.trim())) as string
}
