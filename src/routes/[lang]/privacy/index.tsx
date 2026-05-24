import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { useLocation } from '@builder.io/qwik-city'
import { getTranslation } from '~/i18n/context'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'

export const onStaticGenerate = () => {
  return {
    params: SUPPORTED_LANGUAGES.map(l => ({
      lang: l.code,
    })),
  }
}

export default component$(() => {
  const location = useLocation()
  const lang = (location.params.lang as SupportedLanguage) || 'en'
  const t = getTranslation(lang)

  return (
    <div class="max-w-3xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-bone mb-6">{t.legal.privacy.title}</h1>
      <div class="prose prose-invert max-w-none text-bone/80 leading-relaxed space-y-4">
        <p>{t.legal.privacy.body}</p>
      </div>
    </div>
  )
})

export const head: DocumentHead = ({ params }) => {
  const lang = (params.lang as SupportedLanguage) || 'en'
  const t = getTranslation(lang)

  return {
    title: `${t.legal.privacy.title} | UniTeia`,
    meta: [
      { name: 'description', content: t.legal.privacy.body.slice(0, 160) },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }
}
