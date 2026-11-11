import type { ReactNode } from 'react'
import { JsonLd } from '@/components/seo/json-ld'
import { webPageSchema } from '@/lib/seo/schema'
import { Breadcrumbs } from './breadcrumbs'

export function LegalLayout({ title, path, description, updated, children }: { title: string; path: string; description: string; updated: string; children: ReactNode }) {
  const label = new Date(`${updated}T00:00:00Z`).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <Breadcrumbs items={[{ name: title, path }]} />
      {/* TODO before launch: fill the [bracketed] details, have a Kenyan lawyer review, then remove this notice. */}
      <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Template: replace the bracketed details and have a Kenyan lawyer review this page before you launch.</p>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-navy">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated <time dateTime={updated}>{label}</time>
      </p>
      <div className="mt-8 grid gap-6 text-[16px] leading-relaxed [&_a]:text-primary [&_a]:underline [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-navy [&_li]:ml-5 [&_li]:list-disc [&_ul]:grid [&_ul]:gap-1.5">{children}</div>
      <JsonLd data={webPageSchema({ title, description, path, updated })} />
    </div>
  )
}
