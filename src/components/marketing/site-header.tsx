import Image from 'next/image'
import Link from 'next/link'
import { MAIN_NAV, SITE } from '@/config/site'
import { MobileNav } from './mobile-nav'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy text-white">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-[17px] font-semibold" aria-label={`${SITE.name} home`}>
          <Image src="/logo-inverse.svg" alt="" width={28} height={28} className="size-7 rounded-md" priority />
          {SITE.name}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 text-[15px] text-white/85 md:flex">
          {MAIN_NAV.map((it) => (
            <Link key={it.href} href={it.href} className="hover:text-white">
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" prefetch={false} className="rounded-lg px-3 py-2 text-[15px] text-white/90 hover:bg-white/10">
            Log in
          </Link>
          <Link href="/signup" prefetch={false} className="rounded-lg bg-primary px-4 py-2 text-[15px] font-medium text-white hover:bg-primary/90">
            Start free
          </Link>
        </div>
        <MobileNav items={MAIN_NAV} />
      </div>
    </header>
  )
}
