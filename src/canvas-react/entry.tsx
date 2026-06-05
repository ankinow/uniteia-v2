// @ts-nocheck - React-in-Qwik-tsc-context
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n/i18n'
import UniTeiaCanvas from './UniTeiaCanvas'
import './canvas.css'

const container = document.getElementById('tldraw-canvas-root')
if (!container) {
  throw new Error('Canvas container not found')
}

const params = new URLSearchParams(window.location.search)
const _template = params.get('template') || '01'
const lang = params.get('lang') || 'en'

i18n.changeLanguage(lang)

const root = createRoot(container)
root.render(
  <I18nextProvider i18n={i18n}>
    <UniTeiaCanvas />
  </I18nextProvider>
)
