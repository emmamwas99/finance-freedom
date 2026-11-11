import { JsonLd } from '@/components/seo/json-ld'
import { faqSchema, type Faq } from '@/lib/seo/schema'

/**
 * Visible FAQ (native <details>, no JavaScript) with FAQPage JSON-LD generated from the same data.
 * Answers are in the HTML whether expanded or not, so crawlers and answer engines can read them.
 */
export function FaqSection({ faqs, title = 'Frequently asked questions', id = 'faq', schema = true }: { faqs: Faq[]; title?: string; id?: string; schema?: boolean }) {
  if (!faqs.length) return null
  return (
    <section aria-labelledby={`${id}-title`} className="scroll-mt-24" id={id}>
      <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-tight text-navy">
        {title}
      </h2>
      <div className="mt-5 divide-y rounded-xl border bg-card">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium text-navy [&::-webkit-details-marker]:hidden">
              <h3 className="text-[16px] font-medium">{f.q}</h3>
              <span aria-hidden className="text-xl text-muted-foreground transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
      {schema && <JsonLd data={faqSchema(faqs)} />}
    </section>
  )
}
