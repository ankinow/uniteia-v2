import { component$ } from '@builder.io/qwik'
import type { SchemaType } from '~/types/schema-org'

export interface JSONLDProps {
  data: SchemaType
}

/**
 * JSON-LD Structured Data Component
 * Renders schema.org structured data as a script tag
 */
export const JSONLD = component$<JSONLDProps>(({ data }) => {
  const json = JSON.stringify(data, null, 2)

  // biome-ignore lint/security/noDangerouslySetInnerHtml: Needed for JSON-LD
  return <script type="application/ld+json" dangerouslySetInnerHTML={json} />
})
