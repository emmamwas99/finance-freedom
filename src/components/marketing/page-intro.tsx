import Link from 'next/link'
import type { ReactNode } from 'react'

/** Page heading block for public pages: H1 plus a direct answer paragraph (AEO). */
export function PageIntro({ title, lead, children }: { title: string; lead?: ReactNode; children?: ReactNode }) {
  return (
    <div className="grid gap-4">
      <h1 className="text-[32px] leading-[1.15] font-semibold tracking-tight text-navy sm:text-[40px]">{title}</h1>
      {lead && <p className="max-w-3xl text-[18px] leading-relaxed text-muted-foreground">{lead}</p>}
      {children}
    </div>
  )
}

export function Byline({ updated, published, readingMinutes, author }: { updated: string; published?: string; readingMinutes?: number; author: string }) {
  const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-muted-foreground">
      <span>
        By{' '}
        <Link href="/about" className="font-medium text-navy hover:underline">
          {author}
        </Link>
      </span>
      <span aria-hidden>·</span>
      <span>
        Updated <time dateTime={updated}>{fmt(updated)}</time>
      </span>
      {published && published !== updated && (
        <>
          <span aria-hidden>·</span>
          <span>
            Published <time dateTime={published}>{fmt(published)}</time>
          </span>
        </>
      )}
      {readingMinutes ? (
        <>
          <span aria-hidden>·</span>
          <span>{readingMinutes} min read</span>
        </>
      ) : null}
    </p>
  )
}
