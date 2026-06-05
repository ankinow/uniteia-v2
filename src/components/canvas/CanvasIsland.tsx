import { component$, useVisibleTask$ } from '@builder.io/qwik'

interface CanvasIslandProps {
  template?: string
  lang?: string
}

export const CanvasIsland = component$<CanvasIslandProps>(({ template = '01', lang = 'en' }) => {
  // biome-ignore lint/correctness/useQwikUseVisibleTask: dynamic React island mount requires DOM
  useVisibleTask$(() => {
    // Dynamic import of React module
    void import('../../canvas-react/CanvasIslandReact').then(
      ({ mountCanvas }: { mountCanvas: (c: HTMLElement, t: string, l: string) => void }) => {
        const container = document.getElementById('tldraw-canvas-container')
        if (container) {
          mountCanvas(container, template, lang)
        }
      }
    )
  })

  return (
    <div
      id="tldraw-canvas-container"
      class="canvas-island"
      style={{ width: '100%', height: '100vh' }}
    />
  )
})
