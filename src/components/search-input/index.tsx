import { $, component$, useSignal } from '@builder.io/qwik'

export interface SearchInputProps {
  /** Placeholder text */
  placeholder?: string
  /** Called when user submits search (Enter or button click) */
  onSearch$?: (query: string) => void
  /** Debounce delay in ms (default: 300) */
  debounceMs?: number
  /** Optional class for the wrapper */
  class?: string
}

/**
 * SearchInput — Accessible search field with submit button.
 * Supports debounced input and Enter-key submission.
 */
export const SearchInput = component$<SearchInputProps>(
  ({ placeholder = 'Search articles…', onSearch$, debounceMs = 300, class: classList }) => {
    const query = useSignal('')
    const debounceTimer = useSignal<ReturnType<typeof setTimeout> | null>(null)

    const handleInput = $((value: string) => {
      query.value = value

      if (debounceTimer.value) clearTimeout(debounceTimer.value)
      if (onSearch$) {
        debounceTimer.value = setTimeout(() => {
          onSearch$(value)
        }, debounceMs)
      }
    })

    const handleSubmit = $(() => {
      if (debounceTimer.value) clearTimeout(debounceTimer.value)
      if (onSearch$) onSearch$(query.value)
    })

    return (
      <div class={['relative w-full max-w-lg', classList]} role="search">
        <label for="search-input" class="sr-only">
          Search
        </label>
        <div class="relative flex items-center">
          {/* Search icon */}
          <svg
            class="absolute left-3.5 w-4 h-4 text-bone-muted pointer-events-none"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <input
            id="search-input"
            type="search"
            value={query.value}
            placeholder={placeholder}
            onInput$={(_, el) => handleInput(el.value)}
            onKeyDown$={e => {
              if (e.key === 'Enter') handleSubmit()
            }}
            class="w-full pl-10 pr-12 py-2.5 rounded-full border border-[oklch(100%_0_0_/_0.1)] bg-[oklch(100%_0_0_/_0.03)] text-bone text-sm placeholder:text-bone-muted focus:outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_oklch(0.75_0.18_200_/_0.15)] transition-all duration-150"
            autocomplete="off"
            spellcheck={false}
          />
          {/* Clear / submit button */}
          {query.value && (
            <button
              type="button"
              onClick$={() => {
                query.value = ''
                if (onSearch$) onSearch$('')
              }}
              class="absolute right-2 p-1.5 rounded-full text-bone-muted hover:text-bone hover:bg-[oklch(100%_0_0_/_0.06)] transition-colors duration-150"
              aria-label="Clear search"
            >
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    )
  }
)
