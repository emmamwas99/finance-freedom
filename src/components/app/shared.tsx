'use client'

import { AlertTriangle, ChevronLeft, ChevronRight, Info, Pencil } from 'lucide-react'
import { Children, cloneElement, isValidElement, useId, type ComponentProps, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { levelColor, type Level } from '@/lib/calc'
import { currentMonth, monthLabel, shiftMonth } from '@/lib/format'
import { cn } from '@/lib/utils'

export function Bar({ value, level = 'ok', className }: { value: number; level?: Level; className?: string }) {
  const w = Math.max(0, Math.min(100, value * 100))
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-muted', className)}>
      <div className={cn('h-full rounded-full transition-all', levelColor[level])} style={{ width: `${w}%` }} />
    </div>
  )
}

export function MonthSwitcher({ value, onChange }: { value: string; onChange: (k: string) => void }) {
  const isCurrent = value === currentMonth()
  return (
    <div className="flex items-center gap-2">
      {!isCurrent && (
        <Button variant="ghost" size="sm" className="text-primary" onClick={() => onChange(currentMonth())}>
          This month
        </Button>
      )}
      <div className="flex items-center rounded-lg border bg-card">
        <Button variant="ghost" size="icon" onClick={() => onChange(shiftMonth(value, -1))} aria-label="Previous month">
          <ChevronLeft />
        </Button>
        <span className="min-w-36 text-center text-[15px] font-medium text-navy">{monthLabel(value)}</span>
        <Button variant="ghost" size="icon" onClick={() => onChange(shiftMonth(value, 1))} aria-label="Next month">
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}

export function Field({ label, hint, children, className }: { label: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  const autoId = useId()
  // link the label to the first child, the control (Input, AmountInput, PasswordInput…);
  // anything after it (e.g. a strength meter) is rendered as-is
  const parts = Children.toArray(children)
  const control = isValidElement<{ id?: string }>(parts[0]) ? parts[0] : null
  const id = control?.props.id ?? autoId
  return (
    <div className={cn('grid gap-1.5', className)}>
      <Label htmlFor={control ? id : undefined} className="text-[13px] font-medium text-muted-foreground">
        {label}
      </Label>
      {control ? (
        <>
          {cloneElement(control, { id })}
          {parts.slice(1)}
        </>
      ) : (
        children
      )}
      {hint && <p className="text-[13px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function AmountInput({ className, ...props }: ComponentProps<typeof Input>) {
  return <Input inputMode="decimal" autoComplete="off" placeholder="0" className={cn('tabular-nums', className)} {...props} />
}

export function CardTitleRow({ title, sub, action }: { title: ReactNode; sub?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold text-navy">{title}</h2>
        {sub && <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function Empty({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-lg border border-dashed px-6 py-8 text-center">
      <p className="text-[15px] font-medium">{title}</p>
      {children && <div className="max-w-sm text-sm text-muted-foreground">{children}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export function Stat({
  label,
  value,
  sub,
  tone,
  highlight,
  onClick,
  action,
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  tone?: 'bad' | 'warn'
  highlight?: boolean
  onClick?: () => void
  /** small label shown on hover, e.g. "Edit" */
  action?: string
}) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      onClick={onClick}
      className={cn(
        'group relative min-w-0 rounded-xl border p-4 text-left sm:p-5',
        highlight ? 'border-navy bg-navy text-white' : 'bg-card',
        onClick && (highlight ? 'transition-colors hover:bg-navy-2' : 'transition-colors hover:border-primary/40 hover:bg-accent/40'),
      )}
    >
      {onClick && action && (
        <span
          className={cn(
            'absolute top-4 right-4 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[12px] opacity-60 transition-opacity group-hover:opacity-100',
            highlight ? 'text-white/80' : 'text-primary',
          )}
        >
          <Pencil className="size-3" /> <span className="hidden sm:inline">{action}</span>
        </span>
      )}
      <p className={cn('pr-5 text-[13px] leading-snug sm:pr-12 sm:text-sm', highlight ? 'text-white/70' : 'text-muted-foreground')}>{label}</p>
      <p
        className={cn(
          'mt-1 text-lg leading-tight font-semibold tracking-tight break-words tabular-nums sm:text-2xl',
          !highlight && 'text-navy',
          tone === 'bad' && (highlight ? 'text-red-200' : 'text-red-600'),
          tone === 'warn' && !highlight && 'text-amber-700',
        )}
      >
        {value}
      </p>
      {sub && <p className={cn('mt-1 text-[12px] leading-snug sm:text-[13px]', highlight ? 'text-white/70' : 'text-muted-foreground')}>{sub}</p>}
    </Comp>
  )
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-navy sm:text-2xl lg:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground sm:text-[15px]">{subtitle}</p>}
      </div>
      {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
    </div>
  )
}

export function Notice({ tone = 'info', children, action }: { tone?: 'info' | 'warn' | 'over'; children: ReactNode; action?: ReactNode }) {
  const Icon = tone === 'info' ? Info : AlertTriangle
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border px-4 py-3 text-sm',
        tone === 'over' && 'border-red-200 bg-red-50 text-red-800',
        tone === 'warn' && 'border-amber-200 bg-amber-50 text-amber-900',
        tone === 'info' && 'border-sky-100 bg-accent text-navy',
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="flex-1">{children}</div>
      {action}
    </div>
  )
}

/** Key/value line used in summaries. */
export function Line({ label, value, strong, className }: { label: ReactNode; value: ReactNode; strong?: boolean; className?: string }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4 text-[15px]', className)}>
      <span className={strong ? 'font-medium text-navy' : 'text-muted-foreground'}>{label}</span>
      <span className={cn('tabular-nums', strong ? 'text-lg font-semibold text-navy' : 'text-foreground')}>{value}</span>
    </div>
  )
}
