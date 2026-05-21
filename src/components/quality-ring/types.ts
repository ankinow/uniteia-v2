import type { ClassList } from '@builder.io/qwik'

export interface QualityRingProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
  class?: ClassList
}
