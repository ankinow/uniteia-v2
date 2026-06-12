import { type ClassList, component$, useSignal, useStylesScoped$ } from '@builder.io/qwik'

export interface ArticleHeroProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  class?: ClassList
}

/**
 * Generate a Cloudflare Images transform URL.
 * Pattern: https://uniteia.com/cdn-cgi/image/w={W},h={H},fit=cover,format=auto,q=90/{src}
 */
function cloudflareImageUrl(src: string, w: number, h: number): string {
  return `https://uniteia.com/cdn-cgi/image/w=${w},h=${h},fit=cover,format=auto,q=90/${src}`
}

const scopedStyles = `
  .hero-img {
    transition: opacity 400ms ease;
  }
  .hero-fallback {
    animation: hero-pulse 2s ease-in-out infinite;
  }
  @keyframes hero-pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.9; }
  }
`

/**
 * ArticleHero — responsive hero image with Cloudflare Images srcset delivery.
 *
 * Generates 400w, 800w, 1920w variants via CF Images transforms.
 * Falls back to a gradient placeholder on image load error.
 * Fully SSG-compatible — no useVisibleTask$.
 */
export const ArticleHero = component$<ArticleHeroProps>(
  ({ src, alt, width = 1920, height = 1080, priority = false, class: className }) => {
    useStylesScoped$(scopedStyles)
    const hasError = useSignal(false)

    // Compute proportional heights for srcset breakpoints
    const breakpoints = [
      { w: 400, h: Math.round((400 * height) / width) },
      { w: 800, h: Math.round((800 * height) / width) },
      { w: 1920, h: Math.round((1920 * height) / width) },
    ]

    const srcSet = breakpoints
      .map(({ w, h }) => `${cloudflareImageUrl(src, w, h)} ${w}w`)
      .join(', ')

    const mainSrc = cloudflareImageUrl(src, width, height)
    const sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1920px'

    return (
      <div
        class={[
          'relative overflow-hidden rounded-xl surface-panel',
          'border border-bone/20',
          className,
        ]}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        {hasError.value ? (
          <div class="hero-fallback absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-void flex items-center justify-center">
            <span class="text-bone-muted text-sm font-mono px-4 text-center">{alt}</span>
          </div>
        ) : (
          <img
            src={mainSrc}
            srcset={srcSet}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            fetchpriority={priority ? 'high' : undefined}
            class="hero-img w-full h-full object-cover"
            onError$={() => {
              hasError.value = true
            }}
          />
        )}
      </div>
    )
  }
)
