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
    <aside class="w-64 h-screen sticky top-0 glass-light border-r-4 border-cyan/30 relative overflow-y-auto surface-hud">
      {/* Scanlines overlay */}
      <div class="scanlines absolute inset-0 pointer-events-none" />

      {/* Logo JRPG Style */}
      <div class="p-4 border-b border-cyan/10 text-center glass">
        <div class="text-2xl font-pixel text-cyan tracking-wider">
          <span class="text-cyan">UNI</span>TEIA
        </div>
      </div>

      {/* Navigation */}
      <nav class="p-4">
        <SidebarNav navigationItems={navigationItems} />
      </nav>

      <div class="scratch-divider my-4" />

      {/* Donation Button */}
      <div class="px-4">
        <DonationButton />
      </div>

      <div class="scratch-divider my-4" />

      {/* Language Selector */}
      <div class="p-4 border-t border-cyan/10">
        <LangSelectorCompact />
      </div>
    </aside>
  )
})
