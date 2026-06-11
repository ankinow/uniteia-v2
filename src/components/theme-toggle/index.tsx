import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'

/**
 * ThemeToggle — Switch between light and dark mode.
 * Persists choice in localStorage and applies 'light' class to document.
 */
export const ThemeToggle = component$(() => {
  const theme = useSignal<'light' | 'dark'>('dark')

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const saved = localStorage.getItem('uniteia-theme') as 'light' | 'dark' | null
    if (saved) {
      theme.value = saved
      document.documentElement.classList.toggle('light', saved === 'light')
    } else {
      // Default to dark, but check system preference
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
      if (prefersLight) {
        theme.value = 'light'
        document.documentElement.classList.add('light')
      }
    }
  })

  const toggle = $(() => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('light', theme.value === 'light')
    localStorage.setItem('uniteia-theme', theme.value)
  })

  return (
    <button
      type="button"
      onClick$={toggle}
      class="p-2 rounded-lg border border-white/10 bg-white/5 text-bone/60 hover:text-bone hover:bg-white/10 transition-[color,background-color,transform] duration-200 active:scale-[0.92] focus:outline-none focus:ring-2 focus:ring-neon-cyan"
      aria-label={`Switch to ${theme.value === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme.value === 'dark' ? (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <title>Light mode</title>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"
          />
        </svg>
      ) : (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <title>Dark mode</title>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  )
})
