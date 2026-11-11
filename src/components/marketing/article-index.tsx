import Link from 'next/link'
import type { Article } from '@/content/types'

/** Card list of articles, grouped by category, newest updates first within each group. */
export function ArticleIndex({ articles, base }: { articles: Article[]; base: '/guides' | '/blog' }) {
  const groups = new Map<string, Article[]>()
  for (const a of [...articles].sort((x, y) => y.meta.updated.localeCompare(x.meta.updated))) {
    groups.set(a.meta.category, [...(groups.get(a.meta.category) ?? []), a])
  }
  return (
    <div className="grid gap-12">
      {[...groups].map(([category, list]) => (
        <section key={category} aria-labelledby={`cat-${category}`}>
          <h2 id={`cat-${category}`} className="text-xl font-semibold text-navy">
            {category}
          </h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {list.map(({ meta }) => (
              <li key={meta.slug}>
                <Link href={`${base}/${meta.slug}`} className="flex h-full flex-col gap-2 rounded-2xl border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-accent/40">
                  <span className="text-[18px] leading-snug font-semibold text-navy">{meta.title}</span>
                  <span className="text-[15px] leading-relaxed text-muted-foreground">{meta.description}</span>
                  <span className="mt-auto pt-2 text-[13px] text-muted-foreground">{meta.readingMinutes} min read</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
