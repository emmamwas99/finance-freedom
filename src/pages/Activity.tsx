import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Empty, MonthSwitcher, PageHeader, Stat } from '@/components/shared'
import { TxRow, toItems } from '@/components/TxList'
import { summarize } from '@/lib/calc'
import { currentMonth, monthOf } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useFmt, useStore } from '@/store/data'
import { useUI } from '@/store/ui'

type Filter = 'all' | 'out' | 'in'

export function ActivityPage() {
  const { data } = useStore()
  const { m } = useFmt()
  const { openTx } = useUI()
  const [key, setKey] = useState(currentMonth())
  const [filter, setFilter] = useState<Filter>('all')
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const s = summarize(data, key)

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const catName = (id: string) => data.categories.find((c) => c.id === id)?.name ?? ''
    const ex =
      filter === 'in'
        ? []
        : data.expenses.filter(
            (e) =>
              monthOf(e.date) === key &&
              (cat === 'all' || e.categoryId === cat) &&
              (!needle || `${e.note ?? ''} ${catName(e.categoryId)}`.toLowerCase().includes(needle)),
          )
    const inc =
      filter === 'out' || cat !== 'all'
        ? []
        : data.incomes.filter((i) => monthOf(i.date) === key && (!needle || `${i.note ?? ''} ${i.source}`.toLowerCase().includes(needle)))
    return toItems(ex, inc)
  }, [data, key, filter, cat, q])

  const shownOut = items.reduce((t, x) => (x.type === 'expense' ? t + x.item.amount : t), 0)

  return (
    <div className="grid gap-8">
      <PageHeader
        title="Transactions"
        subtitle="Every shilling in and out. Click a row to edit it."
        action={
          <>
            <MonthSwitcher value={key} onChange={setKey} />
            <Button className="hidden h-10 sm:inline-flex" onClick={() => openTx({ kind: 'expense' })}>
              <Plus /> Expense
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <Stat label="Money in (earned)" value={m(s.earned)} sub={s.borrowed > 0 ? `+ ${m(s.borrowed)} borrowed` : undefined} />
        <Stat label="Money out" value={m(s.spent)} sub={`${s.count} expenses`} />
        <Stat label="Difference" value={m(s.net)} tone={s.net < 0 ? 'bad' : undefined} />
      </div>

      <Card>
        <CardContent className="grid gap-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notes or categories" className="pl-9" />
            </div>
            <div className="flex rounded-lg border p-1">
              {(['all', 'out', 'in'] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn('rounded-md px-4 py-1.5 text-sm', filter === f ? 'bg-navy text-white' : 'text-muted-foreground hover:text-foreground')}
                >
                  {f === 'all' ? 'All' : f === 'out' ? 'Money out' : 'Money in'}
                </button>
              ))}
            </div>
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger className="w-full md:w-60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {data.categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.emoji} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {items.length === 0 ? (
            <Empty title="Nothing here">No transactions match for this month.</Empty>
          ) : (
            <div>
              <div className="hidden grid-cols-[110px_36px_minmax(0,1fr)_220px_140px_40px] gap-3 border-b px-2 pb-2 text-[13px] font-medium text-muted-foreground md:grid">
                <span>Date</span>
                <span />
                <span>Description</span>
                <span>Category</span>
                <span className="text-right">Amount</span>
                <span />
              </div>
              <div className="divide-y">
                {items.map((t) => (
                  <TxRow key={t.item.id} tx={t} wide />
                ))}
              </div>
              <div className="mt-2 flex justify-between border-t px-2 pt-3 text-sm text-muted-foreground">
                <span>{items.length} transactions</span>
                <span>
                  Total out <b className="text-foreground tabular-nums">{m(shownOut)}</b>
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
