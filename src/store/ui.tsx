'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Expense, Income } from '@/lib/types'

export type Route = 'home' | 'activity' | 'plan' | 'freedom' | 'stats' | 'insights' | 'settings' | 'billing'

/** Private app routes. Kept identical to the Vite app so bookmarks and the Paystack return URL still work. */
export const ROUTE_PATHS: Record<Route, string> = {
  home: '/app',
  plan: '/app/plan',
  activity: '/app/transactions',
  freedom: '/app/debts',
  stats: '/app/reports',
  insights: '/app/on-track',
  settings: '/app/settings',
  billing: '/app/billing',
}

export function routeFromPath(path: string): Route {
  const hit = (Object.entries(ROUTE_PATHS) as [Route, string][]).find(([, p]) => p === path.replace(/\/$/, ''))
  return hit?.[0] ?? 'home'
}

export type TxRequest =
  | { kind: 'expense'; id?: string; preset?: Partial<Expense> }
  | { kind: 'income'; id?: string; preset?: Partial<Income> }

interface UICtx {
  route: Route
  go: (r: Route) => void
  tx: TxRequest | null
  openTx: (r: TxRequest) => void
  closeTx: () => void
}

const Ctx = createContext<UICtx | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const path = usePathname()
  const router = useRouter()
  const route = routeFromPath(path)
  const [tx, setTx] = useState<TxRequest | null>(null)
  const go = useCallback((r: Route) => router.push(ROUTE_PATHS[r]), [router])
  const closeTx = useCallback(() => setTx(null), [])
  const value = useMemo(() => ({ route, go, tx, openTx: setTx, closeTx }), [route, go, tx, closeTx])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useUI() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useUI outside provider')
  return c
}
