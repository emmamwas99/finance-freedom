import type { AppData, Category, CategoryKind } from './types'

export const uid = () => crypto.randomUUID()

const c = (name: string, kind: CategoryKind): Category => ({ id: uid(), name, emoji: '', kind, budget: 0 })

export function defaultCategories(): Category[] {
  return [
    c('Rent & Housing', 'need'),
    c('Food & Groceries', 'need'),
    c('Transport', 'need'),
    c('School Fees', 'need'),
    c('Maid / House Help', 'need'),
    c('Utilities (Power, Water, Wi-Fi)', 'need'),
    c('Airtime & Data', 'need'),
    c('Health', 'need'),
    c('Family Support', 'need'),
    c('Shamba Loan', 'debt'),
    c('Other Loan Repayments', 'debt'),
    c('Shop Investment', 'invest'),
    c('Savings & Emergency Fund', 'saving'),
    c('Eating Out & Fun', 'want'),
    c('Clothes & Personal', 'want'),
    c('Miscellaneous', 'want'),
  ]
}

export function emptyData(init: { name: string; expectedIncome: number }): AppData {
  return {
    version: 1,
    settings: {
      name: init.name,
      expectedIncome: init.expectedIncome,
      warnAt: 0.8,
      autoLockMinutes: 5,
    },
    categories: defaultCategories(),
    expenses: [],
    incomes: [],
    loans: [],
    goals: [],
    bills: [],
  }
}

export const KIND_LABEL: Record<CategoryKind, string> = {
  need: 'Needs',
  want: 'Wants',
  debt: 'Debt repayment',
  invest: 'Investments & projects',
  saving: 'Savings',
}

export const KIND_ORDER: CategoryKind[] = ['need', 'debt', 'invest', 'saving', 'want']

export const EMOJIS = [
  '🏠', '🍲', '🚌', '🎓', '🧹', '💡', '📱', '🏥', '👨‍👩‍👧', '🌱', '💳', '🏪', '💰', '🎉', '👕', '📦',
  '⛽', '🚗', '🐄', '🌽', '⛪', '🎁', '💊', '🧾', '🛒', '🍼', '✈️', '🏗️', '📚', '💼', '🛠️', '🐔',
]
