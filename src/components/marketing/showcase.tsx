/**
 * Feature showcase: an illustrated panel (soft glow, dotted orbit, floating chips) with three icon
 * tiles underneath, next to a two-tone heading, subheading, copy and a pill CTA. Rows alternate
 * sides. Server Components only: the illustrations are HTML/SVG, so they cost no JavaScript.
 */
import { ArrowRight, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { isAccountPath } from '@/config/site'
import { cn } from '@/lib/utils'

export interface ShowcaseTile {
  icon: LucideIcon
  label: string
  /** Optional link (e.g. a free tool). */
  href?: string
}

/** Gradient accent word: #1470a8 → #1e8fd0, both ≥3.5:1 on white (large text, WCAG AA). */
export function Accent({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('bg-gradient-to-r from-[#1470a8] to-[#1e8fd0] bg-clip-text text-transparent', className)}>{children}</span>
}

export function Showcase({
  id,
  accent,
  title,
  subtitle,
  children,
  cta,
  visual,
  tiles,
  reverse = false,
  as: H = 'h3',
}: {
  id: string
  accent: string
  title: string
  subtitle: string
  children: ReactNode
  cta: { href: string; label: string }
  visual: ReactNode
  tiles: ShowcaseTile[]
  reverse?: boolean
  as?: 'h2' | 'h3'
}) {
  return (
    <section aria-labelledby={id} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Text first in the HTML (reading order, mobile); the visual swaps sides on desktop */}
      <div className={cn('min-w-0 max-w-xl', reverse ? 'lg:order-1' : 'lg:order-2 lg:justify-self-end')}>
        <H id={id} className="text-[40px] leading-[1.08] font-semibold tracking-tight sm:text-[52px]">
          <Accent className="block pb-1">{accent}</Accent>
          <span className="block text-navy">{title}</span>
        </H>
        <p className="mt-5 text-[20px] leading-snug text-foreground sm:text-[23px]">{subtitle}</p>
        <div className="mt-4 text-[17px] leading-[1.75] text-muted-foreground">{children}</div>
        <Link
          href={cta.href}
          prefetch={isAccountPath(cta.href) ? false : undefined}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[15px] font-medium text-navy transition-colors hover:bg-[#d6eaf6]"
        >
          {cta.label} <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
      <div className={cn('min-w-0', reverse ? 'lg:order-2' : 'lg:order-1')}>
        <ShowcasePanel tiles={tiles}>{visual}</ShowcasePanel>
      </div>
    </section>
  )
}

/** The framed illustration with its three tiles. */
export function ShowcasePanel({ children, tiles }: { children: ReactNode; tiles: ShowcaseTile[] }) {
  return (
    <div className="rounded-[28px] border border-border/80 bg-[#f7f9fc] p-2.5 sm:p-3.5">
      <div className="relative overflow-hidden rounded-[22px] border border-border/80 bg-white">{children}</div>
      <ul className="mt-2.5 grid grid-cols-3 gap-2.5 sm:mt-3.5 sm:gap-3.5">
        {tiles.map((t) => {
          const inner = (
            <>
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-primary sm:size-9">
                <t.icon aria-hidden className="size-4" />
              </span>
              <span className="mt-3 block text-[13px] leading-snug font-medium text-navy sm:mt-4 sm:text-[15px]">{t.label}</span>
            </>
          )
          return (
            <li key={t.label} className="min-w-0">
              {t.href ? (
                <Link href={t.href} className="block h-full rounded-2xl border border-border/80 bg-white p-3 transition-colors hover:border-primary/40 sm:p-4">
                  {inner}
                </Link>
              ) : (
                <div className="h-full rounded-2xl border border-border/80 bg-white p-3 sm:p-4">{inner}</div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * The illustration stage: soft radial glow and a dotted orbit. Everything inside is decorative,
 * so the stage is one image to assistive technology, described by `label`.
 */
export function Stage({ label, children, brand = false }: { label: string; children: ReactNode; brand?: boolean }) {
  return (
    <div role="img" aria-label={label} className="relative aspect-[6/5] w-full select-none sm:aspect-[5/4]">
      <div aria-hidden className="absolute top-1/2 left-1/2 aspect-square h-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#e3f0f9_0%,#eef6fb_42%,rgba(255,255,255,0)_70%)]" />
      <div aria-hidden className="absolute top-1/2 left-1/2 aspect-square h-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#c6dbea]" />
      {brand && (
        <span aria-hidden className="absolute top-[4%] left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border/80 bg-white py-1 pr-3 pl-1 text-[14px] font-semibold tracking-tight text-navy shadow-[0_2px_8px_rgba(10,60,110,0.08)]">
          <Image src="/logo.svg" alt="" width={22} height={22} className="size-[22px] rounded-md" />
          finfe
        </span>
      )}
      <div aria-hidden className="absolute inset-0">
        {children}
      </div>
    </div>
  )
}

/** A floating label chip on the orbit. Position it with absolute classes. */
export function Chip({ icon: Icon, children, className, tone = 'default' }: { icon?: LucideIcon; children: ReactNode; className?: string; tone?: 'default' | 'warn' | 'good' }) {
  return (
    <span
      className={cn(
        'absolute z-10 flex items-center gap-1.5 rounded-lg border bg-white px-2 py-1 text-[11px] font-medium whitespace-nowrap text-navy shadow-[0_2px_8px_rgba(10,60,110,0.08)] sm:px-2.5 sm:py-1.5 sm:text-[13px]',
        tone === 'warn' && 'border-amber-200 bg-amber-50 text-amber-900',
        tone === 'good' && 'border-sky-100',
        className,
      )}
    >
      {Icon && <Icon className={cn('size-3.5', tone === 'warn' ? 'text-amber-600' : 'text-primary')} />}
      {children}
    </span>
  )
}

/** A dashed connector line between a chip and the centre (horizontal). */
export function Connector({ className }: { className?: string }) {
  return <span className={cn('absolute h-0 border-t-2 border-dotted border-[#b9d3e6]', className)} />
}

/** A list of links shown inside the framed panel (used where the "visual" is navigation). */
export function LinkList({ title, items }: { title: string; items: { href: string; label: string; icon: LucideIcon; note?: string }[] }) {
  return (
    <div className="p-4 sm:p-6">
      <p className="text-[13px] font-semibold tracking-wide text-primary uppercase">{title}</p>
      <ul className="mt-3 divide-y divide-border/70">
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href} className="group flex items-center gap-3 py-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                <it.icon aria-hidden className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] leading-snug font-medium text-navy group-hover:text-primary sm:text-[16px]">{it.label}</span>
                {it.note && <span className="mt-0.5 block text-[13px] text-muted-foreground">{it.note}</span>}
              </span>
              <ArrowRight aria-hidden className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
