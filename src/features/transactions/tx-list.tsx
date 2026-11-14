'use client'

import { Copy, HandCoins, MoreHorizontal, Pencil, Receipt, Trash2, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { dayLabel, todayISO } from '@/lib/format'
import type { Expense, Income } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useFmt, useStore } from '@/store/data'
import { useUI } from '@/store/ui'

export type TxItem = { type: 'expense'; item: Expense } | { type: 'income'; item: Income }

export function toItems(expenses: Expense[], incomes: Income[]): TxItem[] {
  const all: TxItem[] = [
    ...expenses.map((item) => ({ type: 'expense' as const, item })),
    ...incomes.map((item) => ({ type: 'income' as const, item })),
  ]
  return all.sort((a, b) => b.item.date.localeCompare(a.item.date) || b.item.createdAt.localeCompare(a.item.createdAt))
}

/** One transaction. `wide` adds date + category columns for desktop tables. */
export function TxRow({ tx, wide }: { tx: TxItem; wide?: boolean }) {
  const { data, update } = useStore()
  const { m } = useFmt()
  const { openTx } = useUI()

  let icon, title, sub, category, amount, amountClass
  if (tx.type === 'expense') {
    const e = tx.item
    const c = data.categories.find((x) => x.id === e.categoryId)
    const loan = e.loanId ? data.loans.find((l) => l.id === e.loanId) : null
    const goal = e.goalId ? data.goals.find((g) => g.id === e.goalId) : null
    icon = <Receipt className="size-4 text-muted-foreground" />
    title = e.note || c?.name || 'Expense'
    category = c?.name ?? '—'
    sub = [wide ? null : e.note ? c?.name : dayLabel(e.date), loan && `repays ${loan.name}`, goal && `towards ${goal.name}`].filter(Boolean).join(' · ')
    amount = `− ${m(e.amount)}`
    amountClass = 'text-foreground'
  } else {
    const i = tx.item
    icon = i.isLoan ? <HandCoins className="size-4 text-amber-700" /> : <Wallet className="size-4 text-primary" />
    title = i.note || i.source
    category = i.isLoan ? 'Borrowed money' : 'Income'
    sub = wide ? (i.note ? i.source : '') : i.isLoan ? 'Borrowed money' : i.note ? i.source : 'Income'
    amount = `+ ${m(i.amount)}`
    amountClass = i.isLoan ? 'text-amber-700' : 'text-primary'
  }

  const remove = () => {
    if (tx.type === 'expense') {
      const e = tx.item
      update((d) => ({ ...d, expenses: d.expenses.filter((x) => x.id !== e.id) }))
      toast('Expense deleted', { action: { label: 'Undo', onClick: () => update((d) => ({ ...d, expenses: [...d.expenses, e] })) } })
    } else {
      const i = tx.item
      update((d) => ({ ...d, incomes: d.incomes.filter((x) => x.id !== i.id) }))
      toast('Income deleted', { action: { label: 'Undo', onClick: () => update((d) => ({ ...d, incomes: [...d.incomes, i] })) } })
    }
  }
  const duplicate = () => {
    if (tx.type === 'expense') {
      const { id: _id, billId: _b, ...rest } = tx.item
      openTx({ kind: 'expense', preset: { ...rest, date: todayISO() } })
    } else {
      const { id: _id, loanId: _l, isLoan: _il, ...rest } = tx.item
      openTx({ kind: 'income', preset: { ...rest, date: todayISO() } })
    }
  }
  const edit = () => openTx({ kind: tx.type, id: tx.item.id })

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && e.target === e.currentTarget && edit()}
      className={cn(
        'grid w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-muted/70',
        wide ? 'grid-cols-[36px_minmax(0,1fr)_auto_40px] md:grid-cols-[110px_36px_minmax(0,1fr)_220px_140px_40px]' : 'grid-cols-[36px_minmax(0,1fr)_auto]',
      )}
      onClick={edit}
    >
      {wide && <span className="hidden text-sm text-muted-foreground md:block">{dayLabel(tx.item.date)}</span>}
      <span className="flex size-9 items-center justify-center rounded-full bg-muted">{icon}</span>
      <span className="min-w-0">
        <span className="block truncate text-[15px]">{title}</span>
        {sub && <span className="block truncate text-[13px] text-muted-foreground">{sub}</span>}
      </span>
      {wide && <span className="hidden truncate text-sm text-muted-foreground md:block">{category}</span>}
      <span className={cn('text-right text-[15px] font-medium tabular-nums', amountClass)}>{amount}</span>
      {wide && (
        <span onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Actions">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={edit}>
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={duplicate}>
                <Copy /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={remove}>
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      )}
    </div>
  )
}
