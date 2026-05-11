import type { Manifest } from '../content-contracts/manifest.schema'
import { getLayout } from '../layouts/registry'

export interface LayoutMapping {
  layoutId: string
  label: string
  allowedBlocks: string[]
  forbiddenBlocks: string[]
  designProfile: string
  density: string
  audience: string
}

export function mapLayout(manifest: Manifest): LayoutMapping | null {
  const entry = getLayout(manifest.layout.layoutId)
  if (!entry) return null

  return {
    layoutId: entry.id,
    label: entry.label,
    allowedBlocks: Array.from(entry.allowedBlocks ?? []),
    forbiddenBlocks: Array.from(entry.forbiddenBlocks),
    designProfile: manifest.layout.designProfile,
    density: manifest.layout.density,
    audience: manifest.layout.audience,
  }
}