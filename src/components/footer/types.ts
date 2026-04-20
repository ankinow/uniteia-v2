import type { ClassList } from '@builder.io/qwik'

/**
 * Footer component props
 */
export interface FooterProps {
  /** Additional CSS classes */
  class?: ClassList
}

/**
 * Footer link structure
 */
export interface FooterLink {
  href: string
  label: string
  external?: boolean
}
