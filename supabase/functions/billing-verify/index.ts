// POST { reference } → { subscription }
// Called when the customer returns from Paystack, so Pro unlocks immediately
// even if the webhook hasn't arrived yet. Idempotent with the webhook.
import { applyPayment } from '../_shared/billing.ts'
import { admin, cors, json, paystack, requireUser, toClientSubscription } from '../_shared/http.ts'
import { mapEvent } from '../_shared/paystack.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(req) })
  const user = await requireUser(req)
  if (!user) return json(req, { error: 'Not signed in' }, 401)

  const { reference } = await req.json().catch(() => ({}))
  if (!reference || typeof reference !== 'string') return json(req, { error: 'Missing reference' }, 400)

  const db = admin()
  const { data: payment } = await db.from('payments').select('user_id,status').eq('reference', reference).maybeSingle()
  if (!payment || payment.user_id !== user.id) return json(req, { error: 'Payment not found' }, 404)

  if (payment.status !== 'success') {
    const v = await paystack<{ data: any }>(`/transaction/verify/${encodeURIComponent(reference)}`)
    if (v.data?.status === 'success') {
      const action = mapEvent({ event: 'charge.success', data: v.data })
      if (action.type === 'payment') await applyPayment(db, action)
    } else if (v.data?.status === 'failed' || v.data?.status === 'abandoned') {
      await db.from('payments').update({ status: 'failed' }).eq('reference', reference).eq('status', 'pending')
    }
  }

  const { data: sub } = await db.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle()
  const { data: p2 } = await db.from('payments').select('status').eq('reference', reference).maybeSingle()
  return json(req, { status: p2?.status ?? 'pending', subscription: toClientSubscription(sub) })
})
