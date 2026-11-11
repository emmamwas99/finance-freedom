import type { ReactNode } from 'react'
import { AppFrame } from '@/features/shell/app-frame'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AppFrame>{children}</AppFrame>
}
