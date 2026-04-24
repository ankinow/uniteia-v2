import { component$, useSignal } from '@builder.io/qwik'
import { HudLabel } from '~/components/hud-label'
import { ScratchDivider } from '~/components/scratch-divider'
import { getLanguageName, useI18n } from '~/i18n/context'
import type { FooterProps } from './types'

export const Footer = component$<FooterProps>(({ class: classList }) => {
  const { lang, t } = useI18n()
  const currentYear = useSignal(new Date().getFullYear())

  return (
    <div
      class={[
        'footer-inner',
        'hud-panel',
        'py-8 px-4 md:px-8',
        'text-sm text-bone-muted',
        classList,
      ]}
      data-testid="footer"
    >
      <div class="footer-content mx-auto flex max-w-7xl flex-col gap-6">
        <ScratchDivider tone="muted" surface="footer" class="opacity-80" />
        <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div class="footer-copyright" data-testid="footer-copyright">
            <p class="text-center md:text-left">
              {t.footer.copyright.replace('{year}', String(currentYear.value))}
            </p>
          </div>
          <div class="footer-tagline text-center" data-testid="footer-tagline">
            <p class="text-bone-muted">{t.footer.madeWith}</p>
          </div>
          <nav
            class="footer-links flex flex-wrap gap-4 justify-center md:justify-end"
            data-testid="footer-links"
          >
            <a
              href="/privacy"
              class="text-bone-muted transition-colors duration-200 hover:text-action"
            >
              {t.footer.links.privacy}
            </a>
            <a
              href="/terms"
              class="text-bone-muted transition-colors duration-200 hover:text-action"
            >
              {t.footer.links.terms}
            </a>
            <a
              href="https://github.com/uniteia/uniteia-v2"
              class="text-bone-muted transition-colors duration-200 hover:text-action"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.footer.links.source}
            </a>
          </nav>
          <div
            class="footer-language flex items-center gap-2 text-xs"
            data-testid="footer-language"
          >
            <HudLabel label="Language" tone="muted" surface="footer" />
            <span class="text-bone-muted">{getLanguageName(lang.value)}</span>
          </div>
        </div>
      </div>
    </div>
  )
})

export type { FooterProps, FooterLink } from './types'
