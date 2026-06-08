import { $, component$, useSignal } from '@builder.io/qwik'

export interface NewsletterFormProps {
  /** Placeholder text for email input */
  placeholder?: string
  /** Button text */
  buttonText?: string
  /** Called on submit with the email value */
  onSubmit$?: (email: string) => void
  /** Success message shown after submit */
  successMessage?: string
  /** Optional class for wrapper */
  class?: string
}

/**
 * NewsletterForm — Email signup form with validation and success state.
 * Accessible, no external deps. Designed for the dark theme.
 */
export const NewsletterForm = component$<NewsletterFormProps>(
  ({
    placeholder = 'your@email.com',
    buttonText = 'Subscribe',
    onSubmit$,
    successMessage = '✓ Thanks for subscribing!',
    class: classList,
  }) => {
    const email = useSignal('')
    const status = useSignal<'idle' | 'loading' | 'success' | 'error'>('idle')
    const errorMessage = useSignal('')

    const validateEmail = (value: string): boolean => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }

    const handleSubmit = $(async () => {
      const trimmed = email.value.trim()

      if (!trimmed) {
        status.value = 'error'
        errorMessage.value = 'Please enter your email address.'
        return
      }

      if (!validateEmail(trimmed)) {
        status.value = 'error'
        errorMessage.value = 'Please enter a valid email address.'
        return
      }

      status.value = 'loading'

      try {
        if (onSubmit$) {
          await onSubmit$(trimmed)
        }
        status.value = 'success'
        email.value = ''
      } catch {
        status.value = 'error'
        errorMessage.value = 'Something went wrong. Please try again.'
      }
    })

    if (status.value === 'success') {
      return (
        <div class={['text-center py-4', classList]} role="status">
          <p class="text-[var(--color-accent)] font-medium text-sm flex items-center justify-center gap-2">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </p>
        </div>
      )
    }

    return (
      <div class={['w-full max-w-md', classList]}>
        <form
          onSubmit$={e => {
            e.preventDefault()
            handleSubmit()
          }}
          class="flex flex-col sm:flex-row gap-2"
          noValidate
        >
          <label for="newsletter-email" class="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email.value}
            placeholder={placeholder}
            onInput$={(_, el) => {
              email.value = el.value
              if (status.value === 'error') status.value = 'idle'
            }}
            class="newsletter-input flex-1"
            disabled={status.value === 'loading'}
            autocomplete="email"
          />
          <button
            type="submit"
            disabled={status.value === 'loading'}
            class={[
              'px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap',
              'bg-[var(--color-accent)] text-[var(--color-void)]',
              'hover:bg-[var(--color-accent-hi)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus:outline-none focus:shadow-[0_0_0_3px_oklch(0.75_0.18_200_/_0.15)]',
            ]}
          >
            {status.value === 'loading' ? 'Subscribing…' : buttonText}
          </button>
        </form>
        {status.value === 'error' && (
          <p class="mt-2 text-xs text-[var(--color-neon-rose)]" role="alert">
            {errorMessage.value}
          </p>
        )}
        <p class="mt-2 text-xs text-bone-muted">No spam. Unsubscribe anytime.</p>
      </div>
    )
  }
)
