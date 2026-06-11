import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { BUILD_LOCALE } from '~/build-locale'
import { NotFound } from '~/components/error-pages/not-found'
import { getTranslation } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'

export default component$(() => {
  return <NotFound />
})

export const head: DocumentHead = () => {
  const lang = BUILD_LOCALE as SupportedLanguage
  const t = getTranslation(lang)
  return {
    title: `404 - ${t.errorPages['404'].title} | ${t.seo.siteName}`,
    meta: [
      {
        name: 'description',
        content: t.errorPages['404'].message,
      },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }
}
