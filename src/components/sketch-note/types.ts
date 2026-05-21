import type { ClassList } from '@builder.io/qwik'

export type SketchNoteVariant = 'insight' | 'tip' | 'warning' | 'highlight'

export interface SketchNoteProps {
  title: string
  content: string
  icon?: string
  variant?: SketchNoteVariant
  class?: ClassList
}
