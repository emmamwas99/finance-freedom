'use client'

import { useStoredState } from '@/hooks/use-stored-state'
import { monthlyForGoal, projectSavings } from '@/lib/calculators/savings-goal'
import { BigNumber, CalculatorCard, durationLabel, ksh, NumberField, ResultLine, ResultPanel, SavedNote, toNum } from './fields'

const DEFAULTS = { target: '150000', current: '10000', months: '12', rate: '0' }

export function SavingsGoalCalculator() {
  const [v, setV, reset, saved] = useStoredState('savings-goal', DEFAULTS)
  const f = (k: keyof typeof DEFAULTS) => ({ value: v[k], onChange: (x: string) => setV((s) => ({ ...s, [k]: x })) })
  const n = Math.max(1, Math.round(toNum(v.months)))
  const monthly = monthlyForGoal(toNum(v.target), toNum(v.current), n, toNum(v.rate))
  const proj = projectSavings(toNum(v.current), monthly, n, toNum(v.rate))

  return (
    <CalculatorCard>
      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()} aria-label="Savings goal calculator inputs">
        <NumberField label="Goal amount" {...f('target')} hint="e.g. next year’s school fees, a deposit, stock for the shop." />
        <NumberField label="Already saved" {...f('current')} />
        <NumberField label="Months until you need it" prefix={null} suffix="months" {...f('months')} className="max-w-56" />
        <NumberField label="Interest your savings earn (optional)" prefix={null} suffix="% / yr" {...f('rate')} hint="Leave at 0 to keep it simple. Rates on savings products change, so check yours." className="max-w-56" />
      </form>

      <ResultPanel label="Your monthly saving">
        <BigNumber label="Save each month" value={ksh(monthly)} sub={`for ${durationLabel(n)}`} />
        <div className="grid gap-2">
          <ResultLine label="You put in" value={ksh(proj.contributed)} />
          <ResultLine label="Interest earned" value={ksh(Math.max(0, proj.interest))} />
          <ResultLine label="You’ll have" value={ksh(proj.balance)} />
        </div>
        <p className="rounded-lg bg-white/10 px-3 py-2 text-[14px]">Tip: set a standing order for {ksh(Math.ceil(monthly / 100) * 100)} on payday so it happens before you can spend it.</p>
      </ResultPanel>
      <SavedNote saved={saved} onReset={reset} />
    </CalculatorCard>
  )
}
