import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbSchema, type Crumb } from '@/lib/seo/schema'

/** Visible breadcrumb trail plus matching BreadcrumbList JSON-LD (always from the same data). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: 'Home', path: '/' }, ...items]
  return (
    <>
      <nav aria-label="Breadcrumb" className="hidden text-[14px] text-muted-foreground md:block">
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((c, i) => {
            const last = i === all.length - 1
            return (
              <li key={c.path} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="text-navy">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.path} className="hover:text-navy hover:underline">
                    {c.name}
                  </Link>
                )}
                {!last && <ChevronRight aria-hidden className="size-3.5" />}
              </li>
            )
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all)} />
    </>
  )
}
