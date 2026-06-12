import { component$ } from '@builder.io/qwik'
import { type LucideIconName, getLucideIconClass } from '~/utils/icon-classes'

/**
 * DepthCardThumbnail — Programmatic card thumbnail (NO AI images)
 * ───────────────────────────────────────────────────────────────
 * Contract v4: thumbnails ARE NOT images. They are programmatic
 * design system components (Lucide icon + gradient + glass border).
 *
 * Replaces all AI-generated thumbnail <img> tags with a
 * deterministic, i18n-neutral, design-system-native component.
 * One component = all 8 locales. Zero HTTP requests for thumbnails.
 */

export type DepthCardGradient = 'cyan-to-void' | 'bronze-to-void' | 'vine-to-void' | 'coral-to-void'

export interface DepthCardThumbnailProps {
  /** Lucide icon name (must exist in LUCIDE_ICON_CLASSES) */
  icon?: LucideIconName
  /** Gradient direction (default: cyan-to-void) */
  gradient?: DepthCardGradient
  /** Card number (renders as mono 01, 02, ...) */
  stepNumber?: number
  /** Category label shown below icon */
  category?: string
  /** Additional CSS classes */
  class?: string
}

const GRADIENT_MAP: Record<DepthCardGradient, string> = {
  'cyan-to-void': 'from-[var(--color-cyan)]/40 to-[var(--color-void)]',
  'bronze-to-void': 'from-[var(--color-bronze)]/40 to-[var(--color-void)]',
  'vine-to-void': 'from-[var(--color-vine)]/40 to-[var(--color-void)]',
  'coral-to-void': 'from-[var(--color-action-coral)]/40 to-[var(--color-void)]',
}

const GRADIENT_FALLBACK: Record<DepthCardGradient, string> = {
  'cyan-to-void': 'from-cyan-500/40 to-black',
  'bronze-to-void': 'from-amber-600/40 to-black',
  'vine-to-void': 'from-emerald-500/40 to-black',
  'coral-to-void': 'from-rose-500/40 to-black',
}

/**
 * DepthCardThumbnail — Qwik component (static, 0 bytes JS)
 *
 * Uses:
 * - Iconify CSS (`icon-[lucide--...]`) for zero-JS icons
 * - OKLCH design tokens via CSS custom properties
 * - Tailwind v4 gradient + glass surface classes
 * - group-hover transitions for depth effect
 *
 * Ensures: deterministic rendering across all 8 locales.
 */
export const DepthCardThumbnail = component$<DepthCardThumbnailProps>(
  ({ icon = 'bot', gradient = 'cyan-to-void', stepNumber, category, class: className }) => {
    const iconClass = getLucideIconClass(icon)
    const gradVar = GRADIENT_MAP[gradient]
    const gradFallback = GRADIENT_FALLBACK[gradient]

    return (
      <div
        class={[
          'relative overflow-hidden rounded-xl surface-panel',
          'aspect-[4/3] flex flex-col items-center justify-center',
          'group cursor-pointer transition-all duration-300',
          'hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10',
          className,
        ]}
        data-component="depth-card-thumbnail"
        data-gradient={gradient}
        aria-label={
          stepNumber
            ? `Card ${stepNumber}${category ? ` — ${category}` : ''}`
            : category
              ? `Card — ${category}`
              : 'Card thumbnail'
        }
      >
        {/* Gradient background overlay */}
        <div
          class={['absolute inset-0 opacity-30 bg-gradient-to-br', gradVar, gradFallback]}
          aria-hidden="true"
        />

        {/* Content layer */}
        <div class="relative z-10 flex flex-col items-center gap-3">
          {/* Step number (mono, large, translucent) */}
          {stepNumber != null && (
            <span class="text-4xl font-bold text-bone/20 font-mono select-none" aria-hidden="true">
              {String(stepNumber).padStart(2, '0')}
            </span>
          )}

          {/* Lucide icon via Iconify CSS */}
          <span
            class={['block text-cyan', iconClass]}
            style={{ width: '48px', height: '48px' }}
            aria-hidden="true"
          />

          {/* Category label */}
          {category && (
            <span class="text-xs uppercase tracking-widest text-bone-muted select-none">
              {category}
            </span>
          )}
        </div>

        {/* Hover reveal overlay */}
        <div
          class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          aria-hidden="true"
        >
          <div class="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent" />
        </div>

        {/* Glass border */}
        <div
          class="absolute inset-0 rounded-xl border border-bone/20 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    )
  }
)
