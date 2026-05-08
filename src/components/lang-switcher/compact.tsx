import { component$ } from '@builder.io/qwik'
import { getTranslation, useI18n } from '~/i18n/context'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'

export const LangSelectorCompact = component$(() => {
  const i18n = useI18n()
  const lang = i18n.lang.value
  const t = getTranslation(lang)

  return (
    <div class="space-y-1">
      <div class="text-xs font-pixel text-cyan/70 uppercase tracking-wider mb-2">
        {t.langSwitcher.label}
      </div>
      {SUPPORTED_LANGUAGES.map(langInfo => (
        <a
          key={langInfo.code}
          href={`/${langInfo.code}`}
          class={[
            'block py-1 px-3 text-xs transition-all duration-200',
            lang === langInfo.code
              ? 'text-cyan bg-cyan/10 font-medium'
              : 'text-bone-muted hover:text-bone hover:bg-cyan/5',
          ]}
        >
          {langInfo.nativeName}
        </a>
      ))}
    </div>
  )
})
