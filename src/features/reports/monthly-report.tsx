'use client'

import { ArrowDownRight, ArrowUpRight, CheckCircle2, Printer } from 'lucide-react'
import { useMemo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CardTitleRow, Empty, MonthSwitcher } from '@/components/app/shared'
import { StatusBadge, statusStyles } from '@/components/app/status'
import { monthReport } from '@/lib/insights'
import { currentMonth, dayLabel, monthLabel, pct } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useFmt, useStore } from '@/store/data'

function Delta({ now, prev, goodWhen, label }: { now: number; prev: number; goodWhen: 'up' | 'down'; label: string }) {
  const { m } = useFmt()
  const diff = now - prev
  if (prev === 0 && now === 0) return <span className="text-[13px] text-muted-foreground">—</span>
  if (Math.abs(diff) < 1) return <span className="text-[13px] text-muted-foreground">Same as {label}</span>
  const up = diff > 0
  const good = goodWhen === 'up' ? up : !up
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span className={cn('inline-flex items-center gap-1 text-[13px]', good ? 'text-primary' : 'text-red-600')}>
      <Icon className="size-3.5" />
      {m(Math.abs(diff))} {up ? 'more' : 'less'} than {label}
    </span>
  )
}

function Box({ label, value, children }: { label: string; value: ReactNode; children?: ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border bg-card p-4 sm:p-5">
      <p className="text-[13px] leading-snug text-muted-foreground sm:text-sm">{label}</p>
      <p className="mt-1 text-lg leading-tight font-semibold tracking-tight break-words text-navy tabular-nums sm:text-2xl">{value}</p>
      <div className="mt-1">{children}</div>
    </div>
  )
}

export function MonthlyReport({ monthKey, setMonthKey }: { monthKey: string; setMonthKey: (k: string) => void }) {
  const { data } = useStore()
  const { m } = useFmt()
  const r = useMemo(() => monthReport(data, monthKey), [data, monthKey])
  const prevLabel = monthLabel(r.prevKey, 'tiny')
  const st = statusStyles[r.verdict.status]

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <MonthSwitcher value={monthKey} onChange={setMonthKey} />
        <Button variant="outline" className="h-10" onClick={() => window.print()}>
          <Printer /> Print / save as PDF
        </Button>
      </div>

      {/* Verdict */}
      <div className={cn('flex flex-col gap-4 rounded-xl border border-l-4 bg-card p-5 sm:flex-row sm:p-6 sm:items-center sm:justify-between', st.border)}>
        <div className="grid gap-1">
          <StatusBadge status={r.verdict.status} />
          <h2 className="text-lg leading-snug font-semibold text-navy sm:text-xl">
            {monthLabel(monthKey)}: {r.verdict.title}
          </h2>
          {r.hasData && (
            <p className="text-sm text-muted-foreground sm:text-[15px]">
              Income {m(r.income)} · Spent {m(r.s.spent)} · {r.kept >= 0 ? `Kept ${m(r.kept)}` : `Overspent ${m(-r.kept)}`}
              {r.plan.payments.length > 0 && ` · ${r.paidCount} of ${r.plan.payments.length} payments made`}
            </p>
          )}
        </div>
        {r.hasData && (
          <div className="text-left sm:text-right">
            <p className="text-sm text-muted-foreground">Month score</p>
            <p className="text-3xl font-semibold text-navy tabular-nums sm:text-4xl">
              {r.score.score}
              <span className="text-base font-normal text-muted-foreground"> / 100</span>
            </p>
          </div>
        )}
      </div>

      {!r.hasData ? (
        <Empty title="No report yet">Record your income and expenses for {monthLabel(monthKey)} and the report will fill in here.</Empty>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <Box label="Income" value={m(r.income)}>
              <Delta now={r.income} prev={r.prev.income} goodWhen="up" label={prevLabel} />
            </Box>
            <Box label="Spent" value={m(r.s.spent)}>
              <Delta now={r.s.spent} prev={r.ps.spent} goodWhen="down" label={prevLabel} />
            </Box>
            <Box label={`${r.kept >= 0 ? 'Kept' : 'Overspent'}${monthKey === currentMonth() ? ' so far' : ''}${r.kept >= 0 && r.income ? ` (${pct(r.kept / r.income)})` : ''}`} value={m(Math.abs(r.kept))}>
              <Delta now={r.kept} prev={r.prevKept} goodWhen="up" label={prevLabel} />
            </Box>
            <Box label="Debt repaid" value={m(r.s.debtPaid)}>
              <Delta now={r.s.debtPaid} prev={r.ps.debtPaid} goodWhen="up" label={prevLabel} />
            </Box>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-2">
            <Card>
              <CardContent className="grid gap-4">
                <CardTitleRow title="Plan vs actual" sub="What you planned for the month and what really happened." />
                <table className="w-full text-sm tabular-nums sm:text-[15px]">
                  <thead className="text-[13px] text-muted-foreground">
                    <tr className="border-b">
                      <th className="py-2 text-left font-medium">
                        <span className="sr-only">Item</span>
                      </th>
                      <th className="py-2 text-right font-medium">Planned</th>
                      <th className="py-2 text-right font-medium">Actual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <PlanRow label="Income" planned={r.expected} actual={r.s.earned} goodWhen="up" pending={r.s.earned === 0 && monthKey >= currentMonth()} />
                    <PlanRow label="Payments" planned={r.plan.payments.reduce((t, p) => t + p.planned, 0)} actual={r.plan.paidTotal} goodWhen="same" />
                    <PlanRow label="Everyday spending" planned={r.limitsTotal} actual={r.plan.otherSpent} goodWhen="down" />
                    <PlanRow label="Left at month end" planned={r.expected - r.plan.payments.reduce((t, p) => t + p.planned, 0) - r.limitsTotal} actual={r.kept} goodWhen="up" strong />
                  </tbody>
                </table>
                {r.unpaid.length > 0 && (
                  <p className="text-[13px] text-muted-foreground">
                    Not ticked as paid: {r.unpaid.map((p) => `${p.bill.name} (${m(p.planned)})`).join(', ')}
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card>
                <CardContent className="grid gap-3">
                  <CardTitleRow title="What went well" />
                  {r.wins.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nothing to celebrate yet. Let's change that.</p>
                  ) : (
                    r.wins.map((w, i) => (
                      <p key={i} className="flex gap-2.5 text-[15px]">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        {w}
                      </p>
                    ))
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="grid gap-3">
                  <CardTitleRow title="What to improve" />
                  {r.fixes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nothing. Keep it up!</p>
                  ) : (
                    r.fixes.map((w, i) => (
                      <p key={i} className="flex gap-2.5 text-[15px]">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
                        {w}
                      </p>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardContent className="grid gap-4">
              <CardTitleRow title="Categories" sub={`Spending against limits, and compared with ${monthLabel(r.prevKey)}.`} />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-[15px] tabular-nums">
                  <thead className="text-[13px] text-muted-foreground">
                    <tr className="border-b">
                      <th className="px-2 py-2 text-left font-medium">Category</th>
                      <th className="px-2 py-2 text-right font-medium">Limit</th>
                      <th className="px-2 py-2 text-right font-medium">Spent</th>
                      <th className="px-2 py-2 text-right font-medium">Under / over</th>
                      <th className="px-2 py-2 text-right font-medium">{prevLabel}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {r.categories.map(({ c, limit, spent, prev }) => {
                      const diff = limit - spent
                      return (
                        <tr key={c.id}>
                          <td className="px-2 py-2.5">
                            <span className="mr-2">{c.emoji}</span>
                            {c.name}
                          </td>
                          <td className="px-2 py-2.5 text-right text-muted-foreground">{limit ? m(limit) : '—'}</td>
                          <td className="px-2 py-2.5 text-right font-medium">{m(spent)}</td>
                          <td className={cn('px-2 py-2.5 text-right', !limit ? 'text-muted-foreground' : diff < 0 ? 'text-red-600' : 'text-primary')}>
                            {!limit ? '—' : diff < 0 ? `${m(-diff)} over` : `${m(diff)} under`}
                          </td>
                          <td className="px-2 py-2.5 text-right text-muted-foreground">{m(prev)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {r.top.length > 0 && (
            <Card>
              <CardContent className="grid gap-3">
                <CardTitleRow title="Biggest expenses" />
                <div className="divide-y">
                  {r.top.map((e) => {
                    const c = data.categories.find((x) => x.id === e.categoryId)
                    return (
                      <div key={e.id} className="flex items-center gap-3 py-2.5">
                        <span className="text-lg">{c?.emoji}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px]">{e.note || c?.name}</span>
                          <span className="text-[13px] text-muted-foreground">
                            {dayLabel(e.date)} · {c?.name}
                          </span>
                        </span>
                        <span className="text-[15px] font-medium tabular-nums">{m(e.amount)}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

function PlanRow({ label, planned, actual, goodWhen, strong, pending }: { label: string; planned: number; actual: number; goodWhen: 'up' | 'down' | 'same'; strong?: boolean; pending?: boolean }) {
  const { m } = useFmt()
  const off = goodWhen === 'up' ? actual < planned : goodWhen === 'down' ? actual > planned : false
  return (
    <tr className={cn(strong && 'font-semibold text-navy')}>
      <td className="py-2.5 pr-2">{label}</td>
      <td className="py-2.5 pl-2 text-right whitespace-nowrap text-muted-foreground">{m(planned)}</td>
      <td className={cn('py-2.5 pl-3 text-right whitespace-nowrap', pending ? 'text-muted-foreground' : off && planned > 0 && 'text-red-600')}>{pending ? 'Pending' : m(actual)}</td>
    </tr>
  )
}
