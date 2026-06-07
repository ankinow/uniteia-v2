export type CellVariant = 'insight' | 'evidence' | 'diagram' | 'cta' | 'metric' | 'quote' | 'mini'

export interface StoryboardCell {
  id: string
  variant: CellVariant
  gridArea: string
  title?: string
  body?: string
  image?: { src: string; alt: string }
  list?: string[]
  cta?: { label: string; href: string; variant: 'primary' | 'secondary' }
  metric?: { value: string; label: string; delta?: string }
  quote?: { text: string; source: string }
  diagram?: 'magica-arch' | 'quickstart-flow' | 'mcp-arch' | 'tencent-stack' | 'vibecoder'
  arrowTo?: string[]
}

export interface StoryboardLayout {
  version: '2.0'
  texture?: string
  gridTemplate: string
  gridColumns: string
  gridRows: string
  cells: StoryboardCell[]
}

export interface ResolvedLayout {
  version: '2.0'
  texture?: string
  gridTemplate: string
  gridColumns: string
  gridRows: string
  cells: ResolvedCell[]
  metaTitle?: string
}

export interface ResolvedCell {
  id: string
  variant: CellVariant
  gridArea: string
  title?: string
  body?: string
  image?: { src: string; alt: string }
  list?: string[]
  cta?: { label: string; href: string; variant: 'primary' | 'secondary' }
  metric?: { value: string; label: string; delta?: string }
  quote?: { text: string; source: string }
  diagram?: 'magica-arch' | 'quickstart-flow' | 'mcp-arch' | 'tencent-stack' | 'vibecoder'
  arrowTo?: string[]
}
