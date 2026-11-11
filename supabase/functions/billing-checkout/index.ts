// POST { period: 'monthly'|'yearly', method: 'mpesa'|'card' } → { url, reference }
// Starts a Paystack checkout for the signed-in user.
import { admin, cors, env, json, paystack, requireUser } from '../_shared/http.ts'
import { CURRENCY, PRICES, type PayMethod, type Period } from '../_shared/plans.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(req) })
  if (req.method !== 'POST') return json(req, { error: 'Method not allowed' }, 405)

  const user = await requireUser(req)
  if (!user?.email) return json(req, { error: 'Not signed in' }, 401)

  const body = await req.json().catch(() => ({}))
  const period: Period = body.period === 'yearly' ? 'yearly' : 'monthly'
  const method: PayMethod = body.method === 'card' ? 'card' : 'mpesa'
  const price = PRICES[period]

  // Auto-renewing card plans are optional: set PAYSTACK_PLAN_MONTHLY / PAYSTACK_PLAN_YEARLY to plan codes.
  const planCode = method === 'card' ? Deno.env.get(period === 'yearly' ? 'PAYSTACK_PLAN_YEARLY' : 'PAYSTACK_PLAN_MONTHLY') : undefined
  const reference = `ff_${period}_${crypto.randomUUID().replaceAll('-', '')}`

  const db = admin()
  const { error: insErr } = await db.from('payments').insert({
    user_id: user.id,
    reference,
    amount: price.amount,
    period,
    method,
    status: 'pending',
  })
  if (insErr) return json(req, { error: insErr.message }, 500)

  try {
    const init = await paystack<{ data: { authorization_url: string; reference: string } }>('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email: user.email,
        amount: price.amount * 100, // subunits
        currency: CURRENCY,
        reference,
        channels: method === 'mpesa' ? ['mobile_money'] : ['card'],
        ...(planCode ? { plan: planCode } : {}),
        callback_url: `${env('APP_URL')}/app/billing`,
        metadata: JSON.stringify({ user_id: user.id, period, method }),
      }),
    })
    return json(req, { url: init.data.authorization_url, reference })
  } catch (e) {
    await db.from('payments').update({ status: 'failed' }).eq('reference', reference)
    return json(req, { error: (e as Error).message }, 502)
  }
})
