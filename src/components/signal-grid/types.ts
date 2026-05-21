import type { ClassList } from '@builder.io/qwik'

export interface SignalGridItem {
  id: string
  title: string
  summary: string
  quality_score: number
  verdict: string
  locales: string[]
  href: string
}

export interface SignalGridProps {
  signals: SignalGridItem[]
  class?: ClassList
}
