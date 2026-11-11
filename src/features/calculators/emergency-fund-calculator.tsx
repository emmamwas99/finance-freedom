'use client'

import { useStoredState } from '@/hooks/use-stored-state'
import { emergencyFund } from '@/lib/calculators/emergency-fund'
import { BigNumber, CalculatorCard, durationLabel, ksh, NumberField, ResultLine, ResultPanel, SavedNote, toNum } from './fields'

const DEFAULTS = { essentials: '45000', months: '3', current: '20000', monthly: '8000' }

export function EmergencyFundCalculator() {
  const [v, setV, reset, saved] = useStoredState('emergency-fund', DEFAULTS)
  const f = (k: keyof typeof DEFAULTS) => ({ value: v[k], onChange: (x: string) => setV((s) => ({ ...s, [k]: x })) })
  const r = emergencyFund({ essentialsPerMonth: toNum(v.essentials), monthsOfCover: toNum(v.months), currentSavings: toNum(v.current), monthlySaving: toNum(v.monthly) })

  return (
    <CalculatorCard>
      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()} aria-label="Emergency fund calculator inputs">
        <NumberField label="Essential costs per month" {...f('essentials')} hint="Rent, food, transport, utilities, school fees and loan minimums: what you must pay even in a bad month." />
        <fieldset className="grid gap-1.5">
          <legend className="mb-1.5 text-[14px] font-medium text-navy">Months of cover</legend>
          <div className="flex flex-wrap gap-2">
            {['1', '3', '6'].map((m) => (
              <label
                key={m}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-[15px] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${v.months === m ? 'border-primary bg-accent font-medium text-navy' : 'bg-card hover:bg-muted'}`}
              >
                <input type="radio" name="months-of-cover" className="sr-only" checked={v.months === m} onChange={() => setV((s) => ({ ...s, months: m }))} />
                {m} month{m === '1' ? '' : 's'}
              </label>
            ))}
          </div>
          <p className="text-[13px] text-muted-foreground">Start with one month. Three to six months is a common target.</p>
        </fieldset>
        <NumberField label="Already saved for emergencies" {...f('current')} />
        <NumberField label="You can save each month" {...f('monthly')} />
      </form>

      <ResultPanel label="Your emergency fund">
        <BigNumber label="Your target" value={ksh(r.target)} sub={`${toNum(v.months)} month${toNum(v.months) === 1 ? '' : 's'} of essential costs`} />
        <div className="h-2 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-label="Progress to target" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(r.progress * 100)}>
          <div className="h-full rounded-full bg-[#5bb3e6]" style={{ width: `${Math.round(r.progress * 100)}%` }} />
        </div>
        <div className="grid gap-2">
          <ResultLine label="You already cover" value={`${r.coveredMonths.toFixed(1)} months`} />
          <ResultLine label="Still to save" value={ksh(r.gap)} />
          <ResultLine label="Time to reach it" value={durationLabel(r.monthsToTarget)} />
        </div>
        {r.starterGap > 0 && <p className="rounded-lg bg-white/10 px-3 py-2 text-[14px]">First milestone: {ksh(r.starterGap)} more gets you one full month of essentials.</p>}
      </ResultPanel>
      <SavedNote saved={saved} onReset={reset} />
    </CalculatorCard>
  )
}
