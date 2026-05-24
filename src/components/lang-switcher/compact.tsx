import { component$ } from '@builder.io/qwik'
import { getTranslation, useI18n } from '~/i18n/context'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'
import { signalsIndex } from '~/routing/routes'

export const LangSelectorCompact = component$(() => {
  const i18n = useI18n()
  const lang = i18n.lang.value
  const t = getTranslation(lang)

  return (
    <fieldset class="space-y-1 border-0 p-0 m-0" aria-label="Language selector">
      <div class="paper-label">{t.langSwitcher.label}</div>
      {SUPPORTED_LANGUAGES.map(langInfo => (
        <a
          key={langInfo.code}
          href={signalsIndex(langInfo.code)}
          aria-current={lang === langInfo.code ? 'page' : undefined}
          class={[
            'block py-1 px-3 text-xs transition-colors duration-200',
            lang === langInfo.code
              ? 'text-cyan bg-cyan/10 font-medium'
              : 'text-bone-muted hover:text-bone hover:bg-cyan/5',
          ]}
        >
          {langInfo.nativeName}
        </a>
      ))}
    </fieldset>
  )
})
