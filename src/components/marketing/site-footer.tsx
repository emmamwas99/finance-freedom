import Image from 'next/image'
import Link from 'next/link'
import { FOOTER_NAV, isAccountPath, SITE } from '@/config/site'

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
        <div className="grid content-start gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-navy">
            <Image src="/logo.svg" alt="" width={28} height={28} className="size-7 rounded-md" />
            {SITE.name}
          </Link>
          <p className="max-w-xs text-[14px] leading-relaxed text-muted-foreground">A private, encrypted budget planner for salaried Kenyans. Plan payments first, stop borrowing to get by, and see your debt-free date.</p>
        </div>
        {FOOTER_NAV.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-[14px] font-semibold text-navy">{col.title}</h2>
            <ul className="mt-3 grid gap-2 text-[14px]">
              {col.items.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} prefetch={isAccountPath(it.href) ? false : undefined} className="text-muted-foreground hover:text-navy">
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto grid max-w-6xl gap-2 px-4 py-6 text-[13px] text-muted-foreground sm:px-6">
          <p>
            © {new Date().getFullYear()} {SITE.company}. {SITE.name} is a product of {SITE.company}. Made in {SITE.country}.
          </p>
          <p>{SITE.name} provides budgeting tools and general education. It is not a bank or lender and does not give financial, tax or legal advice. Calculators are estimates based on the numbers and assumptions you enter.</p>
        </div>
      </div>
    </footer>
  )
}
