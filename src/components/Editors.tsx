import { Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { AmountInput, Field } from '@/components/shared'
import { activeCategories, averageByCategory, debtCategoryFor, loanPaid, monthsToClear } from '@/lib/calc'
import { EMOJIS, KIND_LABEL, KIND_ORDER, uid } from '@/lib/defaults'
import { currentMonth, monthLabel, parseAmount, shiftMonth, todayISO } from '@/lib/format'
import type { Bill, Category, CategoryKind, Goal, Loan } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useFmt, useStore } from '@/store/data'

function Sheet({ open, onOpenChange, title, desc, children }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; desc?: string; children: ReactNode }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-auto bottom-0 max-h-[92dvh] translate-y-0 overflow-y-auto rounded-b-none pb-[calc(1rem+env(safe-area-inset-bottom))] sm:top-1/2 sm:bottom-auto sm:max-w-lg sm:-translate-y-1/2 sm:rounded-xl sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg text-navy">{title}</DialogTitle>
          <DialogDescription className={cn(!desc && 'sr-only')}>{desc ?? title}</DialogDescription>
        </DialogHeader>
        {open && children}
      </DialogContent>
    </Dialog>
  )
}

function EmojiPicker({ value, onChange }: { value: string; onChange: (e: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1">
      {EMOJIS.map((e) => (
        <button
          type="button"
          key={e}
          onClick={() => onChange(e)}
          className={cn('size-9 rounded-lg text-lg', value === e ? 'bg-primary/15 ring-2 ring-primary' : 'hover:bg-muted')}
        >
          {e}
        </button>
      ))}
    </div>
  )
}

function Footer({ onDelete, onSave, saveLabel = 'Save' }: { onDelete?: () => void; onSave: () => void; saveLabel?: string }) {
  return (
    <div className="flex gap-2 pt-1">
      {onDelete && (
        <Button variant="destructive" size="lg" onClick={onDelete} aria-label="Delete">
          <Trash2 />
        </Button>
      )}
      <Button size="lg" className="flex-1" onClick={onSave}>
        {saveLabel}
      </Button>
    </div>
  )
}

// ---------------- Category ----------------

export function CategoryDialog({ id, open, onOpenChange }: { id?: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { data } = useStore()
  const c = id ? data.categories.find((x) => x.id === id) : undefined
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={c ? `${c.emoji} ${c.name}` : 'New category'}>
      <CategoryForm key={id ?? 'new'} c={c} done={() => onOpenChange(false)} />
    </Sheet>
  )
}

function CategoryForm({ c, done }: { c?: Category; done: () => void }) {
  const { data, update } = useStore()
  const { m } = useFmt()
  const [name, setName] = useState(c?.name ?? '')
  const [emoji, setEmoji] = useState(c?.emoji ?? '📦')
  const [kind, setKind] = useState<CategoryKind>(c?.kind ?? 'need')
  const [budget, setBudget] = useState(c?.budget ? String(c.budget) : '')
  const avg = c ? (averageByCategory(data, currentMonth())[c.id] ?? 0) : 0
  const used = c ? data.expenses.some((e) => e.categoryId === c.id) : false

  const save = () => {
    if (!name.trim()) return toast.error('Give it a name')
    const next: Category = { id: c?.id ?? uid(), name: name.trim(), emoji, kind, budget: parseAmount(budget), archived: c?.archived }
    update((d) => ({ ...d, categories: c ? d.categories.map((x) => (x.id === c.id ? next : x)) : [...d.categories, next] }))
    done()
  }
  const remove = () => {
    if (!c) return
    // keep history intact: archive if it has expenses
    update((d) => ({
      ...d,
      categories: used ? d.categories.map((x) => (x.id === c.id ? { ...x, archived: true, budget: 0 } : x)) : d.categories.filter((x) => x.id !== c.id),
    }))
    toast(used ? 'Category hidden (history kept)' : 'Category deleted')
    done()
  }

  return (
    <div className="grid gap-4">
      <Field label="Monthly budget limit" hint={avg > 0 ? <>Your 3-month average here: <b>{m(avg)}</b></> : 'How much may you spend here each month?'}>
        <AmountInput autoFocus value={budget} onChange={(e) => setBudget(e.target.value)} className="h-12 text-xl font-semibold" />
      </Field>
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Type">
        <Select value={kind} onValueChange={(v) => setKind(v as CategoryKind)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {KIND_ORDER.map((k) => (
              <SelectItem key={k} value={k}>
                {KIND_LABEL[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Icon">
        <EmojiPicker value={emoji} onChange={setEmoji} />
      </Field>
      <Footer onDelete={c ? remove : undefined} onSave={save} />
    </div>
  )
}

// ---------------- Bill (planned / recurring payment) ----------------

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function BillDialog({ id, open, onOpenChange, monthKey }: { id?: string; open: boolean; onOpenChange: (o: boolean) => void; monthKey?: string }) {
  const { data } = useStore()
  const b = id ? data.bills.find((x) => x.id === id) : undefined
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={b ? 'Edit payment' : 'New payment'} desc="Debts, rent, school fees, the maid — anything you know you must pay.">
      <BillForm key={id ?? 'new'} b={b} monthKey={monthKey ?? currentMonth()} done={() => onOpenChange(false)} />
    </Sheet>
  )
}

type Repeat = 'monthly' | 'some' | 'once'

function BillForm({ b, monthKey, done }: { b?: Bill; monthKey: string; done: () => void }) {
  const { data, update } = useStore()
  const { m } = useFmt()
  const cats = activeCategories(data)
  const [name, setName] = useState(b?.name ?? '')
  const [amount, setAmount] = useState(b?.amount ? String(b.amount) : '')
  const [categoryId, setCategoryId] = useState(b?.categoryId ?? cats[0]?.id ?? '')
  const [dueDay, setDueDay] = useState(b?.dueDay ? String(b.dueDay) : '')
  const [repeat, setRepeat] = useState<Repeat>(b?.onlyMonth ? 'once' : b && b.months.length ? 'some' : 'monthly')
  const [months, setMonths] = useState<number[]>(b?.months ?? [])
  const [loanId, setLoanId] = useState(b?.loanId ?? '')
  const [goalId, setGoalId] = useState(b?.goalId ?? '')
  const cat = data.categories.find((c) => c.id === categoryId)
  const override = b?.overrides?.[monthKey]

  const save = () => {
    if (!name.trim()) return toast.error('Give it a name')
    if (!parseAmount(amount)) return toast.error('Enter an amount')
    if (repeat === 'some' && months.length === 0) return toast.error('Pick at least one month')
    const next: Bill = {
      ...b,
      id: b?.id ?? uid(),
      name: name.trim(),
      amount: parseAmount(amount),
      categoryId,
      dueDay: Math.min(31, Math.max(0, Number(dueDay) || 0)),
      months: repeat === 'some' ? [...months].sort((x, y) => x - y) : [],
      onlyMonth: repeat === 'once' ? (b?.onlyMonth ?? monthKey) : undefined,
      fromMonth: repeat === 'once' ? undefined : (b?.fromMonth ?? (b ? undefined : monthKey)),
      loanId: cat?.kind === 'debt' && loanId ? loanId : undefined,
      goalId: (cat?.kind === 'invest' || cat?.kind === 'saving') && goalId ? goalId : undefined,
      active: true,
    }
    update((d) => ({ ...d, bills: b ? d.bills.map((x) => (x.id === b.id ? next : x)) : [...d.bills, next] }))
    done()
  }
  const remove = () => {
    if (!b) return
    update((d) => ({ ...d, bills: d.bills.filter((x) => x.id !== b.id) }))
    done()
  }
  const clearOverride = () => {
    if (!b) return
    update((d) => ({
      ...d,
      bills: d.bills.map((x) => {
        if (x.id !== b.id) return x
        const o = { ...x.overrides }
        delete o[monthKey]
        return { ...x, overrides: o }
      }),
    }))
    done()
  }

  return (
    <div className="grid gap-4">
      <Field label="What is it?">
        <Input autoFocus={!b} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Shamba loan, School fees" />
      </Field>
      <div className="grid grid-cols-[1fr_110px] gap-3">
        <Field label={repeat === 'once' ? 'Amount' : 'Usual amount'}>
          <AmountInput value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Due day">
          <Input type="number" inputMode="numeric" min={1} max={31} value={dueDay} onChange={(e) => setDueDay(e.target.value)} placeholder="Any" />
        </Field>
      </div>
      {override !== undefined && override !== b?.amount && (
        <p className="flex items-center justify-between gap-2 rounded-lg bg-accent px-3 py-2 text-[13px] text-navy">
          {monthLabel(monthKey)} is set to {m(override)}.
          <button className="font-medium text-primary underline" onClick={clearOverride}>
            Use usual amount
          </button>
        </p>
      )}
      <Field label="Category">
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-full">
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
      </Field>
      {cat?.kind === 'debt' && data.loans.length > 0 && (
        <Field label="Repays which loan?" hint="Payments reduce that loan's balance.">
          <Select value={loanId || 'none'} onValueChange={(v) => setLoanId(v === 'none' ? '' : v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not linked</SelectItem>
              {data.loans.filter((l) => !l.closed).map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
      {(cat?.kind === 'invest' || cat?.kind === 'saving') && data.goals.length > 0 && (
        <Field label="Towards goal">
          <Select value={goalId || 'none'} onValueChange={(v) => setGoalId(v === 'none' ? '' : v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not linked</SelectItem>
              {data.goals.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.emoji} {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
      <Field label="Repeats">
        <Select value={repeat} onValueChange={(v) => setRepeat(v as Repeat)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Every month</SelectItem>
            <SelectItem value="some">Only in some months (e.g. school terms)</SelectItem>
            <SelectItem value="once">One time only ({monthLabel(b?.onlyMonth ?? monthKey)})</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      {repeat === 'some' && (
        <div className="grid grid-cols-6 gap-1.5">
          {MONTHS.map((mo, i) => {
            const n = i + 1
            const on = months.includes(n)
            return (
              <button
                type="button"
                key={mo}
                onClick={() => setMonths(on ? months.filter((x) => x !== n) : [...months, n])}
                className={cn('rounded-md border py-2 text-sm', on ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted')}
              >
                {mo}
              </button>
            )
          })}
        </div>
      )}
      <Footer onDelete={b ? remove : undefined} onSave={save} />
    </div>
  )
}

// ---------------- Loan ----------------

export function LoanDialog({ id, open, onOpenChange }: { id?: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { data } = useStore()
  const l = id ? data.loans.find((x) => x.id === id) : undefined
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={l ? `Edit ${l.name}` : 'Add a loan / debt'} desc={l ? undefined : 'Shamba loan, SACCO, bank, M-Shwari, Fuliza, a friend…'}>
      <LoanForm key={id ?? 'new'} l={l} done={() => onOpenChange(false)} />
    </Sheet>
  )
}

function LoanForm({ l, done }: { l?: Loan; done: () => void }) {
  const { data, update } = useStore()
  const { m } = useFmt()
  const paid = l ? loanPaid(data, l.id) : 0
  const [name, setName] = useState(l?.name ?? '')
  const [lender, setLender] = useState(l?.lender ?? '')
  const [balance, setBalance] = useState(l ? String(Math.max(0, l.amount - paid)) : '')
  const [rate, setRate] = useState(l?.interestRate ? String(l.interestRate) : '')
  const [payment, setPayment] = useState(l?.monthlyPayment ? String(l.monthlyPayment) : '')
  const [dueDay, setDueDay] = useState(l?.dueDay ? String(l.dueDay) : '')
  const [note, setNote] = useState(l?.note ?? '')
  const [makeBill, setMakeBill] = useState(!l)

  const bal = parseAmount(balance)
  const pay = parseAmount(payment)
  const months = monthsToClear(bal, pay, Number(rate) || 0)

  const save = () => {
    if (!name.trim()) return toast.error('Give the loan a name')
    if (!bal && !l) return toast.error('How much do you still owe?')
    const next: Loan = {
      id: l?.id ?? uid(),
      createdAt: l?.createdAt ?? new Date().toISOString(),
      startDate: l?.startDate ?? todayISO(),
      name: name.trim(),
      lender: lender.trim(),
      amount: bal + paid, // so that balance = amount - repayments
      interestRate: Number(rate) || 0,
      monthlyPayment: pay,
      dueDay: Number(dueDay) || undefined,
      note: note.trim() || undefined,
      closed: l?.closed,
    }
    update((d) => {
      let bills = d.bills
      if (!l && makeBill && pay > 0) {
        const debtCat = debtCategoryFor(d, next.name)
        if (debtCat)
          bills = [...bills, { id: uid(), name: `${next.name} repayment`, amount: pay, categoryId: debtCat.id, dueDay: next.dueDay ?? 0, months: [], fromMonth: currentMonth(), loanId: next.id, active: true }]
      }
      return { ...d, bills, loans: l ? d.loans.map((x) => (x.id === l.id ? next : x)) : [...d.loans, next] }
    })
    toast.success(l ? 'Loan updated' : 'Loan added. You will crush it! 💪')
    done()
  }
  const remove = () => {
    if (!l) return
    update((d) => ({
      ...d,
      loans: d.loans.filter((x) => x.id !== l.id),
      expenses: d.expenses.map((e) => (e.loanId === l.id ? { ...e, loanId: undefined } : e)),
      bills: d.bills.map((b) => (b.loanId === l.id ? { ...b, loanId: undefined } : b)),
    }))
    done()
  }
  const toggleClosed = () => {
    if (!l) return
    update((d) => ({ ...d, loans: d.loans.map((x) => (x.id === l.id ? { ...x, closed: !x.closed } : x)) }))
    if (!l.closed) toast.success('🎉 Loan closed! One step closer to freedom.')
    done()
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-2">
        <Field label="Name">
          <Input autoFocus={!l} value={name} onChange={(e) => setName(e.target.value)} placeholder="Shamba loan" />
        </Field>
        <Field label="Lender">
          <Input value={lender} onChange={(e) => setLender(e.target.value)} placeholder="SACCO / Bank" />
        </Field>
      </div>
      <Field label="Balance you still owe today" hint={l && paid > 0 ? `You've repaid ${m(paid)} through this app so far.` : 'Check your latest statement.'}>
        <AmountInput value={balance} onChange={(e) => setBalance(e.target.value)} className="h-12 text-xl font-semibold" />
      </Field>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Monthly payment">
          <AmountInput value={payment} onChange={(e) => setPayment(e.target.value)} />
        </Field>
        <Field label="Interest %/yr">
          <AmountInput value={rate} onChange={(e) => setRate(e.target.value)} placeholder="0" />
        </Field>
        <Field label="Due day">
          <Input type="number" inputMode="numeric" min={1} max={31} value={dueDay} onChange={(e) => setDueDay(e.target.value)} />
        </Field>
      </div>
      {bal > 0 && (
        <p className={cn('rounded-lg p-2.5 text-[13px]', Number.isFinite(months) ? 'bg-accent text-navy' : 'bg-red-500/10 text-red-700')}>
          {Number.isFinite(months)
            ? `At this rate you'll clear it in ${months} month${months === 1 ? '' : 's'} — around ${monthLabel(shiftMonth(currentMonth(), months))}.`
            : pay > 0
              ? '⚠️ This payment does not even cover the interest. The debt will keep growing — pay more!'
              : 'Add a monthly payment to see when you will be free of this loan.'}
        </p>
      )}
      <Field label="Notes">
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
      </Field>
      {!l && pay > 0 && (
        <label className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm">
          Add it to my monthly payments list
          <Switch checked={makeBill} onCheckedChange={setMakeBill} />
        </label>
      )}
      {l && (
        <Button variant="outline" onClick={toggleClosed}>
          {l.closed ? 'Re-open loan' : '✅ Mark as fully paid / closed'}
        </Button>
      )}
      <Footer onDelete={l ? remove : undefined} onSave={save} />
    </div>
  )
}

// ---------------- Goal ----------------

export function GoalDialog({ id, open, onOpenChange }: { id?: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { data } = useStore()
  const g = id ? data.goals.find((x) => x.id === id) : undefined
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={g ? `Edit ${g.name}` : 'New goal / project'} desc={g ? undefined : 'Shop stock, emergency fund, land, a car…'}>
      <GoalForm key={id ?? 'new'} g={g} done={() => onOpenChange(false)} />
    </Sheet>
  )
}

function GoalForm({ g, done }: { g?: Goal; done: () => void }) {
  const { update } = useStore()
  const [name, setName] = useState(g?.name ?? '')
  const [emoji, setEmoji] = useState(g?.emoji ?? '🏪')
  const [target, setTarget] = useState(g?.target ? String(g.target) : '')
  const [start, setStart] = useState(g?.startingAmount ? String(g.startingAmount) : '')
  const [deadline, setDeadline] = useState(g?.deadline ?? '')

  const save = () => {
    if (!name.trim()) return toast.error('Give it a name')
    if (!parseAmount(target)) return toast.error('Set a target amount')
    const next: Goal = {
      id: g?.id ?? uid(),
      createdAt: g?.createdAt ?? new Date().toISOString(),
      name: name.trim(),
      emoji,
      target: parseAmount(target),
      startingAmount: parseAmount(start),
      deadline: deadline || undefined,
      note: g?.note,
    }
    update((d) => ({ ...d, goals: g ? d.goals.map((x) => (x.id === g.id ? next : x)) : [...d.goals, next] }))
    done()
  }
  const remove = () => {
    if (!g) return
    update((d) => ({
      ...d,
      goals: d.goals.filter((x) => x.id !== g.id),
      expenses: d.expenses.map((e) => (e.goalId === g.id ? { ...e, goalId: undefined } : e)),
      bills: d.bills.map((b) => (b.goalId === g.id ? { ...b, goalId: undefined } : b)),
    }))
    done()
  }

  return (
    <div className="grid gap-4">
      <Field label="Name">
        <Input autoFocus={!g} value={name} onChange={(e) => setName(e.target.value)} placeholder="Grow the shop" />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Target amount">
          <AmountInput value={target} onChange={(e) => setTarget(e.target.value)} />
        </Field>
        <Field label="Already have">
          <AmountInput value={start} onChange={(e) => setStart(e.target.value)} />
        </Field>
      </div>
      <Field label="Target month (optional)">
        <Input type="month" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </Field>
      <Field label="Icon">
        <EmojiPicker value={emoji} onChange={setEmoji} />
      </Field>
      <Footer onDelete={g ? remove : undefined} onSave={save} />
    </div>
  )
}
