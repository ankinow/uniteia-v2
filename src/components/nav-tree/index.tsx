import { component$ } from '@builder.io/qwik'
import type { SupportedLanguage } from '~/i18n/types'
import { nicheIndex } from '~/routing/routes'
import type { NavigationData } from '~/utils/content-loader'

export interface NavTreeProps {
  navData: NavigationData
  currentLang: SupportedLanguage
  currentNiche: string
  nicheSlugMap?: Record<string, string>
}

/**
 * NavTree - Dynamically derived navigation component
 *
 * Implements "hide-if-missing" policy:
 * Only shows niches and articles that exist in the current language.
 */
export const NavTree = component$<NavTreeProps>(
  ({ navData, currentLang, currentNiche, nicheSlugMap }) => {
    const niches = Object.entries(navData.niches)
      .filter(([nicheId, data]) => {
        // Hide if niche is 'apex' (usually handled separately)
        if (nicheId === 'apex') return false
        // Only show if niche has content in the current language
        return data.langs.includes(currentLang)
      })
      .map(([nicheId, data]) => {
        // Find the landing page (_index) for this niche/lang
        const landing = data.articles.find(a => a.slug === '_index' && a.lang === currentLang)
        return {
          id: nicheId,
          title: landing?.title || nicheId,
          href: nicheIndex(currentLang, nicheSlugMap?.[nicheId] ?? nicheId),
          isActive: currentNiche === nicheId,
        }
      })

    if (niches.length === 0) {
      return null
    }

    return (
      <nav class="nav-tree" aria-label="Niche navigation">
        <ul class="flex flex-wrap items-center gap-4 text-sm font-medium">
          {niches.map(niche => (
            <li key={niche.id}>
              <a
                href={niche.href}
                class={[
                  'px-3 py-2 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:outline-none',
                  niche.isActive
                    ? 'bg-action text-void'
                    : 'text-bone-muted hover:text-bone hover:bg-white/5',
                ]}
                aria-current={niche.isActive ? 'page' : undefined}
              >
                {niche.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    )
  }
)
