'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { components } from './types'

type Schemas = components['schemas']
export type Expense = Schemas['Expense']
export type ExpenseInput = Schemas['ExpenseInput']
export type Income = Schemas['Income']
export type IncomeInput = Schemas['IncomeInput']
export type Budget = Schemas['Budget']
export type BudgetInput = Schemas['BudgetInput']
export type SavingsAccount = Schemas['SavingsAccount']
export type SavingsInput = Schemas['SavingsAccountInput']
export type Goal = Schemas['Goal']
export type GoalInput = Schemas['GoalInput']

const base = process.env.NEXT_PUBLIC_FINFE_API_URL
const path = (name: string, id?: string) => `/${name}${id ? `/${encodeURIComponent(id)}` : ''}`
const request = <T,>(p: string, options?: RequestInit) => {
  if (!base) throw new Error('Go API is not configured')
  return api<T>(base, p, options)
}
const json = (method: string, body: unknown): RequestInit => ({ method, body: JSON.stringify(body) })
type Page<T> = { data: T[]; page: number; limit: number; total: number }
type Filters = Record<string, string | number | undefined>

function useList<T>(name: string, filters: Filters = {}) {
  const search = new URLSearchParams()
  for (const [k, v] of Object.entries(filters)) if (v !== undefined && v !== '') search.set(k, String(v))
  return useQuery({
    queryKey: [name, 'list', filters], enabled: !!base,
    queryFn: ({ signal }) => request<Page<T>>(`${path(name)}${search.size ? `?${search}` : ''}`, { signal }),
  })
}
function useItem<T>(name: string, id: string | undefined) {
  return useQuery({ queryKey: [name, 'detail', id], enabled: !!base && !!id, queryFn: ({ signal }) => request<{ data: T }>(path(name, id), { signal }) })
}
function useCreate<T>(name: string) {
  const query = useQueryClient()
  return useMutation({ mutationFn: (input: T) => request(path(name), json('POST', input)), onSuccess: () => { void query.invalidateQueries({ queryKey: [name] }); void query.invalidateQueries({ queryKey: ['reports'] }) } })
}
function useUpdate<T>(name: string) {
  const query = useQueryClient()
  return useMutation({ mutationFn: ({ id, patch }: { id: string; patch: Partial<T> }) => request(path(name, id), json('PATCH', patch)), onSuccess: () => { void query.invalidateQueries({ queryKey: [name] }); void query.invalidateQueries({ queryKey: ['reports'] }) } })
}
function useDelete(name: string) {
  const query = useQueryClient()
  return useMutation({ mutationFn: (id: string) => request(path(name, id), { method: 'DELETE' }), onSuccess: () => { void query.invalidateQueries({ queryKey: [name] }); void query.invalidateQueries({ queryKey: ['reports'] }) } })
}

export const useExpenses = (filters?: Filters) => useList<Expense>('expenses', filters)
export const useExpense = (id: string | undefined) => useItem<Expense>('expenses', id)
export const useCreateExpense = () => useCreate<ExpenseInput>('expenses')
export const useUpdateExpense = () => useUpdate<ExpenseInput>('expenses')
export const useDeleteExpense = () => useDelete('expenses')
export const useIncome = (filters?: Filters) => useList<Income>('income', filters)
export const useCreateIncome = () => useCreate<IncomeInput>('income')
export const useUpdateIncome = () => useUpdate<IncomeInput>('income')
export const useDeleteIncome = () => useDelete('income')
export const useBudgets = () => useList<Budget>('budgets')
export const useCreateBudget = () => useCreate<BudgetInput>('budgets')
export const useUpdateBudget = () => useUpdate<BudgetInput>('budgets')
export const useDeleteBudget = () => useDelete('budgets')
export const useSavings = () => useList<SavingsAccount>('savings')
export const useCreateSavings = () => useCreate<SavingsInput>('savings')
export const useGoals = () => useList<Goal>('goals')
export const useCreateGoal = () => useCreate<GoalInput>('goals')
export const useUpdateGoal = () => useUpdate<GoalInput>('goals')
export const useDeleteGoal = () => useDelete('goals')

export function useMonthlyReport(month: string) {
  return useQuery({ queryKey: ['reports', 'monthly', month], enabled: !!base,
    queryFn: ({ signal }) => request<Schemas['MonthlyReport']>(`/reports/monthly?month=${encodeURIComponent(month)}`, { signal }),
  })
}
export function useFinancialHealth() {
  return useQuery({ queryKey: ['reports', 'financial-health'], enabled: !!base,
    queryFn: ({ signal }) => request<unknown>('/financial-health/overview', { signal }),
  })
}
