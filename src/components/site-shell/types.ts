/**
 * SiteShell component props
 * Wraps the entire application with consistent layout structure
 */
export interface SiteShellProps {
  /** Main content slot */
  children?: unknown
  /** Whether the current host is the apex shell host */
  isApexHost: boolean
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
