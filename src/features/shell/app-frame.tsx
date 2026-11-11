'use client'

import type { ReactNode } from 'react'
import { AppShell } from '@/features/shell/app-shell'
import { TransactionDialog } from '@/features/transactions/transaction-dialog'
import { UIProvider } from '@/store/ui'

/** Dashboard chrome: sidebar / bottom nav, the add-transaction dialog and the N / I shortcuts. */
export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <AppShell>{children}</AppShell>
      <TransactionDialog />
    </UIProvider>
  )
}
