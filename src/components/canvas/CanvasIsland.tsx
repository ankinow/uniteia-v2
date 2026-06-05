import { component$ } from '@builder.io/qwik'

interface CanvasIslandProps {
  template?: string
  lang?: string
  // Qwik City hydration directives (client:visible, client:load, etc.)
  [key: `client:${string}`]: boolean
}

export const CanvasIsland = component$<CanvasIslandProps>(({ template = '01', lang = 'en' }) => {
  return (
    <iframe
      src={`/canvas-react/index.html?template=${template}&lang=${lang}`}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="UniTeia Visual Canvas"
    />
  )
})
