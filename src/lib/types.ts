export type ID = string

/** need = essentials, want = lifestyle, debt = loan repayments, invest = projects/business, saving = savings */
export type CategoryKind = 'need' | 'want' | 'debt' | 'invest' | 'saving'

export interface Category {
  id: ID
  name: string
  emoji: string
  kind: CategoryKind
  /** Monthly spending limit. 0 = no limit set. */
  budget: number
  archived?: boolean
}

export interface Expense {
  id: ID
  date: string // YYYY-MM-DD
  amount: number
  categoryId: ID
  note?: string
  loanId?: ID // repayment towards a loan
  goalId?: ID // contribution towards a goal/project
  billId?: ID // payment of a planned bill
  createdAt: string
}

export interface Income {
  id: ID
  date: string
  amount: number
  source: string
  note?: string
  /** Money that came in because you borrowed it. Not "earned". */
  isLoan?: boolean
  loanId?: ID
  createdAt: string
}

export interface Loan {
  id: ID
  name: string
  lender: string
  /** Total amount owed when the loan was recorded (balance = amount - repayments). */
  amount: number
  /** Annual interest rate in %, used for the debt-free projection. */
  interestRate: number
  monthlyPayment: number
  startDate: string
  dueDay?: number
  closed?: boolean
  note?: string
  createdAt: string
}

export interface Goal {
  id: ID
  name: string
  emoji: string
  target: number
  /** Amount already saved/invested before you started tracking. */
  startingAmount: number
  deadline?: string // YYYY-MM
  note?: string
  createdAt: string
}

export interface Bill {
  id: ID
  name: string
  amount: number
  categoryId: ID
  dueDay: number
  /** Months (1-12) the bill is due. Empty = every month. Ignored when onlyMonth is set. */
  months: number[]
  /** One-off payment: only due in this month (YYYY-MM). */
  onlyMonth?: string
  /** First month (YYYY-MM) a repeating payment applies from. */
  fromMonth?: string
  /** Different amount for specific months: { '2026-11': 12000 } */
  overrides?: Record<string, number>
  /** Months this repeating payment is skipped. */
  skips?: string[]
  loanId?: ID
  goalId?: ID
  active: boolean
}

export interface Settings {
  name: string
  /** Usual monthly take-home income (salary etc). */
  expectedIncome: number
  /** Income changes that apply from a month onwards, e.g. [{ from: '2026-12', amount: 264000 }] */
  incomePlan?: { from: string; amount: number }[]
  /** Income for one specific month only, e.g. { '2026-11': 388000 } */
  incomeOverrides?: Record<string, number>
  /** Warn when a budget reaches this fraction (0.8 = 80%). */
  warnAt: number
  autoLockMinutes: number
  lastBackupAt?: string
}

export interface AppData {
  version: 1
  settings: Settings
  categories: Category[]
  expenses: Expense[]
  incomes: Income[]
  loans: Loan[]
  goals: Goal[]
  bills: Bill[]
}
