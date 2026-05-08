import { component$, useSignal } from '@builder.io/qwik'
import { getTranslation, useI18n } from '~/i18n/context'

export const SidebarNav = component$(() => {
  const i18n = useI18n()
  const lang = i18n.lang.value
  const t = getTranslation(lang)
  const expanded = useSignal(false)

  return (
    <ul class="space-y-2">
      <li>
        <a
          href="/"
          class="pixel-cursor block py-2 px-3 text-bone hover:text-cyan hover:bg-cyan/10 transition-all duration-200 font-pixel text-xs uppercase tracking-wider"
        >
          {t.nav.home}
        </a>
      </li>
      <li>
        <a
          href={`/${lang}/n`}
          class="pixel-cursor block py-2 px-3 text-bone hover:text-cyan hover:bg-cyan/10 transition-all duration-200 font-pixel text-xs uppercase tracking-wider"
        >
          {t.nav.topics}
        </a>
      </li>
      <li>
        <button
          type="button"
          onClick$={() => {
            expanded.value = !expanded.value
          }}
          class="pixel-cursor block w-full text-left py-2 px-3 text-bone hover:text-cyan hover:bg-cyan/10 transition-all duration-200 font-pixel text-xs uppercase tracking-wider"
        >
          Niches {expanded.value ? '▼' : '▶'}
        </button>
        {expanded.value && (
          <ul class="ml-4 mt-2 space-y-1">
            <li>
              <a
                href={`/${lang}/singularity`}
                class="block py-1 px-3 text-bone-muted hover:text-cyan text-xs"
              >
                Singularity
              </a>
            </li>
            <li>
              <a
                href={`/${lang}/hardware`}
                class="block py-1 px-3 text-bone-muted hover:text-cyan text-xs"
              >
                Hardware
              </a>
            </li>
            <li>
              <a
                href={`/${lang}/dev`}
                class="block py-1 px-3 text-bone-muted hover:text-cyan text-xs"
              >
                Dev
              </a>
            </li>
            <li>
              <a
                href={`/${lang}/privacy`}
                class="block py-1 px-3 text-bone-muted hover:text-cyan text-xs"
              >
                Privacy
              </a>
            </li>
          </ul>
        )}
      </li>
    </ul>
  )
})
