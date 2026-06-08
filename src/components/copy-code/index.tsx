import { component$, useVisibleTask$ } from '@builder.io/qwik'

/**
 * CopyCode — Global utility to add copy buttons to all <pre> code blocks.
 * Renders nothing, just handles the logic on the client.
 */
export const CopyCode = component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const handleCopy = async (text: string, btn: HTMLButtonElement) => {
      try {
        await navigator.clipboard.writeText(text)
        const original = btn.innerHTML
        btn.innerHTML = '<span class="text-neon-cyan">Copied!</span>'
        btn.classList.add('copy-success')
        setTimeout(() => {
          btn.innerHTML = original
          btn.classList.remove('copy-success')
        }, 2000)
      } catch (err) {
        console.error('Failed to copy text: ', err)
      }
    }

    const setupButtons = () => {
      const preBlocks = document.querySelectorAll('pre')
      preBlocks.forEach(pre => {
        if (pre.querySelector('.copy-code-btn')) return

        pre.style.position = 'relative'
        const btn = document.createElement('button')
        btn.className =
          'copy-code-btn absolute top-2 right-2 p-1.5 rounded bg-white/5 border border-white/10 text-bone/40 hover:text-bone hover:bg-white/10 transition-all duration-150 z-10'
        btn.setAttribute('aria-label', 'Copy code')
        btn.innerHTML =
          '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>'

        btn.onclick = () => {
          const code = pre.querySelector('code')?.innerText || pre.innerText
          handleCopy(code, btn)
        }

        pre.appendChild(btn)
      })
    }

    setupButtons()

    // Watch for dynamic content changes (e.g. navigation)
    const observer = new MutationObserver(setupButtons)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  })

  return (
    <style
      dangerouslySetInnerHTML={`.copy-code-btn { opacity: 0; } pre:hover .copy-code-btn { opacity: 1; }`}
    />
  )
})
