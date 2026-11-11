import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/json-ld'
import { EDITORIAL } from '@/config/site'
import type { Article } from '@/content/types'
import { routeTitle } from '@/lib/seo/routes'
import { articleSchema, type Crumb } from '@/lib/seo/schema'
import { Breadcrumbs } from './breadcrumbs'
import { CtaBanner } from './cta'
import { FaqSection } from './faq'
import { Byline } from './page-intro'

/**
 * Shared layout for guides, blog posts and pillar pages. The order is designed for answer engines:
 * H1 → byline with dates → direct answer → key takeaways → body → FAQ → sources → related.
 */
export function ArticleLayout({ article, path, crumbs, schemaType = 'Article' }: { article: Article; path: string; crumbs: Crumb[]; schemaType?: 'Article' | 'BlogPosting' }) {
  const { meta, Body } = article
  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <Breadcrumbs items={crumbs} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <header className="grid gap-4">
            <p className="text-[14px] font-semibold tracking-wide text-primary uppercase">{meta.category}</p>
            <h1 className="text-[32px] leading-[1.15] font-semibold tracking-tight text-navy sm:text-[40px]">{meta.title}</h1>
            <Byline author={EDITORIAL.author.name} updated={meta.updated} published={meta.published} readingMinutes={meta.readingMinutes} />
          </header>

          <section aria-label="Quick answer" className="mt-8 rounded-2xl border-l-4 border-primary bg-card p-5 sm:p-6">
            <h2 className="text-[13px] font-semibold tracking-wide text-primary uppercase">Quick answer</h2>
            <p className="mt-2 text-[18px] leading-relaxed text-navy">{meta.summary}</p>
          </section>

          {meta.keyTakeaways.length > 0 && (
            <section aria-labelledby="takeaways" className="mt-6 rounded-2xl bg-accent/60 p-5 sm:p-6">
              <h2 id="takeaways" className="text-[16px] font-semibold text-navy">
                Key takeaways
              </h2>
              <ul className="mt-3 grid gap-2 text-[16px]">
                {meta.keyTakeaways.map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <CheckCircle2 aria-hidden className="mt-1 size-4 shrink-0 text-primary" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-10">
            <Body />
          </div>

          {meta.faq && meta.faq.length > 0 && (
            <div className="mt-14">
              <FaqSection faqs={meta.faq} />
            </div>
          )}

          {meta.sources && meta.sources.length > 0 && (
            <section aria-labelledby="sources" className="mt-12">
              <h2 id="sources" className="text-xl font-semibold text-navy">
                Sources
              </h2>
              <ul className="mt-3 grid gap-1.5 text-[15px]">
                {meta.sources.map((s) => (
                  <li key={s.url + s.title}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                      {s.title}
                    </a>
                    <span className="text-muted-foreground">, {s.publisher}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[14px] text-muted-foreground">{EDITORIAL.reviewPolicy} This is general information, not personal financial advice.</p>
            </section>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 grid gap-6">
            {meta.toc && meta.toc.length > 0 && (
              <nav aria-label="On this page" className="rounded-xl border bg-card p-4">
                <h2 className="text-[14px] font-semibold text-navy">On this page</h2>
                <ol className="mt-2 grid gap-1.5 text-[14px]">
                  {meta.toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-muted-foreground hover:text-navy">
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <div className="rounded-xl border bg-card p-4">
              <p className="text-[14px] font-semibold text-navy">Plan your month in 2 minutes</p>
              <p className="mt-1 text-[14px] text-muted-foreground">See what’s left after every payment, with warnings before you overspend.</p>
              <Link href="/signup" prefetch={false} className="mt-3 inline-flex rounded-lg bg-primary px-3 py-2 text-[14px] font-medium text-white hover:bg-primary/90">
                Start free
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {meta.related.length > 0 && (
        <nav aria-labelledby="related" className="mt-14 border-t pt-10">
          <h2 id="related" className="text-xl font-semibold text-navy">
            Keep reading
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {meta.related.map((href) => (
              <li key={href}>
                <Link href={href} className="block h-full rounded-xl border bg-card p-4 text-[16px] font-medium text-navy transition-colors hover:border-primary/50 hover:bg-accent/40">
                  {routeTitle(href)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="mt-14">
        <CtaBanner />
      </div>

      <JsonLd
        data={articleSchema({
          type: schemaType,
          title: meta.title,
          description: meta.description,
          path,
          published: meta.published,
          updated: meta.updated,
          keywords: meta.keywords,
          section: meta.category,
          sources: meta.sources,
        })}
      />
    </article>
  )
}
