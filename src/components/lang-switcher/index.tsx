import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { getLanguageName, getTranslation, useI18n } from '~/i18n/context'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'
import { routes } from '~/routing/routes'
import type { LangSwitcherLogEvent, LangSwitcherProps, LangSwitcherSegmentedProps } from './types'

export const LangSwitcher = component$<LangSwitcherProps>(
  ({ class: classList, compact = false }) => {
    const { lang, t } = useI18n()
    const isOpen = useSignal(false)
    const isRedirecting = useSignal(false)
    const triggerRef = useSignal<HTMLButtonElement>()
    const focusedIndex = useSignal(-1)

    const logEvent = $((event: Omit<LangSwitcherLogEvent, 'timestamp'>) => {
      if (import.meta.env.DEV) {
        console.log('[LangSwitcher]', { ...event, timestamp: new Date().toISOString() })
      }
    })

    const handleSelect = $(async (newLang: SupportedLanguage) => {
      if (newLang === lang.value) {
        isOpen.value = false
        return
      }

      isRedirecting.value = true
      isOpen.value = false

      // Normalize pathname — strip accidental double slashes before localized() reconstruction
      const pathname = window.location.pathname.replace(/\/{2,}/g, '/')
      const currentPath = pathname + window.location.search + window.location.hash
      const redirectUrl = routes.localized(currentPath, newLang)
      logEvent({ type: 'redirect', to: newLang, redirectUrl })

      // Set cookie on client side for SSG/static hosting
      if (typeof document !== 'undefined') {
        const maxAge = 365 * 24 * 60 * 60 // 1 year
        document.cookie = `uniteia_lang=${newLang}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`
      }

      window.location.href = redirectUrl
    })

    const toggleDropdown = $(() => {
      isOpen.value = !isOpen.value
      logEvent({ type: isOpen.value ? 'open' : 'close' })
    })

    const handleKeyDown = $((e: KeyboardEvent) => {
      if (!isOpen.value) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault()
          toggleDropdown()
        }
        return
      }

      const items = document.querySelectorAll<HTMLElement>('[data-lang-switcher] [role="menuitem"]')
      if (items.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = focusedIndex.value < items.length - 1 ? focusedIndex.value + 1 : 0
        focusedIndex.value = next
        items[next]?.focus()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = focusedIndex.value > 0 ? focusedIndex.value - 1 : items.length - 1
        focusedIndex.value = prev
        items[prev]?.focus()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        isOpen.value = false
      } else if (e.key === 'Tab') {
        isOpen.value = false
      }
    })

    useVisibleTask$(({ track }) => {
      track(() => isOpen.value)

      if (isOpen.value) {
        const firstItem = document.querySelector<HTMLElement>(
          '[data-lang-switcher] [role="menuitem"]'
        )
        firstItem?.focus()
        focusedIndex.value = 0
      } else {
        triggerRef.value?.focus()
        focusedIndex.value = -1
      }
    })

    useVisibleTask$(({ cleanup }) => {
      const handleClickOutside = (e: MouseEvent) => {
        if (!(e.target as HTMLElement).closest('[data-lang-switcher]')) {
          isOpen.value = false
        }
      }
      document.addEventListener('click', handleClickOutside)
      cleanup(() => document.removeEventListener('click', handleClickOutside))
    })

    return (
      <div
        class={['lang-switcher relative', classList]}
        data-lang-switcher
        data-testid="lang-switcher"
      >
        <button
          type="button"
          ref={triggerRef}
          class={[
            'lang-switcher-trigger appearance-none flex items-center gap-2 px-3 py-2',
            'bg-void border border-action/30 rounded-none text-bone-primary',
            'hover:border-action hover:bg-action/5 transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50',
            'min-h-[2.5rem] min-w-[120px]',
            isRedirecting.value && 'opacity-50 cursor-wait',
          ]}
          onClick$={toggleDropdown}
          disabled={isRedirecting.value}
          aria-expanded={isOpen.value}
          aria-haspopup="menu"
          aria-label={t.langSwitcher.label}
          data-testid="lang-switcher-trigger"
        >
          <svg
            class="w-5 h-5 text-action"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
          {!compact && (
            <span class="text-sm font-medium text-bone">{getLanguageName(lang.value)}</span>
          )}
          <svg
            class={['w-4 h-4 transition-transform duration-200', isOpen.value && 'rotate-180']}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {isOpen.value && (
          <div
            class="lang-switcher-dropdown absolute right-0 mt-2 w-48 bg-[var(--sp-void)] border-2 border-[var(--sp-gold)] shadow-[var(--pixel-shadow-md)] overflow-hidden z-[var(--z-overlay)]"
            role="menu"
            aria-label={t.langSwitcher.available}
            data-testid="lang-switcher-dropdown"
            onKeyDown$={handleKeyDown}
          >
            {SUPPORTED_LANGUAGES.map(langInfo => (
              <button
                key={langInfo.code}
                type="button"
                class={[
                  'appearance-none bg-transparent border-0 w-full px-4 py-3 flex items-center justify-between text-left',
                  'hover:bg-action/10 focus-visible:bg-action/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/30 transition-colors duration-150',
                  lang.value === langInfo.code && 'bg-action/5 text-action',
                ]}
                onClick$={() => handleSelect(langInfo.code)}
                role="menuitem"
                aria-selected={lang.value === langInfo.code}
                data-testid={`lang-option-${langInfo.code}`}
              >
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-bone-primary">{langInfo.nativeName}</span>
                  <span class="text-xs text-bone-muted">{langInfo.name}</span>
                </div>
                {lang.value === langInfo.code && (
                  <svg
                    class="w-5 h-5 text-action"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)

// ── LangSwitcherSegmented — WAI-ARIA radio group ─────────────────────

export const LangSwitcherSegmented = component$<LangSwitcherSegmentedProps>(
  ({ currentLang, onLangChange$, class: classList }) => {
    const tabs = SUPPORTED_LANGUAGES

    const handleKeyDown = $((e: KeyboardEvent) => {
      const idx = tabs.findIndex(l => l.code === currentLang.value)
      let next = idx

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        next = idx < tabs.length - 1 ? idx + 1 : 0
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        next = idx > 0 ? idx - 1 : tabs.length - 1
      } else if (e.key === 'Home') {
        e.preventDefault()
        next = 0
      } else if (e.key === 'End') {
        e.preventDefault()
        next = tabs.length - 1
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        const langCode = (e.target as HTMLElement)?.getAttribute('data-lang-segmented')
        if (langCode && langCode !== currentLang.value) {
          onLangChange$(langCode as SupportedLanguage)
        }
      }

      if (next !== idx) {
        const target = tabs[next]
        if (target) {
          onLangChange$(target.code)
          setTimeout(() => {
            const btn = document.querySelector(
              `[data-lang-segmented="${target.code}"]`
            ) as HTMLElement | null
            btn?.focus()
          })
        }
      }
    })

    return (
      <fieldset
        aria-label={getTranslation(currentLang.value).langSwitcher.label}
        class={['inline-flex flex-wrap gap-2 border-0 p-0 m-0', classList]}
        onKeyDown$={handleKeyDown}
      >
        {tabs.map(l => (
          <button
            key={l.code}
            // biome-ignore lint/a11y/useSemanticElements: custom-styled radio button
            type="button"
            role="radio"
            aria-checked={currentLang.value === l.code}
            aria-label={l.nativeName}
            tabIndex={currentLang.value === l.code ? 0 : -1}
            data-lang-segmented={l.code}
            onClick$={() => {
              if (currentLang.value !== l.code) {
                onLangChange$(l.code)
              }
            }}
            class={[
              'min-h-11 min-w-11 px-3 py-2 text-sm uppercase tracking-wider border transition-colors motion-safe:duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan',
              currentLang.value === l.code
                ? 'border-cyan/40 text-cyan bg-cyan/10'
                : 'border-transparent text-bone-muted hover:text-bone hover:border-bone/20',
            ]}
          >
            {l.code}
          </button>
        ))}
      </fieldset>
    )
  }
)

export type { LangSwitcherProps, LangSwitcherLogEvent, LangSwitcherSegmentedProps } from './types'
