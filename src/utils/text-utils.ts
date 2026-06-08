/**
 * Extract a plain-text description from HTML content.
 * Strips tags, collapses whitespace, and truncates to maxLength.
 */
export function extractDescription(html: string, maxLength = 155): string {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= maxLength) return text

  const truncated = text.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  return `${lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated}...`
}

/**
 * Estimate reading time from HTML or plain text content.
 * Returns a human-readable string like "3 min read" or "<1 min read".
 * Uses 200 words/min for English, adjusted to 180 for CJK content.
 */
export function estimateReadTime(html: string): string {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const words = text.split(/\s+/).length
  // Detect CJK-heavy content (slower reading speed)
  const cjkChars = (text.match(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/g) || []).length
  const wpm = cjkChars > text.length * 0.3 ? 180 : 200
  const minutes = Math.max(1, Math.round(words / wpm))
  return minutes === 1 ? '1 min read' : `${minutes} min read`
}
