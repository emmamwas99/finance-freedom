import Link from 'next/link'
import { Breadcrumbs } from '@/components/marketing/breadcrumbs'
import { PageIntro } from '@/components/marketing/page-intro'
import { JsonLd } from '@/components/seo/json-ld'
import { GLOSSARY } from '@/content/glossary'
import { buildMetadata } from '@/lib/seo/metadata'
import { PAGES } from '@/lib/seo/pages'
import { definedTermSetSchema, webPageSchema } from '@/lib/seo/schema'

const page = PAGES.glossary
export const metadata = buildMetadata(page)

const letterOf = (term: string) => (/^[0-9]/.test(term) ? '#' : term[0].toUpperCase())

export default function GlossaryPage() {
  const letters = [...new Set(GLOSSARY.map((t) => letterOf(t.term)))]
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <Breadcrumbs items={[{ name: 'Glossary', path: page.path }]} />
      <div className="mt-6">
        <PageIntro title="Money glossary" lead="Plain-English definitions of the budgeting, saving, debt and investing terms you’ll meet in our guides and calculators, with Kenyan examples. Each term has its own link you can share." />
      </div>
      <nav aria-label="Jump to letter" className="mt-8 flex flex-wrap gap-1.5">
        {letters.map((l) => (
          <a key={l} href={`#letter-${l === '#' ? 'num' : l}`} className="flex size-9 items-center justify-center rounded-md border bg-card text-[15px] font-medium text-navy hover:border-primary/50">
            {l}
          </a>
        ))}
      </nav>
      <dl className="mt-10 grid gap-4">
        {GLOSSARY.map((t, i) => {
          const l = letterOf(t.term)
          const first = i === 0 || letterOf(GLOSSARY[i - 1].term) !== l
          return (
            <div key={t.slug} id={t.slug} className="scroll-mt-24 rounded-xl border bg-card p-5">
              {first && <span id={`letter-${l === '#' ? 'num' : l}`} className="block scroll-mt-24" />}
              <dt>
                <h2 className="text-[19px] font-semibold text-navy">
                  <dfn className="not-italic">{t.term}</dfn>
                </h2>
              </dt>
              <dd className="mt-2 grid gap-2 text-[16px] leading-relaxed">
                <p>{t.definition}</p>
                {t.detail && <p className="text-muted-foreground">{t.detail}</p>}
                {t.related && t.related.length > 0 && (
                  <p className="flex flex-wrap gap-x-4 gap-y-1 text-[15px]">
                    {t.related.map((r) => (
                      <Link key={r.href} href={r.href} className="text-primary underline underline-offset-2">
                        {r.label}
                      </Link>
                    ))}
                  </p>
                )}
              </dd>
            </div>
          )
        })}
      </dl>
      <JsonLd
        data={[
          webPageSchema({ title: page.title, description: page.description, path: page.path, updated: page.updated }),
          definedTermSetSchema('Finfe money glossary', page.path, GLOSSARY.map((t) => ({ slug: t.slug, term: t.term, definition: t.definition }))),
        ]}
      />
    </div>
  )
}
