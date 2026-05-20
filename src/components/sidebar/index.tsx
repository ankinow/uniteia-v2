import { component$ } from '@builder.io/qwik'
import type { NavigationItem } from '~/content-graph/projections'
import { DonationButton } from '../donation'
import { LangSelectorCompact } from '../lang-switcher/compact'
import { SidebarNav } from './sidebar-nav'

export interface SidebarProps {
  navigationItems: NavigationItem[]
}

export const Sidebar = component$<SidebarProps>(({ navigationItems }) => {
  return (
    <aside
      aria-label="Main navigation"
      class="interface-dark w-64 h-screen sticky top-0 glass-light border-r-4 border-cyan/30 relative overflow-y-auto surface-hud rounded-2xl border border-white/10"
    >
      {/* Scanlines overlay */}
      <div class="scanlines absolute inset-0 pointer-events-none" aria-hidden="true" />

      {/* Logo JRPG Style */}
      <div class="p-4 border-b border-cyan/10 text-center glass">
        <div class="text-2xl font-pixel text-cyan tracking-wider">
          <span class="text-cyan">UNI</span>TEIA
        </div>
      </div>

      {/* Label: Interface Compacta */}
      <div class="text-xs uppercase tracking-[1px] opacity-60 mb-0 px-4 pt-3">
        Interface Compacta
      </div>

      {/* Navigation */}
      <nav class="p-4 pt-1">
        <SidebarNav navigationItems={navigationItems} />
      </nav>

      <div class="scratch-divider my-4" aria-hidden="true" />

      {/* Donation Button */}
      <div class="px-4">
        <DonationButton />
      </div>

      <div class="scratch-divider my-4" aria-hidden="true" />

      {/* Language Selector */}
      <div class="p-4 border-t border-cyan/10">
        <LangSelectorCompact />
      </div>
    </aside>
  )
})
