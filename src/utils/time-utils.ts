/**
 * Format a date as a relative time string (e.g., "2 days ago", "just now").
 */
export function formatRelativeTime(date: string | number | Date, locale = 'en'): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  const intervals = [
    { label: 'year' as const, seconds: 31536000 },
    { label: 'month' as const, seconds: 2592000 },
    { label: 'week' as const, seconds: 604800 },
    { label: 'day' as const, seconds: 86400 },
    { label: 'hour' as const, seconds: 3600 },
    { label: 'minute' as const, seconds: 60 },
    { label: 'second' as const, seconds: 1 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1 || interval.label === 'second') {
      return rtf.format(-count, interval.label)
    }
  }

  return rtf.format(0, 'second')
}
