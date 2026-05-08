import type { ClassList } from '@builder.io/qwik'

export type DepthPlane = 'front' | 'mid' | 'back'

export type DepthSurfaceTag = 'section' | 'header' | 'article' | 'aside' | 'div'

export interface DepthSurfaceProps {
  depth: DepthPlane
  as?: DepthSurfaceTag
  class?: ClassList
  [key: string]: unknown
}
