import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { getLanguageName, useI18n } from '~/i18n/context'
import { LANGUAGE_COOKIE_NAME, SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'
import type { LangSwitcherLogEvent, LangSwitcherProps } from './types'

export const LangSwitcher = component$<LangSwitcherProps>(
  ({ class: classList, compact = false }) => {
    const { lang, t } = useI18n()
    const isOpen = useSignal(false)
    const isRedirecting = useSignal(false)

    const logEvent = $((event: Omit<LangSwitcherLogEvent, 'timestamp'>) => {
      console.log('[LangSwitcher]', { ...event, timestamp: new Date().toISOString() })
    })

    const handleSelect = $((newLang: SupportedLanguage) => {
      if (newLang === lang.value) {
        isOpen.value = false
        return
      }
      document.cookie = `${LANGUAGE_COOKIE_NAME}=${newLang};path=/;max-age=31536000;SameSite=Lax`
      logEvent({ type: 'select', from: lang.value, to: newLang })

      const searchParams = new URLSearchParams(window.location.search)
      searchParams.delete('lang')
      const newSearch = searchParams.toString()
      const redirectUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`
      logEvent({ type: 'redirect', to: newLang, redirectUrl })

      isRedirecting.value = true
      setTimeout(() => {
        window.location.href = redirectUrl
      }, 100)
      isOpen.value = false
    })

    const toggleDropdown = $(() => {
      isOpen.value = !isOpen.value
      logEvent({ type: isOpen.value ? 'open' : 'close' })
    })

    useVisibleTask$(({ cleanup }) => {
      const handleClickOutside = (e: MouseEvent) => {
        if (!(e.target as HTMLElement).closest('[data-lang-switcher]')) isOpen.value = false
      }
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen.value) {
          isOpen.value = false
          logEvent({ type: 'close' })
        }
      }
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      cleanup(() => {
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      })
    })

    return (
      <div
        class={['lang-switcher relative', classList]}
        data-lang-switcher
        data-testid="lang-switcher"
      >
        <button
          type="button"
          class={[
            'lang-switcher-trigger flex items-center gap-2 px-3 py-2',
            'bg-void border border-action/30 rounded-lg text-bone-primary',
            'hover:border-action hover:bg-action/5 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-action/50',
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
          {!compact && <span class="text-sm font-medium">{getLanguageName(lang.value)}</span>}
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
            class="lang-switcher-dropdown absolute right-0 mt-2 w-48 bg-void border border-action/20 rounded-lg shadow-xl overflow-hidden z-50"
            role="menu"
            aria-label={t.langSwitcher.available}
            data-testid="lang-switcher-dropdown"
            tabIndex={-1}
          >
            {SUPPORTED_LANGUAGES.map(langInfo => (
              <button
                key={langInfo.code}
                type="button"
                class={[
                  'lang-option w-full px-4 py-3 flex items-center justify-between text-left',
                  'hover:bg-action/10 focus:bg-action/10 focus:outline-none transition-colors duration-150',
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

export type { LangSwitcherProps, LangSwitcherLogEvent } from './types'
