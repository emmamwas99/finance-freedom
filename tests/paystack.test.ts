import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { amountMatches, eventKey, mapEvent, periodFromAmount, verifyPaystackSignature } from '../supabase/functions/_shared/paystack'

const body = JSON.stringify({ event: 'charge.success', data: { reference: 'ff_x', amount: 29900 } })
const raw = new TextEncoder().encode(body)

describe('webhook signatures', () => {
  it('accepts the current Paystack-Signature scheme (t + v1, whsec secret)', async () => {
    const secret = 'whsec_test123'
    const t = 1_800_000_000
    const sig = createHmac('sha512', secret).update(`${t}.`).update(body).digest('hex')
    const h = new Headers({ 'Paystack-Signature': `t=${t},v1=whk_abc:${sig}` })
    expect(await verifyPaystackSignature(raw, h, { webhookSecret: secret }, t + 10)).toBe(true)
  })

  it('accepts when any of several v1 signatures matches (secret rotation)', async () => {
    const t = 1_800_000_000
    const sig = createHmac('sha512', 'whsec_new').update(`${t}.`).update(body).digest('hex')
    const h = new Headers({ 'Paystack-Signature': `t=${t},v1=whk_old:${'0'.repeat(128)},v1=whk_new:${sig}` })
    expect(await verifyPaystackSignature(raw, h, { webhookSecret: 'whsec_new' }, t)).toBe(true)
  })

  it('rejects stale timestamps, tampered bodies and wrong secrets', async () => {
    const secret = 'whsec_test123'
    const t = 1_800_000_000
    const sig = createHmac('sha512', secret).update(`${t}.`).update(body).digest('hex')
    const h = new Headers({ 'Paystack-Signature': `t=${t},v1=whk_abc:${sig}` })
    expect(await verifyPaystackSignature(raw, h, { webhookSecret: secret }, t + 301)).toBe(false)
    expect(await verifyPaystackSignature(new TextEncoder().encode(body.replace('29900', '1')), h, { webhookSecret: secret }, t)).toBe(false)
    expect(await verifyPaystackSignature(raw, h, { webhookSecret: 'whsec_other' }, t)).toBe(false)
    expect(await verifyPaystackSignature(raw, new Headers(), { webhookSecret: secret }, t)).toBe(false)
  })

  it('still accepts the legacy x-paystack-signature (secret key over raw body)', async () => {
    const sk = 'sk_test_abc'
    const sig = createHmac('sha512', sk).update(body).digest('hex')
    expect(await verifyPaystackSignature(raw, new Headers({ 'x-paystack-signature': sig }), { secretKey: sk })).toBe(true)
    expect(await verifyPaystackSignature(raw, new Headers({ 'x-paystack-signature': sig }), { secretKey: 'sk_wrong' })).toBe(false)
  })
})

describe('event mapping', () => {
  it('maps an M-Pesa charge to a prepaid payment', () => {
    const a = mapEvent({
      event: 'charge.success',
      data: { status: 'success', reference: 'ff_monthly_1', amount: 29900, currency: 'KES', channel: 'mobile_money', paid_at: '2026-11-11T10:00:00Z', customer: { email: 'A@B.co', customer_code: 'CUS_1' }, metadata: '{"period":"monthly"}' },
    })
    expect(a).toMatchObject({ type: 'payment', reference: 'ff_monthly_1', amountKes: 299, period: 'monthly', recurring: false, email: 'a@b.co' })
  })

  it('maps a plan charge to a recurring card payment and infers the period', () => {
    const a = mapEvent({ event: 'charge.success', data: { status: 'success', reference: 'r2', amount: 299900, currency: 'KES', channel: 'card', plan: { plan_code: 'PLN_1', interval: 'annually' }, customer: { email: 'x@y.z' } } })
    expect(a).toMatchObject({ type: 'payment', period: 'yearly', recurring: true })
  })

  it('ignores other currencies and failed charges', () => {
    expect(mapEvent({ event: 'charge.success', data: { status: 'failed' } }).type).toBe('ignore')
    expect(mapEvent({ event: 'charge.success', data: { status: 'success', currency: 'NGN' } }).type).toBe('ignore')
  })

  it('maps subscription lifecycle events', () => {
    expect(mapEvent({ event: 'subscription.create', data: { subscription_code: 'SUB_1', email_token: 't', next_payment_date: '2026-12-11', customer: { email: 'a@b.co' } } })).toMatchObject({ type: 'subscription', status: 'active', subscriptionCode: 'SUB_1' })
    expect(mapEvent({ event: 'subscription.not_renew', data: {} })).toMatchObject({ status: 'non_renewing' })
    expect(mapEvent({ event: 'subscription.disable', data: {} })).toMatchObject({ status: 'cancelled' })
    expect(mapEvent({ event: 'invoice.payment_failed', data: { subscription: { subscription_code: 'SUB_1' } } })).toMatchObject({ type: 'payment_failed', subscriptionCode: 'SUB_1' })
  })

  it('guards amounts and builds stable de-dup keys', () => {
    expect(periodFromAmount(299)).toBe('monthly')
    expect(periodFromAmount(2999)).toBe('yearly')
    expect(amountMatches(299, 'monthly')).toBe(true)
    expect(amountMatches(1, 'monthly')).toBe(false)
    expect(amountMatches(299, 'yearly')).toBe(false)
    const e = { event: 'charge.success', data: { id: 42, status: 'success' } }
    expect(eventKey(e)).toBe(eventKey(structuredClone(e)))
  })
})
