import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  billDue,
  billsForMonth,
  budgetLevel,
  dailyAllowance,
  debtOverview,
  debtProjection,
  expectedIncomeFor,
  forecast,
  freedomScore,
  goalSaved,
  loanBalance,
  monthPlan,
  plannedIncome,
  summarize,
} from '../src/lib/calc'
import { bill, exp, household, inc, loan } from './helpers/fixtures'

// "Today" is 15 Nov 2026 for every test, so month logic is deterministic.
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 10, 15, 12))
})
afterEach(() => vi.useRealTimers())

describe('summarize', () => {
  it('splits earned vs borrowed money and groups spending by kind', () => {
    const d = household({
      incomes: [inc('2026-11-01', 85000), inc('2026-11-10', 5000, { isLoan: true }), inc('2026-10-01', 80000)],
      expenses: [exp('2026-11-02', 18000, 'rent'), exp('2026-11-03', 3000, 'fun'), exp('2026-11-04', 9000, 'loans'), exp('2026-11-05', 2000, 'save'), exp('2026-10-30', 999, 'food')],
    })
    const s = summarize(d, '2026-11')
    expect(s.earned).toBe(85000)
    expect(s.borrowed).toBe(5000)
    expect(s.spent).toBe(32000)
    expect(s.byKind).toEqual({ need: 18000, want: 3000, debt: 9000, invest: 0, saving: 2000 })
    expect(s.net).toBe(85000 - 32000)
    expect(s.count).toBe(4)
  })

  it('treats an expense in an unknown category as a want', () => {
    const s = summarize(household({ expenses: [exp('2026-11-01', 500, 'deleted-category')] }), '2026-11')
    expect(s.byKind.want).toBe(500)
  })
})

describe('budgetLevel', () => {
  it('warns at the threshold and is over above 100%', () => {
    expect(budgetLevel(100, 0, 0.8)).toBe('none')
    expect(budgetLevel(79, 100, 0.8)).toBe('ok')
    expect(budgetLevel(80, 100, 0.8)).toBe('warn')
    expect(budgetLevel(100, 100, 0.8)).toBe('warn')
    expect(budgetLevel(101, 100, 0.8)).toBe('over')
  })
})

describe('income planning', () => {
  const d = household({ settings: { ...household().settings, incomePlan: [{ from: '2026-12', amount: 264000 }, { from: '2027-03', amount: 300000 }], incomeOverrides: { '2026-11': 388000 } } })

  it('uses one-month override, then the latest "from" change, then the usual salary', () => {
    expect(expectedIncomeFor(d, '2026-10')).toBe(85000)
    expect(expectedIncomeFor(d, '2026-11')).toBe(388000)
    expect(expectedIncomeFor(d, '2026-12')).toBe(264000)
    expect(expectedIncomeFor(d, '2027-02')).toBe(264000)
    expect(expectedIncomeFor(d, '2027-04')).toBe(300000)
  })

  it('past months use what was received; current/future use the larger of received and expected', () => {
    const h = household()
    expect(plannedIncome(h, '2026-10', 70000)).toBe(70000) // past, received
    expect(plannedIncome(h, '2026-10', 0)).toBe(85000) // past, nothing recorded → expected
    expect(plannedIncome(h, '2026-11', 40000)).toBe(85000) // partial salary so far
    expect(plannedIncome(h, '2026-11', 90000)).toBe(90000) // got more than expected
  })
})

describe('planned payments', () => {
  it('handles repeating, month-specific, one-off, start month and skips', () => {
    expect(billDue(bill('a', 1, 'rent'), '2026-11')).toBe(true)
    expect(billDue(bill('a', 1, 'rent', { active: false }), '2026-11')).toBe(false)
    expect(billDue(bill('fees', 1, 'rent', { months: [1, 5, 9] }), '2026-11')).toBe(false)
    expect(billDue(bill('fees', 1, 'rent', { months: [1, 5, 9] }), '2027-01')).toBe(true)
    expect(billDue(bill('once', 1, 'rent', { onlyMonth: '2026-11' }), '2026-11')).toBe(true)
    expect(billDue(bill('once', 1, 'rent', { onlyMonth: '2026-11' }), '2026-12')).toBe(false)
    expect(billDue(bill('later', 1, 'rent', { fromMonth: '2027-01' }), '2026-12')).toBe(false)
    expect(billDue(bill('skip', 1, 'rent', { skips: ['2026-11'] }), '2026-11')).toBe(false)
  })

  it('matches payments to expenses: exact bill link first, then a loan payment recorded elsewhere', () => {
    const d = household({
      loans: [loan('sacco', 100000, 8000, 12)],
      bills: [bill('rent', 18000, 'rent'), bill('sacco-bill', 8000, 'loans', { loanId: 'sacco' }), bill('fees', 7000, 'rent', { overrides: { '2026-11': 9000 } })],
      expenses: [exp('2026-11-02', 18500, 'rent', { billId: 'rent' }), exp('2026-11-06', 8000, 'loans', { loanId: 'sacco' })],
    })
    const ps = billsForMonth(d, '2026-11')
    const by = Object.fromEntries(ps.map((p) => [p.bill.id, p]))
    expect(by.rent.paid).toBe(true)
    expect(by.rent.paidAmount).toBe(18500)
    expect(by['sacco-bill'].paid).toBe(true)
    expect(by.fees.paid).toBe(false)
    expect(by.fees.planned).toBe(9000) // one-month override
  })
})

describe('monthPlan: the heart of the app', () => {
  it('income − payments = left after payments; − other spending = remaining', () => {
    const d = household({
      incomes: [inc('2026-11-01', 85000)],
      bills: [bill('rent', 18000, 'rent'), bill('school', 7000, 'rent'), bill('helper', 7500, 'rent')],
      expenses: [exp('2026-11-02', 18000, 'rent', { billId: 'rent' }), exp('2026-11-03', 6000, 'food'), exp('2026-11-04', 1500, 'fun')],
    })
    const p = monthPlan(d, '2026-11')
    expect(p.income).toBe(85000)
    // paid items count what was paid; unpaid count the plan
    expect(p.paymentsTotal).toBe(18000 + 7000 + 7500)
    expect(p.paidTotal).toBe(18000)
    expect(p.toPay).toBe(14500)
    expect(p.otherSpent).toBe(7500)
    expect(p.afterPayments).toBe(85000 - 32500)
    expect(p.remaining).toBe(85000 - 32500 - 7500)
  })

  it('a paid amount different from the plan replaces the plan', () => {
    const d = household({ bills: [bill('rent', 18000, 'rent')], expenses: [exp('2026-11-02', 20000, 'rent', { billId: 'rent' })] })
    const p = monthPlan(d, '2026-11')
    expect(p.paymentsTotal).toBe(20000)
    expect(p.otherSpent).toBe(0)
  })
})

describe('loans and debt', () => {
  const d = household({
    loans: [loan('bank', 180000, 9000, 16), loan('sacco', 60000, 4000, 12), loan('paid', 1000, 500, 0)],
    expenses: [exp('2026-10-05', 9000, 'loans', { loanId: 'bank' }), exp('2026-11-05', 9000, 'loans', { loanId: 'bank' }), exp('2026-11-05', 1000, 'loans', { loanId: 'paid' })],
  })

  it('balance = amount − repayments, never negative', () => {
    expect(loanBalance(d, d.loans[0])).toBe(162000)
    expect(loanBalance(d, d.loans[2])).toBe(0)
  })

  it('keeps an amount owed separate from money paid out until a linked repayment is recorded', () => {
    const debt = loan('friend', 12000, 2000, 0)
    const owed = household({ loans: [debt] })
    expect(debtOverview(owed).total).toBe(12000)
    expect(summarize(owed, '2026-11').spent).toBe(0)

    const unlinked = household({ loans: [debt], expenses: [exp('2026-11-02', 2000, 'loans')] })
    expect(summarize(unlinked, '2026-11').debtPaid).toBe(2000)
    expect(debtOverview(unlinked).total).toBe(12000)

    const linked = household({ loans: [debt], expenses: [exp('2026-11-02', 2000, 'loans', { loanId: 'friend' })] })
    expect(summarize(linked, '2026-11').spent).toBe(2000)
    expect(debtOverview(linked).total).toBe(10000)
  })

  it('debt-free date is the slowest loan, counted from this month', () => {
    const o = debtOverview(d)
    expect(o.total).toBe(162000 + 60000)
    expect(o.monthly).toBe(13000)
    expect(o.loans).toHaveLength(2) // the cleared loan drops out
    // bank: −ln(1 − 0.01333·162,000/9,000)/ln(1.01333) = 20.7 → 21 months; sacco: 16.3 → 17
    expect(o.monthsLeft).toBe(21)
    expect(o.freeKey).toBe('2028-08')
  })

  it('projection starts with today’s total and reaches zero; extra payments finish sooner', () => {
    const base = debtProjection(d)
    const extra = debtProjection(d, 5000)
    expect(base[0]).toMatchObject({ key: '2026-11', total: 222000 })
    expect(base.at(-1)!.total).toBe(0)
    expect(extra.length).toBeLessThan(base.length)
  })

  it('a payment below the interest never clears (no debt-free date)', () => {
    const stuck = household({ loans: [loan('fuliza', 100000, 1000, 24)] }) // interest 2,000/month
    expect(debtOverview(stuck).freeKey).toBeNull()
  })
})

describe('goals, forecast and guidance', () => {
  it('goal progress = starting amount + linked contributions', () => {
    const d = household({ goals: [{ id: 'g', name: 'Shop', emoji: '🏪', target: 100000, startingAmount: 10000, createdAt: '2026-01-01' }], expenses: [exp('2026-11-01', 5000, 'shop', { goalId: 'g' })] })
    expect(goalSaved(d, 'g')).toBe(15000)
  })

  it('forecast plans each category as the larger of its limit and the bills due in it', () => {
    const d = household({ bills: [bill('rent', 18000, 'rent'), bill('groceries', 20000, 'food')] })
    const f = forecast(d, '2026-12')
    const food = f.plans.find((p) => p.category.id === 'food')!
    expect(food.planned).toBe(20000) // bill > 15,000 limit
    expect(f.underBudgeted.map((p) => p.category.id)).toEqual(['food'])
    expect(f.leftover).toBe(85000 - f.planned)
  })

  it('daily allowance only exists for the current month', () => {
    const d = household({ incomes: [inc('2026-11-01', 85000)], expenses: [exp('2026-11-02', 25000, 'rent')] })
    const a = dailyAllowance(d, '2026-11', summarize(d, '2026-11'))!
    expect(a.daysLeft).toBe(16) // 15 → 30 Nov inclusive
    expect(a.left).toBe(60000)
    expect(a.perDay).toBe(3750)
    expect(dailyAllowance(d, '2026-10', summarize(d, '2026-10'))).toBeNull()
  })

  it('freedom score adds up to 100 for a perfect month', () => {
    const d = household({
      incomes: [inc('2026-11-01', 85000)],
      expenses: [exp('2026-11-02', 10000, 'food'), exp('2026-11-03', 2000, 'fun'), exp('2026-11-04', 5000, 'save')],
    })
    const { score, parts } = freedomScore(d, summarize(d, '2026-11'))
    expect(parts.reduce((t, p) => t + p.max, 0)).toBe(100)
    expect(score).toBe(100)
  })

  it('freedom score penalises overspending, borrowing and broken limits', () => {
    const d = household({
      settings: { ...household().settings, expectedIncome: 50000 },
      incomes: [inc('2026-11-01', 50000), inc('2026-11-20', 10000, { isLoan: true })],
      expenses: [exp('2026-11-02', 50000, 'food'), exp('2026-11-03', 10000, 'fun')],
    })
    const { score, parts } = freedomScore(d, summarize(d, '2026-11'))
    expect(parts.find((p) => p.label === 'No new loans')!.points).toBe(0)
    expect(parts.find((p) => p.label === 'Budgets respected')!.points).toBe(0)
    expect(parts.find((p) => p.label === 'Spending within income')!.points).toBe(0) // 60k / 50k = 120%
    expect(score).toBe(10) // only "paying down debt" (no debt) scores
  })
})
