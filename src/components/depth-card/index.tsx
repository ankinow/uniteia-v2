import { Slot, component$ } from '@builder.io/qwik'
import type { DepthSurfaceProps } from '~/components/depth/types'

export const DepthCard = component$<DepthSurfaceProps>(
  ({ as = 'div', depth, class: classList, ...attrs }) => {
    const sharedProps = {
      ...attrs,
      'data-surface': 'depth-card',
      'data-depth': depth,
      class: ['surface-hud depth-surface depth-card', classList],
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
      case 'section':
        return (
          <section {...sharedProps}>
            <Slot />
          </section>
        )
      default:
        return (
          <div {...sharedProps}>
            <Slot />
          </div>
        )
    }
  }
)
