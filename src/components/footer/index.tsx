import { component$, useSignal } from '@builder.io/qwik'
import { HudLabel } from '~/components/hud-label'
import { ScratchDivider } from '~/components/scratch-divider'
import { getLanguageName, useI18n } from '~/i18n/context'
import { staticPage } from '~/routing/routes'
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
        'bg-[oklch(10%_0.01_260)]',
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
            aria-label="Footer links"
            class="footer-links flex flex-wrap gap-4 justify-center md:justify-end glass-light px-3 py-2"
            data-testid="footer-links"
          >
            <a
              href={staticPage(lang.value, 'privacy')}
              class="text-bone-muted transition-colors duration-200 hover:text-action focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:outline-none"
            >
              {t.footer.links.privacy}
            </a>
            <a
              href={staticPage(lang.value, 'terms')}
              class="text-bone-muted transition-colors duration-200 hover:text-action focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:outline-none"
            >
              {t.footer.links.terms}
            </a>
            <a
              href="https://github.com/ankinow/uniteia-v2"
              class="text-bone-muted transition-colors duration-200 hover:text-action focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:outline-none"
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
            <HudLabel label={t.langSwitcher.label} tone="muted" surface="footer" />
            <span class="text-bone-muted">{getLanguageName(lang.value)}</span>
          </div>
        </div>
      </div>
    </div>
  )
})

export type { FooterProps, FooterLink } from './types'
