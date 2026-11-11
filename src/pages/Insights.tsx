import { ArrowDownRight, ArrowUpRight, Lightbulb } from 'lucide-react'
import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CardTitleRow, Empty, PageHeader } from '@/components/shared'
import { StatusBadge, statusStyles } from '@/components/status'
import { progressCheck } from '@/lib/insights'
import { monthLabel } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useFmt, useStore } from '@/store/data'

export function InsightsPage() {
  const { data } = useStore()
  const { m } = useFmt()
  const r = useMemo(() => progressCheck(data), [data])

  if (r.empty)
    return (
      <div className="grid gap-8">
        <PageHeader title="Am I on track?" subtitle="An honest check of where your money is heading." />
        <Empty title="Not enough information yet">Record your income and a few weeks of expenses, and this page will tell you how you're doing and what to fix.</Empty>
      </div>
    )

  const st = statusStyles[r.verdict.status]
  const Icon = st.icon
  const passing = r.checks.filter((c) => c.status === 'good').length

  return (
    <div className="grid gap-8">
      <PageHeader title="Am I on track?" subtitle={`An honest check of where your money is heading, based on the ${r.period}.`} />

      <div className={cn('grid gap-5 rounded-xl border border-l-4 bg-card p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center', st.border)}>
        <div className="flex gap-4">
          <span className={cn('flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-full', st.bg)}>
            <Icon className={cn('size-6', st.text)} />
          </span>
          <div className="grid gap-1">
            <h2 className="text-lg leading-snug font-semibold text-navy sm:text-xl lg:text-2xl">{r.verdict.title}</h2>
            <p className="text-sm text-muted-foreground sm:text-[15px]">{r.verdict.text}</p>
            {r.direction && (
              <p className={cn('mt-1 inline-flex items-center gap-1.5 text-[15px] font-medium', r.direction.up ? 'text-primary' : 'text-red-600')}>
                {r.direction.up ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                {r.direction.text}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-8 lg:text-right">
          <div>
            <p className="text-sm text-muted-foreground">Checks passing</p>
            <p className="text-2xl font-semibold text-navy tabular-nums sm:text-3xl">
              {passing}
              <span className="text-base font-normal text-muted-foreground"> / {r.checks.length}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-semibold text-navy tabular-nums sm:text-3xl">
              {r.score}
              <span className="text-base font-normal text-muted-foreground"> / 100</span>
            </p>
          </div>
        </div>
      </div>

      {r.actions.length > 0 && (
        <Card>
          <CardContent className="grid gap-4">
            <CardTitleRow title="Your next moves" sub="Do these this month. They make the biggest difference." />
            <ol className="grid gap-3">
              {r.actions.map((a, i) => (
                <li key={a.id} className="flex gap-4 rounded-lg bg-muted/60 p-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">{i + 1}</span>
                  <span>
                    <span className="block text-[15px] font-medium text-navy">{a.title}</span>
                    <span className="text-[15px]">{a.advice}</span>
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {r.checks.map((c) => (
          <div key={c.id} className="grid content-start gap-2 rounded-xl border bg-card p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[15px] font-semibold text-navy">{c.title}</h3>
              <StatusBadge status={c.status} label={c.status === 'good' ? 'Good' : c.status === 'warn' ? 'Watch' : 'Fix this'} />
            </div>
            <p className="text-lg font-semibold tabular-nums">{c.metric}</p>
            <p className="text-sm text-muted-foreground">{c.detail}</p>
            {c.advice && (
              <p className="mt-1 flex gap-2 rounded-lg bg-accent px-3 py-2 text-sm text-navy">
                <Lightbulb className="mt-0.5 size-4 shrink-0" />
                {c.advice}
              </p>
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="grid gap-4">
          <CardTitleRow title="Last 6 months" sub="Are you keeping more each month?" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-[15px] tabular-nums">
              <thead className="text-[13px] text-muted-foreground">
                <tr className="border-b">
                  <th className="px-2 py-2 text-left font-medium">Month</th>
                  <th className="px-2 py-2 text-right font-medium">Income</th>
                  <th className="px-2 py-2 text-right font-medium">Spent</th>
                  <th className="px-2 py-2 text-right font-medium">Kept</th>
                  <th className="px-2 py-2 text-right font-medium">Debt repaid</th>
                  <th className="px-2 py-2 text-right font-medium">Borrowed</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {r.trend.map((t) => (
                  <tr key={t.key} className={cn(!t.has && 'text-muted-foreground')}>
                    <td className="px-2 py-2.5">{monthLabel(t.key)}</td>
                    <td className="px-2 py-2.5 text-right">{t.has ? m(t.income) : '—'}</td>
                    <td className="px-2 py-2.5 text-right">{t.has ? m(t.spent) : '—'}</td>
                    <td className={cn('px-2 py-2.5 text-right font-medium', t.has && (t.kept < 0 ? 'text-red-600' : 'text-navy'))}>{t.has ? m(t.kept) : '—'}</td>
                    <td className="px-2 py-2.5 text-right">{t.has ? m(t.debtPaid) : '—'}</td>
                    <td className={cn('px-2 py-2.5 text-right', t.borrowed > 0 && 'text-amber-700')}>{t.has ? m(t.borrowed) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
