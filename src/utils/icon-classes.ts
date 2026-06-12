/**
 * Static Lucide icon class lookup.
 *
 * Tailwind/Iconify scans source files for literal icon class strings.
 * Keep the actual class names as plain string literals here so dynamic
 * components can select from a safe finite set without emitting
 * placeholder-style template strings.
 */
export const LUCIDE_ICON_CLASSES = {
  bot: 'icon-[lucide--bot]',
  'message-square-text': 'icon-[lucide--message-square-text]',
  'pen-tool': 'icon-[lucide--pen-tool]',
  'check-circle-2': 'icon-[lucide--check-circle-2]',
  zap: 'icon-[lucide--zap]',
  // DepthCard thumbnail icons (GenForge v1.2)
  'book-open': 'icon-[lucide--book-open]',
  clock: 'icon-[lucide--clock]',
  code: 'icon-[lucide--code]',
  cpu: 'icon-[lucide--cpu]',
  network: 'icon-[lucide--network]',
  search: 'icon-[lucide--search]',
  'bar-chart-3': 'icon-[lucide--bar-chart-3]',
  layers: 'icon-[lucide--layers]',
  cloud: 'icon-[lucide--cloud]',
  'message-circle': 'icon-[lucide--message-circle]',
} as const

export type LucideIconName = keyof typeof LUCIDE_ICON_CLASSES

export function getLucideIconClass(icon: string | null | undefined): string {
  if (!icon) return ''
  return LUCIDE_ICON_CLASSES[icon as LucideIconName] ?? ''
}
