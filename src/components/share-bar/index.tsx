import { $, component$ } from '@builder.io/qwik'

export interface ShareBarProps {
  /** Full URL to share */
  url: string
  /** Title/text for share intent */
  title: string
  /** Platforms to show (default: all) */
  platforms?: Array<'twitter' | 'linkedin' | 'copy' | 'reddit' | 'email'>
  /** Optional class for wrapper */
  class?: string
}

/**
 * ShareBar — Social sharing buttons with copy-link feedback.
 * Accessible, no external JS dependencies.
 */
export const ShareBar = component$<ShareBarProps>(
  ({ url, title, platforms = ['twitter', 'linkedin', 'copy'], class: classList }) => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)

    const shareLinks: Record<string, { href: string; label: string; icon: string }> = {
      twitter: {
        href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        label: 'Share on X (Twitter)',
        icon: '𝕏',
      },
      linkedin: {
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        label: 'Share on LinkedIn',
        icon: 'in',
      },
      reddit: {
        href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
        label: 'Share on Reddit',
        icon: 'r/',
      },
      email: {
        href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
        label: 'Share via Email',
        icon: '@',
      },
      copy: {
        href: '#',
        label: 'Copy link',
        icon: '📋',
      },
    }

    const handleCopy = $(async (e: Event) => {
      e.preventDefault()
      try {
        await navigator.clipboard.writeText(url)
        const btn = (e.target as HTMLElement).closest('button')
        if (btn) {
          const originalText = btn.textContent
          btn.textContent = '✓ Copied!'
          setTimeout(() => {
            btn.textContent = originalText
          }, 2000)
        }
      } catch {
        // Fallback for older browsers
        const input = document.createElement('input')
        input.value = url
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }
    })

    return (
      <div
        class={['flex flex-wrap items-center gap-2', classList]}
        role="group"
        aria-label="Share this article"
      >
        <span class="text-xs text-bone-muted mr-1 font-medium uppercase tracking-wider">Share</span>
        {platforms.map(platform => {
          const link = shareLinks[platform]
          if (!link) return null

          if (platform === 'copy') {
            return (
              <button
                key="copy"
                type="button"
                onClick$={handleCopy}
                class="share-pill"
                aria-label={link.label}
              >
                <span aria-hidden="true">{link.icon}</span>
                <span>Copy</span>
              </button>
            )
          }

          return (
            <a
              key={platform}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              class="share-pill"
              aria-label={link.label}
            >
              <span aria-hidden="true">{link.icon}</span>
              <span class="hidden sm:inline">
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </span>
            </a>
          )
        })}
      </div>
    )
  }
)
