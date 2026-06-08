import { component$ } from '@builder.io/qwik'

export interface NewsletterFormProps {
  placeholder?: string
  buttonText?: string
  class?: string
}

/**
 * NewsletterForm — SSG-safe version. Form submits to /api/newsletter.
 * Interactive JS hydrates on client via progressive enhancement.
 */
export const NewsletterForm = component$<NewsletterFormProps>(
  ({ placeholder = 'your@email.com', buttonText = 'Subscribe', class: classList }) => {
    return (
      <div class={['w-full max-w-md', classList]}>
        <form
          method="POST"
          action="/api/newsletter"
          class="flex flex-col sm:flex-row gap-2"
        >
          <label for="newsletter-email" class="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            placeholder={placeholder}
            class="newsletter-input flex-1"
            autocomplete="email"
            required
          />
          <button
            type="submit"
            class={[
              'px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap',
              'bg-[var(--color-accent)] text-[var(--color-void)]',
              'hover:bg-[var(--color-accent-hi)]',
              'focus:outline-none focus:shadow-[0_0_0_3px_oklch(0.75_0.18_200_/_0.15)]',
            ]}
          >
            {buttonText}
          </button>
        </form>
        <p class="mt-2 text-xs text-bone-muted">No spam. Unsubscribe anytime.</p>
      </div>
    )
  }
)
