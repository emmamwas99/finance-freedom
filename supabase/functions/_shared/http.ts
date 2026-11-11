// Shared helpers for edge functions (Deno).
import { createClient, type SupabaseClient, type User } from 'npm:@supabase/supabase-js@2'

export const env = (k: string, required = true) => {
  const v = Deno.env.get(k)
  if (!v && required) throw new Error(`Missing env ${k}`)
  return v ?? ''
}

const allowedOrigin = () => Deno.env.get('APP_URL') ?? '*'

export function cors(req: Request) {
  const origin = req.headers.get('origin') ?? ''
  const allow = allowedOrigin()
  return {
    'Access-Control-Allow-Origin': allow === '*' || origin === allow ? origin || allow : allow,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  }
}

export function json(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...cors(req) } })
}

export function admin(): SupabaseClient {
  return createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } })
}

/** Returns the signed-in user from the request's Authorization header, or null. */
export async function requireUser(req: Request): Promise<User | null> {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (!token) return null
  const { data, error } = await admin().auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}

export async function paystack<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`https://api.paystack.co${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${env('PAYSTACK_SECRET_KEY')}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok || body?.status === false) throw new Error(body?.message ?? `Paystack ${res.status}`)
  return body as T
}

/** Shape the subscription row the way the web app expects. */
export function toClientSubscription(row: any) {
  if (!row) return null
  return {
    status: row.status,
    trialEndsAt: row.trial_ends_at,
    currentPeriodEnd: row.current_period_end,
    billing: row.billing,
    period: row.period,
    hasManageLink: !!row.paystack_subscription_code,
  }
}
