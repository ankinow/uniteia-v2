import { component$, useSignal } from '@builder.io/qwik'
import { getLanguageName, useI18n } from '~/i18n/context'
import type { FooterProps } from './types'

export const Footer = component$<FooterProps>(({ class: classList }) => {
  const { t } = useI18n()
  const currentYear = useSignal(new Date().getFullYear())

  return (
    <footer
      class={[
        'footer',
        'border-t border-action/10',
        'bg-void',
        'py-8 px-4 md:px-8',
        'text-bone-muted text-sm',
        classList,
      ]}
      data-testid="footer"
    >
      <div class="footer-content max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="footer-copyright" data-testid="footer-copyright">
          <p class="text-center md:text-left">
            {t.footer.copyright.replace('{year}', String(currentYear.value))}
          </p>
        </div>
        <div class="footer-tagline text-center" data-testid="footer-tagline">
          <p class="text-bone-secondary">{t.footer.madeWith}</p>
        </div>
        <nav class="footer-links flex gap-4" data-testid="footer-links">
          <a
            href="/privacy"
            class="text-bone-muted hover:text-action transition-colors duration-200"
          >
            {t.footer.links.privacy}
          </a>
          <a href="/terms" class="text-bone-muted hover:text-action transition-colors duration-200">
            {t.footer.links.terms}
          </a>
          <a
            href="https://github.com/uniteia/uniteia-v2"
            class="text-bone-muted hover:text-action transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.footer.links.source}
          </a>
        </nav>
        <div class="footer-language text-bone-muted text-xs" data-testid="footer-language">
          <span class="opacity-60">Language: </span>
          <span class="text-bone-secondary">{getLanguageName('en')}</span>
        </div>
      </div>
    </footer>
  )
})

export type { FooterProps, FooterLink } from './types'
