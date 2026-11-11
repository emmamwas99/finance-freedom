/**
 * Payments-first budget, the same method as the app's monthly plan:
 *   income − planned payments = left after payments
 *   left after payments − everyday spending limits = unplanned money
 */

export interface BudgetLine {
  name: string
  amount: number
}

export interface BudgetInput {
  income: number
  payments: BudgetLine[]
  limits: BudgetLine[]
  /** Days left in the month including today, for the daily allowance. */
  daysLeft: number
}

export interface BudgetResult {
  paymentsTotal: number
  limitsTotal: number
  afterPayments: number
  unplanned: number
  perDay: number
  /** Share of income going to planned payments (0–1). */
  paymentsShare: number
  status: 'over' | 'tight' | 'ok'
}

const sum = (xs: BudgetLine[]) => xs.reduce((t, x) => t + (Number.isFinite(x.amount) && x.amount > 0 ? x.amount : 0), 0)

export function budgetPlan(input: BudgetInput): BudgetResult {
  const income = Math.max(0, input.income)
  const paymentsTotal = sum(input.payments)
  const limitsTotal = sum(input.limits)
  const afterPayments = income - paymentsTotal
  const unplanned = afterPayments - limitsTotal
  const days = Math.max(1, Math.round(input.daysLeft))
  const perDay = afterPayments > 0 ? afterPayments / days : 0
  // "tight" mirrors the app's warning: less than 15% of income left after payments
  const status = afterPayments < 0 || unplanned < 0 ? 'over' : income > 0 && afterPayments < income * 0.15 ? 'tight' : 'ok'
  return { paymentsTotal, limitsTotal, afterPayments, unplanned, perDay, paymentsShare: income > 0 ? paymentsTotal / income : 0, status }
}

/** The classic 50/30/20 split of take-home pay, for comparison. */
export function fiftyThirtyTwenty(income: number) {
  const i = Math.max(0, income)
  return { needs: i * 0.5, wants: i * 0.3, savingsAndDebt: i * 0.2 }
}

/** Days left in the month for a date, counting today. */
export function daysLeftInMonth(d = new Date()) {
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  return last - d.getDate() + 1
}
