import type { ClassList } from '@builder.io/qwik'

export type KindleFont = 'serif' | 'sans'
export type KindleFontSize = 'sm' | 'base' | 'lg'

export interface KindlePlaygroundProps {
  title: string
  content: string
  progress?: number
  font?: KindleFont
  fontSize?: KindleFontSize
  class?: ClassList
}
