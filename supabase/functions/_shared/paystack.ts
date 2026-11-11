/**
 * Paystack helpers that are pure (Web Crypto only) so they run in Deno edge functions
 * and in Node unit tests.
 */
import { PRICES, type Period } from './plans.ts'

const enc = new TextEncoder()

function toHex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}

async function hmacSha512Hex(key: string, parts: (string | Uint8Array)[]) {
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign'])
  const chunks = parts.map((p) => (typeof p === 'string' ? enc.encode(p) : p))
  const total = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0))
  let o = 0
  for (const c of chunks) {
    total.set(c, o)
    o += c.length
  }
  return toHex(await crypto.subtle.sign('HMAC', k, total))
}

export interface SignatureConfig {
  /** Webhook signing secret (whsec_…) — verifies the current `Paystack-Signature` header. */
  webhookSecret?: string
  /** Secret key (sk_…) — verifies the legacy `x-paystack-signature` header. */
  secretKey?: string
  /** Seconds; Paystack recommends rejecting events older than 5 minutes. */
  toleranceSec?: number
}

/**
 * Verifies a webhook. Current scheme: header `Paystack-Signature: t=<unix>,v1=<kid>:<hex>`
 * where hex = HMAC-SHA512(webhookSecret, `${t}.` + rawBody). Legacy scheme:
 * `x-paystack-signature` = HMAC-SHA512(secretKey, rawBody).
 */
export async function verifyPaystackSignature(rawBody: Uint8Array, headers: Headers, cfg: SignatureConfig, nowSec = Math.floor(Date.now() / 1000)) {
  const current = headers.get('paystack-signature')
  if (current && cfg.webhookSecret) {
    let t = ''
    const sigs: string[] = []
    for (const part of current.split(',')) {
      const [k, ...rest] = part.trim().split('=')
      const v = rest.join('=')
      if (k === 't') t = v
      if (k === 'v1') sigs.push(v.includes(':') ? v.slice(v.indexOf(':') + 1) : v)
    }
    const ts = Number(t)
    if (!t || !Number.isFinite(ts) || Math.abs(nowSec - ts) > (cfg.toleranceSec ?? 300)) return false
    const expected = await hmacSha512Hex(cfg.webhookSecret, [`${t}.`, rawBody])
    return sigs.some((s) => safeEqual(s.toLowerCase(), expected))
  }
  const legacy = headers.get('x-paystack-signature')
  if (legacy && cfg.secretKey) {
    const expected = await hmacSha512Hex(cfg.secretKey, [rawBody])
    return safeEqual(legacy.toLowerCase(), expected)
  }
  return false
}

// ---------------------------------------------------------------------------
// Event → action mapping
// ---------------------------------------------------------------------------

// deno-lint-ignore no-explicit-any
type Json = any

export type WebhookAction =
  | {
      type: 'payment'
      reference: string
      email: string
      amountKes: number
      period: Period
      channel: string | null
      paidAt: string
      customerCode: string | null
      /** true when the charge belongs to an auto-renewing plan */
      recurring: boolean
    }
  | {
      type: 'subscription'
      email: string
      customerCode: string | null
      subscriptionCode: string | null
      emailToken: string | null
      status: 'active' | 'non_renewing' | 'cancelled' | 'past_due'
      nextPaymentDate: string | null
    }
  | { type: 'payment_failed'; email: string; customerCode: string | null; subscriptionCode: string | null }
  | { type: 'ignore'; reason: string }

/** Unique id for de-duplicating resent events. */
export function eventKey(evt: Json): string {
  const d = evt?.data ?? {}
  const id = d.id ?? d.reference ?? d.subscription_code ?? d.invoice_code ?? JSON.stringify(d).length
  return `${evt?.event}:${id}:${d.status ?? ''}`
}

function parseMeta(m: Json): Record<string, unknown> {
  if (!m) return {}
  if (typeof m === 'string') {
    try {
      return JSON.parse(m)
    } catch {
      return {}
    }
  }
  return m
}

export function periodFromAmount(amountKes: number): Period {
  // whichever price is closest; yearly is ~10x monthly so this is unambiguous
  return Math.abs(amountKes - PRICES.yearly.amount) < Math.abs(amountKes - PRICES.monthly.amount) ? 'yearly' : 'monthly'
}

function periodFromPlan(plan: Json): Period | null {
  const interval = plan?.interval
  if (interval === 'annually' || interval === 'yearly') return 'yearly'
  if (interval === 'monthly') return 'monthly'
  return null
}

export function mapEvent(evt: Json): WebhookAction {
  const name: string = evt?.event ?? ''
  const d = evt?.data ?? {}
  const email = String(d.customer?.email ?? '').toLowerCase()
  const customerCode = d.customer?.customer_code ?? null

  switch (name) {
    case 'charge.success': {
      if (d.status && d.status !== 'success') return { type: 'ignore', reason: `status ${d.status}` }
      if (d.currency && d.currency !== 'KES') return { type: 'ignore', reason: `currency ${d.currency}` }
      const amountKes = Math.round(Number(d.amount ?? 0) / 100)
      const meta = parseMeta(d.metadata)
      const planObj = d.plan && typeof d.plan === 'object' && d.plan.plan_code ? d.plan : null
      const period = (meta.period as Period) || periodFromPlan(planObj) || periodFromAmount(amountKes)
      return {
        type: 'payment',
        reference: String(d.reference),
        email,
        amountKes,
        period: period === 'yearly' ? 'yearly' : 'monthly',
        channel: d.channel ?? null,
        paidAt: d.paid_at ?? d.paidAt ?? new Date().toISOString(),
        customerCode,
        recurring: !!planObj,
      }
    }
    case 'subscription.create':
    case 'subscription.enable':
      return {
        type: 'subscription',
        email,
        customerCode,
        subscriptionCode: d.subscription_code ?? null,
        emailToken: d.email_token ?? null,
        status: 'active',
        nextPaymentDate: d.next_payment_date ?? null,
      }
    case 'subscription.not_renew':
      return { type: 'subscription', email, customerCode, subscriptionCode: d.subscription_code ?? null, emailToken: d.email_token ?? null, status: 'non_renewing', nextPaymentDate: d.next_payment_date ?? null }
    case 'subscription.disable':
      return { type: 'subscription', email, customerCode, subscriptionCode: d.subscription_code ?? null, emailToken: d.email_token ?? null, status: 'cancelled', nextPaymentDate: null }
    case 'invoice.payment_failed':
      return { type: 'payment_failed', email, customerCode, subscriptionCode: d.subscription?.subscription_code ?? null }
    default:
      return { type: 'ignore', reason: `unhandled ${name}` }
  }
}

/** Amount check: reject charges that don't match a known price (protects against tampered amounts). */
export function amountMatches(amountKes: number, period: Period) {
  return amountKes >= PRICES[period].amount
}
