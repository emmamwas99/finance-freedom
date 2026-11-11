'use client'

import { BarChart3, CalendarCheck, Cloud, CloudOff, Compass, LayoutDashboard, List, Loader2, Lock, Mountain, Plus, Settings, Sparkles } from 'lucide-react'
import { DemoBanner } from '@/features/auth/auth-screens'
import { daysLeft, planLabel } from '@/features/billing/billing-ui'
import { isTrial, proUntil } from '@/lib/plans'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useStore, type SyncState } from '@/store/data'
import { ROUTE_PATHS, useUI, type Route } from '@/store/ui'

const NAV: { route: Route; label: string; short: string; icon: typeof List }[] = [
  { route: 'home', label: 'Overview', short: 'Home', icon: LayoutDashboard },
  { route: 'plan', label: 'Monthly plan', short: 'Plan', icon: CalendarCheck },
  { route: 'activity', label: 'Transactions', short: 'Activity', icon: List },
  { route: 'freedom', label: 'Debts & goals', short: 'Debts', icon: Mountain },
  { route: 'stats', label: 'Reports', short: 'Reports', icon: BarChart3 },
  { route: 'insights', label: 'Am I on track?', short: 'On track', icon: Compass },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { route, openTx, tx } = useUI()
  const { lock, sync, backendMode, user, pro, subscription } = useStore()
  const plan = planLabel(subscription)

  // Desktop shortcut: press "N" to add an expense, "I" for income
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (tx || e.metaKey || e.ctrlKey || e.altKey || t.closest('input, textarea, select, [role="dialog"], [contenteditable]')) return
      if (e.key === 'n') {
        e.preventDefault()
        openTx({ kind: 'expense' })
      } else if (e.key === 'i') {
        e.preventDefault()
        openTx({ kind: 'income' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openTx, tx])

  return (
    <div className="min-h-dvh">
      {/* ---------- Desktop sidebar ---------- */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-navy text-white lg:flex print:hidden">
        <div className="flex h-16 items-center gap-2.5 px-6">
          <Image src="/logo-inverse.svg" alt="" width={28} height={28} className="size-7 rounded-md" />
          <span className="text-[17px] font-semibold tracking-tight">Finfe</span>
        </div>
        <div className="px-4 pt-2 pb-4">
          <Button className="h-10 w-full justify-start gap-2 text-[15px]" onClick={() => openTx({ kind: 'expense' })}>
            <Plus className="size-4" /> Add expense
            <kbd className="ml-auto rounded border border-white/30 px-1.5 text-[11px] text-white/80">N</kbd>
          </Button>
        </div>
        <nav aria-label="Main" className="grid gap-0.5 px-3">
          {NAV.map((n) => (
            <SideLink key={n.route} active={route === n.route} href={ROUTE_PATHS[n.route]} icon={<n.icon className="size-[18px]" />}>
              {n.label}
            </SideLink>
          ))}
        </nav>
        <div className="mt-auto grid gap-0.5 border-t border-white/10 px-3 py-3">
          <Link
            href={ROUTE_PATHS.billing}
            aria-current={route === 'billing' ? 'page' : undefined}
            className={cn('mb-2 flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px]', pro ? 'bg-white/8 text-white/85' : 'bg-primary text-white')}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="size-4" /> {plan.short}
            </span>
            {!pro && <span className="font-medium">Upgrade</span>}
          </Link>
          <SideLink active={route === 'settings'} href={ROUTE_PATHS.settings} icon={<Settings className="size-[18px]" />}>
            Settings
          </SideLink>
          <SideLink onClick={() => void lock()} icon={<Lock className="size-[18px]" />}>
            Lock
          </SideLink>
          <p className="flex items-center gap-1.5 truncate px-3 pt-3 text-[12px] text-white/50" title={user?.email}>
            <SyncIcon state={sync.state} /> {syncText(sync.state, backendMode)}
          </p>
        </div>
      </aside>

      {/* ---------- Mobile top bar ---------- */}
      <header className="sticky top-0 z-30 border-b bg-navy pt-safe text-white lg:hidden print:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href={ROUTE_PATHS.home} className="flex items-center gap-2 font-semibold">
            <Image src="/logo-inverse.svg" alt="" width={24} height={24} className="size-6 rounded-md" />
            Finfe
          </Link>
          <div className="flex items-center">
            <Button asChild variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
              <Link href={ROUTE_PATHS.settings} aria-label="Settings">
                <Settings />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" onClick={() => void lock()} aria-label="Lock">
              <Lock />
            </Button>
          </div>
        </div>
      </header>

      <main id="main" className="px-4 pt-6 pb-32 sm:px-6 lg:ml-64 lg:px-10 lg:pt-10 lg:pb-16 print:m-0 print:p-0">
        <div className="mx-auto max-w-6xl">
          <PlanBanner />
          {children}
        </div>
      </main>

      {/* ---------- Mobile FAB + bottom nav ---------- */}
      <Button
        size="icon-lg"
        className="fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 size-14 rounded-full shadow-lg lg:hidden print:hidden"
        onClick={() => openTx({ kind: 'expense' })}
        aria-label="Add expense"
      >
        <Plus className="size-7" />
      </Button>
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t bg-card pb-safe lg:hidden print:hidden">
        <div className="grid grid-cols-6">
          {NAV.map((t) => {
            const active = route === t.route
            return (
              <Link
                key={t.route}
                href={ROUTE_PATHS[t.route]}
                aria-current={active ? 'page' : undefined}
                className={cn('flex flex-col items-center gap-1 py-2.5 text-[10.5px]', active ? 'font-semibold text-primary' : 'text-muted-foreground')}
              >
                <t.icon className="size-5" aria-hidden />
                {t.short}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

const sideLinkClass = (active?: boolean) =>
  cn('flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[15px] transition-colors', active ? 'bg-white/12 font-medium text-white' : 'text-white/70 hover:bg-white/6 hover:text-white')

/** Navigation entry (a real link) or, without href, an action button such as Lock. */
function SideLink({ active, href, onClick, icon, children }: { active?: boolean; href?: string; onClick?: () => void; icon: ReactNode; children: ReactNode }) {
  if (href)
    return (
      <Link href={href} aria-current={active ? 'page' : undefined} className={sideLinkClass(active)}>
        {icon}
        {children}
      </Link>
    )
  return (
    <button type="button" onClick={onClick} className={sideLinkClass(active)}>
      {icon}
      {children}
    </button>
  )
}

function SyncIcon({ state }: { state: SyncState }) {
  if (state === 'syncing' || state === 'pending') return <Loader2 className="size-3 animate-spin" />
  if (state === 'offline' || state === 'error') return <CloudOff className="size-3" />
  return <Cloud className="size-3" />
}

function syncText(state: SyncState, mode: 'go' | 'supabase' | 'demo') {
  if (mode === 'demo') return 'Demo mode · this browser only'
  return state === 'synced' ? 'All changes synced' : state === 'offline' ? 'Offline · will sync later' : state === 'error' ? 'Sync problem · retrying' : 'Saving…'
}

/** Gentle reminders: demo mode, trial ending, prepaid Pro ending, failed card payment. */
function PlanBanner() {
  const { subscription, pro, backendMode } = useStore()
  const { route } = useUI()
  if (route === 'billing') return null
  const until = proUntil(subscription)
  const left = daysLeft(until)
  let msg: string | null = null
  let action = 'See plans'
  if (pro && isTrial(subscription) && left <= 3) msg = `Your Pro trial ends in ${left} day${left === 1 ? '' : 's'}. Keep Reports and “Am I on track?” by upgrading.`
  else if (pro && subscription?.status === 'past_due') {
    msg = 'Your card payment failed. Update your card to keep Pro.'
    action = 'Fix payment'
  } else if (pro && subscription?.billing === 'prepaid' && left <= 5) {
    msg = `Your Pro ends in ${left} day${left === 1 ? '' : 's'}. Renew with M-Pesa to keep it.`
    action = 'Renew'
  } else if (!pro && subscription && (subscription.currentPeriodEnd || subscription.trialEndsAt) && until && Date.now() - until.getTime() < 14 * 864e5) {
    msg = 'Your Pro has ended. Your data is safe. Upgrade any time to get Pro features back.'
  }
  return (
    <>
      {backendMode === 'demo' && <DemoBanner className="mb-6" />}
      {msg && (
        <div className="mb-6 flex flex-col gap-3 rounded-lg border border-sky-100 bg-accent px-4 py-3 text-[15px] text-navy sm:flex-row sm:items-center sm:justify-between print:hidden">
          <span>{msg}</span>
          <Button asChild size="sm">
            <Link href={ROUTE_PATHS.billing}>{action}</Link>
          </Button>
        </div>
      )}
    </>
  )
}
