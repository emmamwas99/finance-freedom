import { Check } from 'lucide-react'
import { money } from '@/lib/money'
import { cn } from '@/lib/utils'

/** Illustration of the monthly plan (decorative sample numbers, not real user data). */
export function HeroMock() {
  const rows: [string, number, boolean][] = [
    ['Shamba loan', 15000, true],
    ['School fees', 20000, false],
    ['Fuliza', 3500, true],
    ['SACCO loan', 8000, false],
    ['House help', 7500, false],
  ]
  return (
    <figure className="relative mx-auto w-full max-w-[30rem]" aria-label="Example monthly plan: five payments listed, two ticked as paid, KSh 31,000 left after all payments">
      <div className="rounded-[26px] border border-white/90 bg-white/95 p-4 text-left text-[#333] shadow-[0_24px_70px_rgba(10,60,110,0.14)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-navy sm:text-base">Payments for November</p>
          <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-navy sm:text-xs">5 planned</span>
        </div>
        <ul className="mt-3 divide-y text-[13px] sm:text-[15px]">
          {rows.map(([n, a, paid]) => (
            <li key={n} className="flex items-center gap-3 py-2.5">
              <span aria-hidden className={cn('flex size-5 shrink-0 items-center justify-center rounded-[5px] border', paid && 'border-primary bg-primary text-white')}>
                {paid && <Check className="size-3.5" />}
              </span>
              <span className={cn('min-w-0 flex-1', paid && 'text-muted-foreground line-through')}>
                {n}
                {paid && <span className="sr-only"> (paid)</span>}
              </span>
              <span className="shrink-0 font-medium tabular-nums">{money(a)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative -mt-5 ml-auto w-[88%] rounded-[22px] border border-white/20 bg-navy p-4 text-white shadow-[0_18px_42px_rgba(10,60,110,0.23)] sm:-mr-4 sm:p-5">
        <p className="text-sm text-white">Left after all payments</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">{money(31000)}</p>
        <p className="mt-1 text-[13px] text-white">≈ {money(1550)} a day for 20 days</p>
      </div>
    </figure>
  )
}
