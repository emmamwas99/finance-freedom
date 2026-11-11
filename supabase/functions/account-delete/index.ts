// POST → { ok }   Permanently deletes the signed-in user's account and encrypted data,
// and stops any auto-renewing Paystack subscription.
import { admin, cors, json, paystack, requireUser } from '../_shared/http.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(req) })
  const user = await requireUser(req)
  if (!user) return json(req, { error: 'Not signed in' }, 401)

  const db = admin()
  const { data: sub } = await db.from('subscriptions').select('paystack_subscription_code,paystack_email_token').eq('user_id', user.id).maybeSingle()
  if (sub?.paystack_subscription_code && sub.paystack_email_token) {
    try {
      await paystack('/subscription/disable', {
        method: 'POST',
        body: JSON.stringify({ code: sub.paystack_subscription_code, token: sub.paystack_email_token }),
      })
    } catch (e) {
      console.warn('could not disable subscription', e)
    }
  }

  // vaults + subscriptions are removed by ON DELETE CASCADE; payments keep a record with user_id = null
  const { error } = await db.auth.admin.deleteUser(user.id)
  if (error) return json(req, { error: error.message }, 500)
  return json(req, { ok: true })
})
