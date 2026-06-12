import { component$ } from '@builder.io/qwik'

export interface ScreenshotFrameProps {
  src: string
  alt: string
  caption?: string | undefined
  dark?: boolean | undefined
  class?: string | undefined
  showBrowserBar?: boolean | undefined
}

/**
 * ScreenshotFrame — terminal/UI screenshot display component.
 * Glass overlay with cyan accent, optional browser chrome bar,
 * and SSG-compatible (no useVisibleTask$).
 */
export const ScreenshotFrame = component$<ScreenshotFrameProps>(
  ({ src, alt, caption, dark = true, class: className, showBrowserBar = true }) => {
    return (
      <figure class={['relative', className].filter(Boolean).join(' ')}>
        {/* Browser-style header bar with traffic-light dots */}
        {showBrowserBar && (
          <div
            class="flex items-center gap-1.5 px-3 py-2 bg-void rounded-t-xl border border-b-0 border-cyan/30"
            aria-hidden="true"
          >
            <span class="w-3 h-3 rounded-full bg-red-500" />
            <span class="w-3 h-3 rounded-full bg-yellow-500" />
            <span class="w-3 h-3 rounded-full bg-green-500" />
          </div>
        )}

        {/* Image container: glass overlay + cyan accent border + inner depth shadow */}
        <div
          class={[
            'surface-panel',
            'rounded-xl',
            'border-cyan/30',
            'shadow-inner',
            'overflow-hidden',
            dark ? 'bg-void' : '',
            showBrowserBar ? 'rounded-t-none' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <img
            src={src}
            alt={alt}
            class="object-contain max-h-[600px] w-full block"
            loading="lazy"
          />
        </div>

        {/* Monospace caption below the frame */}
        {caption && (
          <figcaption class="mt-3 font-mono text-xs text-bone-muted text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }
)
