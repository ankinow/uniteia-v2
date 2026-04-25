import { component$ } from '@builder.io/qwik'
import { useDocumentHead } from '@builder.io/qwik-city'

export const RouterHead = component$(() => {
  const head = useDocumentHead()

  return (
    <>
      <title>{head.title}</title>

      {head.meta.map((meta) => (
        <meta key={JSON.stringify(meta)} {...meta} />
      ))}

      {head.links.map((link) => (
        <link key={JSON.stringify(link)} {...link} />
      ))}

      {head.styles.map((style) => (
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Qwik head styles are controlled by route metadata
        <style key={JSON.stringify(style.props)} {...style.props} dangerouslySetInnerHTML={style.style} />
      ))}

      {head.scripts.map((script) => (
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Qwik head scripts are controlled by route metadata
        <script key={JSON.stringify(script.props)} {...script.props} dangerouslySetInnerHTML={script.script} />
      ))}
    </>
  )
})
