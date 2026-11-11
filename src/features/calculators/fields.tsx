'use client'

import { Plus, X } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { money } from '@/lib/money'
import { cn } from '@/lib/utils'

/** Parse "1,500" / "12.5" / "" into a number (empty → 0). Never NaN. */
export function toNum(s: string) {
  const n = Number(String(s).replace(/[,\s]/g, ''))
  return Number.isFinite(n) ? n : 0
}

export function NumberField({
  label,
  value,
  onChange,
  prefix = 'KSh',
  suffix,
  hint,
  className,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  prefix?: string | null
  suffix?: string
  hint?: ReactNode
  className?: string
}) {
  const id = useId()
  return (
    <div className={cn('grid content-start gap-1.5', className)}>
      <label htmlFor={id} className="text-[14px] font-medium text-navy">
        {label}
      </label>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[14px] text-muted-foreground">{prefix}</span>}
        <Input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={cn('h-11 bg-card text-[16px] tabular-nums', prefix && 'pl-12', suffix && 'pr-14')}
        />
        {suffix && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[14px] text-muted-foreground">{suffix}</span>}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-[13px] text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  )
}

export interface Row {
  id: string
  name: string
  amount: string
}

/** Random ids: rows are saved and restored, so a counter would collide after a reload. */
export const rowId = () => Math.random().toString(36).slice(2, 10)
export const newRow = (name = '', amount = ''): Row => ({ id: rowId(), name, amount })

/** Editable list of named amounts (payments, limits). */
export function RowsEditor({ legend, rows, onChange, namePlaceholder, addLabel }: { legend: string; rows: Row[]; onChange: (r: Row[]) => void; namePlaceholder: string; addLabel: string }) {
  const set = (id: string, patch: Partial<Row>) => onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-1.5 text-[14px] font-medium text-navy">{legend}</legend>
      {rows.map((r, i) => (
        <div key={r.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,9rem)_auto] items-center gap-2">
          <Input aria-label={`${legend}: name ${i + 1}`} value={r.name} placeholder={namePlaceholder} onChange={(e) => set(r.id, { name: e.target.value })} className="h-10 bg-card" />
          <Input aria-label={`${legend}: amount ${i + 1} in KSh`} inputMode="decimal" value={r.amount} placeholder="0" onChange={(e) => set(r.id, { amount: e.target.value })} className="h-10 bg-card text-right tabular-nums" />
          <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${r.name || `row ${i + 1}`}`} onClick={() => onChange(rows.filter((x) => x.id !== r.id))}>
            <X />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => onChange([...rows, newRow()])}>
        <Plus /> {addLabel}
      </Button>
    </fieldset>
  )
}

/** The highlighted result panel. aria-live so screen readers hear updates as inputs change. */
export function ResultPanel({ children, label = 'Result' }: { children: ReactNode; label?: string }) {
  return (
    <section aria-label={label} aria-live="polite" className="grid gap-4 rounded-2xl bg-navy p-5 text-white sm:p-6">
      {children}
    </section>
  )
}

export function BigNumber({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: 'bad' }) {
  return (
    <div>
      <p className="text-[14px] text-white/75">{label}</p>
      <p className={cn('text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl', tone === 'bad' && 'text-red-200')}>{value}</p>
      {sub && <p className="mt-1 text-[14px] text-white/75">{sub}</p>}
    </div>
  )
}

export function ResultLine({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-white/15 pt-2 text-[15px]">
      <span className="text-white/75">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

export const ksh = (n: number) => money(n)

export function CalculatorCard({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 rounded-2xl border bg-card p-5 shadow-[0_1px_3px_rgba(10,60,110,0.06)] sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">{children}</div>
}

/** Months as "1 year 3 months". */
export function durationLabel(months: number) {
  if (!Number.isFinite(months)) return 'Never at this rate'
  if (months <= 0) return 'Already there'
  const y = Math.floor(months / 12)
  const m = months % 12
  const part = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`
  return [y ? part(y, 'year') : '', m ? part(m, 'month') : ''].filter(Boolean).join(' ')
}

/** "Remembered on this device" note with a reset button, shown under every free tool. */
export function SavedNote({ saved, onReset }: { saved: boolean; onReset: () => void }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground lg:col-span-2">
      <span>{saved ? 'Your numbers are saved in this browser only, so they’re here when you come back.' : 'Your numbers stay in this browser. Nothing is sent anywhere.'}</span>
      {saved && (
        <button type="button" onClick={onReset} className="font-medium text-primary underline underline-offset-2">
          Reset to example
        </button>
      )}
    </p>
  )
}
