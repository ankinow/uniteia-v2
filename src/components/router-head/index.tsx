import { component$ } from '@builder.io/qwik'
import { useDocumentHead } from '@builder.io/qwik-city'

export const RouterHead = component$(() => {
  const head = useDocumentHead()

  return (
    <>
      <title>{head.title}</title>

      {head.meta.map(meta => (
        <meta key={JSON.stringify(meta)} {...meta} />
      ))}

      {head.links.map(link => (
        <link key={JSON.stringify(link)} {...link} />
      ))}
    </>
  )
})
