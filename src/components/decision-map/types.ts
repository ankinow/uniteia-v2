import type { ClassList } from '@builder.io/qwik'

export interface DecisionNode {
  id: string
  label: string
  outcome?: string
  children?: DecisionNode[]
}

export type DecisionMapVariant = 'sketchnote' | 'signal' | 'minimal'

export interface DecisionMapProps {
  nodes: DecisionNode[]
  variant?: DecisionMapVariant
  class?: ClassList
}
