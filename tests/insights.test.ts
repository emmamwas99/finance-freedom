import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { monthReport, progressCheck } from '../src/lib/insights'
import { bill, exp, household, inc, loan } from './helpers/fixtures'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 10, 15, 12))
})
afterEach(() => vi.useRealTimers())

describe('Am I on track?', () => {
  it('is empty until there is something recorded', () => {
    expect(progressCheck(household()).empty).toBe(true)
  })

  it('a disciplined household is on track', () => {
    const months = ['2026-09', '2026-10', '2026-11']
    const d = household({
      incomes: months.map((m) => inc(`${m}-01`, 85000)),
      expenses: months.flatMap((m) => [exp(`${m}-02`, 30000, 'rent'), exp(`${m}-03`, 12000, 'food'), exp(`${m}-04`, 3000, 'fun'), exp(`${m}-05`, 10000, 'save')]),
    })
    // recent entries for the tracking habit
    for (let i = 0; i < 8; i++) d.expenses.push(exp(`2026-11-${String(5 + i).padStart(2, '0')}`, 100, 'food'))
    const r = progressCheck(d)
    if (r.empty) throw new Error('expected checks')
    expect(r.verdict.status).toBe('good')
    expect(r.checks.find((c) => c.id === 'living')!.status).toBe('good')
    expect(r.checks.find((c) => c.id === 'saving')!.status).toBe('good')
  })

  it('borrowing, overspending and heavy debt are flagged with advice, worst first', () => {
    const d = household({
      loans: [loan('fuliza', 50000, 30000, 0)],
      bills: [bill('fuliza-bill', 30000, 'loans', { loanId: 'fuliza' })],
      incomes: [inc('2026-11-01', 60000), inc('2026-11-10', 15000, { isLoan: true })],
      expenses: [exp('2026-11-02', 70000, 'fun')],
    })
    const r = progressCheck(d)
    if (r.empty) throw new Error('expected checks')
    expect(r.checks[0].status).toBe('bad') // sorted worst first
    expect(r.checks.find((c) => c.id === 'borrowing')!.status).toBe('bad')
    expect(r.checks.find((c) => c.id === 'burden')!.status).not.toBe('good')
    expect(r.actions.length).toBeGreaterThan(0)
    expect(r.actions.length).toBeLessThanOrEqual(3)
  })
})

describe('monthly report', () => {
  it('compares with last month and lists wins and fixes', () => {
    const d = household({
      bills: [bill('rent', 18000, 'rent')],
      incomes: [inc('2026-10-01', 85000), inc('2026-11-01', 85000)],
      expenses: [exp('2026-10-02', 60000, 'food'), exp('2026-11-02', 18000, 'rent', { billId: 'rent' }), exp('2026-11-03', 10000, 'food'), exp('2026-11-04', 5000, 'save')],
    })
    const r = monthReport(d, '2026-11')
    expect(r.kept).toBe(85000 - 33000)
    expect(r.unpaid).toHaveLength(0)
    expect(r.wins.join(' ')).toContain('All 1 planned payments were made')
    expect(r.wins.join(' ')).toContain('less than in Oct')
    expect(r.verdict.status).toBe('good')
  })

  it('a future month is labelled as not started', () => {
    expect(monthReport(household(), '2027-01').verdict.title).toMatch(/hasn't started/)
  })
})
