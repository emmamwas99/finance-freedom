import type { JsonLd as JsonLdData } from '@/lib/seo/schema'

/**
 * Renders JSON-LD in the server HTML. `<` is escaped so no string inside the data can close the
 * script tag (XSS-safe), as recommended in the Next.js JSON-LD guide.
 */
export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  const items = Array.isArray(data) ? data : [data]
  return (
    <>
      {items.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }} />
      ))}
    </>
  )
}
