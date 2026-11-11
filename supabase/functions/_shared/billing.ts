import type { SupabaseClient } from 'npm:@supabase/supabase-js@2'
import { amountMatches, type WebhookAction } from './paystack.ts'

type PaymentAction = Extract<WebhookAction, { type: 'payment' }>

/** Find which of our users a Paystack event belongs to. */
export async function findUserId(db: SupabaseClient, opts: { reference?: string; customerCode?: string | null; email?: string }) {
  if (opts.reference) {
    const { data } = await db.from('payments').select('user_id').eq('reference', opts.reference).maybeSingle()
    if (data?.user_id) return data.user_id as string
  }
  if (opts.customerCode) {
    const { data } = await db.from('subscriptions').select('user_id').eq('paystack_customer_code', opts.customerCode).maybeSingle()
    if (data?.user_id) return data.user_id as string
  }
  if (opts.email) {
    const { data } = await db.from('subscriptions').select('user_id').ilike('email', opts.email).maybeSingle()
    if (data?.user_id) return data.user_id as string
  }
  return null
}

/** Applies a successful charge. Safe to call more than once for the same reference. */
export async function applyPayment(db: SupabaseClient, a: PaymentAction) {
  const userId = await findUserId(db, { reference: a.reference, customerCode: a.customerCode, email: a.email })
  if (!userId) return { ok: false, reason: 'unknown user' }
  if (!amountMatches(a.amountKes, a.period)) return { ok: false, reason: `amount ${a.amountKes} too low for ${a.period}` }
  const { data: pending } = await db.from('payments').select('method').eq('reference', a.reference).maybeSingle()
  const { data, error } = await db.rpc('apply_payment', {
    p_reference: a.reference,
    p_user: userId,
    p_amount: a.amountKes,
    p_period: a.period,
    p_billing: a.recurring ? 'card' : 'prepaid',
    p_method: pending?.method ?? (a.channel === 'mobile_money' ? 'mpesa' : 'card'),
    p_channel: a.channel,
    p_paid_at: a.paidAt,
    p_customer_code: a.customerCode,
  })
  if (error) throw error
  return { ok: true, applied: data as boolean, userId }
}
