import type { NicheConfig } from '~/types/niche'

/**
 * Data returned by the niche route loader.
 * Contains the current niche and all other niches for related-content grid.
 */
export interface NicheRouteData {
  /** The niche matching the URL slug */
  niche: NicheConfig
  /** All other niches (excluding the current one) for the related-niches grid */
  otherNiches: NicheConfig[]
}
