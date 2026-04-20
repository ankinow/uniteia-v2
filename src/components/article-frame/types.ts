/**
 * ArticleFrame component props
 * Wraps article content in a prose-styled container with dark theme surface
 */
export interface ArticleFrameProps {
  /** Optional CSS class for additional styling */
  class?: string
}

/**
 * ArticleFrame emits structured log events for debugging
 * Observable in browser console and server logs
 */
export interface ArticleFrameLogEvent {
  type: 'render'
  timestamp: string
  slug?: string
  lang?: string
}
