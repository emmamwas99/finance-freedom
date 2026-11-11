import { describe, expect, it } from 'vitest'
import { monthlyInterest, monthsToClear, simulateDebts, type DebtInput } from '../src/lib/calculators/debt'

/** The Vite app's original debtProjection loop, verbatim, as the reference implementation. */
function originalProjection(loansIn: DebtInput[], extraPerMonth = 0, maxMonths = 120) {
  const loans = loansIn.map((l) => ({ bal: l.balance, pay: l.payment, r: l.annualRate / 100 / 12 }))
  const total = () => loans.reduce((s, l) => s + l.bal, 0)
  const out = [total()]
  for (let i = 0; i < maxMonths && total() > 0.5; i++) {
    let extra = extraPerMonth
    const order = [...loans].sort((a, b) => b.r - a.r)
    for (const l of loans) {
      if (l.bal <= 0) continue
      l.bal = l.bal * (1 + l.r) - l.pay
      if (l.bal < 0) {
        extra += -l.bal
        l.bal = 0
      }
    }
    for (const l of order) {
      if (extra <= 0) break
      if (l.bal <= 0) continue
      const use = Math.min(extra, l.bal)
      l.bal -= use
      extra -= use
    }
    out.push(Math.max(0, total()))
  }
  return out
}

const LOANS: DebtInput[] = [
  { name: 'Bank', balance: 180000, payment: 9000, annualRate: 16 },
  { name: 'SACCO', balance: 60000, payment: 4000, annualRate: 12 },
  { name: 'App loan', balance: 12000, payment: 3000, annualRate: 60 },
]

describe('monthsToClear', () => {
  it('matches the amortisation formula and its edge cases', () => {
    expect(monthsToClear(0, 1000, 10)).toBe(0)
    expect(monthsToClear(1000, 0, 10)).toBe(Infinity)
    expect(monthsToClear(12000, 1000, 0)).toBe(12)
    expect(monthsToClear(12001, 1000, 0)).toBe(13)
    expect(monthsToClear(100000, 1000, 12)).toBe(Infinity) // interest = payment
    expect(monthsToClear(120000, 6000, 14)).toBe(23)
    expect(monthsToClear(120000, 8000, 14)).toBe(17)
  })

  it('monthly interest is balance × rate ÷ 12', () => {
    expect(monthlyInterest(180000, 16)).toBeCloseTo(2400)
  })
})

describe('simulateDebts', () => {
  it('reproduces the original app projection exactly (refactor safety net)', () => {
    for (const extra of [0, 2000, 10000]) {
      const ref = originalProjection(LOANS, extra)
      const now = simulateDebts(LOANS, { extraPerMonth: extra }).totals
      expect(now).toHaveLength(ref.length)
      now.forEach((v, i) => expect(v).toBeCloseTo(ref[i], 6))
    }
  })

  it('agrees with the closed-form months for a single loan', () => {
    const s = simulateDebts([{ balance: 120000, payment: 6000, annualRate: 14 }], { maxMonths: 600 })
    expect(s.months).toBe(monthsToClear(120000, 6000, 14))
    expect(s.clearedAt).toEqual([s.months])
  })

  it('total interest = total paid − starting balance', () => {
    const s = simulateDebts([{ balance: 120000, payment: 8000, annualRate: 14 }], { maxMonths: 600 })
    // 16 full payments plus a smaller last one; interest is the difference
    expect(s.interest).toBeGreaterThan(12000)
    expect(s.interest).toBeLessThan(13500)
  })

  it('extra payments go to the highest rate first and save time and interest', () => {
    const base = simulateDebts(LOANS, { maxMonths: 600 })
    const boosted = simulateDebts(LOANS, { maxMonths: 600, extraPerMonth: 2000 })
    expect(boosted.months).toBeLessThan(base.months)
    expect(boosted.interest).toBeLessThan(base.interest)
    // the 60% app loan clears before the others
    expect(boosted.clearedAt[2]).toBeLessThan(boosted.clearedAt[1])
    expect(boosted.clearedAt[2]).toBeLessThan(boosted.clearedAt[0])
  })

  it('rolling over a cleared loan’s payment is never slower', () => {
    const plain = simulateDebts(LOANS, { maxMonths: 600 })
    const roll = simulateDebts(LOANS, { maxMonths: 600, rollover: true })
    expect(roll.months).toBeLessThanOrEqual(plain.months)
    expect(roll.interest).toBeLessThanOrEqual(plain.interest)
  })

  it('reports Infinity when a payment never beats the interest', () => {
    const s = simulateDebts([{ balance: 100000, payment: 1500, annualRate: 24 }], { maxMonths: 600 })
    expect(s.months).toBe(Infinity)
    expect(s.clearedAt[0]).toBe(Infinity)
  })

  it('ignores negative inputs and empty lists', () => {
    expect(simulateDebts([]).months).toBe(0)
    expect(simulateDebts([{ balance: -5, payment: 100, annualRate: 10 }]).totals).toEqual([0])
  })
})
