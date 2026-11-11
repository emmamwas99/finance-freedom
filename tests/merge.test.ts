import { describe, expect, it } from 'vitest'
import { merge3 } from '../src/lib/cloud/merge'
import type { AppData, Expense } from '../src/lib/types'

const exp = (id: string, amount: number, note = ''): Expense => ({ id, amount, note, date: '2026-11-01', categoryId: 'c1', createdAt: '2026-11-01' })

function data(expenses: Expense[], name = 'Chris', income = 85000): AppData {
  return {
    version: 1,
    settings: { name, expectedIncome: income, warnAt: 0.8, autoLockMinutes: 5 },
    categories: [{ id: 'c1', name: 'Food', emoji: '🍲', kind: 'need', budget: 0 }],
    expenses,
    incomes: [],
    loans: [],
    goals: [],
    bills: [],
  }
}

describe('merge3 (two devices editing)', () => {
  const base = data([exp('a', 100), exp('b', 200), exp('c', 300)])

  it('keeps additions from both devices', () => {
    const local = data([...base.expenses, exp('phone', 50)])
    const remote = data([...base.expenses, exp('laptop', 70)])
    const ids = merge3(base, local, remote).expenses.map((e) => e.id).sort()
    expect(ids).toEqual(['a', 'b', 'c', 'laptop', 'phone'])
  })

  it('applies deletions from either side', () => {
    const local = data([exp('a', 100), exp('b', 200)]) // deleted c here
    const remote = data([exp('b', 200), exp('c', 300)]) // deleted a there
    expect(merge3(base, local, remote).expenses.map((e) => e.id)).toEqual(['b'])
  })

  it('takes the other device’s edit when this one did not touch the record', () => {
    const local = base
    const remote = data([exp('a', 999), exp('b', 200), exp('c', 300)])
    expect(merge3(base, local, remote).expenses.find((e) => e.id === 'a')!.amount).toBe(999)
  })

  it('this device wins when both edited the same record', () => {
    const local = data([exp('a', 111), exp('b', 200), exp('c', 300)])
    const remote = data([exp('a', 999), exp('b', 200), exp('c', 300)])
    expect(merge3(base, local, remote).expenses.find((e) => e.id === 'a')!.amount).toBe(111)
  })

  it('keeps an edit even if the other device deleted the record', () => {
    const local = data([exp('a', 150), exp('b', 200), exp('c', 300)])
    const remote = data([exp('b', 200), exp('c', 300)])
    expect(merge3(base, local, remote).expenses.find((e) => e.id === 'a')!.amount).toBe(150)
  })

  it('merges settings field by field', () => {
    const local = data(base.expenses, 'Chris K') // changed name here
    const remote = data(base.expenses, 'Chris', 264000) // changed income there
    const m = merge3(base, local, remote)
    expect(m.settings.name).toBe('Chris K')
    expect(m.settings.expectedIncome).toBe(264000)
  })
})
