import { describe, expect, it } from 'vitest'
import { budgetPlan, daysLeftInMonth, fiftyThirtyTwenty } from '../src/lib/calculators/budget'
import { emergencyFund } from '../src/lib/calculators/emergency-fund'
import { financialFreedom, fiNumber, monthsToTarget, savingsRateTable } from '../src/lib/calculators/financial-freedom'
import { financialHealth, type HealthInput } from '../src/lib/calculators/financial-health'
import { futureValue, monthlyForGoal, monthsBetween, monthsToGoal, projectSavings, savingsGrowth } from '../src/lib/calculators/savings-goal'

describe('budget calculator', () => {
  const base = {
    income: 85000,
    payments: [
      { name: 'Rent', amount: 18000 },
      { name: 'SACCO', amount: 8000 },
      { name: 'Fees', amount: 7000 },
      { name: 'Help', amount: 7500 },
    ],
    limits: [{ name: 'Food', amount: 15000 }],
    daysLeft: 30,
  }

  it('matches the worked example on the page', () => {
    const r = budgetPlan(base)
    expect(r.paymentsTotal).toBe(40500)
    expect(r.afterPayments).toBe(44500)
    expect(r.perDay).toBeCloseTo(1483.33, 2)
    expect(r.unplanned).toBe(29500)
    expect(r.status).toBe('ok')
  })

  it('flags over-planned and tight months and ignores invalid amounts', () => {
    expect(budgetPlan({ ...base, income: 40000 }).status).toBe('over')
    expect(budgetPlan({ ...base, income: 46000, limits: [] }).status).toBe('tight') // 5,500 left < 15%
    expect(budgetPlan({ ...base, payments: [{ name: 'x', amount: Number.NaN }, { name: 'y', amount: -5 }] }).paymentsTotal).toBe(0)
    expect(budgetPlan({ ...base, daysLeft: 0 }).perDay).toBe(44500) // at least one day
  })

  it('50/30/20 and days left', () => {
    expect(fiftyThirtyTwenty(100000)).toEqual({ needs: 50000, wants: 30000, savingsAndDebt: 20000 })
    expect(daysLeftInMonth(new Date(2026, 10, 15))).toBe(16)
    expect(daysLeftInMonth(new Date(2027, 1, 28))).toBe(1)
  })
})

describe('emergency fund calculator', () => {
  it('matches the worked example on the page', () => {
    const r = emergencyFund({ essentialsPerMonth: 45000, monthsOfCover: 3, currentSavings: 20000, monthlySaving: 8000 })
    expect(r.target).toBe(135000)
    expect(r.gap).toBe(115000)
    expect(r.monthsToTarget).toBe(15)
    expect(r.starterGap).toBe(25000)
    expect(r.coveredMonths).toBeCloseTo(0.444, 3)
  })

  it('handles already-funded and no-saving cases', () => {
    expect(emergencyFund({ essentialsPerMonth: 10000, monthsOfCover: 3, currentSavings: 50000, monthlySaving: 0 }).monthsToTarget).toBe(0)
    expect(emergencyFund({ essentialsPerMonth: 10000, monthsOfCover: 3, currentSavings: 0, monthlySaving: 0 }).monthsToTarget).toBe(Infinity)
  })
})

describe('savings goal calculator', () => {
  it('without interest it is simple division (page example)', () => {
    expect(monthlyForGoal(150000, 10000, 12)).toBeCloseTo(11666.67, 2)
  })

  it('with interest the monthly amount is lower and projects back to the goal', () => {
    const m = monthlyForGoal(150000, 10000, 12, 8)
    expect(m).toBeLessThan(11666.67)
    expect(projectSavings(10000, m, 12, 8).balance).toBeCloseTo(150000, 2)
  })

  it('months to goal and edge cases', () => {
    expect(monthsToGoal(12000, 0, 1000)).toBe(12)
    expect(monthsToGoal(1000, 2000, 0)).toBe(0)
    expect(monthsToGoal(1000, 0, 0)).toBe(Infinity)
    expect(monthlyForGoal(1000, 5000, 6)).toBe(0)
    expect(monthsBetween('2026-11', '2027-08')).toBe(9)
  })
})

describe('savings calculator (growth)', () => {
  it('matches the worked example on the page', () => {
    const r = savingsGrowth(20000, 5000, 8, 5)
    expect(r.deposited).toBe(320000)
    expect(Math.round(r.balance)).toBe(397181)
    expect(Math.round(r.interest)).toBe(77181)
  })

  it('agrees with the closed-form future value and reports each year', () => {
    const r = savingsGrowth(10000, 2500, 11, 7)
    expect(r.balance).toBeCloseTo(futureValue(10000, 2500, 11, 84), 6)
    expect(r.yearly.map((y) => y.year)).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(r.yearly.at(-1)!.balance).toBeCloseTo(r.balance, 6)
  })

  it('handles zero rate, partial years and bad input', () => {
    expect(savingsGrowth(1000, 100, 0, 2).balance).toBe(3400)
    expect(savingsGrowth(0, 1000, 0, 1.5).yearly.map((y) => y.year)).toEqual([1, 2])
    expect(savingsGrowth(-5, -5, -5, 1).balance).toBe(0)
  })
})

describe('financial freedom calculator', () => {
  it('freedom number is 25× yearly spending at 4%', () => {
    expect(fiNumber(84000)).toBe(25200000)
    expect(fiNumber(80000, 3)).toBeCloseTo(32000000)
  })

  it('page example takes several decades at a 30% savings rate', () => {
    const r = financialFreedom({ monthlyIncome: 120000, monthlySpending: 84000, currentInvestments: 200000, realReturn: 3, withdrawalRate: 4 })
    expect(r.monthlySaving).toBe(36000)
    expect(r.savingsRate).toBeCloseTo(0.3)
    expect(r.years).toBeGreaterThan(30)
    expect(r.years).toBeLessThan(36)
  })

  it('no saving means never; a higher savings rate is always faster', () => {
    expect(financialFreedom({ monthlyIncome: 50000, monthlySpending: 60000, currentInvestments: 0, realReturn: 3, withdrawalRate: 4 }).months).toBe(Infinity)
    const t = savingsRateTable(3)
    for (let i = 1; i < t.length; i++) expect(t[i].years).toBeLessThan(t[i - 1].years)
    expect(monthsToTarget(100, 0, 50, 3)).toBe(0)
  })
})

describe('financial health check', () => {
  const healthy: HealthInput = {
    monthlyIncome: 100000,
    monthlySpending: 80000,
    monthlyDebtPayments: 10000,
    monthlyBorrowing: 0,
    monthlySaving: 15000,
    emergencySavings: 200000,
    essentialsPerMonth: 50000,
    wantsPerMonth: 15000,
    tracking: 'always',
  }

  it('a healthy profile scores 100 with no actions', () => {
    const r = financialHealth(healthy)
    expect(r.score).toBe(100)
    expect(r.verdict.status).toBe('good')
    expect(r.actions).toHaveLength(0)
  })

  it('uses the same thresholds as the app (30% debt, 10% saving, 30% wants)', () => {
    const r = financialHealth({ ...healthy, monthlyDebtPayments: 35000, monthlySaving: 5000, wantsPerMonth: 35000 })
    const s = Object.fromEntries(r.checks.map((c) => [c.id, c.status]))
    expect(s.burden).toBe('warn')
    expect(s.saving).toBe('warn')
    expect(s.wants).toBe('bad')
  })

  it('a struggling profile gets the three most urgent moves first', () => {
    const r = financialHealth({ ...healthy, monthlySpending: 110000, monthlyBorrowing: 20000, monthlySaving: 0, emergencySavings: 0, tracking: 'never' })
    expect(r.verdict.status).toBe('bad')
    expect(r.actions).toHaveLength(3)
    expect(r.checks.filter((c) => c.status === 'bad').length).toBeGreaterThanOrEqual(3)
  })
})
