import { component$ } from '@builder.io/qwik'
import { CanvaMagicaOverview } from '~/components/canva/CanvaMagicaOverview'
import { CanvasIsland } from '~/components/canvas/CanvasIsland'
import { getBuildLocale } from '~/utils/build-locale'

export const onStaticGenerate = () => {
  const lang = getBuildLocale()
  return {
    params: [{ lang }],
  }
}

export default component$(() => {
  return (
    <div class="canvas-page">
      <div class="canvas-fallback">
        <CanvaMagicaOverview />
      </div>
      <CanvasIsland client:visible />
    </div>
  )
})
