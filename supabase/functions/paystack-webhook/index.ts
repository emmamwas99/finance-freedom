// Paystack → us. Configure in Paystack dashboard: Settings → API Keys & Webhooks → Webhook URL
//   https://<project>.supabase.co/functions/v1/paystack-webhook
// JWT verification is disabled for this function (see supabase/config.toml); requests are
// authenticated by the Paystack signature instead.
import { applyPayment, findUserId } from '../_shared/billing.ts'
import { admin } from '../_shared/http.ts'
import { eventKey, mapEvent, verifyPaystackSignature } from '../_shared/paystack.ts'

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const raw = new Uint8Array(await req.arrayBuffer()) // raw bytes BEFORE parsing — required for the signature
  const ok = await verifyPaystackSignature(raw, req.headers, {
    webhookSecret: Deno.env.get('PAYSTACK_WEBHOOK_SECRET') ?? undefined,
    secretKey: Deno.env.get('PAYSTACK_SECRET_KEY') ?? undefined,
  })
  if (!ok) return new Response('Invalid signature', { status: 401 })

  let evt: any
  try {
    evt = JSON.parse(new TextDecoder().decode(raw))
  } catch {
    return new Response('Bad JSON', { status: 400 })
  }

  const db = admin()

  // De-duplicate: Paystack resends events until it gets a 200.
  const key = eventKey(evt)
  const { error: dupErr } = await db.from('webhook_events').insert({ id: key })
  if (dupErr) {
    if (dupErr.code === '23505') return new Response('ok (duplicate)', { status: 200 })
    console.error('webhook_events insert failed', dupErr)
  }

  try {
    const action = mapEvent(evt)
    if (action.type === 'payment') {
      const r = await applyPayment(db, action)
      if (!r.ok) console.warn('payment not applied', action.reference, r.reason)
    } else if (action.type === 'subscription') {
      const userId = await findUserId(db, { customerCode: action.customerCode, email: action.email })
      if (userId) {
        const patch: Record<string, unknown> = { status: action.status, billing: 'card' }
        if (action.subscriptionCode) patch.paystack_subscription_code = action.subscriptionCode
        if (action.emailToken) patch.paystack_email_token = action.emailToken
        if (action.customerCode) patch.paystack_customer_code = action.customerCode
        if (action.nextPaymentDate) patch.current_period_end = action.nextPaymentDate
        await db.from('subscriptions').update(patch).eq('user_id', userId)
      }
    } else if (action.type === 'payment_failed') {
      const userId = await findUserId(db, { customerCode: action.customerCode, email: action.email })
      if (userId) await db.from('subscriptions').update({ status: 'past_due' }).eq('user_id', userId)
    }
  } catch (e) {
    console.error('webhook processing failed', e)
    // let Paystack retry: remove the de-dup marker
    await db.from('webhook_events').delete().eq('id', key)
    return new Response('error', { status: 500 })
  }

  return new Response('ok', { status: 200 })
})
