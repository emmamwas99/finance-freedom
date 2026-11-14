'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Suspense, useEffect, useSyncExternalStore, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthLayout, ForgotPage, RecoveryKeyScreen, ResetScreen, SetupScreen, Splash, UnlockScreen } from '@/features/auth/auth-screens'
import { Button } from '@/components/ui/button'
import { DataProvider, useStore } from '@/store/data'
import { QueryProvider } from '@/lib/api/query-provider'

const DESKTOP_QUERY = '(min-width: 1024px)'

function useDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(DESKTOP_QUERY)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true,
  )
}

/** Registers the offline service worker (production only, HTTPS or localhost). */
function useServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => undefined)
  }, [])
}

function Redirect({ to }: { to: string }) {
  const router = useRouter()
  useEffect(() => router.replace(to), [router, to])
  return <Splash />
}

/**
 * Decides what an account route shows, based on where the user is in the auth/encryption flow.
 * Same rules as the Vite app's router: signed-out users reach only the auth pages, signed-in users
 * must unlock (decrypt) before any /app page renders, and unlocked users are sent into /app.
 */
function Gate({ children }: { children: ReactNode }) {
  const { status } = useStore()
  const path = usePathname()

  if (status === 'loading') return <Splash />

  if (path === '/verify-email') return <>{children}</>

  if (status === 'connection-error') return (
    <AuthLayout title="Connection interrupted" sub="We couldn't check your saved session. Your account is still here.">
      <Button className="w-full" onClick={() => window.location.reload()}>Try again</Button>
    </AuthLayout>
  )

  if (status === 'signed-out') {
    if (path === '/reset') return <ForgotPage />
    if (path.startsWith('/app') || path === '/demo-checkout') return <Redirect to="/login" />
    return <>{children}</>
  }

  if (status === 'reset') return <ResetScreen />
  if (status === 'setup') return <SetupScreen />
  if (status === 'recovery-key') return <RecoveryKeyScreen />
  if (status === 'locked') return <UnlockScreen />

  // unlocked
  if (path === '/demo-checkout') return <>{children}</>
  if (!path.startsWith('/app')) return <Redirect to="/app" />
  return <>{children}</>
}

/**
 * Root of every private route (/login … /app/*). One DataProvider for the whole group, so the
 * decrypted vault survives navigation between the auth pages and the dashboard.
 */
export function AccountRoot({ children }: { children: ReactNode }) {
  const desktop = useDesktop()
  useServiceWorker()
  return (
    <QueryProvider><DataProvider>
      <TooltipProvider>
        <Suspense fallback={<Splash />}>
          <Gate>{children}</Gate>
        </Suspense>
        <Toaster position={desktop ? 'bottom-right' : 'top-center'} closeButton theme="light" duration={3500} toastOptions={{ className: 'text-[15px]' }} />
      </TooltipProvider>
    </DataProvider></QueryProvider>
  )
}
