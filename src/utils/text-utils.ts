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
