import { component$ } from '@builder.io/qwik'
import { CanvaMagicaOverview } from '~/components/canva/CanvaMagicaOverview'
import { CanvasIsland } from '~/components/canvas/CanvasIsland'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'

export const onStaticGenerate = () => {
  return {
    params: SUPPORTED_LANGUAGES.map(lang => ({
      lang: lang.code,
    })),
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
