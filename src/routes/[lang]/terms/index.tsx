import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { useLocation } from '@builder.io/qwik-city'
import { getTranslation } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'
import { getBuildLocale } from '~/utils/build-locale'

export const onStaticGenerate = () => {
  const lang = getBuildLocale()
  return {
    params: [{ lang }],
  }
}

export default component$(() => {
  const location = useLocation()
  const lang = (location.params.lang as SupportedLanguage) || 'en'
  const t = getTranslation(lang)

  return (
    <div class="max-w-3xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-bone mb-6">{t.legal.terms.title}</h1>
      <div
        class="prose prose-invert max-w-none text-bone leading-relaxed space-y-4"
        dangerouslySetInnerHTML={t.legal.terms.body}
      />
    </div>
  )
})

export const head: DocumentHead = ({ params }) => {
  const lang = (params.lang as SupportedLanguage) || 'en'
  const t = getTranslation(lang)

  return {
    title: `${t.legal.terms.title} | UniTeia`,
    meta: [
      { name: 'description', content: t.legal.terms.title },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }
}
