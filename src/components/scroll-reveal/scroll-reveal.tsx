/**
 * ScrollReveal — IntersectionObserver stagger reveal with configurable transforms.
 *
 * Wraps children and reveals them one by one as they enter the viewport.
 * Each child gets a staggered delay. Configurable direction, threshold,
 * root margin, and animation variant.
 *
 * Uses the animate-stagger CSS classes defined in aether-assets-animations.css
 */

import { Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { isServer } from '@builder.io/qwik/build'

export type StaggerDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

export interface ScrollRevealProps {
  class?: string
  direction?: StaggerDirection
  threshold?: number
  rootMargin?: string
  staggerDelay?: number // ms between each child reveal, default 100
  duration?: number // transition duration ms, default 500
  once?: boolean // only animate once, default true
  as?: 'div' | 'section' | 'article' | 'ul' | 'ol'
}

export const ScrollReveal = component$<ScrollRevealProps>(props => {
  const {
    class: classList,
    direction = 'up',
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    staggerDelay = 100,
    duration = 500,
    once = true,
    as: Tag = 'div',
  } = props

  const containerRef = useSignal<HTMLElement>()
  const visibleItems = useSignal<Set<number>>(new Set())

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    if (isServer) return

    const container = containerRef.value
    if (!container) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      // Reveal all immediately
      const children = container.children
      for (let i = 0; i < children.length; i++) {
        ;(children[i] as HTMLElement).style.opacity = '1'
        ;(children[i] as HTMLElement).style.transform = 'none'
      }
      return
    }

    // Prepare children with initial state - filter to HTMLElement only
    const children = Array.from(container.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement
    )
    for (const child of children) {
      child.style.opacity = '0'
      child.style.transition = `opacity ${duration}ms cubic-bezier(0.25, 0.8, 0.25, 1), transform ${duration}ms cubic-bezier(0.25, 0.8, 0.25, 1)`

      switch (direction) {
        case 'up':
          child.style.transform = 'translateY(24px)'
          break
        case 'down':
          child.style.transform = 'translateY(-24px)'
          break
        case 'left':
          child.style.transform = 'translateX(24px)'
          break
        case 'right':
          child.style.transform = 'translateX(-24px)'
          break
        case 'scale':
          child.style.transform = 'scale(0.95)'
          break
        case 'fade':
          child.style.transform = 'none'
          break
      }
    }

    const revealChild = (index: number) => {
      if (visibleItems.value.has(index)) return
      visibleItems.value = new Set([...visibleItems.value, index])

      const child = children[index]
      if (child) {
        child.style.opacity = '1'
        child.style.transform = 'none'
      }
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            if (!once) {
              // Hide element again when it scrolls out of view
              const idx = children.indexOf(entry.target as HTMLElement)
              if (idx >= 0) {
                const child = children[idx]
                if (!child) return
                child.style.opacity = '0'
                switch (direction) {
                  case 'up':
                    child.style.transform = 'translateY(24px)'
                    break
                  case 'down':
                    child.style.transform = 'translateY(-24px)'
                    break
                  case 'left':
                    child.style.transform = 'translateX(24px)'
                    break
                  case 'right':
                    child.style.transform = 'translateX(-24px)'
                    break
                  case 'scale':
                    child.style.transform = 'scale(0.95)'
                    break
                  case 'fade':
                    child.style.transform = 'none'
                    break
                }
              }
            }
            continue
          }

          const idx = children.indexOf(entry.target as HTMLElement)
          if (idx < 0) continue

          // Reveal with stagger delay
          setTimeout(() => revealChild(idx), idx * staggerDelay)

          if (once) {
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold, rootMargin: rootMargin }
    )

    for (const child of children) {
      observer.observe(child)
    }

    cleanup(() => {
      observer.disconnect()
    })
  })

  return (
    <Tag ref={containerRef} class={['scroll-reveal', classList]}>
      <Slot />
    </Tag>
  )
})
