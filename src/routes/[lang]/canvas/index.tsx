import { component$ } from '@builder.io/qwik'
import { CanvasIsland } from '~/components/canvas/CanvasIsland'

export default component$(() => {
  return (
    <div class="canvas-page">
      <div class="canvas-fallback">
        <h1>UniTeia Visual Canvas</h1>
        <p>
          Interactive whiteboard powered by tldraw. Drag shapes, zoom, pan, edit. Loading the canvas
          below — this static shell renders in all 8 languages.
        </p>
      </div>
      <CanvasIsland client:visible />
    </div>
  )
})
