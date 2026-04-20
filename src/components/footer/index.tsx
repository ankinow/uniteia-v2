import { component$, useSignal } from '@builder.io/qwik'
import { getLanguageName, useI18n } from '~/i18n/context'
import type { FooterLink, FooterProps } from './types'

export const Footer = component$<FooterProps>(({ class: classList }) => {
  const { t } = useI18n()
  const currentYear = useSignal(new Date().getFullYear())

  const links: FooterLink[] = [
    { href: '/privacy', label: t.footer.links.privacy },
    { href: '/terms', label: t.footer.links.terms },
    { href: 'https://github.com/uniteia/uniteia-v2', label: t.footer.links.source, external: true },
  ]

  return (
    <footer
      class={[
        'footer',
        'border-t border-brand-primary/10',
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
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              class="text-bone-muted hover:text-brand-primary transition-colors duration-200"
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
            >
              {link.label}
            </a>
          ))}
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
