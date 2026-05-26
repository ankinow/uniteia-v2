import { component$ } from '@builder.io/qwik'
import type { SupportedLanguage } from '~/i18n/types'
import { nicheIndex } from '~/routing/routes'
import type { NicheConfig } from '~/types/niche'
import type { NavigationData } from '~/utils/content-loader'

export interface NavTreeProps {
  navData: NavigationData
  niches: NicheConfig[]
  currentLang: SupportedLanguage
  currentNiche: string
  nicheSlugMap?: Record<string, string>
}

/**
 * NavTree - Dynamically derived navigation component
 *
 * Shows all configured niches (from niches.yaml) regardless of whether
 * they have content in the current language. The niche landing page
 * handles the "0 articles" state gracefully.
 */
export const NavTree = component$<NavTreeProps>(
  ({ navData, niches, currentLang, currentNiche, nicheSlugMap }) => {
    const visibleNiches = niches
      .map(niche => {
        const nicheData = navData.niches[niche.slug]
        const articles = nicheData?.articles ?? []
        const realArticles = articles.filter(a => a.slug !== '_index')
        const landing = articles.find(a => a.slug === '_index' && a.lang === currentLang)
        return {
          id: niche.slug,
          title: landing?.title ?? niche.title[currentLang] ?? niche.title.en ?? niche.slug,
          href: nicheIndex(currentLang, nicheSlugMap?.[niche.slug] ?? niche.slug),
          isActive: currentNiche === niche.slug,
          articleCount: realArticles.length,
        }
      })
      .filter(n => n.articleCount > 0)
      .sort((a, b) => {
        if (a.id === 'apex') return -1
        if (b.id === 'apex') return 1
        return 0
      })

    if (visibleNiches.length === 0) {
      return null
    }

    return (
      <nav class="nav-tree" aria-label="Niche navigation">
        <ul class="flex flex-wrap items-center gap-4 text-sm font-medium">
          {visibleNiches.map(niche => (
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
