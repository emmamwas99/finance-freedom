'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { NavItem } from '@/config/site'

/** Small client island: the only JavaScript in the public header. */
export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false)
  const path = usePathname()
  // close the menu after navigating (state derived from the path, no effect needed)
  const [shownFor, setShownFor] = useState(path)
  if (shownFor !== path) {
    setShownFor(path)
    setOpen(false)
  }
  return (
    <div className="md:hidden">
      <button type="button" className="flex size-10 items-center justify-center rounded-md" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
        {open ? <X /> : <Menu />}
      </button>
      {open && (
        <nav id="mobile-menu" aria-label="Main" className="absolute inset-x-0 top-16 grid gap-1 border-t border-white/10 bg-navy px-4 py-3 shadow-lg">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="rounded-md px-2 py-2.5 text-white/90 hover:bg-white/10" aria-current={path === it.href ? 'page' : undefined}>
              {it.label}
            </Link>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link href="/login" prefetch={false} className="rounded-lg border border-white/30 px-3 py-2.5 text-center text-white">
              Log in
            </Link>
            <Link href="/signup" prefetch={false} className="rounded-lg bg-primary px-3 py-2.5 text-center font-medium text-white">
              Start free
            </Link>
          </div>
        </nav>
      )}
    </div>
  )
}
