'use client'

import { AlertTriangle, HandCoins, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AmountInput, Field } from '@/components/app/shared'
import { activeCategories, budgetLevel, goalSaved, loanBalance, plannedIncome, summarize } from '@/lib/calc'
import { KIND_LABEL, KIND_ORDER, uid } from '@/lib/defaults'
import { monthOf, parseAmount, pct, todayISO } from '@/lib/format'
import type { AppData, Category, CategoryKind, Expense, Income } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useFmt, useStore } from '@/store/data'
import { useUI, type TxRequest } from '@/store/ui'

export function TransactionDialog() {
  const { tx, closeTx } = useUI()
  return (
    <Dialog open={!!tx} onOpenChange={(o) => !o && closeTx()}>
      <DialogContent className="top-auto bottom-0 max-h-[92dvh] translate-y-0 overflow-y-auto rounded-b-none pb-[calc(1rem+env(safe-area-inset-bottom))] sm:top-1/2 sm:bottom-auto sm:max-w-xl sm:-translate-y-1/2 sm:rounded-xl sm:p-6">
        {/* key forces a fresh form for each request */}
        {tx && <TxForm key={JSON.stringify(tx)} req={tx} onDone={closeTx} />}
      </DialogContent>
    </Dialog>
  )
}

function TxForm({ req, onDone }: { req: TxRequest; onDone: () => void }) {
  const [kind, setKind] = useState<'expense' | 'income'>(req.kind)
  const editing = !!req.id
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg text-navy">{editing ? 'Edit' : 'Add'} {kind === 'expense' ? 'expense' : 'income'}</DialogTitle>
        <DialogDescription className="sr-only">Record money going out or coming in</DialogDescription>
      </DialogHeader>
      {!editing && (
        <Tabs value={kind} onValueChange={(v) => setKind(v as 'expense' | 'income')}>
          <TabsList className="w-full">
            <TabsTrigger value="expense">Money out</TabsTrigger>
            <TabsTrigger value="income">Money in</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      {kind === 'expense' ? (
        <ExpenseForm req={req.kind === 'expense' ? req : { kind: 'expense' }} onDone={onDone} />
      ) : (
        <IncomeForm req={req.kind === 'income' ? req : { kind: 'income' }} onDone={onDone} />
      )}
    </>
  )
}

function useCategoryOrder(data: AppData) {
  return useMemo(() => {
    const cutoff = new Date(Date.now() - 60 * 864e5).toISOString().slice(0, 10)
    const uses: Record<string, number> = {}
    for (const e of data.expenses) if (e.date >= cutoff) uses[e.categoryId] = (uses[e.categoryId] ?? 0) + 1
    return activeCategories(data).sort(
      (a, b) => (uses[b.id] ?? 0) - (uses[a.id] ?? 0) || KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind),
    )
  }, [data])
}

function ExpenseForm({ req, onDone }: { req: Extract<TxRequest, { kind: 'expense' }>; onDone: () => void }) {
  const { data, update } = useStore()
  const { go } = useUI()
  const { m } = useFmt()
  const original = req.id ? data.expenses.find((e) => e.id === req.id) : undefined
  const init = { ...original, ...req.preset }
  const cats = useCategoryOrder(data)

  const [amount, setAmount] = useState(init.amount ? String(init.amount) : '')
  const [categoryId, setCategoryId] = useState(init.categoryId ?? '')
  const [categoryQuery, setCategoryQuery] = useState('')
  const [newCategoryId] = useState(uid)
  const [newCategoryKind, setNewCategoryKind] = useState<CategoryKind>('need')
  const [date, setDate] = useState(init.date ?? todayISO())
  const [note, setNote] = useState(init.note ?? '')
  const [loanId, setLoanId] = useState(init.loanId ?? '')
  const [goalId, setGoalId] = useState(init.goalId ?? '')

  const normalizedCategory = categoryQuery.trim().replace(/\s+/g, ' ')
  const existingByName = cats.find((c) => c.name.toLocaleLowerCase() === normalizedCategory.toLocaleLowerCase())
  const newCategory: Category | null = normalizedCategory && !existingByName && !categoryId
    ? { id: newCategoryId, name: normalizedCategory, emoji: '', kind: newCategoryKind, budget: 0 }
    : null
  const cat = data.categories.find((c) => c.id === categoryId) ?? existingByName ?? newCategory
  const visibleCats = normalizedCategory
    ? cats.filter((c) => c.name.toLocaleLowerCase().includes(normalizedCategory.toLocaleLowerCase()))
    : cats
  const amt = parseAmount(amount)
  const openLoans = data.loans.filter((l) => !l.closed || l.id === loanId)

  // ---- live budget warning ----
  const warning = useMemo(() => {
    if (!cat || !amt) return null
    const key = monthOf(date)
    const s = summarize(data, key)
    const prevSame = original && monthOf(original.date) === key ? original.amount : 0
    const prevSameCat = original && monthOf(original.date) === key && original.categoryId === cat.id ? original.amount : 0
    const catAfter = (s.byCategory[cat.id] ?? 0) - prevSameCat + amt
    const totalAfter = s.spent - prevSame + amt
    const income = plannedIncome(data, key, s.earned)
    const msgs: { level: 'warn' | 'over'; text: string }[] = []
    const lvl = budgetLevel(catAfter, cat.budget, data.settings.warnAt)
    if (lvl === 'over') msgs.push({ level: 'over', text: `${cat.name} will be ${m(catAfter - cat.budget)} OVER budget (${pct(catAfter / cat.budget)}).` })
    else if (lvl === 'warn') msgs.push({ level: 'warn', text: `${cat.name} will be at ${pct(catAfter / cat.budget)} of its budget.` })
    if (income > 0 && totalAfter > income) msgs.push({ level: 'over', text: `This month you'd spend ${m(totalAfter - income)} more than you earn.` })
    if (cat.kind === 'want' && income > 0 && totalAfter > income * 0.9) msgs.push({ level: 'warn', text: `This is a "want". Is it worth it right now?` })
    return msgs
  }, [cat, amt, date, data, original, m])

  const save = () => {
    if (!amt) return toast.error('Enter an amount')
    if (!cat) return toast.error('Pick or type a category')
    if (newCategory && new TextEncoder().encode(newCategory.name).length > 60) return toast.error('Category name is too long')
    const exp: Expense = {
      id: original?.id ?? uid(),
      createdAt: original?.createdAt ?? new Date().toISOString(),
      date,
      amount: amt,
      categoryId: cat.id,
      note: note.trim() || undefined,
      loanId: cat.kind === 'debt' && loanId ? loanId : undefined,
      goalId: (cat.kind === 'invest' || cat.kind === 'saving') && goalId ? goalId : undefined,
      billId: init.billId,
    }
    update((d) => ({
      ...d,
      categories: newCategory ? [...d.categories, newCategory] : d.categories,
      expenses: original ? d.expenses.map((e) => (e.id === exp.id ? exp : e)) : [...d.expenses, exp],
    }))
    const over = warning?.find((w) => w.level === 'over')
    if (over) toast.warning('Over budget!', { description: over.text, duration: 6000 })
    else toast.success(`${original ? 'Updated' : 'Saved'} ${m(amt)} · ${cat.name}`, newCategory ? { description: 'Category saved for next time.' } : undefined)
    onDone()
  }

  const remove = () => {
    if (!original) return
    update((d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== original.id) }))
    toast('Expense deleted', {
      action: { label: 'Undo', onClick: () => update((d) => ({ ...d, expenses: [...d.expenses, original] })) },
    })
    onDone()
  }

  return (
    <div className="grid gap-4">
      {!original && (
        <div className="rounded-lg border border-primary/25 bg-accent/40 p-3 text-sm">
          <p><b className="text-navy">Still owe this money?</b> Add it as a debt. Record an expense only when money has actually left your pocket.</p>
          <Button variant="link" className="mt-1 h-auto px-0" onClick={() => { onDone(); go('freedom') }}>Go to Debts</Button>
        </div>
      )}
      <AmountInput
        aria-label="Amount in KSh"
        autoFocus={!req.preset?.amount}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="h-14 text-center text-3xl font-semibold text-navy"
        onKeyDown={(e) => e.key === 'Enter' && save()}
      />

      <div className="grid gap-2">
        <Field label="Category">
          <Input
            value={categoryQuery}
            onChange={(e) => {
              const value = e.target.value
              setCategoryQuery(value)
              setCategoryId(cats.find((c) => c.name.toLocaleLowerCase() === value.trim().replace(/\s+/g, ' ').toLocaleLowerCase())?.id ?? '')
            }}
            placeholder={cat && !categoryQuery ? cat.name : 'Search or type a new category'}
            maxLength={60}
            autoComplete="off"
          />
        </Field>
        <div className="grid max-h-44 grid-cols-2 gap-1.5 overflow-y-auto p-0.5 sm:grid-cols-3">
          {visibleCats.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => { setCategoryId(c.id); setCategoryQuery('') }}
              className={cn(
                'rounded-lg border px-3 py-2 text-left text-[13px] leading-tight transition-colors',
                c.id === categoryId ? 'border-primary bg-primary/10 font-medium ring-1 ring-primary' : 'hover:bg-muted',
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
        {newCategory && (
          <div className="grid gap-2 rounded-lg border border-dashed bg-muted/30 p-3">
            <p className="text-sm">“{newCategory.name}” will be saved as a category with this expense.</p>
            <Field label="Category type">
              <Select value={newCategoryKind} onValueChange={(value) => setNewCategoryKind(value as CategoryKind)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {KIND_ORDER.map((kind) => <SelectItem key={kind} value={kind}>{KIND_LABEL[kind]}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
        )}
      </div>

      {cat?.kind === 'debt' && (
        <div className="grid gap-2">
          {openLoans.length > 0 ? (
            <Field label="Which debt did you repay?" hint="Linking this payment reduces that debt's balance.">
              <Select value={loanId || 'none'} onValueChange={(v) => setLoanId(v === 'none' ? '' : v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No debt linked — balance will not change</SelectItem>
                  {openLoans.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name} · {m(loanBalance(data, l))} left</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          ) : (
            <p className="text-sm text-muted-foreground">This payment will count as money out. Add the debt first if you want to track how much you still owe.</p>
          )}
        </div>
      )}

      {(cat?.kind === 'invest' || cat?.kind === 'saving') && data.goals.length > 0 && (
        <Field label="Towards which goal?">
          <Select value={goalId || 'none'} onValueChange={(v) => setGoalId(v === 'none' ? '' : v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not linked</SelectItem>
              {data.goals.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name} · {m(goalSaved(data, g.id))} / {m(g.target)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Field label="Date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Note (optional)">
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Naivas, matatu" />
        </Field>
      </div>

      {warning && warning.length > 0 && (
        <div className="grid gap-1.5">
          {warning.map((w, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-2 rounded-lg p-2.5 text-[13px]',
                w.level === 'over' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-800',
              )}
            >
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
              {w.text}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {original && (
          <Button variant="destructive" size="lg" onClick={remove} aria-label="Delete">
            <Trash2 />
          </Button>
        )}
        <Button size="lg" className="flex-1" onClick={save}>
          {original ? 'Save changes' : 'Save expense'}
        </Button>
      </div>
    </div>
  )
}

const SOURCES = ['Salary', 'Side hustle', 'Shop', 'Shamba', 'Bonus', 'Gift', 'Other']

function IncomeForm({ req, onDone }: { req: Extract<TxRequest, { kind: 'income' }>; onDone: () => void }) {
  const { data, update } = useStore()
  const { m } = useFmt()
  const original = req.id ? data.incomes.find((e) => e.id === req.id) : undefined
  const init = { ...original, ...req.preset }

  const [amount, setAmount] = useState(init.amount ? String(init.amount) : '')
  const [source, setSource] = useState(init.source ?? 'Salary')
  const [date, setDate] = useState(init.date ?? todayISO())
  const [note, setNote] = useState(init.note ?? '')
  const [isLoan, setIsLoan] = useState(!!init.isLoan)
  const [loanId, setLoanId] = useState(init.loanId ?? 'new')
  const [repay, setRepay] = useState('')
  const [rate, setRate] = useState('')

  const amt = parseAmount(amount)

  const save = () => {
    if (!amt) return toast.error('Enter an amount')
    let linkedLoan = isLoan && loanId !== 'new' ? loanId : undefined
    const newLoan =
      isLoan && loanId === 'new' && !original
        ? {
            id: uid(),
            name: note.trim() || `${source} loan`,
            lender: source,
            amount: amt,
            interestRate: Number(rate) || 0,
            monthlyPayment: parseAmount(repay),
            startDate: date,
            createdAt: new Date().toISOString(),
          }
        : null
    if (newLoan) linkedLoan = newLoan.id
    const inc: Income = {
      id: original?.id ?? uid(),
      createdAt: original?.createdAt ?? new Date().toISOString(),
      date,
      amount: amt,
      source: source.trim() || 'Other',
      note: note.trim() || undefined,
      isLoan: isLoan || undefined,
      loanId: linkedLoan,
    }
    update((d) => ({
      ...d,
      incomes: original ? d.incomes.map((e) => (e.id === inc.id ? inc : e)) : [...d.incomes, inc],
      loans: newLoan
        ? [...d.loans, newLoan]
        : linkedLoan && !original
          ? d.loans.map((l) => (l.id === linkedLoan ? { ...l, amount: l.amount + amt } : l)) // top-up
          : d.loans,
    }))
    if (isLoan) toast.warning(`Borrowed ${m(amt)}`, { description: newLoan ? 'Added to your debts. Plan the repayment!' : 'Recorded as borrowed money.' })
    else toast.success(`Income saved: ${m(amt)}`)
    onDone()
  }

  const remove = () => {
    if (!original) return
    update((d) => ({ ...d, incomes: d.incomes.filter((e) => e.id !== original.id) }))
    toast('Income deleted', {
      action: { label: 'Undo', onClick: () => update((d) => ({ ...d, incomes: [...d.incomes, original] })) },
    })
    onDone()
  }

  return (
    <div className="grid gap-4">
      <AmountInput
        aria-label="Amount in KSh"
        autoFocus
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="h-14 text-center text-3xl font-semibold text-primary"
      />
      <div>
        <p className="mb-1.5 text-[13px] text-muted-foreground">Source</p>
        <div className="flex flex-wrap gap-1.5">
          {SOURCES.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setSource(s)}
              className={cn('rounded-full border px-3 py-1.5 text-[13px]', source === s ? 'border-primary bg-primary/10 font-medium' : 'hover:bg-muted')}
            >
              {s}
            </button>
          ))}
        </div>
        {!SOURCES.includes(source) || source === 'Other' ? (
          <Input className="mt-2" value={source === 'Other' ? '' : source} onChange={(e) => setSource(e.target.value)} placeholder="Where did it come from?" />
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Note (optional)">
          <Input value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
      </div>

      <label className="flex items-center justify-between gap-3 rounded-lg border p-3">
        <span className="flex items-center gap-2 text-sm">
          <HandCoins className="size-4 text-amber-500" /> This is borrowed money (a loan)
        </span>
        <Switch checked={isLoan} onCheckedChange={setIsLoan} />
      </label>

      {isLoan && (
        <div className="grid gap-3 rounded-lg bg-amber-500/10 p-3">
          <p className="text-[13px] text-amber-800">
            Borrowing to cover spending keeps you in the debt cycle. Make sure you know exactly how you'll repay this.
          </p>
          {!original && (
            <Field label="Track repayment as">
              <Select value={loanId} onValueChange={setLoanId}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">➕ A new loan</SelectItem>
                  {data.loans
                    .filter((l) => !l.closed)
                    .map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        Top-up of {l.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </Field>
          )}
          {!original && loanId === 'new' && (
            <div className="grid grid-cols-2 gap-2">
              <Field label="Monthly repayment">
                <AmountInput className="bg-background" value={repay} onChange={(e) => setRepay(e.target.value)} />
              </Field>
              <Field label="Interest % / year">
                <AmountInput className="bg-background" value={rate} onChange={(e) => setRate(e.target.value)} />
              </Field>
            </div>
          )}
          {!original && loanId !== 'new' && (
            <p className="text-[13px] text-muted-foreground">The loan's balance will go up by this amount.</p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {original && (
          <Button variant="destructive" size="lg" onClick={remove} aria-label="Delete">
            <Trash2 />
          </Button>
        )}
        <Button size="lg" className="flex-1" onClick={save}>
          {original ? 'Save changes' : 'Save income'}
        </Button>
      </div>
    </div>
  )
}
