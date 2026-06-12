import {
  type ClassList,
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from '@builder.io/qwik'
import { isServer } from '@builder.io/qwik/build'

export interface ArticleHeroProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  /** Enable IntersectionObserver lazy loading (default: true). SSG-compatible. */
  lazyLoad?: boolean
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
  .hero-placeholder {
    filter: blur(20px);
    transform: scale(1.1);
    transition: opacity 0.4s ease;
  }
  .hero-placeholder--loaded {
    opacity: 0;
    pointer-events: none;
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
 * Features:
 * - Responsive srcset: 400w, 800w, 1920w with CF Images transforms
 * - Blur-up placeholder: low-res thumbnail that fades out on image load
 * - IntersectionObserver lazy loading (opt-in via lazyLoad prop)
 * - DepthCard-style broken image fallback with Lucide icon
 * - Fully SSG-compatible — only IntersectionObserver setup uses useVisibleTask$
 */
export const ArticleHero = component$<ArticleHeroProps>(
  ({
    src,
    alt,
    width = 1920,
    height = 1080,
    priority = false,
    lazyLoad = true,
    class: className,
  }) => {
    useStylesScoped$(scopedStyles)
    const hasError = useSignal(false)
    const loaded = useSignal(false)
    const containerRef = useSignal<HTMLElement>()
    const imgRef = useSignal<HTMLImageElement>()

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

    // SSG-compatible IntersectionObserver for lazy loading
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
      if (isServer || !lazyLoad) return

      const container = containerRef.value
      if (!container) return

      const img = imgRef.value
      if (!img) return

      // Defer image loading: move src/srcset to data attributes
      // so the browser doesn't load the image until it's near the viewport.
      const currentSrc = img.getAttribute('src')
      const currentSrcset = img.getAttribute('srcset')
      if (currentSrc) {
        img.setAttribute('data-src', currentSrc)
        img.removeAttribute('src')
      }
      if (currentSrcset) {
        img.setAttribute('data-srcset', currentSrcset)
        img.removeAttribute('srcset')
      }

      const observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              // Restore image sources to trigger loading
              const dataSrc = img.getAttribute('data-src')
              if (dataSrc) {
                img.setAttribute('src', dataSrc)
                img.removeAttribute('data-src')
              }
              const dataSrcset = img.getAttribute('data-srcset')
              if (dataSrcset) {
                img.setAttribute('srcset', dataSrcset)
                img.removeAttribute('data-srcset')
              }
              observer.unobserve(container)
            }
          }
        },
        {
          rootMargin: '200px 0px', // Start loading 200px before entering viewport
          threshold: 0,
        }
      )

      observer.observe(container)

      cleanup(() => {
        observer.disconnect()
      })
    })

    // Low-resolution thumbnail URL for blur-up placeholder background
    const thumbnailSrc = cloudflareImageUrl(src, 40, Math.round((40 * height) / width))

    return (
      <div
        ref={containerRef}
        class={[
          'relative overflow-hidden rounded-xl surface-panel',
          'border border-bone/20',
          className,
        ]}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        {/* Error fallback — DepthCard-style gradient with icon */}
        {hasError.value ? (
          <div class="hero-fallback absolute inset-0 bg-gradient-to-br from-cyan/20 to-void rounded-xl flex flex-col items-center justify-center gap-2">
            <span
              class="icon-[lucide--image-off] block text-cyan/60"
              style={{ width: '48px', height: '48px' }}
              aria-hidden="true"
            />
            <span class="text-bone-muted text-sm font-mono px-4 text-center">{alt}</span>
          </div>
        ) : (
          <>
            {/* Blur-up placeholder — fades out when image loads */}
            {!loaded.value && (
              <div
                class={[
                  'hero-placeholder absolute inset-0 z-10',
                  loaded.value && 'hero-placeholder--loaded',
                ]}
                aria-hidden="true"
              >
                <img
                  src={thumbnailSrc}
                  alt=""
                  width={width}
                  height={height}
                  class="w-full h-full object-cover"
                  loading="eager"
                  aria-hidden="true"
                />
              </div>
            )}

            {/* Main hero image — IntersectionObserver defers src until near viewport */}
            <img
              ref={imgRef}
              src={mainSrc}
              srcset={srcSet}
              sizes={sizes}
              alt={alt}
              width={width}
              height={height}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              class="hero-img w-full h-full object-cover"
              onLoad$={() => {
                loaded.value = true
              }}
              onError$={() => {
                hasError.value = true
              }}
            />
          </>
        )}
      </div>
    )
  }
)
