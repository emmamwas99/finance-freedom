'use client'

import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { useStoredState } from '@/hooks/use-stored-state'
import { financialHealth, type HealthInput, type HealthStatus } from '@/lib/calculators/financial-health'
import { cn } from '@/lib/utils'
import { NumberField, SavedNote, toNum } from './fields'

const DEFAULTS = {
  monthlyIncome: '85000',
  monthlySpending: '80000',
  monthlyDebtPayments: '22000',
  monthlyBorrowing: '3000',
  monthlySaving: '4000',
  emergencySavings: '30000',
  essentialsPerMonth: '55000',
  wantsPerMonth: '15000',
  tracking: 'sometimes' as HealthInput['tracking'],
}
type NumKey = Exclude<keyof typeof DEFAULTS, 'tracking'>

const STATUS: Record<HealthStatus, { label: string; icon: typeof CheckCircle2; cls: string }> = {
  good: { label: 'Healthy', icon: CheckCircle2, cls: 'bg-accent text-primary' },
  warn: { label: 'Needs attention', icon: AlertTriangle, cls: 'bg-amber-50 text-amber-800' },
  bad: { label: 'Fix this first', icon: XCircle, cls: 'bg-red-50 text-red-700' },
}

/** Status is always shown with an icon AND a word, never colour alone. */
function Badge({ status }: { status: HealthStatus }) {
  const s = STATUS[status]
  return (
    <span className={cn('inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[13px] font-medium', s.cls)}>
      <s.icon aria-hidden className="size-3.5" />
      {s.label}
    </span>
  )
}

export function FinancialHealthCheck() {
  const [v, setV, reset, saved] = useStoredState('financial-health', DEFAULTS)
  const tracking = v.tracking
  const setTracking = (t: HealthInput['tracking']) => setV((s) => ({ ...s, tracking: t }))
  const f = (k: NumKey) => ({ value: v[k], onChange: (x: string) => setV((s) => ({ ...s, [k]: x })) })
  const r = financialHealth({
    monthlyIncome: toNum(v.monthlyIncome),
    monthlySpending: toNum(v.monthlySpending),
    monthlyDebtPayments: toNum(v.monthlyDebtPayments),
    monthlyBorrowing: toNum(v.monthlyBorrowing),
    monthlySaving: toNum(v.monthlySaving),
    emergencySavings: toNum(v.emergencySavings),
    essentialsPerMonth: toNum(v.essentialsPerMonth),
    wantsPerMonth: toNum(v.wantsPerMonth),
    tracking,
  })

  return (
    <div className="grid gap-6 rounded-2xl border bg-card p-5 shadow-[0_1px_3px_rgba(10,60,110,0.06)] sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} aria-label="Financial health check inputs">
        <NumberField label="Take-home pay per month" {...f('monthlyIncome')} />
        <NumberField label="Total spending per month" {...f('monthlySpending')} hint="Including loan repayments." />
        <NumberField label="Loan repayments per month" {...f('monthlyDebtPayments')} />
        <NumberField label="New borrowing per month" {...f('monthlyBorrowing')} hint="Mobile loans, overdrafts, salary advances." />
        <NumberField label="Saved or invested per month" {...f('monthlySaving')} />
        <NumberField label="Emergency savings today" {...f('emergencySavings')} />
        <NumberField label="Essential costs per month" {...f('essentialsPerMonth')} hint="What you must pay even in a bad month." />
        <NumberField label="Spent on “wants” per month" {...f('wantsPerMonth')} hint="Eating out, fun, clothes and extras." />
        <fieldset className="grid gap-1.5 sm:col-span-2">
          <legend className="mb-1 text-[14px] font-medium text-navy">Do you record what you spend?</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['always', 'Every expense'],
                ['sometimes', 'Sometimes'],
                ['never', 'Not really'],
              ] as const
            ).map(([k, label]) => (
              <label key={k} className={cn('flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 text-[15px] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring', tracking === k ? 'border-primary bg-accent font-medium text-navy' : 'bg-card')}>
                <input type="radio" name="tracking" className="sr-only" checked={tracking === k} onChange={() => setTracking(k)} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      <section aria-label="Your financial health result" aria-live="polite" className="grid gap-4">
        <div className="rounded-2xl bg-navy p-5 text-white">
          <p className="text-[14px] text-white/75">Your financial health score</p>
          <p className="text-4xl font-semibold tabular-nums">
            {r.score}
            <span className="text-xl text-white/60">/100</span>
          </p>
          <p className="mt-1 text-[15px]">{r.verdict.title}</p>
        </div>
        {r.actions.length > 0 && (
          <div className="rounded-xl border bg-background p-4">
            <h2 className="text-[15px] font-semibold text-navy">Your next {r.actions.length === 1 ? "move" : `${r.actions.length} moves`}</h2>
            <ol className="mt-2 grid list-decimal gap-1.5 pl-5 text-[15px]">
              {r.actions.map((a) => (
                <li key={a.id}>{a.advice}</li>
              ))}
            </ol>
          </div>
        )}
        <ul className="grid gap-2">
          {r.checks.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-background px-3 py-2">
              <span className="text-[15px]">
                {c.title}
                <span className="block text-[13px] text-muted-foreground">{c.metric}</span>
              </span>
              <Badge status={c.status} />
            </li>
          ))}
        </ul>
      </section>
      <SavedNote saved={saved} onReset={reset} />
    </div>
  )
}
