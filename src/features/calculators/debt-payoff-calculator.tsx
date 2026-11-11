'use client'

import { Plus, X } from 'lucide-react'
import { useMemo } from 'react'
import { useClientValue } from '@/hooks/use-client-value'
import { useStoredState } from '@/hooks/use-stored-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { monthlyInterest, monthsToClear, simulateDebts } from '@/lib/calculators/debt'
import { BigNumber, CalculatorCard, durationLabel, ksh, NumberField, ResultLine, ResultPanel, rowId, SavedNote, toNum } from './fields'

interface LoanRow {
  id: string
  name: string
  balance: string
  payment: string
  rate: string
}

// Month helpers without date-fns, to keep this island small.
const thisMonth = () => {
  const d = new Date()
  return d.getFullYear() * 12 + d.getMonth()
}
const monthName = (index: number) => new Date(Math.floor(index / 12), index % 12, 1).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })

const loan = (name = '', balance = '', payment = '', rate = ''): LoanRow => ({ id: rowId(), name, balance, payment, rate })

const DEFAULTS = {
  loans: [
    { id: 'd1', name: 'Bank loan', balance: '180000', payment: '9000', rate: '16' },
    { id: 'd2', name: 'SACCO loan', balance: '60000', payment: '4000', rate: '12' },
    { id: 'd3', name: 'App loan', balance: '12000', payment: '3000', rate: '60' },
  ] as LoanRow[],
  extra: '2000',
  rollover: true,
}

export function DebtPayoffCalculator() {
  const [v, setV, reset, saved] = useStoredState('debt-payoff', DEFAULTS)
  const { loans, extra, rollover } = v
  const setLoans = (fn: (ls: LoanRow[]) => LoanRow[]) => setV((s) => ({ ...s, loans: fn(s.loans) }))
  const setExtra = (x: string) => setV((s) => ({ ...s, extra: x }))
  const setRollover = (x: boolean) => setV((s) => ({ ...s, rollover: x }))
  const now = useClientValue<number | null>(thisMonth, null)

  const inputs = useMemo(() => loans.map((l) => ({ name: l.name, balance: toNum(l.balance), payment: toNum(l.payment), annualRate: toNum(l.rate) })).filter((l) => l.balance > 0), [loans])
  const extraAmt = Math.max(0, toNum(extra))
  const base = useMemo(() => simulateDebts(inputs, { maxMonths: 600, rollover }), [inputs, rollover])
  const boosted = useMemo(() => simulateDebts(inputs, { maxMonths: 600, rollover, extraPerMonth: extraAmt }), [inputs, rollover, extraAmt])
  const stuck = inputs.filter((l) => l.payment <= monthlyInterest(l.balance, l.annualRate))
  const total = inputs.reduce((t, l) => t + l.balance, 0)
  const dateOf = (months: number) => (now !== null && Number.isFinite(months) ? monthName(now + months) : null)
  const set = (id: string, patch: Partial<LoanRow>) => setLoans((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  const result = extraAmt > 0 ? boosted : base

  return (
    <CalculatorCard>
      <form className="grid gap-6" onSubmit={(e) => e.preventDefault()} aria-label="Debt payoff calculator inputs">
        <fieldset className="grid gap-3">
          <legend className="mb-1.5 text-[14px] font-medium text-navy">Your loans</legend>
          {loans.map((l, i) => (
            <div key={l.id} className="grid gap-2 rounded-xl border bg-background p-3">
              <div className="flex items-center gap-2">
                <Input aria-label={`Loan ${i + 1} name`} value={l.name} placeholder="e.g. Shamba loan" onChange={(e) => set(l.id, { name: e.target.value })} className="h-10 bg-card" />
                <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${l.name || `loan ${i + 1}`}`} onClick={() => setLoans((ls) => ls.filter((x) => x.id !== l.id))}>
                  <X />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <NumberField label="Balance" value={l.balance} onChange={(v) => set(l.id, { balance: v })} />
                <NumberField label="Monthly payment" value={l.payment} onChange={(v) => set(l.id, { payment: v })} />
                <NumberField label="Interest / year" prefix={null} suffix="%" value={l.rate} onChange={(v) => set(l.id, { rate: v })} />
              </div>
              {toNum(l.balance) > 0 && (
                <p className="text-[13px] text-muted-foreground">
                  {(() => {
                    const m = monthsToClear(toNum(l.balance), toNum(l.payment), toNum(l.rate))
                    return Number.isFinite(m) ? `On its own: cleared in ${durationLabel(m)}.` : `This payment doesn’t cover the interest (about ${ksh(monthlyInterest(toNum(l.balance), toNum(l.rate)))} a month), so the balance never falls.`
                  })()}
                </p>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => setLoans((ls) => [...ls, loan()])}>
            <Plus /> Add loan
          </Button>
        </fieldset>
        <NumberField label="Extra you could pay each month" value={extra} onChange={setExtra} hint="Goes to the highest-interest loan first (the avalanche method)." className="max-w-64" />
        <label className="flex items-start gap-2.5 text-[15px]">
          <input type="checkbox" checked={rollover} onChange={(e) => setRollover(e.target.checked)} className="mt-1 size-4 accent-[var(--primary)]" />
          <span>When a loan is cleared, move its monthly payment to the next loan</span>
        </label>
      </form>

      <ResultPanel label="Your debt-free date">
        {inputs.length === 0 ? (
          <p className="text-[15px] text-white/85">Add a loan with a balance to see your debt-free date.</p>
        ) : (
          <>
            <BigNumber
              label="Debt-free in"
              value={durationLabel(result.months)}
              tone={Number.isFinite(result.months) ? undefined : 'bad'}
              sub={Number.isFinite(result.months) ? (dateOf(result.months) ? `That’s ${dateOf(result.months)}.` : 'Counting from this month.') : 'At least one payment is too small to beat its interest.'}
            />
            <div className="grid gap-2">
              <ResultLine label="Total debt today" value={ksh(total)} />
              <ResultLine label="Interest you’ll pay" value={Number.isFinite(result.months) ? ksh(result.interest) : '—'} />
              {extraAmt > 0 && Number.isFinite(base.months) && Number.isFinite(boosted.months) && (
                <>
                  <ResultLine label={`Time saved by paying ${ksh(extraAmt)} extra`} value={durationLabel(base.months - boosted.months) === 'Already there' ? '—' : durationLabel(base.months - boosted.months)} />
                  <ResultLine label="Interest saved" value={ksh(Math.max(0, base.interest - boosted.interest))} />
                </>
              )}
            </div>
            {stuck.length > 0 && (
              <p className="rounded-lg bg-red-500/20 px-3 py-2 text-[14px]">
                Raise the payment on {stuck.map((s) => s.name || 'one loan').join(', ')} above its monthly interest, or that balance will keep growing.
              </p>
            )}
          </>
        )}
      </ResultPanel>
      <SavedNote saved={saved} onReset={reset} />
    </CalculatorCard>
  )
}
