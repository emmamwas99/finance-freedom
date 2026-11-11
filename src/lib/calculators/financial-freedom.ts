/**
 * Financial independence ("work becomes optional") estimate.
 * FI number = annual spending ÷ withdrawal rate (4% → 25× spending). The 4% figure comes from US
 * retirement research and is a rough guideline, not a guarantee, so the rate is user-adjustable.
 * Returns are entered as REAL returns (after inflation), so all amounts are in today's shillings.
 */

export interface FreedomInput {
  monthlyIncome: number
  monthlySpending: number
  currentInvestments: number
  /** Expected yearly return after inflation, in %. */
  realReturn: number
  /** Safe withdrawal rate in % (default 4). */
  withdrawalRate: number
}

export function fiNumber(monthlySpending: number, withdrawalRate = 4) {
  const rate = Math.max(0.5, withdrawalRate) / 100
  return (Math.max(0, monthlySpending) * 12) / rate
}

/** Months until investments reach the target, saving `monthly` with monthly compounding. Capped at 100 years. */
export function monthsToTarget(current: number, monthly: number, target: number, realReturn: number) {
  if (current >= target) return 0
  const r = (1 + Math.max(-0.99, realReturn / 100)) ** (1 / 12) - 1
  let bal = current
  for (let m = 1; m <= 1200; m++) {
    bal = bal * (1 + r) + monthly
    if (bal >= target) return m
  }
  return Infinity
}

export function financialFreedom(input: FreedomInput) {
  const income = Math.max(0, input.monthlyIncome)
  const spending = Math.max(0, input.monthlySpending)
  const monthlySaving = income - spending
  const savingsRate = income > 0 ? monthlySaving / income : 0
  const target = fiNumber(spending, input.withdrawalRate)
  const months = monthlySaving > 0 || input.currentInvestments >= target ? monthsToTarget(input.currentInvestments, Math.max(0, monthlySaving), target, input.realReturn) : Infinity
  return { monthlySaving, savingsRate, target, months, years: months / 12 }
}

/** Years to FI at different savings rates, starting from zero, with the same assumptions. */
export function savingsRateTable(realReturn: number, withdrawalRate = 4, rates = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]) {
  return rates.map((rate) => {
    // spending is (1 − rate) of income; income cancels out, so use 100
    const spending = 100 * (1 - rate)
    const months = monthsToTarget(0, 100 * rate, fiNumber(spending, withdrawalRate), realReturn)
    return { rate, years: months / 12 }
  })
}
