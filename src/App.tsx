import { useSyncExternalStore } from 'react'
import { Toaster } from 'sonner'
import { AppShell } from '@/components/AppShell'
import { LockScreen } from '@/components/LockScreen'
import { TransactionDialog } from '@/components/TransactionDialog'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ActivityPage } from '@/pages/Activity'
import { FreedomPage } from '@/pages/Freedom'
import { HomePage } from '@/pages/Home'
import { InsightsPage } from '@/pages/Insights'
import { PlanPage } from '@/pages/Plan'
import { SettingsPage } from '@/pages/Settings'
import { StatsPage } from '@/pages/Stats'
import { DataProvider, useStore } from '@/store/data'
import { UIProvider, useUI } from '@/store/ui'

function Pages() {
  const { route } = useUI()
  switch (route) {
    case 'activity':
      return <ActivityPage />
    case 'plan':
      return <PlanPage />
    case 'freedom':
      return <FreedomPage />
    case 'stats':
      return <StatsPage />
    case 'insights':
      return <InsightsPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <HomePage />
  }
}

const desktopMq = typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)') : null
function useDesktop() {
  return useSyncExternalStore(
    (cb) => {
      desktopMq?.addEventListener('change', cb)
      return () => desktopMq?.removeEventListener('change', cb)
    },
    () => desktopMq?.matches ?? true,
  )
}

function Root() {
  const { status } = useStore()
  const desktop = useDesktop()
  return (
    <>
      {status === 'unlocked' ? (
        <UIProvider>
          <AppShell>
            <Pages />
          </AppShell>
          <TransactionDialog />
        </UIProvider>
      ) : (
        <LockScreen />
      )}
      <Toaster position={desktop ? 'bottom-right' : 'top-center'} closeButton theme="light" duration={3500} toastOptions={{ className: 'text-[15px]' }} />
    </>
  )
}

export default function App() {
  return (
    <DataProvider>
      <TooltipProvider>
        <Root />
      </TooltipProvider>
    </DataProvider>
  )
}
