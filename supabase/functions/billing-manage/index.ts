// POST → { url }   Paystack-hosted page where a card subscriber can update the card or cancel.
import { admin, cors, json, paystack, requireUser } from '../_shared/http.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(req) })
  const user = await requireUser(req)
  if (!user) return json(req, { error: 'Not signed in' }, 401)

  const { data: sub } = await admin().from('subscriptions').select('paystack_subscription_code').eq('user_id', user.id).maybeSingle()
  if (!sub?.paystack_subscription_code) return json(req, { error: 'No card subscription' }, 404)

  const r = await paystack<{ data: { link: string } }>(`/subscription/${encodeURIComponent(sub.paystack_subscription_code)}/manage/link`)
  return json(req, { url: r.data.link })
})
