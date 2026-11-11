import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import type { Status } from '@/lib/insights'
import { cn } from '@/lib/utils'

/** Status always ships with an icon + a word, never colour alone. */
export const statusStyles: Record<Status, { label: string; text: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  good: { label: 'On track', text: 'text-primary', bg: 'bg-accent', border: 'border-l-primary', icon: CheckCircle2 },
  warn: { label: 'Needs attention', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-l-amber-500', icon: AlertTriangle },
  bad: { label: 'Off track', text: 'text-red-600', bg: 'bg-red-50', border: 'border-l-red-600', icon: XCircle },
}

export function StatusBadge({ status, label, className }: { status: Status; label?: string; className?: string }) {
  const s = statusStyles[status]
  const Icon = s.icon
  return (
    <span className={cn('inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[13px] font-medium', s.bg, s.text, className)}>
      <Icon className="size-3.5" />
      {label ?? s.label}
    </span>
  )
}
