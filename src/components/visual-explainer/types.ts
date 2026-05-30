/**
 * types.ts — VisualExplainer type definitions
 *
 * P0.2+: Hierarchical North Star data model for live-drawn diagrams.
 * Used by VisualExplainer component to render 6 layers + 6 agents.
 */

export interface LayerData {
  /** Layer identifier (L0-L5) */
  id: string
  /** Display name */
  label: string
  /** Short description for tooltip/expand */
  description: string
  /** Vertical position (0=top, 5=bottom) normalized 0-1 */
  level: number
  /** Icon emoji / symbol */
  icon: string
  /** OKLCH color for the layer */
  color: string
  /** Associated agents working at this layer */
  agents: string[] // agent IDs
  /** Click expands to show details */
  details?: string
}

export interface AgentData {
  /** Agent identifier */
  id: string
  /** Display name */
  label: string
  /** Emoji/symbol */
  icon: string
  /** Short description */
  description: string
  /** OKLCH accent color */
  color: string
  /** What this agent produces */
  output: string
}

export interface NorthStarData {
  /** Layers from user-facing (L5) to infrastructure (L0) */
  layers: LayerData[]
  /** Agents mapped to layers */
  agents: AgentData[]
  /** Theme colors */
  theme: {
    background: string
    stroke: string
    text: string
    accent: string
  }
}

export interface StrokePoint {
  x: number
  y: number
  pressure?: number
}

export interface StrokeConfig {
  strokeColor: string
  strokeWidth: number
  strokeTaper: number
  strokeSmoothing: number
  animationSpeed: number
}
