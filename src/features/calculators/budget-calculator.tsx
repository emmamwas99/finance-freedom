'use client'

import { useMemo } from 'react'
import { useClientValue } from '@/hooks/use-client-value'
import { useStoredState } from '@/hooks/use-stored-state'
import { budgetPlan, daysLeftInMonth, fiftyThirtyTwenty } from '@/lib/calculators/budget'
import { BigNumber, CalculatorCard, ksh, NumberField, ResultLine, ResultPanel, RowsEditor, SavedNote, toNum, type Row } from './fields'

const DEFAULTS = {
  income: '85000',
  payments: [
    { id: 'p1', name: 'Rent', amount: '18000' },
    { id: 'p2', name: 'SACCO loan', amount: '8000' },
    { id: 'p3', name: 'School fees (monthly share)', amount: '7000' },
    { id: 'p4', name: 'House help', amount: '7500' },
  ] as Row[],
  limits: [
    { id: 'l1', name: 'Food & groceries', amount: '15000' },
    { id: 'l2', name: 'Transport', amount: '6000' },
    { id: 'l3', name: 'Airtime & data', amount: '2000' },
    { id: 'l4', name: 'Eating out & fun', amount: '4000' },
  ] as Row[],
  /** null = follow the real number of days left this month */
  days: null as string | null,
}

export function BudgetCalculator() {
  const [v, setV, reset, saved] = useStoredState('budget', DEFAULTS)
  const set = (patch: Partial<typeof DEFAULTS>) => setV((s) => ({ ...s, ...patch }))
  // "today" only exists in the browser; until the user edits it, days-left follows the real date
  const autoDays = useClientValue(() => String(daysLeftInMonth()), '30')
  const days = v.days ?? autoDays

  const r = useMemo(
    () => budgetPlan({ income: toNum(v.income), payments: v.payments.map((p) => ({ name: p.name, amount: toNum(p.amount) })), limits: v.limits.map((l) => ({ name: l.name, amount: toNum(l.amount) })), daysLeft: toNum(days) }),
    [v, days],
  )
  const rule = fiftyThirtyTwenty(toNum(v.income))

  return (
    <CalculatorCard>
      <form className="grid gap-6" onSubmit={(e) => e.preventDefault()} aria-label="Budget calculator inputs">
        <NumberField label="Monthly take-home pay" value={v.income} onChange={(income) => set({ income })} hint="Your net salary after PAYE, NSSF, SHIF and other deductions, plus any regular side income." />
        <RowsEditor legend="Payments you must make this month" rows={v.payments} onChange={(payments) => set({ payments })} namePlaceholder="e.g. Shamba loan" addLabel="Add payment" />
        <RowsEditor legend="Everyday spending limits" rows={v.limits} onChange={(limits) => set({ limits })} namePlaceholder="e.g. Food" addLabel="Add limit" />
        <NumberField label="Days left this month" prefix={null} suffix="days" value={days} onChange={(d) => set({ days: d })} className="max-w-48" />
      </form>

      <ResultPanel label="Your budget">
        <BigNumber label="Left after payments" value={ksh(r.afterPayments)} tone={r.afterPayments < 0 ? 'bad' : undefined} sub={r.afterPayments > 0 ? `About ${ksh(r.perDay)} a day for ${Math.max(1, Math.round(toNum(days)))} days` : 'Your payments are more than your income.'} />
        <div className="grid gap-2">
          <ResultLine label="Take-home pay" value={ksh(toNum(v.income))} />
          <ResultLine label={`Payments (${Math.round(r.paymentsShare * 100)}% of pay)`} value={`− ${ksh(r.paymentsTotal)}`} />
          <ResultLine label="Everyday limits" value={`− ${ksh(r.limitsTotal)}`} />
          <ResultLine label={r.unplanned >= 0 ? 'Unplanned (save it or clear debt)' : 'Over-planned by'} value={ksh(Math.abs(r.unplanned))} />
        </div>
        <p className="rounded-lg bg-white/10 px-3 py-2 text-[14px] leading-relaxed">
          {r.status === 'over'
            ? 'Your plan spends more than you earn. Cut a limit, move a payment, or plan the gap before the month starts. Don’t borrow to fill it.'
            : r.status === 'tight'
              ? 'Less than 15% of your pay is left after payments. Keep limits tight and avoid new commitments this month.'
              : r.unplanned > 0
                ? `Give the unplanned ${ksh(r.unplanned)} a job on payday: savings first, then extra on your most expensive loan.`
                : 'Every shilling has a job. Track spending against each limit as you go.'}
        </p>
        <details className="text-[14px] text-white/85">
          <summary className="cursor-pointer font-medium">Compare with the 50/30/20 rule</summary>
          <div className="mt-2 grid gap-1.5">
            <ResultLine label="50% needs" value={ksh(rule.needs)} />
            <ResultLine label="30% wants" value={ksh(rule.wants)} />
            <ResultLine label="20% savings & extra debt" value={ksh(rule.savingsAndDebt)} />
          </div>
        </details>
      </ResultPanel>
      <SavedNote saved={saved} onReset={reset} />
    </CalculatorCard>
  )
}
