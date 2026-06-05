// @ts-nocheck - React-in-Qwik-tsc-context: tsc cannot typecheck this file under the Qwik JSX runtime
// Vite handles the actual loading via dynamic import at runtime.
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n/i18n'
import UniTeiaCanvas from './UniTeiaCanvas'
import './canvas.css'

let canvasRoot: ReturnType<typeof createRoot> | null = null

export function mountCanvas(container: HTMLElement, template: string, lang: string) {
  const url = new URL(window.location.href)
  url.searchParams.set('template', template)
  url.searchParams.set('lang', lang)
  window.history.replaceState({}, '', url)

  i18n.changeLanguage(lang)

  if (!canvasRoot) {
    canvasRoot = createRoot(container)
  }

  canvasRoot.render(
    <I18nextProvider i18n={i18n}>
      <UniTeiaCanvas />
    </I18nextProvider>
  )
}

export function unmountCanvas() {
  if (canvasRoot) {
    canvasRoot.unmount()
    canvasRoot = null
  }
}
