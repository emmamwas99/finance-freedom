import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AccountRoot } from '@/features/shell/account-root'

/**
 * Private area. Vault encryption and offline editing happen in the browser;
 * server reports receive a readable finance projection. The HTML is noindexed.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AccountRoot>{children}</AccountRoot>
}
