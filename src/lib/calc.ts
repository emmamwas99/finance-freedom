import { getDaysInMonth } from 'date-fns'
import { currentMonth, monthLabel, monthOf, shiftMonth } from './format'
import type { AppData, Bill, Category, CategoryKind, Expense, Loan } from './types'

export interface MonthSummary {
  key: string
  earned: number // salary & other real income
  borrowed: number // money that came from loans
  spent: number
  byCategory: Record<string, number>
  byKind: Record<CategoryKind, number>
  debtPaid: number
  invested: number
  saved: number
  /** earned - spent. Negative = you lived on borrowed money. */
  net: number
  count: number
}

export function summarize(data: AppData, key: string): MonthSummary {
  const byCategory: Record<string, number> = {}
  const byKind: Record<CategoryKind, number> = { need: 0, want: 0, debt: 0, invest: 0, saving: 0 }
  const kindOf = new Map(data.categories.map((c) => [c.id, c.kind]))
  let spent = 0
  let count = 0
  for (const e of data.expenses) {
    if (monthOf(e.date) !== key) continue
    spent += e.amount
    count++
    byCategory[e.categoryId] = (byCategory[e.categoryId] ?? 0) + e.amount
    const k = kindOf.get(e.categoryId) ?? 'want'
    byKind[k] += e.amount
  }
  let earned = 0
  let borrowed = 0
  for (const i of data.incomes) {
    if (monthOf(i.date) !== key) continue
    if (i.isLoan) borrowed += i.amount
    else earned += i.amount
  }
  return {
    key,
    earned,
    borrowed,
    spent,
    byCategory,
    byKind,
    debtPaid: byKind.debt,
    invested: byKind.invest,
    saved: byKind.saving,
    net: earned - spent,
    count,
  }
}

export type Level = 'none' | 'ok' | 'warn' | 'over'

export function budgetLevel(spent: number, budget: number, warnAt: number): Level {
  if (budget <= 0) return 'none'
  const r = spent / budget
  if (r > 1) return 'over'
  if (r >= warnAt) return 'warn'
  return 'ok'
}

export const levelColor: Record<Level, string> = {
  none: 'bg-muted-foreground/30',
  ok: 'bg-primary',
  warn: 'bg-amber-500',
  over: 'bg-red-600',
}

export const levelText: Record<Level, string> = {
  none: 'text-muted-foreground',
  ok: 'text-foreground',
  warn: 'text-amber-700',
  over: 'text-red-600',
}

export function activeCategories(data: AppData) {
  return data.categories.filter((c) => !c.archived)
}

export function totalBudget(data: AppData) {
  return activeCategories(data).reduce((s, c) => s + c.budget, 0)
}

// ---------- Income ----------

/** Expected income for a month: one-month override → latest "from this month on" change → usual salary. */
export function expectedIncomeFor(data: AppData, key: string) {
  const st = data.settings
  const o = st.incomeOverrides?.[key]
  if (o !== undefined) return o
  const plan = (st.incomePlan ?? []).filter((p) => p.from <= key).sort((a, b) => b.from.localeCompare(a.from))
  return plan[0]?.amount ?? st.expectedIncome
}

/** Income used for planning a month: what you received, or what you expect if that is more. */
export function plannedIncome(data: AppData, key: string, earned: number) {
  const exp = expectedIncomeFor(data, key)
  if (key < currentMonth()) return earned > 0 ? earned : exp
  return Math.max(earned, exp)
}

// ---------- Bills / planned payments ----------

export function billDue(bill: Bill, key: string) {
  if (!bill.active) return false
  if (bill.onlyMonth) return bill.onlyMonth === key
  if (bill.fromMonth && key < bill.fromMonth) return false
  if (bill.skips?.includes(key)) return false
  const m = Number(key.slice(5, 7))
  return bill.months.length === 0 || bill.months.includes(m)
}

/** Planned amount for a given month (respects one-month overrides). */
export function billAmount(bill: Bill, key: string) {
  return bill.overrides?.[key] ?? bill.amount
}

export function billPaid(data: AppData, bill: Bill, key: string) {
  return billsForMonth(data, key).some((p) => p.bill.id === bill.id && p.paid)
}

export interface PlannedPayment {
  bill: Bill
  planned: number
  paid: boolean
  paidAmount: number
  expenseIds: string[]
}

export function billsForMonth(data: AppData, key: string): PlannedPayment[] {
  const due = data.bills.filter((b) => billDue(b, key)).sort((a, b) => a.dueDay - b.dueDay || a.name.localeCompare(b.name))
  const dueIds = new Set(due.map((b) => b.id))
  const monthExp = data.expenses.filter((e) => monthOf(e.date) === key)
  const matched = new Map<string, Expense[]>(due.map((b) => [b.id, []]))
  // 1) exact: expenses recorded by ticking the payment
  for (const e of monthExp) if (e.billId && dueIds.has(e.billId)) matched.get(e.billId)!.push(e)
  // 2) loose: a loan/goal payment recorded elsewhere counts for the first unpaid payment linked to that loan/goal
  for (const e of monthExp) {
    if (e.billId && dueIds.has(e.billId)) continue
    const b = due.find((x) => matched.get(x.id)!.length === 0 && ((!!x.loanId && e.loanId === x.loanId) || (!!x.goalId && e.goalId === x.goalId)))
    if (b) matched.get(b.id)!.push(e)
  }
  return due.map((bill) => {
    const list = matched.get(bill.id)!
    return {
      bill,
      planned: billAmount(bill, key),
      paid: list.length > 0,
      paidAmount: list.reduce((t, e) => t + e.amount, 0),
      expenseIds: list.map((e) => e.id),
    }
  })
}

/**
 * The heart of the app: what is left this month after all planned payments.
 *   income − payments = left after payments
 *   left after payments − other spending = remaining now
 */
export function monthPlan(data: AppData, key: string) {
  const s = summarize(data, key)
  const payments = billsForMonth(data, key)
  const paymentExpenseIds = new Set(payments.flatMap((p) => p.expenseIds))
  const income = plannedIncome(data, key, s.earned)
  // a paid item counts what you actually paid; an unpaid one counts what you planned
  const paymentsTotal = payments.reduce((t, p) => t + (p.paid ? p.paidAmount : p.planned), 0)
  const paidTotal = payments.reduce((t, p) => t + (p.paid ? p.paidAmount : 0), 0)
  const toPay = payments.reduce((t, p) => t + (p.paid ? 0 : p.planned), 0)
  const otherSpent = data.expenses.reduce((t, e) => (monthOf(e.date) === key && !paymentExpenseIds.has(e.id) ? t + e.amount : t), 0)
  const afterPayments = income - paymentsTotal
  const remaining = afterPayments - otherSpent
  return { key, summary: s, income, payments, paymentsTotal, paidTotal, toPay, otherSpent, afterPayments, remaining }
}

// ---------- Loans ----------

export function loanPaid(data: AppData, loanId: string) {
  return data.expenses.reduce((s, e) => (e.loanId === loanId ? s + e.amount : s), 0)
}

export function loanBalance(data: AppData, loan: Loan) {
  return Math.max(0, loan.amount - loanPaid(data, loan.id))
}

/** Months to clear a balance with a fixed monthly payment. Infinity = never (payment too small). */
export function monthsToClear(balance: number, payment: number, annualRate: number) {
  if (balance <= 0) return 0
  if (payment <= 0) return Infinity
  const r = annualRate / 100 / 12
  if (r === 0) return Math.ceil(balance / payment)
  if (payment <= balance * r) return Infinity
  return Math.ceil(-Math.log(1 - (r * balance) / payment) / Math.log(1 + r))
}

export function openLoans(data: AppData) {
  return data.loans
    .filter((l) => !l.closed)
    .map((l) => ({ loan: l, balance: loanBalance(data, l), paid: loanPaid(data, l.id) }))
    .filter((x) => x.balance > 0)
}

export function debtOverview(data: AppData) {
  const loans = openLoans(data)
  const total = loans.reduce((s, l) => s + l.balance, 0)
  const monthly = loans.reduce((s, l) => s + l.loan.monthlyPayment, 0)
  const months = loans.map((l) => monthsToClear(l.balance, l.loan.monthlyPayment, l.loan.interestRate))
  const worst = months.length ? Math.max(...months) : 0
  const freeKey = Number.isFinite(worst) ? shiftMonth(currentMonth(), worst) : null
  const originalTotal = data.loans.reduce((s, l) => s + l.amount, 0)
  const paidTotal = data.loans.reduce((s, l) => s + Math.min(l.amount, loanPaid(data, l.id)), 0)
  return { loans, total, monthly, monthsLeft: worst, freeKey, originalTotal, paidTotal }
}

/** Month-by-month projection of total debt if you keep paying the planned monthly amounts. */
export function debtProjection(data: AppData, extraPerMonth = 0, maxMonths = 120) {
  const loans = openLoans(data).map((l) => ({
    bal: l.balance,
    pay: l.loan.monthlyPayment,
    r: l.loan.interestRate / 100 / 12,
  }))
  const out: { key: string; label: string; total: number }[] = []
  let key = currentMonth()
  const total = () => loans.reduce((s, l) => s + l.bal, 0)
  out.push({ key, label: monthLabel(key, 'short'), total: total() })
  for (let i = 0; i < maxMonths && total() > 0.5; i++) {
    let extra = extraPerMonth
    // avalanche: extra goes to the highest-interest loan first
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
    key = shiftMonth(key, 1)
    out.push({ key, label: monthLabel(key, 'short'), total: Math.max(0, total()) })
  }
  return out
}

// ---------- Goals ----------

export function goalSaved(data: AppData, goalId: string) {
  const g = data.goals.find((x) => x.id === goalId)
  const contrib = data.expenses.reduce((s, e) => (e.goalId === goalId ? s + e.amount : s), 0)
  return (g?.startingAmount ?? 0) + contrib
}

// ---------- Forecast / planning ----------

export function averageEarned(data: AppData, beforeKey: string, months = 3) {
  const vals: number[] = []
  for (let i = 1; i <= months; i++) {
    const s = summarize(data, shiftMonth(beforeKey, -i))
    if (s.earned > 0) vals.push(s.earned)
  }
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
}

export function averageByCategory(data: AppData, beforeKey: string, months = 3) {
  const totals: Record<string, number> = {}
  let n = 0
  for (let i = 1; i <= months; i++) {
    const s = summarize(data, shiftMonth(beforeKey, -i))
    if (s.count === 0) continue
    n++
    for (const [k, v] of Object.entries(s.byCategory)) totals[k] = (totals[k] ?? 0) + v
  }
  if (n === 0) return {}
  return Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, v / n]))
}

export interface CategoryPlan {
  category: Category
  budget: number
  billsDue: number
  planned: number // max(budget, bills)
  average: number
  lastYear: number
}

export function forecast(data: AppData, key: string) {
  const exp = expectedIncomeFor(data, key)
  const expectedIncome = exp > 0 ? exp : averageEarned(data, key)
  const bills = billsForMonth(data, key)
  const avg = averageByCategory(data, key)
  const lastYear = summarize(data, shiftMonth(key, -12))
  const billsByCat: Record<string, number> = {}
  for (const b of bills) billsByCat[b.bill.categoryId] = (billsByCat[b.bill.categoryId] ?? 0) + b.planned
  const plans: CategoryPlan[] = activeCategories(data).map((c) => {
    const billsDue = billsByCat[c.id] ?? 0
    return {
      category: c,
      budget: c.budget,
      billsDue,
      planned: Math.max(c.budget, billsDue),
      average: avg[c.id] ?? 0,
      lastYear: lastYear.byCategory[c.id] ?? 0,
    }
  })
  const planned = plans.reduce((s, p) => s + p.planned, 0)
  const billsTotal = bills.reduce((s, b) => s + b.planned, 0)
  const avgTotal = Object.values(avg).reduce((a, b) => a + b, 0)
  return {
    key,
    expectedIncome,
    planned,
    billsTotal,
    bills,
    plans,
    avgTotal,
    lastYearSpent: lastYear.spent,
    leftover: expectedIncome - planned,
    underBudgeted: plans.filter((p) => p.billsDue > p.budget && p.budget > 0),
  }
}

/** Planned outflow for each of the next N months — spot the heavy months (school fees!) early. */
export function outlook(data: AppData, from: string, months = 12) {
  return Array.from({ length: months }, (_, i) => {
    const key = shiftMonth(from, i)
    const f = forecast(data, key)
    return { key, label: monthLabel(key, 'tiny'), full: monthLabel(key), planned: f.planned, income: f.expectedIncome, payments: f.billsTotal, left: f.expectedIncome - f.billsTotal }
  })
}

export function yearSeries(data: AppData, year: number) {
  return Array.from({ length: 12 }, (_, i) => {
    const key = `${year}-${String(i + 1).padStart(2, '0')}`
    const s = summarize(data, key)
    return {
      key,
      label: monthLabel(key, 'tiny'),
      earned: s.earned,
      spent: s.spent,
      borrowed: s.borrowed,
      net: s.net,
      debtPaid: s.debtPaid,
    }
  })
}

// ---------- Daily guidance ----------

export function dailyAllowance(data: AppData, key: string, s: MonthSummary) {
  if (key !== currentMonth()) return null
  const today = new Date()
  const daysLeft = getDaysInMonth(today) - today.getDate() + 1
  const income = plannedIncome(data, key, s.earned)
  const left = income - s.spent
  return { daysLeft, left, perDay: left > 0 ? left / daysLeft : 0 }
}

/** A 0–100 score of how well this month is going. */
export function freedomScore(data: AppData, s: MonthSummary) {
  const income = plannedIncome(data, s.key, s.earned)
  const parts: { label: string; points: number; max: number }[] = []

  // 1. Spending under income (40)
  const ratio = income > 0 ? s.spent / income : s.spent > 0 ? 2 : 0
  parts.push({ label: 'Spending within income', max: 40, points: ratio <= 0.8 ? 40 : ratio >= 1.2 ? 0 : Math.round(40 * (1.2 - ratio) / 0.4) })

  // 2. Budgets respected (25)
  const budgeted = activeCategories(data).filter((c) => c.budget > 0)
  const within = budgeted.filter((c) => (s.byCategory[c.id] ?? 0) <= c.budget).length
  parts.push({ label: 'Budgets respected', max: 25, points: budgeted.length ? Math.round((25 * within) / budgeted.length) : 0 })

  // 3. No new borrowing (15)
  parts.push({ label: 'No new loans', max: 15, points: s.borrowed > 0 ? 0 : 15 })

  // 4. Paying down debt / no debt (10)
  const hasDebt = openLoans(data).length > 0
  parts.push({ label: 'Paying down debt', max: 10, points: !hasDebt || s.debtPaid > 0 ? 10 : 0 })

  // 5. Building wealth: saving or investing (10)
  parts.push({ label: 'Saving or investing', max: 10, points: s.saved + s.invested > 0 ? 10 : 0 })

  const score = parts.reduce((a, p) => a + p.points, 0)
  return { score, parts }
}

/** Best debt category for a loan: one whose name shares a word with the loan (e.g. "Shamba"), else "Other Loan Repayments". */
export function debtCategoryFor(data: AppData, loanName: string) {
  const cats = activeCategories(data).filter((c) => c.kind === 'debt')
  const words = loanName.toLowerCase().split(/\W+/).filter((w) => w.length > 3 && w !== 'loan' && w !== 'loans')
  return (
    cats.find((c) => words.some((w) => c.name.toLowerCase().includes(w))) ??
    cats.find((c) => c.name.toLowerCase().includes('other')) ??
    cats[0]
  )
}
