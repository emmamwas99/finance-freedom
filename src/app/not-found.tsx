import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { isAccountPath, SITE } from '@/config/site'

export const metadata: Metadata = { title: 'Page not found', robots: { index: false, follow: true } }

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/budgeting', label: 'Budgeting' },
  { href: '/calculators', label: 'Calculators' },
  { href: '/guides', label: 'Guides' },
  { href: '/app', label: 'Open the app' },
]

/** Real 404 status, with links back into the site so visitors and crawlers aren't stranded. */
export default function NotFound() {
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg text-center">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold text-navy">
          <Image src="/logo.svg" alt="" width={28} height={28} className="size-7 rounded-md" />
          {SITE.name}
        </Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-navy">We couldn’t find that page</h1>
        <p className="mt-3 text-[17px] text-muted-foreground">It may have moved, or the link may be wrong. Try one of these instead:</p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} prefetch={isAccountPath(l.href) ? false : undefined} className="inline-flex rounded-lg border bg-card px-4 py-2 text-[15px] text-navy hover:border-primary/50">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
