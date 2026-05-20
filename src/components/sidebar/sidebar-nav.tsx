import { component$, useSignal } from '@builder.io/qwik'
import type { NavigationItem } from '~/content-graph/projections'
import { getTranslation, useI18n } from '~/i18n/context'
import { searchPage, signalsIndex } from '~/routing/routes'

export interface SidebarNavProps {
  navigationItems: NavigationItem[]
}

export const SidebarNav = component$<SidebarNavProps>(({ navigationItems }) => {
  const i18n = useI18n()
  const lang = i18n.lang.value
  const t = getTranslation(lang)
  const expanded = useSignal(false)

  return (
    <ul class="space-y-2">
      <li>
        <a
          href={signalsIndex(lang)}
          class="pixel-cursor block py-2 px-3 text-bone hover:text-cyan hover:bg-cyan/10 transition-colors duration-200 font-pixel text-xs uppercase tracking-wider"
          style="text-shadow: none"
          onMouseEnter$={e => {
            const el = e.target as HTMLElement
            el.style.textShadow = '0 0 8px rgba(100, 220, 255, 0.6)'
          }}
          onMouseLeave$={e => {
            const el = e.target as HTMLElement
            el.style.textShadow = 'none'
          }}
        >
          {t.nav.home}
        </a>
      </li>
      <li>
        <a
          href={signalsIndex(lang)}
          class="pixel-cursor block py-2 px-3 text-bone hover:text-cyan hover:bg-cyan/10 transition-colors duration-200 font-pixel text-xs uppercase tracking-wider"
          style="text-shadow: none"
          onMouseEnter$={e => {
            const el = e.target as HTMLElement
            el.style.textShadow = '0 0 8px rgba(100, 220, 255, 0.6)'
          }}
          onMouseLeave$={e => {
            const el = e.target as HTMLElement
            el.style.textShadow = 'none'
          }}
        >
          {t.nav.topics}
        </a>
      </li>
      <li>
        <a
          href={searchPage(lang)}
          class="pixel-cursor block py-2 px-3 text-bone hover:text-cyan hover:bg-cyan/10 transition-colors duration-200 font-pixel text-xs uppercase tracking-wider"
          style="text-shadow: none"
          onMouseEnter$={e => {
            const el = e.target as HTMLElement
            el.style.textShadow = '0 0 8px rgba(100, 220, 255, 0.6)'
          }}
          onMouseLeave$={e => {
            const el = e.target as HTMLElement
            el.style.textShadow = 'none'
          }}
        >
          Search
        </a>
      </li>
      <li>
        <button
          type="button"
          onClick$={() => {
            expanded.value = !expanded.value
          }}
          aria-expanded={expanded.value}
          aria-controls="sidebar-niches-list"
          class="pixel-cursor block w-full text-left py-2 px-3 text-bone hover:text-cyan hover:bg-cyan/10 transition-colors duration-200 font-pixel text-xs uppercase tracking-wider"
          style="text-shadow: none"
          onMouseEnter$={e => {
            const el = e.target as HTMLElement
            el.style.textShadow = '0 0 8px rgba(100, 220, 255, 0.6)'
          }}
          onMouseLeave$={e => {
            const el = e.target as HTMLElement
            el.style.textShadow = 'none'
          }}
        >
          Niches {expanded.value ? '▼' : '▶'}
        </button>
        {expanded.value && (
          <ul id="sidebar-niches-list" class="ml-4 mt-2 space-y-1">
            {navigationItems.map(item => (
              <li key={item.nicheSlug}>
                <a href={item.href} class="block py-1 px-3 text-bone-muted hover:text-cyan text-xs">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    </ul>
  )
})
