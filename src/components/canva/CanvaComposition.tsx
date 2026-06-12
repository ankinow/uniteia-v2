/**
 * CanvaComposition — PLANO-04 v0.6 wire (stub)
 *
 * SSG-resolved canva visual that renders ABOVE StoryboardGrid.
 * Currently a stub: returns empty fragment until the canva pipeline
 * (getCanvaComposition, canva i18n, scene-type resolver) is wired.
 */
import { component$ } from '@builder.io/qwik'

export interface CanvaCompositionProps {
  refs: string[]
  lang: string
  sceneType: string
}

export const CanvaComposition = component$<CanvaCompositionProps>(
  ({ refs: _refs, lang: _lang, sceneType: _sceneType }) => {
    // Stub: renders nothing. Wire PLANO-04 pipeline here.
    return null
  }
)
