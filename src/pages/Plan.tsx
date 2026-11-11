import { MoreHorizontal, Pencil, Plus } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BillDialog, CategoryDialog } from '@/components/Editors'
import { IncomeDialog, MonthSpendingSheet } from '@/components/MonthEditors'
import { AmountInput, Bar, CardTitleRow, Empty, MonthSwitcher, Notice, PageHeader } from '@/components/shared'
import { activeCategories, budgetLevel, debtCategoryFor, levelText, loanBalance, monthPlan, type PlannedPayment } from '@/lib/calc'
import { uid } from '@/lib/defaults'
import { currentMonth, keyToDate, monthLabel, parseAmount, shiftMonth, todayISO } from '@/lib/format'
import type { AppData, Bill, Expense } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useFmt, useStore } from '@/store/data'
import { getDaysInMonth } from 'date-fns'

export function PlanPage() {
  const { data } = useStore()
  const { m } = useFmt()
  const [key, setKey] = useState(currentMonth())
  const [billDlg, setBillDlg] = useState<{ open: boolean; id?: string }>({ open: false })
  const [catDlg, setCatDlg] = useState<{ open: boolean; id?: string }>({ open: false })
  const [incomeOpen, setIncomeOpen] = useState(false)
  const [spentOpen, setSpentOpen] = useState(false)

  const plan = useMemo(() => monthPlan(data, key), [data, key])
  const upcoming = useMemo(() => Array.from({ length: 6 }, (_, i) => monthPlan(data, shiftMonth(key, i + 1))), [data, key])
  const [showAll, setShowAll] = useState(false)
  const everyday = activeCategories(data).filter((c) => c.kind === 'need' || c.kind === 'want')
  const limitsTotal = everyday.reduce((s, c) => s + c.budget, 0)
  const paymentCats = new Set(plan.payments.map((p) => p.bill.categoryId))
  const limits = showAll ? everyday : everyday.filter((c) => c.budget > 0 || ((plan.summary.byCategory[c.id] ?? 0) > 0 && !paymentCats.has(c.id)))
  const month = monthLabel(key, 'tiny')
  const answer = (
    <Card className="border-navy bg-navy text-white">
      <CardContent className="grid gap-4">
        <div>
          <p className="text-sm text-white/70">Left after all payments · {month}</p>
          <p className={cn('mt-1 text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl', plan.afterPayments < 0 && 'text-red-200')}>{m(plan.afterPayments)}</p>
        </div>
        <div className="grid gap-2 border-t border-white/15 pt-4 text-[15px]">
          <div className="flex justify-between gap-3">
          <button className="flex items-center gap-1.5 text-white/70 hover:text-white" onClick={() => setIncomeOpen(true)}>
            Income <Pencil className="size-3.5" />
          </button>
          <span className="tabular-nums">{m(plan.income)}</span>
        </div>
          <Row label="Payments listed" value={`− ${m(plan.paymentsTotal)}`} />
          <div className="flex justify-between gap-3">
          <button className="flex items-center gap-1.5 text-white/70 hover:text-white" onClick={() => setSpentOpen(true)}>
            Other spending so far <Pencil className="size-3.5" />
          </button>
          <span className="tabular-nums">− {m(plan.otherSpent)}</span>
        </div>
        </div>
        <div className="rounded-lg bg-white/10 px-4 py-3">
          <p className="text-sm text-white/70">Remaining right now</p>
          <p className={cn('text-2xl font-semibold tabular-nums', plan.remaining < 0 && 'text-red-200')}>{m(plan.remaining)}</p>
        </div>
        {plan.summary.earned === 0 && (
          <button className="text-left text-[13px] text-white/60 hover:text-white" onClick={() => setIncomeOpen(true)}>
            Using your expected income. Click to change it for {monthLabel(key)}.
          </button>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="grid gap-8">
      <PageHeader title="Monthly plan" subtitle="List everything you must pay this month and see exactly what's left." action={<MonthSwitcher value={key} onChange={setKey} />} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* -------- Left column -------- */}
        <div className="grid gap-6">
          <div className="lg:hidden">{answer}</div>
          <Card>
            <CardContent className="grid gap-5">
              <CardTitleRow
                title={`Payments for ${monthLabel(key)}`}
                sub="Debts, school fees, rent, the maid… Tick each one when you've paid it."
              />
              <AddPayment data={data} monthKey={key} />
              {plan.payments.length === 0 ? (
                <Empty title="No payments listed yet">
                  Add each debt or bill you must pay in {month}. Payments set to repeat will appear again next month automatically.
                </Empty>
              ) : (
                <div className="overflow-hidden rounded-lg border">
                  <div className="hidden grid-cols-[36px_minmax(0,1fr)_180px_150px_40px] items-center gap-3 border-b bg-muted/60 px-4 py-2.5 text-[13px] font-medium text-muted-foreground md:grid">
                    <span />
                    <span>Payment</span>
                    <span>Category</span>
                    <span className="text-right">Amount</span>
                    <span />
                  </div>
                  <div className="divide-y">
                    {plan.payments.map((p) => (
                      <PaymentRow key={p.bill.id} p={p} monthKey={key} onEdit={() => setBillDlg({ open: true, id: p.bill.id })} />
                    ))}
                  </div>
                  <div className="grid gap-1 border-t bg-muted/40 px-4 py-3 text-sm sm:grid-cols-3">
                    <span className="text-muted-foreground">
                      Total <b className="text-foreground tabular-nums">{m(plan.paymentsTotal)}</b>
                    </span>
                    <span className="text-muted-foreground sm:text-center">
                      Paid <b className="text-foreground tabular-nums">{m(plan.paidTotal)}</b>
                    </span>
                    <span className="text-muted-foreground sm:text-right">
                      Still to pay <b className={cn('tabular-nums', plan.toPay > 0 ? 'text-navy' : 'text-foreground')}>{m(plan.toPay)}</b>
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="grid gap-5">
              <CardTitleRow
                title="Everyday spending limits"
                sub="Food, transport, airtime… Set a monthly limit and you'll be warned before you go over."
                action={
                  <Button variant="outline" size="sm" onClick={() => setCatDlg({ open: true })}>
                    <Plus /> Category
                  </Button>
                }
              />
              <div className="overflow-hidden rounded-lg border">
                <div className="hidden grid-cols-[minmax(0,1fr)_130px_150px] items-center gap-4 border-b bg-muted/60 px-4 py-2.5 text-[13px] font-medium text-muted-foreground sm:grid">
                  <span>Category</span>
                  <span className="text-right">Spent</span>
                  <span className="text-right">Monthly limit</span>
                </div>
                <div className="divide-y">
                  {limits.map((c) => {
                    const spent = plan.summary.byCategory[c.id] ?? 0
                    const lvl = budgetLevel(spent, c.budget, data.settings.warnAt)
                    return (
                      <div key={c.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_130px_150px]">
                        <button className="min-w-0 text-left" onClick={() => setCatDlg({ open: true, id: c.id })}>
                          <span className="block truncate text-[15px]">
                            <span className="mr-2">{c.emoji}</span>
                            {c.name}
                          </span>
                          {c.budget > 0 && <Bar className="mt-2" value={spent / c.budget} level={lvl} />}
                        </button>
                        <span className={cn('text-right text-[15px] tabular-nums', levelText[lvl])}>
                          {m(spent)}
                          {lvl === 'over' && <span className="block text-xs">over by {m(spent - c.budget)}</span>}
                        </span>
                        <LimitInput categoryId={c.id} value={c.budget} />
                      </div>
                    )
                  })}
                </div>
                {limits.length === 0 && <p className="px-4 py-5 text-sm text-muted-foreground">No limits set yet. Click “Set limits” below to add some.</p>}
                <div className="flex items-center justify-between border-t bg-muted/40 px-4 py-3 text-sm">
                  <button className="font-medium text-primary hover:underline" onClick={() => setShowAll((x) => !x)}>
                    {showAll ? 'Show only categories in use' : `Set limits (${everyday.length} categories)`}
                  </button>
                  <span className="text-muted-foreground">
                    Total limits <b className="ml-1 text-foreground tabular-nums">{m(limitsTotal)}</b>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* -------- Right column: the answer -------- */}
        <div className="grid gap-6 lg:sticky lg:top-10">
          <div className="hidden lg:block">{answer}</div>
          {plan.afterPayments < 0 && (
            <Notice tone="over">
              Your payments are <b>{m(-plan.afterPayments)}</b> more than your income in {month}. Move or reduce a payment now, before you're forced to borrow.
            </Notice>
          )}
          {plan.afterPayments >= 0 && limitsTotal > plan.afterPayments && (
            <Notice tone="warn">
              Your everyday limits ({m(limitsTotal)}) are more than what's left after payments ({m(plan.afterPayments)}). Lower some limits.
            </Notice>
          )}

          <Card>
            <CardContent className="grid gap-4">
              <CardTitleRow title="Coming months" sub="What you'll have left after the payments you've planned." />
              <div className="grid gap-1">
                {upcoming.map((u) => (
                  <button
                    key={u.key}
                    onClick={() => setKey(u.key)}
                    className="flex items-center justify-between rounded-md px-2 py-2 text-[15px] hover:bg-muted"
                  >
                    <span>{monthLabel(u.key, 'short')}</span>
                    <span className="text-right">
                      <span className={cn('font-medium tabular-nums', u.afterPayments < 0 ? 'text-red-600' : 'text-navy')}>{m(u.afterPayments)}</span>
                      <span className="block text-xs text-muted-foreground tabular-nums">{m(u.paymentsTotal)} in payments</span>
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BillDialog open={billDlg.open} id={billDlg.id} monthKey={key} onOpenChange={(open) => setBillDlg((d) => ({ ...d, open }))} />
      <IncomeDialog monthKey={key} open={incomeOpen} onOpenChange={setIncomeOpen} />
      <MonthSpendingSheet monthKey={key} open={spentOpen} onOpenChange={setSpentOpen} />
      <CategoryDialog open={catDlg.open} id={catDlg.id} onOpenChange={(open) => setCatDlg((d) => ({ ...d, open }))} />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-white/70">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

// ---------------------------------------------------------------

function guess(data: AppData, name: string) {
  const words = name.toLowerCase().split(/\W+/).filter((w) => w.length > 2 && !['loan', 'the', 'for', 'pay'].includes(w))
  const loan = data.loans.find((l) => !l.closed && words.some((w) => l.name.toLowerCase().split(/\W+/).includes(w)))
  const cats = activeCategories(data)
  const cat = loan ? debtCategoryFor(data, loan.name) : cats.find((c) => words.some((w) => c.name.toLowerCase().includes(w)))
  return { loan, categoryId: cat?.id }
}

function AddPayment({ data, monthKey }: { data: AppData; monthKey: string }) {
  const { update } = useStore()
  const { m } = useFmt()
  const cats = activeCategories(data)
  const fallback = cats.find((c) => c.kind === 'debt' && c.name.toLowerCase().includes('other'))?.id ?? cats[0]?.id
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [repeat, setRepeat] = useState<'monthly' | 'once'>('monthly')
  const g = name.trim() ? guess(data, name) : null
  const effectiveCat = categoryId || g?.categoryId || fallback

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const amt = parseAmount(amount)
    if (!name.trim()) return toast.error('What is the payment for?')
    if (!amt) return toast.error('Enter the amount')
    const bill: Bill = {
      id: uid(),
      name: name.trim(),
      amount: amt,
      categoryId: effectiveCat,
      dueDay: 0,
      months: [],
      active: true,
      loanId: g?.loan?.id,
      ...(repeat === 'once' ? { onlyMonth: monthKey } : { fromMonth: monthKey }),
    }
    update((d) => ({ ...d, bills: [...d.bills, bill] }))
    toast.success(`Added ${bill.name} · ${m(amt)}`, { description: repeat === 'monthly' ? 'It will repeat every month.' : `Only for ${monthLabel(monthKey)}.` })
    setName('')
    setAmount('')
    setCategoryId('')
    setRepeat('monthly')
  }

  return (
    <form onSubmit={submit} className="grid gap-2 rounded-lg bg-muted/50 p-3 sm:grid-cols-[minmax(0,1fr)_160px]">
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="What do you need to pay? e.g. Fuliza, Shamba loan" className="bg-card" aria-label="Payment name" />
      <AmountInput value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (KSh)" className="bg-card" aria-label="Amount" />
      <div className="grid gap-2 sm:col-span-2 sm:grid-cols-[minmax(0,1fr)_170px_auto]">
        <Select value={effectiveCat} onValueChange={setCategoryId}>
          <SelectTrigger className="w-full bg-card" aria-label="Category">
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
        <Select value={repeat} onValueChange={(v) => setRepeat(v as 'monthly' | 'once')}>
          <SelectTrigger className="w-full bg-card" aria-label="Repeat">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Every month</SelectItem>
            <SelectItem value="once">This month only</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="h-10 px-5">
          <Plus /> Add payment
        </Button>
      </div>
      {g?.loan && (
        <p className="text-[13px] text-muted-foreground sm:col-span-2">
          Will count as a repayment of <b>{g.loan.name}</b> ({m(loanBalance(data, g.loan))} left).
        </p>
      )}
    </form>
  )
}

function paymentDate(key: string, dueDay: number) {
  if (key === currentMonth()) return todayISO()
  const max = getDaysInMonth(keyToDate(key))
  return `${key}-${String(Math.min(max, Math.max(1, dueDay || 1))).padStart(2, '0')}`
}

function PaymentRow({ p, monthKey, onEdit }: { p: PlannedPayment; monthKey: string; onEdit: () => void }) {
  const { data, update } = useStore()
  const { m } = useFmt()
  const { bill } = p
  const cat = data.categories.find((c) => c.id === bill.categoryId)
  const loan = bill.loanId ? data.loans.find((l) => l.id === bill.loanId) : undefined
  const repeating = !bill.onlyMonth
  const overridden = repeating && bill.overrides?.[monthKey] !== undefined && bill.overrides[monthKey] !== bill.amount

  const togglePaid = (checked: boolean) => {
    if (checked) {
      const exp: Expense = {
        id: uid(),
        createdAt: new Date().toISOString(),
        date: paymentDate(monthKey, bill.dueDay),
        amount: p.planned,
        categoryId: bill.categoryId,
        note: bill.name,
        billId: bill.id,
        loanId: bill.loanId,
        goalId: bill.goalId,
      }
      update((d) => ({ ...d, expenses: [...d.expenses, exp] }))
      toast.success(`Paid ${bill.name} · ${m(p.planned)}`)
    } else {
      const removed = data.expenses.filter((e) => p.expenseIds.includes(e.id))
      update((d) => ({ ...d, expenses: d.expenses.filter((e) => !p.expenseIds.includes(e.id)) }))
      toast(`${bill.name} marked as not paid`, {
        action: { label: 'Undo', onClick: () => update((d) => ({ ...d, expenses: [...d.expenses, ...removed] })) },
      })
    }
  }

  const setAmount = (amt: number) => {
    if (!amt || amt === p.planned) return
    update((d) => ({
      ...d,
      bills: d.bills.map((b) =>
        b.id !== bill.id ? b : repeating ? { ...b, overrides: { ...b.overrides, [monthKey]: amt } } : { ...b, amount: amt },
      ),
    }))
    if (repeating) toast(`Changed for ${monthLabel(monthKey)} only`, { description: `Other months stay at ${m(bill.amount)}. Use Edit to change every month.` })
  }

  const skip = () => {
    update((d) => ({ ...d, bills: d.bills.map((b) => (b.id === bill.id ? { ...b, skips: [...(b.skips ?? []), monthKey] } : b)) }))
    toast(`${bill.name} skipped for ${monthLabel(monthKey)}`, {
      action: { label: 'Undo', onClick: () => update((d) => ({ ...d, bills: d.bills.map((b) => (b.id === bill.id ? { ...b, skips: (b.skips ?? []).filter((k) => k !== monthKey) } : b)) })) },
    })
  }

  const remove = () => {
    update((d) => ({ ...d, bills: d.bills.filter((b) => b.id !== bill.id) }))
    toast(`${bill.name} deleted`, { action: { label: 'Undo', onClick: () => update((d) => ({ ...d, bills: [...d.bills, bill] })) } })
  }

  return (
    <div className={cn('grid grid-cols-[28px_minmax(0,1fr)_40px] items-center gap-x-3 gap-y-1 px-4 py-3 md:grid-cols-[36px_minmax(0,1fr)_180px_150px_40px]', p.paid && 'bg-muted/30')}>
      <Checkbox checked={p.paid} onCheckedChange={(c) => togglePaid(c === true)} aria-label={`Mark ${bill.name} as paid`} className="size-5" />
      <div className="min-w-0">
        <p className={cn('truncate text-[15px] font-medium', p.paid && 'text-muted-foreground line-through')}>{bill.name}</p>
        <p className="truncate text-[13px] text-muted-foreground">
          {repeating ? (bill.months.length ? 'Some months' : 'Every month') : 'This month only'}
          {bill.dueDay > 0 && ` · due on the ${ordinal(bill.dueDay)}`}
          {loan && ` · ${m(loanBalance(data, loan))} left on loan`}
        </p>
      </div>
      <span className="hidden truncate text-sm text-muted-foreground md:block">
        {cat?.emoji} {cat?.name}
      </span>
      <div className="col-start-2 row-start-2 md:col-start-auto md:row-start-auto md:text-right">
        {p.paid ? (
          <span className="text-[15px] font-medium text-primary tabular-nums">{m(p.paidAmount)}</span>
        ) : (
          <InlineAmount value={p.planned} onCommit={setAmount} />
        )}
        {overridden && !p.paid && <span className="block text-xs text-muted-foreground">usually {m(bill.amount)}</span>}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="More actions" className="col-start-3 row-start-1 md:col-start-auto">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          {repeating && <DropdownMenuItem onClick={skip}>Skip this month</DropdownMenuItem>}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={remove}>
            Delete {repeating ? 'for all months' : ''}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const group = (n: number) => (n ? n.toLocaleString('en-KE', { maximumFractionDigits: 2 }) : '')

function InlineAmount({ value, onCommit }: { value: number; onCommit: (n: number) => void }) {
  const [v, setV] = useState(group(value))
  const [prev, setPrev] = useState(value)
  if (prev !== value) {
    setPrev(value)
    setV(group(value))
  }
  return (
    <span className="flex w-36 items-center rounded-md border md:ml-auto md:justify-end border-transparent md:pl-2 hover:border-input focus-within:border-ring focus-within:bg-card">
      <span className="text-[15px] text-muted-foreground">KSh</span>
      <AmountInput
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => {
          const n = parseAmount(v)
          setV(group(n || value))
          onCommit(n)
        }}
        onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
        className="h-9 w-24 border-0 bg-transparent pl-1 md:text-right text-[15px] font-medium shadow-none focus-visible:ring-0"
        aria-label="Amount"
      />
    </span>
  )
}

function LimitInput({ categoryId, value }: { categoryId: string; value: number }) {
  const { update } = useStore()
  const [v, setV] = useState(group(value))
  const [prev, setPrev] = useState(value)
  if (prev !== value) {
    setPrev(value)
    setV(group(value))
  }
  const commit = () => {
    const n = parseAmount(v)
    setV(group(n))
    if (n === value) return
    update((d) => ({ ...d, categories: d.categories.map((c) => (c.id === categoryId ? { ...c, budget: n } : c)) }))
  }
  return (
    <AmountInput
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
      placeholder="No limit"
      className="col-span-2 h-9 text-right sm:col-span-1"
      aria-label="Monthly limit"
    />
  )
}

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
