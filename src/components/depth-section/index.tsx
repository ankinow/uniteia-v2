import { Slot, component$ } from '@builder.io/qwik'
import type { DepthSurfaceProps } from '~/components/depth/types'

export const DepthSection = component$<DepthSurfaceProps>(
  ({ as = 'section', depth, class: classList, ...attrs }) => {
    const sharedProps = {
      ...attrs,
      'data-surface': 'depth-section',
      'data-depth': depth,
      class: ['surface-hud depth-surface depth-section', classList],
    }

    switch (as) {
      case 'header':
        return (
          <header {...sharedProps}>
            <Slot />
          </header>
        )
      case 'article':
        return (
          <article {...sharedProps}>
            <Slot />
          </article>
        )
      case 'aside':
        return (
          <aside {...sharedProps}>
            <Slot />
          </aside>
        )
      case 'div':
        return (
          <div {...sharedProps}>
            <Slot />
          </div>
        )
      default:
        return (
          <section {...sharedProps}>
            <Slot />
          </section>
        )
    }
  }
)
