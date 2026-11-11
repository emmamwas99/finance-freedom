/**
 * Single source of truth for pricing. Imported by the web app AND the edge functions,
 * so it must stay plain TypeScript (no Deno or browser APIs).
 */

export const CURRENCY = 'KES'
export const TRIAL_DAYS = 14
/** Days a card subscription keeps Pro after a failed renewal, while the customer fixes the card. */
export const GRACE_DAYS = 3

export type Period = 'monthly' | 'yearly'
export type PayMethod = 'mpesa' | 'card'

export const PRICES: Record<Period, { amount: number; label: string; per: string }> = {
  monthly: { amount: 299, label: 'Monthly', per: 'month' },
  yearly: { amount: 2999, label: 'Yearly', per: 'year' },
}

export type SubStatus = 'trialing' | 'active' | 'non_renewing' | 'past_due' | 'cancelled' | 'expired'

export interface Subscription {
  status: SubStatus
  trialEndsAt: string | null
  currentPeriodEnd: string | null
  /** card = auto-renewing Paystack subscription; prepaid = one-off payment (M-Pesa or card) */
  billing: 'card' | 'prepaid' | null
  period: Period | null
  hasManageLink: boolean
}

export function proUntil(sub: Subscription | null): Date | null {
  if (!sub) return null
  const dates: number[] = []
  if (sub.trialEndsAt) dates.push(Date.parse(sub.trialEndsAt))
  if (sub.currentPeriodEnd) {
    let end = Date.parse(sub.currentPeriodEnd)
    if (sub.status === 'past_due' && sub.billing === 'card') end += GRACE_DAYS * 864e5
    dates.push(end)
  }
  const max = Math.max(...dates.filter(Number.isFinite), 0)
  return max ? new Date(max) : null
}

export function isPro(sub: Subscription | null, now = Date.now()) {
  const until = proUntil(sub)
  return !!until && until.getTime() > now
}

export function isTrial(sub: Subscription | null, now = Date.now()) {
  if (!sub?.trialEndsAt) return false
  const trialEnd = Date.parse(sub.trialEndsAt)
  const paidEnd = sub.currentPeriodEnd ? Date.parse(sub.currentPeriodEnd) : 0
  return trialEnd > now && paidEnd <= now
}

export const FREE_FEATURES = [
  'Monthly plan: list payments and see what’s left',
  'Unlimited expenses, income and loans',
  'Warnings before you overspend',
  'Debts & goals with your debt-free date',
  'Secure sync on phone and computer',
]

export const PRO_FEATURES = [
  'Monthly report card, with plan vs actual',
  'Yearly reports and charts',
  '“Am I on track?” check with your next moves',
  '“Pay extra” debt-free simulator',
  'Encrypted backups and spreadsheet export',
]
