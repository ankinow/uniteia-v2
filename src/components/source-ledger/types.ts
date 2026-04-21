/**
 * SourceLedger component props
 * Renders external referral links with SEO-safe rel attributes
 */
export interface SourceLedgerProps {
  /** External referral links (max 5 per article per schema) */
  referralLinks: ReferralLinkSlot[]
  /** i18n label for the sources heading */
  sourcesLabel?: string | undefined
  /** Optional CSS class for additional styling */
  class?: string
}

/**
 * Referral link slot item
 * Matches the ReferralLink interface from route types
 */
export interface ReferralLinkSlot {
  url: string
  title: string
  description?: string
}
