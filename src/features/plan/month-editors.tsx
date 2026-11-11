'use client'

import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { AmountInput, Field } from '@/components/app/shared'
import { activeCategories, expectedIncomeFor } from '@/lib/calc'
import { uid } from '@/lib/defaults'
import { currentMonth, dayLabel, keyToDate, monthLabel, monthOf, parseAmount, shiftMonth, todayISO } from '@/lib/format'
import type { Expense } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useFmt, useStore } from '@/store/data'
import { useUI } from '@/store/ui'
import { getDaysInMonth } from 'date-fns'

const dialogClass =
  'top-auto bottom-0 max-h-[92dvh] translate-y-0 overflow-y-auto rounded-b-none pb-[calc(1rem+env(safe-area-inset-bottom))] sm:top-1/2 sm:bottom-auto sm:max-w-lg sm:-translate-y-1/2 sm:rounded-xl sm:p-6'

function dateInMonth(key: string) {
  if (key === currentMonth()) return todayISO()
  return `${key}-${String(key < currentMonth() ? getDaysInMonth(keyToDate(key)) : 1).padStart(2, '0')}`
}

// ---------------------------------------------------------------------
// Income for a month
// ---------------------------------------------------------------------

export function IncomeDialog({ monthKey, open, onOpenChange }: { monthKey: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogClass}>
        <DialogHeader>
          <DialogTitle className="text-lg text-navy">Income for {monthLabel(monthKey)}</DialogTitle>
          <DialogDescription>Set what you expect to earn. Your plan uses it until the money is recorded.</DialogDescription>
        </DialogHeader>
        {open && <IncomeForm key={monthKey} monthKey={monthKey} done={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function IncomeForm({ monthKey, done }: { monthKey: string; done: () => void }) {
  const { data, update } = useStore()
  const { m } = useFmt()
  const { openTx } = useUI()
  const current = expectedIncomeFor(data, monthKey)
  const hasOverride = data.settings.incomeOverrides?.[monthKey] !== undefined
  const [amount, setAmount] = useState(current ? String(current) : '')
  const [scope, setScope] = useState<'only' | 'onwards'>(hasOverride ? 'only' : 'onwards')
  const received = data.incomes.filter((i) => monthOf(i.date) === monthKey).sort((a, b) => a.date.localeCompare(b.date))
  const month = monthLabel(monthKey)

  const save = () => {
    const amt = parseAmount(amount)
    update((d) => {
      const st = d.settings
      if (scope === 'only') {
        return { ...d, settings: { ...st, incomeOverrides: { ...st.incomeOverrides, [monthKey]: amt } } }
      }
      // from this month on: replace later changes and later one-month amounts
      const overrides = Object.fromEntries(Object.entries(st.incomeOverrides ?? {}).filter(([k]) => k < monthKey))
      const plan = (st.incomePlan ?? []).filter((p) => p.from < monthKey)
      return { ...d, settings: { ...st, incomeOverrides: overrides, incomePlan: [...plan, { from: monthKey, amount: amt }] } }
    })
    toast.success(scope === 'only' ? `${month}: ${m(amt)}` : `${m(amt)} a month from ${month}`)
    done()
  }

  const clearOverride = () => {
    update((d) => {
      const o = { ...d.settings.incomeOverrides }
      delete o[monthKey]
      return { ...d, settings: { ...d.settings, incomeOverrides: o } }
    })
    done()
  }

  const removeIncome = (id: string) => {
    const item = data.incomes.find((i) => i.id === id)
    if (!item) return
    update((d) => ({ ...d, incomes: d.incomes.filter((i) => i.id !== id) }))
    toast('Income deleted', { action: { label: 'Undo', onClick: () => update((d) => ({ ...d, incomes: [...d.incomes, item] })) } })
  }

  return (
    <div className="grid gap-5">
      <Field label="Expected income (KSh)">
        <AmountInput autoFocus value={amount} onChange={(e) => setAmount(e.target.value)} className="h-12 text-xl font-semibold text-navy" />
      </Field>
      <div className="grid gap-2">
        {(
          [
            ['only', `Only for ${month}`, 'e.g. a bonus month. Other months stay the same.'],
            ['onwards', `${month} and every month after`, 'e.g. your new salary from this month.'],
          ] as const
        ).map(([v, label, hint]) => (
          <label key={v} className={cn('flex cursor-pointer items-start gap-3 rounded-lg border p-3', scope === v && 'border-primary bg-accent')}>
            <input type="radio" name="scope" className="mt-1 accent-[var(--primary)]" checked={scope === v} onChange={() => setScope(v)} />
            <span>
              <span className="block text-[15px] font-medium text-navy">{label}</span>
              <span className="text-[13px] text-muted-foreground">{hint}</span>
            </span>
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        {hasOverride && (
          <Button variant="outline" size="lg" onClick={clearOverride}>
            Use usual amount
          </Button>
        )}
        <Button size="lg" className="flex-1" onClick={save}>
          Save income
        </Button>
      </div>

      <div className="grid gap-2 border-t pt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-navy">Money received in {monthLabel(monthKey, 'tiny')}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              done()
              openTx({ kind: 'income', preset: { date: dateInMonth(monthKey), amount: received.length ? undefined : parseAmount(amount) || undefined } })
            }}
          >
            <Plus /> Record
          </Button>
        </div>
        {received.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing recorded yet. Click Record when your salary arrives.</p>
        ) : (
          <div className="divide-y rounded-lg border">
            {received.map((i) => (
              <div key={i.id} className="flex items-center gap-3 px-3 py-2">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px]">{i.note || i.source}</span>
                  <span className="text-[13px] text-muted-foreground">
                    {dayLabel(i.date)}
                    {i.isLoan && ' · borrowed'}
                  </span>
                </span>
                <span className="text-[15px] font-medium tabular-nums">{m(i.amount)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit"
                  onClick={() => {
                    done()
                    openTx({ kind: 'income', id: i.id })
                  }}
                >
                  <Pencil />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => removeIncome(i.id)}>
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------
// Spending in a month (the "Spent so far" number, fully editable)
// ---------------------------------------------------------------------

export function MonthSpendingSheet({ monthKey, open, onOpenChange }: { monthKey: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-x-hidden overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-xl">
        <SheetHeader className="border-b p-6">
          <SheetTitle className="text-lg text-navy">Spending in {monthLabel(monthKey)}</SheetTitle>
          <SheetDescription>Edit or delete any expense, or add spending you didn't record.</SheetDescription>
        </SheetHeader>
        {open && <SpendingList monthKey={monthKey} close={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}

function SpendingList({ monthKey, close }: { monthKey: string; close: () => void }) {
  const { data, update } = useStore()
  const { m } = useFmt()
  const { openTx } = useUI()
  const list = data.expenses.filter((e) => monthOf(e.date) === monthKey).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
  const total = list.reduce((t, e) => t + e.amount, 0)
  const cats = activeCategories(data)
  const misc = cats.find((c) => c.name.toLowerCase().includes('misc'))?.id ?? cats[0]?.id
  const [lump, setLump] = useState('')
  const [lumpCat, setLumpCat] = useState(misc)

  const addLump = () => {
    const amt = parseAmount(lump)
    if (!amt) return toast.error('Enter the amount')
    const e: Expense = {
      id: uid(),
      createdAt: new Date().toISOString(),
      date: dateInMonth(monthKey),
      amount: amt,
      categoryId: lumpCat,
      note: 'Untracked spending',
    }
    update((d) => ({ ...d, expenses: [...d.expenses, e] }))
    setLump('')
    toast.success(`Added ${m(amt)} untracked spending`)
  }

  const remove = (e: Expense) => {
    update((d) => ({ ...d, expenses: d.expenses.filter((x) => x.id !== e.id) }))
    toast('Expense deleted', { action: { label: 'Undo', onClick: () => update((d) => ({ ...d, expenses: [...d.expenses, e] })) } })
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 [&>*]:min-w-0">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Total spent</p>
          <p className="text-3xl font-semibold text-navy tabular-nums">{m(total)}</p>
        </div>
        <Button
          onClick={() => {
            close()
            openTx({ kind: 'expense', preset: { date: dateInMonth(monthKey) } })
          }}
        >
          <Plus /> Add expense
        </Button>
      </div>

      <div className="grid gap-2 rounded-lg bg-muted/60 p-4">
        <p className="text-sm font-medium text-navy">Spent money you didn't record?</p>
        <p className="text-[13px] text-muted-foreground">Add it as one amount so your totals are right.</p>
        <div className="grid gap-2 sm:grid-cols-[150px_minmax(0,1fr)_auto]">
          <AmountInput value={lump} onChange={(e) => setLump(e.target.value)} placeholder="Amount" className="bg-card" onKeyDown={(e) => e.key === 'Enter' && addLump()} />
          <Select value={lumpCat} onValueChange={setLumpCat}>
            <SelectTrigger className="w-full bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cats.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-10 bg-card" onClick={addLump}>
            Add
          </Button>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">No expenses recorded in {monthLabel(monthKey)}.</p>
      ) : (
        <div className="divide-y rounded-lg border">
          {list.map((e) => {
            const c = data.categories.find((x) => x.id === e.categoryId)
            return (
              <div key={e.id} className="flex items-center gap-3 px-3 py-2.5">
                <span className="text-lg">{c?.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px]">{e.note || c?.name}</span>
                  <span className="block truncate text-[13px] text-muted-foreground">
                    {dayLabel(e.date)} · {c?.name}
                  </span>
                </span>
                <span className="text-[15px] font-medium tabular-nums">{m(e.amount)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit"
                  onClick={() => {
                    close()
                    openTx({ kind: 'expense', id: e.id })
                  }}
                >
                  <Pencil />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => remove(e)}>
                  <Trash2 />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** List of income changes, for Settings. */
export function IncomeSchedule() {
  const { data, update } = useStore()
  const { m } = useFmt()
  const st = data.settings
  const rows = [
    ...(st.incomePlan ?? []).map((p) => ({ kind: 'plan' as const, key: p.from, amount: p.amount, label: `From ${monthLabel(p.from)} onwards` })),
    ...Object.entries(st.incomeOverrides ?? {}).map(([k, v]) => ({ kind: 'only' as const, key: k, amount: v, label: `${monthLabel(k)} only` })),
  ].sort((a, b) => a.key.localeCompare(b.key))
  const [dlg, setDlg] = useState<string | null>(null)

  const remove = (r: (typeof rows)[number]) =>
    update((d) => {
      const s2 = d.settings
      if (r.kind === 'plan') return { ...d, settings: { ...s2, incomePlan: (s2.incomePlan ?? []).filter((p) => p.from !== r.key) } }
      const o = { ...s2.incomeOverrides }
      delete o[r.key]
      return { ...d, settings: { ...s2, incomeOverrides: o } }
    })

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-muted-foreground">Income changes</p>
        <Button size="sm" variant="outline" onClick={() => setDlg(shiftMonth(currentMonth(), 1))}>
          <Plus /> Add change
        </Button>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">None. Every month uses the usual amount above.</p>
      ) : (
        <div className="divide-y rounded-lg border">
          {rows.map((r) => (
            <div key={r.kind + r.key} className="flex items-center gap-3 px-3 py-2">
              <span className="flex-1 text-[15px]">{r.label}</span>
              <span className="text-[15px] font-medium tabular-nums">{m(r.amount)}</span>
              <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => setDlg(r.key)}>
                <Pencil />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => remove(r)}>
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      )}
      <MonthPickerIncome monthKey={dlg} onClose={() => setDlg(null)} />
    </div>
  )
}

function MonthPickerIncome({ monthKey, onClose }: { monthKey: string | null; onClose: () => void }) {
  const [key, setKey] = useState(monthKey ?? currentMonth())
  const [prev, setPrev] = useState(monthKey)
  if (prev !== monthKey) {
    setPrev(monthKey)
    if (monthKey) setKey(monthKey)
  }
  return (
    <Dialog open={!!monthKey} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={dialogClass}>
        <DialogHeader>
          <DialogTitle className="text-lg text-navy">Income change</DialogTitle>
          <DialogDescription>Pick the month the change starts.</DialogDescription>
        </DialogHeader>
        <Field label="Month">
          <Input type="month" value={key} onChange={(e) => e.target.value && setKey(e.target.value)} />
        </Field>
        {monthKey && <IncomeForm key={key} monthKey={key} done={onClose} />}
      </DialogContent>
    </Dialog>
  )
}
