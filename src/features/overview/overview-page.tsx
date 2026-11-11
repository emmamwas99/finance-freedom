'use client'

import { ArrowRight, Check, Plus } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MonthlyBars } from '@/components/app/charts'
import { Bar, CardTitleRow, Empty, MonthSwitcher, Notice, PageHeader, Stat } from '@/components/app/shared'
import { IncomeDialog, MonthSpendingSheet } from '@/features/plan/month-editors'
import { StatusBadge } from '@/components/app/status'
import { TxRow, toItems } from '@/features/transactions/tx-list'
import { progressCheck } from '@/lib/insights'
import { activeCategories, budgetLevel, dailyAllowance, debtOverview, levelText, monthPlan, summarize, totalBudget } from '@/lib/calc'
import { currentMonth, monthLabel, monthOf, pct, shiftMonth } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useFmt, useStore } from '@/store/data'
import { useUI } from '@/store/ui'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

export function HomePage() {
  const { data } = useStore()
  const { m } = useFmt()
  const { go, openTx } = useUI()
  const [key, setKey] = useState(currentMonth())
  const [incomeOpen, setIncomeOpen] = useState(false)
  const [spentOpen, setSpentOpen] = useState(false)
  const plan = useMemo(() => monthPlan(data, key), [data, key])
  const s = plan.summary
  const allowance = dailyAllowance(data, key, s)
  const debt = debtOverview(data)
  const progress = useMemo(() => progressCheck(data), [data])
  const warnAt = data.settings.warnAt
  const isNow = key === currentMonth()

  const trend = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const k = shiftMonth(key, i - 5)
        const x = summarize(data, k)
        return { key: k, label: monthLabel(k, 'tiny'), full: monthLabel(k), earned: x.earned, spent: x.spent }
      }),
    [data, key],
  )

  const limits = activeCategories(data)
    .filter((c) => c.kind !== 'debt')
    .map((c) => ({ c, spent: s.byCategory[c.id] ?? 0 }))
    .filter((x) => x.c.budget > 0)
    .sort((a, b) => b.spent / b.c.budget - a.spent / a.c.budget)

  // ---------- warnings ----------
  const notices: { tone: 'over' | 'warn' | 'info'; text: ReactNode; action?: { label: string; to: () => void } }[] = []
  if (plan.remaining < 0)
    notices.push({ tone: 'over', text: <>You are <b>{m(-plan.remaining)}</b> over your income for {monthLabel(key)} (including payments still to make). Stop non-essential spending.</> })
  else if (plan.income > 0 && plan.remaining < plan.income * (1 - warnAt))
    notices.push({ tone: 'warn', text: <>Only <b>{m(plan.remaining)}</b> left for the rest of {monthLabel(key, 'tiny')}. Spend carefully.</> })
  const over = limits.filter((l) => budgetLevel(l.spent, l.c.budget, warnAt) === 'over')
  if (over.length) notices.push({ tone: 'over', text: <>Over the limit: {over.map((o) => `${o.c.name} (+${m(o.spent - o.c.budget)})`).join(', ')}</> })
  if (s.borrowed > 0) notices.push({ tone: 'warn', text: <>You borrowed <b>{m(s.borrowed)}</b> this month. Add its repayment to your monthly plan.</> })
  if (isNow) {
    const today = new Date().getDate()
    const late = plan.payments.filter((p) => !p.paid && p.bill.dueDay > 0 && p.bill.dueDay < today)
    if (late.length) notices.push({ tone: 'over', text: <>Overdue: {late.map((p) => `${p.bill.name} (${m(p.planned)})`).join(', ')}</>, action: { label: 'Open plan', to: () => go('plan') } })
  }
  if (data.bills.length === 0)
    notices.push({ tone: 'info', text: 'Start by listing what you must pay this month (debts, school fees, rent…) to see what money you have left.', action: { label: 'Plan my month', to: () => go('plan') } })
  else if (totalBudget(data) === 0)
    notices.push({ tone: 'info', text: 'Set spending limits for food, transport and the rest so you get warned before overspending.', action: { label: 'Set limits', to: () => go('plan') } })
  const lastBackup = data.settings.lastBackupAt ? new Date(data.settings.lastBackupAt).getTime() : 0
  if (data.expenses.length > 10 && Date.now() - lastBackup > 30 * 864e5)
    notices.push({ tone: 'info', text: 'It has been a while since your last backup.', action: { label: 'Back up', to: () => go('settings') } })

  const recent = toItems(
    data.expenses.filter((e) => monthOf(e.date) === key),
    data.incomes.filter((e) => monthOf(e.date) === key),
  ).slice(0, 7)
  const paidCount = plan.payments.filter((p) => p.paid).length

  return (
    <div className="grid gap-8">
      <PageHeader
        title={`${greeting()}${data.settings.name ? `, ${data.settings.name}` : ''}`}
        subtitle={isNow ? "Here's where your money stands this month." : `Looking at ${monthLabel(key)}.`}
        action={
          <>
            <MonthSwitcher value={key} onChange={setKey} />
            <Button variant="outline" className="h-10" onClick={() => openTx({ kind: 'income' })}>
              <Plus /> Income
            </Button>
            <Button className="hidden h-10 sm:inline-flex" onClick={() => openTx({ kind: 'expense' })}>
              <Plus /> Expense
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat
          label="Income"
          action="Edit"
          onClick={() => setIncomeOpen(true)}
          value={m(plan.income)}
          sub={s.earned === 0 && plan.income > 0 ? 'Expected (not received yet)' : s.earned > 0 && s.earned < plan.income ? `${m(s.earned)} received so far` : 'Received'}
        />
        <Stat
          label="Payments"
          action="Open"
          onClick={() => go('plan')}
          value={m(plan.paymentsTotal)}
          sub={plan.payments.length ? `${paidCount} of ${plan.payments.length} paid · ${m(plan.toPay)} to go` : 'None planned yet'}
        />
        <Stat label="Spent so far" action="Edit" onClick={() => setSpentOpen(true)} value={m(s.spent)} sub={plan.income > 0 ? `${pct(s.spent / plan.income)} of income` : undefined} />
        <Stat
          highlight
          label="Remaining"
          action="Plan"
          onClick={() => go('plan')}
          value={m(plan.remaining)}
          tone={plan.remaining < 0 ? 'bad' : undefined}
          sub={allowance && plan.remaining > 0 ? `About ${m(plan.remaining / allowance.daysLeft)} a day for ${allowance.daysLeft} days` : 'After all payments'}
        />
      </div>
      <IncomeDialog monthKey={key} open={incomeOpen} onOpenChange={setIncomeOpen} />
      <MonthSpendingSheet monthKey={key} open={spentOpen} onOpenChange={setSpentOpen} />

      {notices.length > 0 && (
        <div className="grid gap-2">
          {notices.map((n, i) => (
            <Notice
              key={i}
              tone={n.tone}
              action={
                n.action && (
                  <Button size="sm" variant="outline" className="bg-card" onClick={n.action.to}>
                    {n.action.label}
                  </Button>
                )
              }
            >
              {n.text}
            </Notice>
          ))}
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="grid gap-6 lg:col-span-2">
          <Card>
            <CardContent className="grid gap-4">
              <CardTitleRow
                title="Income vs spending"
                sub="Last 6 months. Click a month to look at it."
                action={
                  <Button variant="ghost" size="sm" onClick={() => go('stats')}>
                    Reports <ArrowRight />
                  </Button>
                }
              />
              <MonthlyBars data={trend} keys={['earned', 'spent']} height={240} selected={key} onSelect={setKey} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="grid gap-4">
              <CardTitleRow
                title="Recent transactions"
                action={
                  <Button variant="ghost" size="sm" onClick={() => go('activity')}>
                    View all <ArrowRight />
                  </Button>
                }
              />
              {recent.length === 0 ? (
                <Empty title="Nothing recorded yet">
                  Click <b>Add expense</b> (or press <kbd className="rounded border px-1">N</kbd>) every time you spend.
                </Empty>
              ) : (
                <div className="-mx-2 divide-y">
                  {recent.map((t) => (
                    <TxRow key={t.item.id} tx={t} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardContent className="grid gap-4">
              <CardTitleRow
                title="Payments this month"
                action={
                  <Button variant="ghost" size="sm" onClick={() => go('plan')}>
                    Plan <ArrowRight />
                  </Button>
                }
              />
              {plan.payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payments listed for {monthLabel(key, 'tiny')}.</p>
              ) : (
                <div className="grid gap-2.5">
                  {plan.payments.slice(0, 7).map((p) => (
                    <div key={p.bill.id} className="flex items-center gap-3 text-[15px]">
                      <span className={cn('flex size-5 shrink-0 items-center justify-center rounded-full border', p.paid && 'border-primary bg-primary text-white')}>
                        {p.paid && <Check className="size-3" />}
                      </span>
                      <span className={cn('min-w-0 flex-1 truncate', p.paid && 'text-muted-foreground line-through')}>{p.bill.name}</span>
                      <span className="tabular-nums">{m(p.paid ? p.paidAmount : p.planned)}</span>
                    </div>
                  ))}
                  {plan.payments.length > 7 && <p className="text-[13px] text-muted-foreground">+{plan.payments.length - 7} more</p>}
                  <div className="mt-1 flex justify-between border-t pt-3 text-sm">
                    <span className="text-muted-foreground">Left after payments</span>
                    <b className={cn('tabular-nums', plan.afterPayments < 0 ? 'text-red-600' : 'text-navy')}>{m(plan.afterPayments)}</b>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="grid gap-3">
              <CardTitleRow
                title="Debt"
                action={
                  <Button variant="ghost" size="sm" onClick={() => go('freedom')}>
                    Details <ArrowRight />
                  </Button>
                }
              />
              <p className="text-2xl font-semibold text-navy tabular-nums">{m(debt.total)}</p>
              <p className="text-sm text-muted-foreground">
                {debt.total === 0 ? (
                  data.loans.length ? 'You are debt free. 🎉' : 'No loans added yet.'
                ) : debt.freeKey ? (
                  <>
                    Debt-free by <b className="text-navy">{monthLabel(debt.freeKey)}</b> at {m(debt.monthly)}/month
                  </>
                ) : (
                  'Monthly payments are too low to clear your debts.'
                )}
              </p>
              {debt.originalTotal > 0 && <Bar value={debt.paidTotal / debt.originalTotal} />}
            </CardContent>
          </Card>

          {!progress.empty && (
            <button onClick={() => go('insights')} className="grid gap-2 rounded-xl border bg-card p-6 text-left transition-colors hover:border-primary/40">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-navy">Am I on track?</h2>
                <ArrowRight className="size-4 text-muted-foreground" />
              </div>
              <StatusBadge status={progress.verdict.status} />
              <p className="text-sm text-muted-foreground">{progress.verdict.title}.</p>
              {progress.actions[0] && <p className="text-sm text-navy">Next move: {progress.actions[0].title.toLowerCase()}.</p>}
            </button>
          )}

          {limits.length > 0 && (
            <Card>
              <CardContent className="grid gap-4">
                <CardTitleRow title="Spending limits" />
                {limits.slice(0, 6).map(({ c, spent }) => {
                  const lvl = budgetLevel(spent, c.budget, warnAt)
                  return (
                    <div key={c.id} className="grid gap-1.5">
                      <div className="flex justify-between gap-2 text-sm">
                        <span className="truncate">{c.name}</span>
                        <span className={cn('shrink-0 tabular-nums', levelText[lvl])}>
                          {m(spent)} <span className="text-muted-foreground">/ {m(c.budget)}</span>
                        </span>
                      </div>
                      <Bar value={spent / c.budget} level={lvl} />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
