import type { AppData, Bill, Category, Expense, Income, Loan } from '../../src/lib/types'

export const cat = (id: string, kind: Category['kind'], budget = 0, name = id): Category => ({ id, name, emoji: '•', kind, budget })

let n = 0
export const exp = (date: string, amount: number, categoryId: string, extra: Partial<Expense> = {}): Expense => ({ id: `e${++n}`, date, amount, categoryId, createdAt: `${date}T08:00:00Z`, ...extra })
export const inc = (date: string, amount: number, extra: Partial<Income> = {}): Income => ({ id: `i${++n}`, date, amount, source: 'Salary', createdAt: `${date}T08:00:00Z`, ...extra })
export const bill = (id: string, amount: number, categoryId: string, extra: Partial<Bill> = {}): Bill => ({ id, name: id, amount, categoryId, dueDay: 5, months: [], active: true, ...extra })
export const loan = (id: string, amount: number, monthlyPayment: number, interestRate: number, extra: Partial<Loan> = {}): Loan => ({ id, name: id, lender: 'Bank', amount, monthlyPayment, interestRate, startDate: '2026-01-01', createdAt: '2026-01-01', ...extra })

/** A realistic household: KSh 85k salary, rent, two loans, food/fun limits. */
export function household(over: Partial<AppData> = {}): AppData {
  return {
    version: 1,
    settings: { name: 'Wanjiku', expectedIncome: 85000, warnAt: 0.8, autoLockMinutes: 5 },
    categories: [cat('rent', 'need'), cat('food', 'need', 15000), cat('fun', 'want', 4000), cat('loans', 'debt'), cat('save', 'saving'), cat('shop', 'invest')],
    expenses: [],
    incomes: [],
    loans: [],
    goals: [],
    bills: [],
    ...over,
  }
}
