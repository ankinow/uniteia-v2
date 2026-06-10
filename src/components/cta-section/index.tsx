import { component$ } from '@builder.io/qwik'
import { DepthCard } from '~/components/depth-card'
import { DepthSection } from '~/components/depth-section'

export interface CTASectionProps {
  /** Article slug for the share URL */
  slug: string
  /** Current language */
  lang: string
  /** GitHub repo URL */
  githubUrl?: string
  /** Current page URL */
  url: string
}

/**
 * CTASection — Article footer engagement section
 *
 * Renders:
 * - Share button (copy link)
 * - GitHub star link
 * - Newsletter CTA
 */
export const CTASection = component$<CTASectionProps>(
  ({ slug: _slug, lang: _lang, githubUrl, url }) => {
    return (
      <DepthSection depth="back" aria-label="Article engagement">
        <DepthCard depth="back" class="p-6 md:p-8 mt-8">
          <div class="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {/* Copy link button */}
            <button
              type="button"
              onClick$={() => {
                if (typeof navigator !== 'undefined') {
                  navigator.clipboard.writeText(url).catch(() => {})
                }
              }}
              class="inline-flex items-center gap-2 px-4 py-2 rounded-full
                     bg-white/5 hover:bg-white/10 text-bone-muted hover:text-bone
                     border border-white/10 hover:border-cyan/30
                     transition-[color,background-color,transform] duration-200 active:scale-[0.96] text-sm cursor-pointer"
              aria-label="Copy article link"
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>Copy Link</span>
            </button>

            {/* GitHub star */}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full
                       bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300
                       border border-amber-500/20 hover:border-amber-500/30
                       transition-[color,background-color,transform] duration-200 active:scale-[0.96] text-sm"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                <span>Star on GitHub</span>
              </a>
            )}

            {/* Share on X/Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-full
                     bg-white/5 hover:bg-white/10 text-bone-muted hover:text-bone
                     border border-white/10 hover:border-white/10
                     transition-[color,background-color,transform] duration-200 active:scale-[0.96] text-sm"
              aria-label="Share on X"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Share</span>
            </a>
          </div>
        </DepthCard>
      </DepthSection>
    )
  }
)
