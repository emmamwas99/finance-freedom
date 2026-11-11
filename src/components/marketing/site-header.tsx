'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { MAIN_NAV, SITE } from '@/config/site'
import { cn } from '@/lib/utils'
import { MobileNav } from './mobile-nav'

function backFallback(path: string) {
  if (path.startsWith('/blog/')) return '/blog'
  if (path.startsWith('/guides/')) return '/guides'
  if (path.startsWith('/calculators/')) return '/calculators'
  if (path === '/financial-health') return '/calculators'
  if (['/blog', '/guides', '/glossary', '/budgeting', '/personal-finance', '/debt-management', '/saving-money', '/financial-freedom'].includes(path)) return '/learn'
  return '/'
}

export function SiteHeader() {
  const path = usePathname()
  const router = useRouter()
  const [pastHero, setPastHero] = useState(false)
  const [hasClientNavigation, setHasClientNavigation] = useState(false)
  const lastPath = useRef(path)

  useEffect(() => {
    if (lastPath.current !== path) {
      setHasClientNavigation(true)
      lastPath.current = path
    }
  }, [path])

  useEffect(() => {
    if (path !== '/') return
    const hero = document.querySelector('.finfe-hero')
    if (!hero) return
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: '-64px 0px 0px 0px' },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [path])

  const navy = path !== '/' || pastHero

  return (
    <>
      <header className={cn('sticky top-0 z-40 border-b', path !== '/' && 'hidden md:block', navy ? 'border-white/10 bg-navy text-white' : 'finfe-header-light border-[#e4eef7] text-navy')}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-[17px] font-semibold" aria-label={`${SITE.name} home`}>
            <Image src={navy ? '/logo-inverse.svg' : '/logo.svg'} alt="" width={28} height={28} className="size-7 rounded-md" priority />
            {SITE.name}
          </Link>
          <nav aria-label="Main" className={cn('hidden items-center gap-6 text-[15px] md:flex', navy ? 'text-white/85' : 'text-navy/80')}>
            {MAIN_NAV.map((it) => (
              <Link key={it.href} href={it.href} className={navy ? 'hover:text-white' : 'hover:text-primary'}>
                {it.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/login" prefetch={false} className={cn('rounded-lg px-3 py-2 text-[15px]', navy ? 'text-white/90 hover:bg-white/10' : 'text-navy hover:bg-navy/5')}>
              Log in
            </Link>
            <Link href="/signup" prefetch={false} className="rounded-lg bg-primary px-4 py-2 text-[15px] font-medium text-white hover:bg-primary/90">
              Start free
            </Link>
          </div>
          <Link href="/signup" prefetch={false} className="inline-flex min-h-9 items-center rounded-full bg-primary px-4 text-[13px] font-medium text-white hover:bg-primary/90 md:hidden">
            Start free
          </Link>
        </div>
      </header>
      {path !== '/' && (
        <header className="finfe-header-light sticky top-0 z-40 border-b border-[#e4eef7] text-navy md:hidden">
          <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
            <Link
              href={backFallback(path)}
              onClick={(event) => {
                if (hasClientNavigation && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                  event.preventDefault()
                  router.back()
                }
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Go back"
            >
              <ArrowLeft aria-hidden className="size-5" />
              Back
            </Link>
          </div>
        </header>
      )}
      <MobileNav />
    </>
  )
}
