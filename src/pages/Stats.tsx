import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MonthlyBars } from '@/components/charts'
import { MonthlyReport } from '@/pages/MonthlyReport'
import { Bar, CardTitleRow, Empty, PageHeader, Stat } from '@/components/shared'
import { budgetLevel, freedomScore, summarize, yearSeries } from '@/lib/calc'
import { KIND_LABEL, KIND_ORDER } from '@/lib/defaults'
import { currentMonth, monthLabel, pct } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useFmt, useStore } from '@/store/data'

function YearlyReport({ onOpenMonth }: { onOpenMonth: (k: string) => void }) {
  const { data } = useStore()
  const { m } = useFmt()
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [sel, setSel] = useState(currentMonth())
  const [view, setView] = useState<'chart' | 'table'>('chart')

  const series = useMemo(() => yearSeries(data, year).map((x) => ({ ...x, full: monthLabel(x.key) })), [data, year])
  const totals = series.reduce((a, x) => ({ earned: a.earned + x.earned, spent: a.spent + x.spent, borrowed: a.borrowed + x.borrowed }), { earned: 0, spent: 0, borrowed: 0 })
  const active = series.filter((x) => x.spent > 0 || x.earned > 0)
  const selKey = sel.startsWith(String(year)) ? sel : (active[active.length - 1]?.key ?? series[0].key)
  const s = useMemo(() => summarize(data, selKey), [data, selKey])
  const score = freedomScore(data, s)

  const byCat = data.categories
    .map((c) => ({ c, v: s.byCategory[c.id] ?? 0 }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v)
  const maxCat = byCat[0]?.v ?? 1

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center rounded-lg border bg-card">
          <Button variant="ghost" size="icon" onClick={() => setYear(year - 1)} aria-label="Previous year">
            <ChevronLeft />
          </Button>
          <span className="min-w-16 text-center text-[15px] font-medium text-navy tabular-nums">{year}</span>
          <Button variant="ghost" size="icon" onClick={() => setYear(year + 1)} aria-label="Next year">
            <ChevronRight />
          </Button>
        </div>
        <Button variant="outline" className="h-10" onClick={() => onOpenMonth(selKey)}>
          Open {monthLabel(selKey)} report
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label={`Earned in ${year}`} value={m(totals.earned)} />
        <Stat label={`Spent in ${year}`} value={m(totals.spent)} />
        <Stat label="Kept (earned − spent)" value={m(totals.earned - totals.spent)} tone={totals.earned - totals.spent < 0 ? 'bad' : undefined} />
        <Stat label="Borrowed" value={m(totals.borrowed)} tone={totals.borrowed > 0 ? 'warn' : undefined} />
      </div>

      <Card>
        <CardContent className="grid gap-5">
          <CardTitleRow
            title="Month by month"
            sub="Click a month to see its breakdown below."
            action={
              <Tabs value={view} onValueChange={(v) => setView(v as 'chart' | 'table')}>
                <TabsList>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
              </Tabs>
            }
          />
          {view === 'chart' ? (
            <MonthlyBars data={series} keys={['earned', 'spent']} height={300} selected={selKey} onSelect={setSel} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[15px] tabular-nums">
                <thead className="text-[13px] text-muted-foreground">
                  <tr className="border-b">
                    <th className="px-3 py-2 text-left font-medium">Month</th>
                    <th className="px-3 py-2 text-right font-medium">Earned</th>
                    <th className="px-3 py-2 text-right font-medium">Spent</th>
                    <th className="px-3 py-2 text-right font-medium">Debt repaid</th>
                    <th className="px-3 py-2 text-right font-medium">Borrowed</th>
                    <th className="px-3 py-2 text-right font-medium">Kept</th>
                  </tr>
                </thead>
                <tbody>
                  {series.map((x) => (
                    <tr key={x.key} onClick={() => setSel(x.key)} className={cn('cursor-pointer border-b last:border-0 hover:bg-muted/60', x.key === selKey && 'bg-accent')}>
                      <td className="px-3 py-2.5">{x.full}</td>
                      <td className="px-3 py-2.5 text-right">{m(x.earned)}</td>
                      <td className="px-3 py-2.5 text-right">{m(x.spent)}</td>
                      <td className="px-3 py-2.5 text-right">{m(x.debtPaid)}</td>
                      <td className={cn('px-3 py-2.5 text-right', x.borrowed > 0 && 'text-amber-700')}>{m(x.borrowed)}</td>
                      <td className={cn('px-3 py-2.5 text-right font-medium', x.net < 0 ? 'text-red-600' : 'text-navy')}>{m(x.net)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-semibold text-navy">
                    <td className="px-3 py-2.5">Total</td>
                    <td className="px-3 py-2.5 text-right">{m(totals.earned)}</td>
                    <td className="px-3 py-2.5 text-right">{m(totals.spent)}</td>
                    <td className="px-3 py-2.5 text-right">{m(series.reduce((a, x) => a + x.debtPaid, 0))}</td>
                    <td className="px-3 py-2.5 text-right">{m(totals.borrowed)}</td>
                    <td className="px-3 py-2.5 text-right">{m(totals.earned - totals.spent)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="-mb-2 text-xl font-semibold text-navy">{monthLabel(selKey)}</h2>

      {s.count === 0 ? (
        <Empty title="No spending recorded this month" />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="grid gap-4">
              <CardTitleRow title="Where the money went" sub="Red bars went over their limit." />
              {byCat.map(({ c, v }) => {
                const lvl = budgetLevel(v, c.budget, data.settings.warnAt)
                return (
                  <div key={c.id} className="grid grid-cols-[minmax(0,200px)_minmax(0,1fr)_auto] items-center gap-4">
                    <span className="truncate text-[15px]">
                      <span className="mr-2">{c.emoji}</span>
                      {c.name}
                    </span>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className={cn('h-full rounded-full', lvl === 'over' ? 'bg-red-600' : 'bg-[var(--series-spent)]')} style={{ width: `${(v / maxCat) * 100}%` }} />
                    </div>
                    <span className="w-36 text-right text-[15px] tabular-nums">
                      {m(v)} <span className="text-[13px] text-muted-foreground">{pct(v / s.spent)}</span>
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card>
              <CardContent className="grid gap-4">
                <CardTitleRow title="By type" />
                {KIND_ORDER.map((k) => {
                  const v = s.byKind[k]
                  return (
                    <div key={k} className="grid gap-1.5">
                      <div className="flex justify-between text-sm">
                        <span>{KIND_LABEL[k]}</span>
                        <span className="tabular-nums">
                          {m(v)} <span className="text-muted-foreground">{s.spent ? pct(v / s.spent) : '0%'}</span>
                        </span>
                      </div>
                      <Bar value={s.spent ? v / s.spent : 0} level={k === 'want' && s.spent && v / s.spent > 0.3 ? 'warn' : 'ok'} />
                    </div>
                  )
                })}
                <p className="text-[13px] text-muted-foreground">Aim to keep wants under 30% and put at least 20% into debt, savings and investments.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="grid gap-3">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-base font-semibold text-navy">Month score</h2>
                  <p className="text-2xl font-semibold text-navy tabular-nums">
                    {score.score}
                    <span className="text-sm font-normal text-muted-foreground"> / 100</span>
                  </p>
                </div>
                {score.parts.map((p) => (
                  <div key={p.label} className="flex justify-between text-sm">
                    <span className={p.points === p.max ? 'text-foreground' : 'text-muted-foreground'}>
                      {p.points === p.max ? '✓' : '○'} {p.label}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {p.points}/{p.max}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export function StatsPage() {
  const [tab, setTab] = useState<'month' | 'year'>('month')
  const [monthKey, setMonthKey] = useState(currentMonth())
  return (
    <div className="grid gap-8">
      <PageHeader
        title="Reports"
        subtitle={tab === 'month' ? 'Your report card for the month: plan vs actual, and compared with last month.' : 'The whole year, month by month.'}
        action={
          <Tabs value={tab} onValueChange={(v) => setTab(v as 'month' | 'year')} className="print:hidden">
            <TabsList className="h-10">
              <TabsTrigger value="month" className="px-4">Monthly</TabsTrigger>
              <TabsTrigger value="year" className="px-4">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />
      {tab === 'month' ? (
        <MonthlyReport monthKey={monthKey} setMonthKey={setMonthKey} />
      ) : (
        <YearlyReport
          onOpenMonth={(k) => {
            setMonthKey(k)
            setTab('month')
          }}
        />
      )}
    </div>
  )
}
