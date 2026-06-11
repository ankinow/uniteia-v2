import { $, type Signal, component$, useSignal } from '@builder.io/qwik'
import type { KindleFont, KindleFontSize, KindlePlaygroundProps } from './types'

const FONT_SIZE_MAP: Record<KindleFontSize, string> = {
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
}

export const KindlePlayground = component$<KindlePlaygroundProps>(
  ({ title, content, progress = 0, font = 'serif', fontSize = 'base', class: className }) => {
    const currentFont = useSignal(font ?? 'serif') as Signal<KindleFont>
    const currentSize = useSignal(fontSize ?? 'base') as Signal<KindleFontSize>
    const clampedProgress = Math.max(0, Math.min(100, progress))

    const toggleFont = $(() => {
      currentFont.value = currentFont.value === 'serif' ? 'sans' : 'serif'
    })

    const cycleSize = $(() => {
      const sizes: KindleFontSize[] = ['sm', 'base', 'lg']
      const idx = sizes.indexOf(currentSize.value)
      currentSize.value = sizes[(idx + 1) % 3] as KindleFontSize
    })

    return (
      <div
        data-testid="kindle-playground"
        class={['relative min-h-screen flex flex-col', 'paper-fiber', className]}
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
        }}
      >
        <div
          class="fixed top-0 left-0 h-1 bg-action transition-[width] duration-300 z-[var(--z-floating)] focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:outline-none"
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
        />

        <div class="flex-1 mx-auto w-full max-w-2xl px-6 py-12">
          <div class="mb-8 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <button
                onClick$={toggleFont}
                type="button"
                class="text-xs text-bone-muted hover:text-action transition-colors duration-200 font-mono px-3 py-1.5 border border-bone-muted/20 rounded focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:outline-none"
                aria-label="Toggle font"
              >
                {currentFont.value === 'serif' ? 'Aa' : 'Aa'}
              </button>
              <button
                onClick$={cycleSize}
                type="button"
                class="text-xs text-bone-muted hover:text-action transition-colors duration-200 font-mono px-3 py-1.5 border border-bone-muted/20 rounded focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:outline-none"
                aria-label="Change font size"
              >
                T
              </button>
            </div>
            <span class="text-xs text-bone-muted font-mono">{clampedProgress}%</span>
          </div>

          <article
            class="prose prose-invert max-w-prose"
            style={{
              fontFamily:
                currentFont.value === 'serif' ? 'var(--font-display)' : 'var(--font-family-sans)',
              fontSize: FONT_SIZE_MAP[currentSize.value],
            }}
          >
            <h1 class="font-display text-3xl md:text-4xl text-bone mb-8 leading-tight tracking-[-1px]">
              {title}
            </h1>
            <div
              class="text-bone leading-relaxed [&_p]:mb-4 [&_p]:max-w-prose"
              style={{ lineHeight: '1.8' }}
              dangerouslySetInnerHTML={content}
            />
          </article>
        </div>

        <div
          class="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-action/40 to-transparent"
          aria-hidden="true"
        />
      </div>
    )
  }
)

export type { KindlePlaygroundProps, KindleFont, KindleFontSize }
