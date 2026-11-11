import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/marketing/breadcrumbs'
import { CtaBanner } from '@/components/marketing/cta'
import { FaqSection } from '@/components/marketing/faq'
import { Byline, PageIntro } from '@/components/marketing/page-intro'
import { JsonLd } from '@/components/seo/json-ld'
import { EDITORIAL } from '@/config/site'
import { CALCULATORS, getCalculator } from '@/content/calculators'
import { buildMetadata } from '@/lib/seo/metadata'
import { calculatorSchema } from '@/lib/seo/schema'

export const dynamicParams = false

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.meta.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCalculator((await params).slug)
  if (!c) return {}
  return buildMetadata({ title: c.meta.seoTitle, description: c.meta.description, path: `/calculators/${c.meta.slug}`, keywords: c.meta.keywords })
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCalculator((await params).slug)
  if (!c) notFound()
  const { meta, Widget, Body } = c
  const path = `/calculators/${meta.slug}`
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <Breadcrumbs items={[{ name: 'Free tools', path: '/calculators' }, { name: meta.name, path }]} />
      <div className="mt-6 grid gap-3">
        <PageIntro title={meta.title} lead={meta.summary} />
        <Byline author={EDITORIAL.author.name} updated={meta.updated} />
      </div>
      <div className="mt-8">
        <Widget />
      </div>
      <p className="mt-3 text-[13px] text-muted-foreground">Estimates only, based on the numbers you enter. Free to use, no account needed.</p>
      <div className="mt-12">
        <Body />
      </div>
      <div className="mt-14 max-w-3xl">
        <FaqSection faqs={meta.faq} />
      </div>
      <nav aria-labelledby="related" className="mt-14 border-t pt-10">
        <h2 id="related" className="text-xl font-semibold text-navy">
          Related
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {[...meta.related, ...CALCULATORS.filter((x) => x.meta.slug !== meta.slug).slice(0, 3).map((x) => ({ href: `/calculators/${x.meta.slug}`, label: x.meta.name }))].map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="block h-full rounded-xl border bg-card p-4 text-[16px] font-medium text-navy hover:border-primary/50 hover:bg-accent/40">
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-14">
        <CtaBanner />
      </div>
      <JsonLd data={calculatorSchema({ name: meta.name, description: meta.description, path })} />
    </div>
  )
}
