import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { NotFound } from '~/components/error-pages/not-found'

/**
 * Catchall route for 404 Not Found
 * Matches any route that doesn't have a specific handler
 */
export default component$(() => {
  return <NotFound />
})

export const head: DocumentHead = {
  title: '404 - Page Not Found | UniTeia',
  meta: [
    { name: 'description', content: 'The page you are looking for does not exist.' },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
}
