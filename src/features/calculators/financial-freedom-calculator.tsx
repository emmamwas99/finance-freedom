'use client'

import { useClientValue } from '@/hooks/use-client-value'
import { useStoredState } from '@/hooks/use-stored-state'
import { financialFreedom, savingsRateTable } from '@/lib/calculators/financial-freedom'
import { BigNumber, CalculatorCard, ksh, NumberField, ResultLine, ResultPanel, SavedNote, toNum } from './fields'

const DEFAULTS = { income: '120000', spending: '84000', invested: '200000', ret: '3', wr: '4' }

const yearsLabel = (y: number) => (Number.isFinite(y) ? (y < 1 ? 'Under a year' : `${Math.ceil(y)} years`) : 'Not with these numbers')

export function FinancialFreedomCalculator() {
  const [v, setV, reset, saved] = useStoredState('financial-freedom', DEFAULTS)
  const { income, spending, invested, ret, wr } = v
  const setter = (k: keyof typeof DEFAULTS) => (x: string) => setV((s) => ({ ...s, [k]: x }))
  const [setIncome, setSpending, setInvested, setRet, setWr] = [setter('income'), setter('spending'), setter('invested'), setter('ret'), setter('wr')]
  const year = useClientValue<number | null>(() => new Date().getFullYear(), null)

  const r = financialFreedom({ monthlyIncome: toNum(income), monthlySpending: toNum(spending), currentInvestments: toNum(invested), realReturn: toNum(ret), withdrawalRate: toNum(wr) || 4 })
  const table = savingsRateTable(toNum(ret), toNum(wr) || 4)

  return (
    <CalculatorCard>
      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()} aria-label="Financial freedom calculator inputs">
        <NumberField label="Monthly take-home income" value={income} onChange={setIncome} />
        <NumberField label="Monthly spending" value={spending} onChange={setSpending} hint="Everything you spend in a month, including loan repayments." />
        <NumberField label="Savings and investments today" value={invested} onChange={setInvested} hint="Money set aside for the long term (not your emergency fund)." />
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Yearly return after inflation" prefix={null} suffix="%" value={ret} onChange={setRet} hint="An assumption, not a promise." />
          <NumberField label="Withdrawal rate" prefix={null} suffix="%" value={wr} onChange={setWr} hint="4% means 25× yearly spending." />
        </div>
      </form>

      <ResultPanel label="Your financial freedom estimate">
        <BigNumber
          label="Work becomes optional in about"
          value={yearsLabel(r.years)}
          tone={Number.isFinite(r.years) ? undefined : 'bad'}
          sub={Number.isFinite(r.years) && year ? `Around ${year + Math.ceil(r.years)}, in today’s shillings.` : r.monthlySaving <= 0 ? 'You need to spend less than you earn to get there.' : undefined}
        />
        <div className="grid gap-2">
          <ResultLine label="Your freedom number" value={ksh(r.target)} />
          <ResultLine label="Saving each month" value={ksh(Math.max(0, r.monthlySaving))} />
          <ResultLine label="Savings rate" value={`${Math.round(Math.max(0, r.savingsRate) * 100)}%`} />
        </div>
        <details className="text-[14px] text-white/85">
          <summary className="cursor-pointer font-medium">How the savings rate changes the timeline</summary>
          <table className="mt-2 w-full text-left text-[14px]">
            <caption className="sr-only">Years to financial independence by savings rate, starting from zero</caption>
            <thead>
              <tr className="text-white/70">
                <th className="py-1 font-medium">Savings rate</th>
                <th className="py-1 text-right font-medium">Years (from zero)</th>
              </tr>
            </thead>
            <tbody>
              {table.map((t) => (
                <tr key={t.rate} className="border-t border-white/15">
                  <td className="py-1">{Math.round(t.rate * 100)}%</td>
                  <td className="py-1 text-right tabular-nums">{Number.isFinite(t.years) ? Math.ceil(t.years) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </ResultPanel>
      <SavedNote saved={saved} onReset={reset} />
    </CalculatorCard>
  )
}
