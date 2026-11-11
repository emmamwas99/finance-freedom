import { BarChart3, CalendarCheck, Compass, LayoutDashboard, List, Lock, Mountain, Plus, Settings } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/data'
import { useUI, type Route } from '@/store/ui'

const NAV: { route: Route; label: string; short: string; icon: typeof List }[] = [
  { route: 'home', label: 'Overview', short: 'Home', icon: LayoutDashboard },
  { route: 'plan', label: 'Monthly plan', short: 'Plan', icon: CalendarCheck },
  { route: 'activity', label: 'Transactions', short: 'Activity', icon: List },
  { route: 'freedom', label: 'Debts & goals', short: 'Debts', icon: Mountain },
  { route: 'stats', label: 'Reports', short: 'Reports', icon: BarChart3 },
  { route: 'insights', label: 'Am I on track?', short: 'On track', icon: Compass },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { route, go, openTx, tx } = useUI()
  const { lock, data } = useStore()

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
          <img src="/logo.svg" alt="" className="size-7 rounded-md" />
          <span className="text-[17px] font-semibold tracking-tight">Finance Freedom</span>
        </div>
        <div className="px-4 pt-2 pb-4">
          <Button className="h-10 w-full justify-start gap-2 text-[15px]" onClick={() => openTx({ kind: 'expense' })}>
            <Plus className="size-4" /> Add expense
            <kbd className="ml-auto rounded border border-white/30 px-1.5 text-[11px] text-white/80">N</kbd>
          </Button>
        </div>
        <nav className="grid gap-0.5 px-3">
          {NAV.map((n) => (
            <SideLink key={n.route} active={route === n.route} onClick={() => go(n.route)} icon={<n.icon className="size-[18px]" />}>
              {n.label}
            </SideLink>
          ))}
        </nav>
        <div className="mt-auto grid gap-0.5 border-t border-white/10 px-3 py-3">
          <SideLink active={route === 'settings'} onClick={() => go('settings')} icon={<Settings className="size-[18px]" />}>
            Settings
          </SideLink>
          <SideLink onClick={() => void lock()} icon={<Lock className="size-[18px]" />}>
            Lock
          </SideLink>
          {data.settings.name && <p className="px-3 pt-3 text-[13px] text-white/50">Signed in as {data.settings.name}</p>}
        </div>
      </aside>

      {/* ---------- Mobile top bar ---------- */}
      <header className="sticky top-0 z-30 border-b bg-navy pt-safe text-white lg:hidden print:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <button className="flex items-center gap-2 font-semibold" onClick={() => go('home')}>
            <img src="/logo.svg" alt="" className="size-6 rounded-md" />
            Finance Freedom
          </button>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" onClick={() => go('settings')} aria-label="Settings">
              <Settings />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" onClick={() => void lock()} aria-label="Lock">
              <Lock />
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 pt-6 pb-32 sm:px-6 lg:ml-64 lg:px-10 lg:pt-10 lg:pb-16 print:m-0 print:p-0">
        <div className="mx-auto max-w-6xl">{children}</div>
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
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-card pb-safe lg:hidden print:hidden">
        <div className="grid grid-cols-6">
          {NAV.map((t) => {
            const active = route === t.route
            return (
              <button
                key={t.route}
                onClick={() => go(t.route)}
                className={cn('flex flex-col items-center gap-1 py-2.5 text-[10.5px]', active ? 'font-semibold text-primary' : 'text-muted-foreground')}
              >
                <t.icon className="size-5" />
                {t.short}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

function SideLink({ active, onClick, icon, children }: { active?: boolean; onClick: () => void; icon: ReactNode; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-10 items-center gap-3 rounded-lg px-3 text-[15px] transition-colors',
        active ? 'bg-white/12 font-medium text-white' : 'text-white/70 hover:bg-white/6 hover:text-white',
      )}
    >
      {icon}
      {children}
    </button>
  )
}
