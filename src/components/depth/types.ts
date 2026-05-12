import type { ClassList } from '@builder.io/qwik'

export type DepthPlane = 'front' | 'mid' | 'back'

export type DepthSurfaceTag = 'section' | 'header' | 'article' | 'aside' | 'div' | 'footer' | 'nav'

export type DepthVariant =
  | 'surface'
  | 'raised'
  | 'pressed'
  | 'glass'
  | 'glass-light'
  | 'glass-heavy'

export type Depth2D5Level = 'back' | 'base' | 'front' | 'floating'

export interface DepthSurfaceProps {
  as?: DepthSurfaceTag
  depth?: DepthVariant | DepthPlane
  depth2d5?: Depth2D5Level
  glass?: boolean
  class?: ClassList
  [key: string]: unknown
}
