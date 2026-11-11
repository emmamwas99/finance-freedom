'use client'

import { Pencil, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DebtArea } from '@/components/app/charts'
import { ProInline } from '@/features/billing/billing-ui'
import { GoalDialog, LoanDialog } from '@/features/editors/editors'
import { AmountInput, Bar, CardTitleRow, Empty, PageHeader } from '@/components/app/shared'
import { debtCategoryFor, debtOverview, debtProjection, goalSaved, loanBalance, loanPaid, monthsToClear } from '@/lib/calc'
import { currentMonth, monthLabel, parseAmount, pct, shiftMonth } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useFmt, useStore } from '@/store/data'
import { useUI } from '@/store/ui'

export function FreedomPage() {
  const { data } = useStore()
  const { m } = useFmt()
  const { openTx } = useUI()
  const [loanDlg, setLoanDlg] = useState<{ open: boolean; id?: string }>({ open: false })
  const [goalDlg, setGoalDlg] = useState<{ open: boolean; id?: string }>({ open: false })
  const [extra, setExtra] = useState('')
  const [showClosed, setShowClosed] = useState(false)

  const d = useMemo(() => debtOverview(data), [data])
  const extraAmt = parseAmount(extra)
  const base = useMemo(() => debtProjection(data), [data])
  const boosted = useMemo(() => (extraAmt > 0 ? debtProjection(data, extraAmt) : null), [data, extraAmt])
  const baseMonths = base.length - 1
  const boostMonths = boosted ? boosted.length - 1 : 0
  const progress = d.originalTotal > 0 ? d.paidTotal / d.originalTotal : 0
  const investCat = data.categories.find((c) => c.kind === 'invest' && !c.archived) ?? data.categories.find((c) => c.kind === 'saving')
  const closed = data.loans.filter((l) => l.closed || loanBalance(data, l) === 0)
  const neverEnds = baseMonths >= 120 && d.total > 0

  return (
    <div className="grid gap-8">
      <PageHeader
        title="Debts & goals"
        subtitle="Clear the loans, then build the shop and your savings."
        action={
          <>
            <Button variant="outline" className="h-10" onClick={() => setGoalDlg({ open: true })}>
              <Plus /> Goal
            </Button>
            <Button className="h-10" onClick={() => setLoanDlg({ open: true })}>
              <Plus /> Loan
            </Button>
          </>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-6">
          <Card>
            <CardContent className="grid gap-4">
              <CardTitleRow title="Loans" sub="Highest interest first — that's the one to attack with any extra money." />
              {d.loans.length === 0 && closed.length === 0 ? (
                <Empty title="No loans added" action={<Button onClick={() => setLoanDlg({ open: true })}><Plus /> Add a loan</Button>}>
                  Add the shamba loan and any other debts (SACCO, bank, Fuliza, friends) to see when you'll be free.
                </Empty>
              ) : (
                <div className="divide-y rounded-lg border">
                  {[...d.loans]
                    .sort((a, b) => b.loan.interestRate - a.loan.interestRate || a.balance - b.balance)
                    .map(({ loan, balance, paid }) => {
                      const months = monthsToClear(balance, loan.monthlyPayment, loan.interestRate)
                      const p = loan.amount > 0 ? paid / loan.amount : 0
                      return (
                        <div key={loan.id} className="grid gap-3 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <button className="min-w-0 text-left" onClick={() => setLoanDlg({ open: true, id: loan.id })}>
                              <p className="truncate text-[15px] font-medium text-navy hover:underline">{loan.name}</p>
                              <p className="text-[13px] text-muted-foreground">
                                {loan.lender || 'Lender'}
                                {loan.interestRate > 0 && ` · ${loan.interestRate}% a year`}
                                {loan.monthlyPayment > 0 && ` · ${m(loan.monthlyPayment)}/month`}
                              </p>
                            </button>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-navy tabular-nums">{m(balance)}</p>
                              <p className="text-[13px] text-muted-foreground">left to pay</p>
                            </div>
                          </div>
                          <Bar value={p} />
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-muted-foreground">
                            <span>
                              {pct(p)} paid ·{' '}
                              {Number.isFinite(months) ? (
                                <>
                                  {months} months left · cleared by <b className="text-foreground">{monthLabel(shiftMonth(currentMonth(), months), 'short')}</b>
                                </>
                              ) : (
                                <span className="text-red-600">payment too low to ever clear it</span>
                              )}
                            </span>
                            <span className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setLoanDlg({ open: true, id: loan.id })}>
                              <Pencil /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                openTx({
                                  kind: 'expense',
                                  preset: { amount: loan.monthlyPayment || undefined, categoryId: debtCategoryFor(data, loan.name)?.id, loanId: loan.id, note: `${loan.name} repayment` },
                                })
                              }
                            >
                              Record payment
                            </Button>
                            </span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
              {closed.length > 0 && (
                <button className="justify-self-start text-sm text-primary hover:underline" onClick={() => setShowClosed((s) => !s)}>
                  {showClosed ? 'Hide' : 'Show'} {closed.length} cleared loan{closed.length > 1 ? 's' : ''}
                </button>
              )}
              {showClosed &&
                closed.map((l) => (
                  <button key={l.id} onClick={() => setLoanDlg({ open: true, id: l.id })} className="flex justify-between rounded-lg border border-dashed px-4 py-3 text-[15px]">
                    <span>✓ {l.name}</span>
                    <span className="text-muted-foreground tabular-nums">{m(loanPaid(data, l.id))} repaid</span>
                  </button>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="grid gap-4">
              <CardTitleRow title="Goals & projects" sub="Track money you put into the shop, savings, land…" />
              {data.goals.length === 0 ? (
                <Empty title="No goals yet" action={<Button variant="outline" onClick={() => setGoalDlg({ open: true })}><Plus /> Add a goal</Button>}>
                  e.g. “Grow the shop — KSh 200,000”. Every contribution moves the bar.
                </Empty>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.goals.map((g) => {
                    const saved = goalSaved(data, g.id)
                    const p = g.target ? saved / g.target : 0
                    const monthsLeft = g.deadline ? Math.max(1, monthDiff(currentMonth(), g.deadline)) : 0
                    const need = g.deadline && saved < g.target ? (g.target - saved) / monthsLeft : 0
                    return (
                      <div key={g.id} className="grid gap-3 rounded-lg border p-4">
                        <button className="flex items-start justify-between gap-2 text-left" onClick={() => setGoalDlg({ open: true, id: g.id })}>
                          <span className="min-w-0">
                            <span className="block truncate text-[15px] font-medium text-navy">
                              {g.emoji} {g.name}
                            </span>
                            <span className="text-[13px] text-muted-foreground">
                              {m(saved)} of {m(g.target)}
                              {g.deadline && ` · by ${monthLabel(g.deadline, 'short')}`}
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-navy">{pct(Math.min(1, p))}</span>
                        </button>
                        <Bar value={p} />
                        <div className="flex items-center justify-between gap-2 text-[13px] text-muted-foreground">
                          <span>{p >= 1 ? 'Goal reached 🎉' : need > 0 ? `${m(need)}/month to make it` : `${m(g.target - saved)} to go`}</span>
                          <span className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setGoalDlg({ open: true, id: g.id })}>
                              <Pencil /> Edit
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => openTx({ kind: 'expense', preset: { categoryId: investCat?.id, goalId: g.id, note: g.name } })}>
                              Add money
                            </Button>
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* -------- Right column -------- */}
        <div className="grid gap-6 lg:sticky lg:top-10">
          <Card className="border-navy bg-navy text-white">
            <CardContent className="grid gap-4">
              {d.total === 0 && data.loans.length > 0 ? (
                <div>
                  <p className="text-2xl font-semibold">You are debt free 🎉</p>
                  <p className="mt-1 text-sm text-white/70">Now send that money to your goals.</p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-white/70">Total debt</p>
                    <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">{m(d.total)}</p>
                  </div>
                  <div className="grid gap-2">
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                      <div className="h-full rounded-full bg-[#5bb3e6]" style={{ width: `${progress * 100}%` }} />
                    </div>
                    <p className="text-[13px] text-white/70">
                      {pct(progress)} paid off · {m(d.paidTotal)} of {m(d.originalTotal)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-white/15 pt-4">
                    <div>
                      <p className="text-[13px] text-white/70">Monthly repayments</p>
                      <p className="text-lg font-semibold tabular-nums">{m(d.monthly)}</p>
                    </div>
                    <div>
                      <p className="text-[13px] text-white/70">Debt-free</p>
                      <p className={cn('text-lg font-semibold', !d.freeKey && d.total > 0 && 'text-red-200')}>
                        {d.total === 0 ? '—' : d.freeKey ? monthLabel(d.freeKey, 'short') : 'Never at this rate'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {d.total > 0 && (
            <Card>
              <CardContent className="grid gap-4">
                <CardTitleRow title="Road to zero" sub={neverEnds ? 'Your payments are too small — the debt is not shrinking.' : `${baseMonths} months at your current payments.`} />
                <DebtArea data={boosted ?? base} height={180} />
                <ProInline label="The “pay extra” simulator">
                <div className="grid gap-3 rounded-lg bg-muted/60 p-4">
                  <p className="text-sm font-medium text-navy">What if I pay extra every month?</p>
                  <div className="flex gap-2">
                    <AmountInput value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="e.g. 5,000" className="bg-card" />
                    {[2000, 5000].map((n) => (
                      <Button key={n} variant="outline" className="h-10 bg-card" onClick={() => setExtra(String(n))}>
                        +{n / 1000}k
                      </Button>
                    ))}
                  </div>
                  {boosted && (
                    <p className="text-sm">
                      Debt-free in <b>{boostMonths} months</b> ({monthLabel(shiftMonth(currentMonth(), boostMonths), 'short')})
                      {baseMonths > boostMonths && <b className="text-primary"> — {baseMonths - boostMonths} months sooner</b>}.
                    </p>
                  )}
                </div>
                </ProInline>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <LoanDialog open={loanDlg.open} id={loanDlg.id} onOpenChange={(open) => setLoanDlg((x) => ({ ...x, open }))} />
      <GoalDialog open={goalDlg.open} id={goalDlg.id} onOpenChange={(open) => setGoalDlg((x) => ({ ...x, open }))} />
    </div>
  )
}

function monthDiff(from: string, to: string) {
  const [y1, m1] = from.split('-').map(Number)
  const [y2, m2] = to.split('-').map(Number)
  return (y2 - y1) * 12 + (m2 - m1)
}
