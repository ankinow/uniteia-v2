import { component$ } from '@builder.io/qwik'

export const DonationButton = component$(() => {
  return (
    <a
      href="https://buymeacoffee.com/lermf"
      target="_blank"
      rel="noopener noreferrer"
      class="donation-btn block w-full p-3 text-center
             bg-gradient-to-b from-yellow-900/40 to-yellow-950/60
             border-2 border-yellow-500/50
             hover:border-yellow-400 hover:shadow-glow-yellow
             transition-all duration-200
             font-pixel text-xs uppercase tracking-wider"
    >
      <span class="inline-block mr-2">☕</span>
      SUPPORT
      <div
        class="text-xs text-yellow-400/70 mt-1 font-sans normal-case"
        style="font-family: var(--font-sans);"
      >
        Buy me a coffee
      </div>
    </a>
  )
})
