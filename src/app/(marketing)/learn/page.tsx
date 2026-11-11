import { BookA, BookOpen, Calculator, HeartPulse, Newspaper } from 'lucide-react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/marketing/breadcrumbs'
import { CtaBanner } from '@/components/marketing/cta'
import { PageIntro } from '@/components/marketing/page-intro'
import { LinkList, Showcase } from '@/components/marketing/showcase'
import { JsonLd } from '@/components/seo/json-ld'
import { POSTS } from '@/content/blog'
import { GUIDES } from '@/content/guides'
import { TOPICS } from '@/content/topics'
import { buildMetadata } from '@/lib/seo/metadata'
import { PAGES } from '@/lib/seo/pages'
import { routeTitle } from '@/lib/seo/routes'
import { itemListSchema, webPageSchema } from '@/lib/seo/schema'

const page = PAGES.learn
export const metadata = buildMetadata(page)

const articlesFor = (categories: string[]) => [
  ...GUIDES.filter((g) => categories.includes(g.meta.category)).map((g) => ({ href: `/guides/${g.meta.slug}`, title: g.meta.title, kind: 'Guide' })),
  ...POSTS.filter((p) => categories.includes(p.meta.category)).map((p) => ({ href: `/blog/${p.meta.slug}`, title: p.meta.title, kind: 'Article' })),
]

export default function LearnPage() {
  const all = TOPICS.flatMap((t) => [t.hub, ...articlesFor(t.categories).map((a) => a.href)])
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <Breadcrumbs items={[{ name: 'Learn', path: page.path }]} />
      <div className="mt-6">
        <PageIntro
          title="Financial education hub"
          lead="Practical, free personal finance education for salaried Kenyans, organised around five questions: budgeting, expenses, debt, saving and financial independence. Each topic has a plain-English overview, step-by-step guides, and free tools that answer the question with your own numbers."
        />
      </div>

      <nav aria-label="Topics" className="mt-8 flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <a key={t.id} href={`#${t.id}`} className="rounded-full border bg-card px-4 py-1.5 text-[15px] text-navy hover:border-primary/50">
            {t.title}
          </a>
        ))}
      </nav>

      <section aria-labelledby="start" className="mt-10 rounded-2xl bg-navy p-6 text-white sm:p-8">
        <h2 id="start" className="text-xl font-semibold">
          New to managing money? Start here
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { href: '/personal-finance', title: 'Personal finance basics', text: 'The order of priorities, from your first budget to investing.' },
            { href: '/financial-health', title: 'Financial health check', text: 'Score seven money habits in two minutes.' },
            { href: '/glossary', title: 'Money glossary', text: 'Plain-English definitions, with Kenyan examples.' },
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block h-full rounded-xl bg-white/10 p-4 transition-colors hover:bg-white/15">
                <span className="block font-semibold">{l.title}</span>
                <span className="mt-1 block text-[14px] text-white/85">{l.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-20 grid gap-24 lg:gap-32">
        {TOPICS.map((t, i) => {
          const articles = articlesFor(t.categories)
          const tools = [...new Set([...t.tools, '/financial-health', '/glossary'])].slice(0, 3)
          return (
            <div key={t.id} id={t.id} className="scroll-mt-24">
              <Showcase
                id={`${t.id}-title`}
                as="h2"
                reverse={i % 2 === 1}
                accent={t.accent}
                title={t.headline}
                subtitle={t.question}
                visual={<LinkList title={`${t.title}: guides and articles`} items={articles.map((a) => ({ href: a.href, label: a.title, icon: a.kind === 'Guide' ? BookOpen : Newspaper, note: a.kind }))} />}
                tiles={tools.map((href) => ({ href, label: routeTitle(href), icon: href.startsWith('/calculators') ? Calculator : href === '/glossary' ? BookA : HeartPulse }))}
                cta={{ href: t.hub, label: `Read the ${t.title.toLowerCase()} overview` }}
              >
                {t.intro}
              </Showcase>
            </div>
          )
        })}
      </div>

      <p className="mt-14 max-w-3xl text-[14px] text-muted-foreground">
        Everything here is general education, written in plain language with Kenyan examples, not personal financial advice. We show our formulas and sources, and update guides when rules or products change. <Link href="/about#editorial" className="text-primary underline underline-offset-2">How we write our guides</Link>.
      </p>
      <div className="mt-10">
        <CtaBanner />
      </div>
      <JsonLd data={[webPageSchema({ type: 'CollectionPage', title: page.title, description: page.description, path: page.path, updated: page.updated }), itemListSchema('Financial education topics', [...new Set(all)].map((path) => ({ name: routeTitle(path), path })))]} />
    </div>
  )
}
