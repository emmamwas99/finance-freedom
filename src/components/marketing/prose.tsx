/**
 * Building blocks for long-form content. All Server Components: zero client JavaScript.
 * Content files compose these inside <Prose>.
 */
import { AlertTriangle, ExternalLink as ExternalIcon, Info, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { isAccountPath } from '@/config/site'
import { cn } from '@/lib/utils'

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('prose-ff', className)}>{children}</div>
}

/** Internal link (client-side navigation, prefetched). */
export function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} prefetch={isAccountPath(href) ? false : undefined}>
      {children}
    </Link>
  )
}

/** Citation to an outside source. Opens in a new tab; trusted sources are followed (no nofollow). */
export function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ExternalIcon aria-hidden className="ml-0.5 inline size-3.5 align-baseline" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

const tones = {
  info: { icon: Info, cls: 'border-sky-100 bg-accent text-navy' },
  tip: { icon: Lightbulb, cls: 'border-sky-100 bg-accent text-navy' },
  warn: { icon: AlertTriangle, cls: 'border-amber-200 bg-amber-50 text-amber-950' },
}

export function Callout({ tone = 'info', title, children }: { tone?: keyof typeof tones; title?: string; children: ReactNode }) {
  const t = tones[tone]
  const Icon = t.icon
  return (
    <aside className={cn('not-prose flex gap-3 rounded-xl border p-4 text-[15px] leading-relaxed', t.cls)}>
      <Icon aria-hidden className="mt-1 size-4 shrink-0" />
      <div className="grid gap-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="[&_a]:underline [&>p+p]:mt-2">{children}</div>
      </div>
    </aside>
  )
}

/** A worked example with real-looking KSh numbers. Clearly labelled as an illustration. */
export function Example({ title = 'Worked example', children }: { title?: string; children: ReactNode }) {
  return (
    <figure className="rounded-xl border bg-card p-5 text-[16px]">
      <figcaption className="mb-2 text-[13px] font-semibold tracking-wide text-primary uppercase">{title}</figcaption>
      <div className="grid gap-2 [&_table]:mt-1">{children}</div>
    </figure>
  )
}

/** A formula, shown in a readable monospace block with an accessible label. */
export function Formula({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="math" aria-label={label} className="rounded-lg border border-dashed border-primary/40 bg-accent/60 px-4 py-3 font-mono text-[15px] text-navy">
      {children}
    </div>
  )
}

/** Numbered steps for "how to" content. */
export function Steps({ items }: { items: { title: string; body: ReactNode }[] }) {
  return (
    <ol className="grid gap-4 !pl-0 !list-none">
      {items.map((s, i) => (
        <li key={s.title} className="flex gap-4">
          <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy text-[15px] font-semibold text-white">
            {i + 1}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-navy">{s.title}</p>
            <div className="mt-1 text-[16px] leading-relaxed">{s.body}</div>
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Responsive table wrapper that scrolls sideways on small screens instead of the whole page. */
export function Table({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="region" aria-label={caption ?? 'Table'} tabIndex={0}>
      <table>
        {caption && <caption>{caption}</caption>}
        {children}
      </table>
    </div>
  )
}

/** Definition list item used for inline term definitions. */
export function Definition({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border-l-4 border-primary bg-card px-4 py-3">
      <dfn className="font-semibold text-navy not-italic">{term}</dfn>
      <span className="text-muted-foreground">: </span>
      {children}
    </div>
  )
}

/** Grid of internal links with a short description each, for hub pages and "next steps". */
export function LinkGrid({ items }: { items: { href: string; title: string; text: string }[] }) {
  return (
    <ul className="not-prose grid gap-3 !pl-0 !list-none sm:grid-cols-2">
      {items.map((it) => (
        <li key={it.href} className="!mt-0">
          <Link href={it.href} prefetch={isAccountPath(it.href) ? false : undefined} className="block h-full rounded-xl border bg-card p-4 !no-underline transition-colors hover:border-primary/50 hover:bg-accent/40">
            <span className="block text-[16px] font-semibold text-navy">{it.title}</span>
            <span className="mt-1 block text-[15px] leading-relaxed text-muted-foreground">{it.text}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
