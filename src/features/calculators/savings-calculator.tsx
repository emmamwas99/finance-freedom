'use client'

import { useStoredState } from '@/hooks/use-stored-state'
import { savingsGrowth } from '@/lib/calculators/savings-goal'
import { BigNumber, CalculatorCard, ksh, NumberField, ResultLine, ResultPanel, SavedNote, toNum } from './fields'

const DEFAULTS = { start: '20000', monthly: '5000', rate: '8', years: '5' }

export function SavingsCalculator() {
  const [v, setV, reset, saved] = useStoredState('savings', DEFAULTS)
  const f = (k: keyof typeof DEFAULTS) => ({ value: v[k], onChange: (x: string) => setV((s) => ({ ...s, [k]: x })) })
  const years = Math.min(50, Math.max(0, toNum(v.years)))
  const r = savingsGrowth(toNum(v.start), toNum(v.monthly), toNum(v.rate), years)
  const share = r.balance > 0 ? Math.max(0, r.interest) / r.balance : 0

  return (
    <CalculatorCard>
      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()} aria-label="Savings calculator inputs">
        <NumberField label="Starting amount" {...f('start')} hint="What you have saved today. Can be zero." />
        <NumberField label="Monthly deposit" {...f('monthly')} />
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Interest rate" prefix={null} suffix="% / yr" {...f('rate')} hint="An assumption. Rates change, so check yours." />
          <NumberField label="Years" prefix={null} suffix="years" {...f('years')} />
        </div>
      </form>

      <ResultPanel label="Your savings">
        <BigNumber label={`After ${years} year${years === 1 ? '' : 's'} you’d have`} value={ksh(r.balance)} sub={r.balance > 0 ? `${Math.round(share * 100)}% of it from interest` : undefined} />
        <div className="grid gap-2">
          <ResultLine label="You deposit" value={ksh(r.deposited)} />
          <ResultLine label="Interest earned" value={ksh(Math.max(0, r.interest))} />
        </div>
        {r.yearly.length > 0 && (
          <details className="text-[14px] text-white/85">
            <summary className="cursor-pointer font-medium">Year by year</summary>
            <table className="mt-2 w-full text-left text-[14px]">
              <caption className="sr-only">Balance at the end of each year</caption>
              <thead>
                <tr className="text-white/70">
                  <th className="py-1 font-medium">Year</th>
                  <th className="py-1 text-right font-medium">Deposited</th>
                  <th className="py-1 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {r.yearly.map((y) => (
                  <tr key={y.year} className="border-t border-white/15">
                    <td className="py-1">{y.year}</td>
                    <td className="py-1 text-right tabular-nums">{ksh(y.deposited)}</td>
                    <td className="py-1 text-right tabular-nums">{ksh(y.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        )}
        <p className="rounded-lg bg-white/10 px-3 py-2 text-[14px]">Remember inflation: if prices rise faster than your interest rate, your savings buy less over time.</p>
      </ResultPanel>
      <SavedNote saved={saved} onReset={reset} />
    </CalculatorCard>
  )
}
