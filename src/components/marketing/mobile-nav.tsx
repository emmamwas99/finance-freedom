'use client'

import { BookOpen, Calculator, CircleUserRound, House, Tags } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/', label: 'Home', icon: House },
  { href: '/calculators', label: 'Tools', icon: Calculator },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/pricing', label: 'Pricing', icon: Tags },
  { href: '/login', label: 'Account', icon: CircleUserRound },
]

function selected(path: string, href: string) {
  if (href === '/') return path === '/'
  if (href === '/calculators') return path.startsWith('/calculators') || path === '/financial-health'
  if (href === '/learn') return ['/learn', '/guides', '/blog', '/glossary', '/budgeting', '/personal-finance', '/debt-management', '/saving-money', '/financial-freedom'].some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
  return path === href
}

/** Fixed navigation for public pages on phones; account pages have their own layout. */
export function MobileNav() {
  const path = usePathname()
  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-navy/10 bg-white/95 pb-safe shadow-[0_-8px_28px_rgba(10,60,110,0.08)] backdrop-blur-xl md:hidden print:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 px-1.5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = selected(path, href)
          return (
            <Link
              key={href}
              href={href}
              prefetch={href === '/login' ? false : undefined}
              aria-current={active ? 'page' : undefined}
              className={cn('flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary', active ? 'text-primary' : 'text-muted-foreground hover:text-navy')}
            >
              <Icon aria-hidden className="size-5" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
