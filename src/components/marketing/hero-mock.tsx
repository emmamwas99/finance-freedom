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
    <figure className="relative mx-auto w-full max-w-md" aria-label="Example monthly plan: five payments listed, two ticked as paid, KSh 31,000 left after all payments">
      <div className="rounded-2xl border border-white/15 bg-white p-5 text-left text-[#333] shadow-2xl shadow-black/30">
        <p className="text-sm font-semibold text-navy">Payments for November</p>
        <ul className="mt-3 divide-y text-[15px]">
          {rows.map(([n, a, paid]) => (
            <li key={n} className="flex items-center gap-3 py-2.5">
              <span aria-hidden className={cn('flex size-5 items-center justify-center rounded-[5px] border', paid && 'border-primary bg-primary text-white')}>
                {paid && <Check className="size-3.5" />}
              </span>
              <span className={cn('flex-1', paid && 'text-muted-foreground line-through')}>
                {n}
                {paid && <span className="sr-only"> (paid)</span>}
              </span>
              <span className="font-medium tabular-nums">{money(a)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="-mt-6 ml-auto w-[85%] rounded-2xl bg-primary p-5 text-white shadow-xl sm:-mr-6">
        <p className="text-sm text-white">Left after all payments</p>
        <p className="text-3xl font-semibold tabular-nums">{money(31000)}</p>
        <p className="mt-1 text-[13px] text-white">≈ {money(1550)} a day for 20 days</p>
      </div>
    </figure>
  )
}
