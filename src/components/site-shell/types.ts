import type { Slot } from '@builder.io/qwik'

/**
 * SiteShell component props
 * Wraps the entire application with consistent layout structure
 */
export interface SiteShellProps {
  /** Main content slot */
  children?: Slot
}

/**
 * SiteShell emits structured log events for debugging
 * These are observable in browser console and server logs
 */
export interface SiteShellLogEvent {
  type: 'render' | 'language-change'
  timestamp: string
  lang?: string
  path?: string
}
