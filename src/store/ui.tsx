import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Expense, Income } from '@/lib/types'

export type Route = 'home' | 'activity' | 'plan' | 'freedom' | 'stats' | 'insights' | 'settings'
const ROUTES: Route[] = ['home', 'activity', 'plan', 'freedom', 'stats', 'insights', 'settings']

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

function readHash(): Route {
  const h = window.location.hash.replace('#/', '').replace('#', '') as Route
  return ROUTES.includes(h) ? h : 'home'
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(readHash)
  const [tx, setTx] = useState<TxRequest | null>(null)

  useEffect(() => {
    const on = () => setRoute(readHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const go = useCallback((r: Route) => {
    window.location.hash = `/${r}`
    window.scrollTo({ top: 0 })
  }, [])

  return <Ctx.Provider value={{ route, go, tx, openTx: setTx, closeTx: () => setTx(null) }}>{children}</Ctx.Provider>
}

export function useUI() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useUI outside provider')
  return c
}
