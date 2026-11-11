'use client'

import { CreditCard, Lock, Smartphone, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { isPro, isTrial, proUntil, PRO_FEATURES, type Subscription } from '@/lib/plans'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/data'
import { useUI } from '@/store/ui'

export function daysLeft(d: Date | null) {
  if (!d) return 0
  return Math.max(0, Math.ceil((d.getTime() - Date.now()) / 864e5))
}

export function fmtDate(d: Date | string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function planLabel(sub: Subscription | null) {
  const until = proUntil(sub)
  if (!isPro(sub)) return { short: 'Free plan', long: 'You’re on the Free plan.' }
  if (isTrial(sub)) return { short: `Pro trial · ${daysLeft(until)}d left`, long: `Pro trial: ${daysLeft(until)} days left (ends ${fmtDate(until)}).` }
  if (sub?.status === 'past_due') return { short: 'Payment failed', long: `Your card payment failed. Pro stays on until ${fmtDate(until)}. Please update your card.` }
  if (sub?.billing === 'card' && sub.status === 'active') return { short: 'Pro', long: `Pro: renews automatically on ${fmtDate(until)}.` }
  if (sub?.status === 'non_renewing' || sub?.status === 'cancelled') return { short: 'Pro', long: `Pro until ${fmtDate(until)}. It won’t renew.` }
  return { short: 'Pro', long: `Pro: paid until ${fmtDate(until)}.` }
}

/** Wraps Pro-only pages. Free users see what they'd get and an upgrade button. */
export function ProGate({ title, children }: { title: string; children: ReactNode }) {
  const { pro } = useStore()
  const { go } = useUI()
  if (pro) return <>{children}</>
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-navy sm:text-2xl lg:text-[28px]">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-[15px]">This is a Pro feature.</p>
      </div>
      <div className="grid gap-6 rounded-2xl border bg-card p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
            <Lock className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-navy">Unlock {title} with Pro</h2>
            <ul className="mt-3 grid gap-1.5 text-[15px]">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Button size="lg" onClick={() => go('billing')}>
          See Pro plans
        </Button>
      </div>
    </div>
  )
}

/** Small inline lock for a single Pro button/feature. */
export function ProInline({ children, label = 'Pro' }: { children: ReactNode; label?: string }) {
  const { pro } = useStore()
  const { go } = useUI()
  if (pro) return <>{children}</>
  return (
    <button onClick={() => go('billing')} className="flex w-full items-center justify-between gap-3 rounded-lg border border-dashed px-4 py-3 text-left text-sm text-muted-foreground hover:border-primary/50">
      <span className="flex items-center gap-2">
        <Lock className="size-4" /> {label} is part of Pro
      </span>
      <span className="font-medium text-primary">Upgrade</span>
    </button>
  )
}

export function MethodCard({ active, onClick, method, title, text }: { active: boolean; onClick: () => void; method: 'mpesa' | 'card'; title: string; text: string }) {
  const Icon = method === 'mpesa' ? Smartphone : CreditCard
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('flex items-start gap-3 rounded-xl border p-4 text-left transition-colors', active ? 'border-primary bg-accent ring-1 ring-primary' : 'bg-card hover:border-primary/40')}
    >
      <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', active ? 'bg-primary text-white' : 'bg-muted text-navy')}>
        <Icon className="size-4" />
      </span>
      <span>
        <span className="block text-[15px] font-medium text-navy">{title}</span>
        <span className="text-[13px] text-muted-foreground">{text}</span>
      </span>
    </button>
  )
}
