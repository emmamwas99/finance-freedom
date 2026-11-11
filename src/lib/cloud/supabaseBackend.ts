import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Subscription } from '@/lib/plans'
import { ConflictError, type AuthEvent, type CloudBackend, type CloudUser, type PaymentRecord, type VaultRecord } from './backend'

function toUser(u: { id: string; email?: string } | null | undefined): CloudUser | null {
  return u ? { id: u.id, email: (u.email ?? '').toLowerCase() } : null
}

function toVault(row: any): VaultRecord | null {
  if (!row) return null
  return { version: row.version, kdf: row.kdf, wrappedKey: row.wrapped_key, recoveryKey: row.recovery_key, data: row.data, updatedAt: row.updated_at }
}

function toSub(row: any): Subscription | null {
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

export function createSupabaseBackend(url: string, anonKey: string): CloudBackend {
  const sb: SupabaseClient = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit' },
  })

  async function uid() {
    const { data } = await sb.auth.getUser()
    if (!data.user) throw new Error('Not signed in')
    return data.user.id
  }

  async function fn<T>(name: string, body?: unknown): Promise<T> {
    const { data, error } = await sb.functions.invoke(name, { body: body ?? {} })
    if (error) {
      let msg = error.message
      try {
        const ctx = (error as { context?: Response }).context
        if (ctx) msg = (await ctx.json())?.error ?? msg
      } catch {
        /* ignore */
      }
      throw new Error(msg)
    }
    return data as T
  }

  return {
    mode: 'supabase',

    async getUser() {
      const { data } = await sb.auth.getSession()
      return toUser(data.session?.user)
    },

    onAuthChange(cb) {
      const { data } = sb.auth.onAuthStateChange((event, session) => {
        const e: AuthEvent = event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'PASSWORD_RECOVERY' ? event : 'OTHER'
        cb(e, toUser(session?.user))
      })
      return () => data.subscription.unsubscribe()
    },

    async signUp(email, loginSecret) {
      const { data, error } = await sb.auth.signUp({
        email,
        password: loginSecret,
        options: { emailRedirectTo: `${window.location.origin}/login?confirmed=1` },
      })
      if (error) throw error
      return { user: toUser(data.user), needsConfirmation: !data.session }
    },

    async signIn(email, loginSecret) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password: loginSecret })
      if (error) {
        if (/confirm/i.test(error.message)) throw new Error('Please confirm your email first — check your inbox.')
        if (/invalid login/i.test(error.message)) throw new Error('Wrong email or password.')
        throw error
      }
      return toUser(data.user)!
    },

    async signOut() {
      await sb.auth.signOut()
    },

    async sendPasswordReset(email) {
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset` })
      if (error) throw error
    },

    async setLoginSecret(loginSecret) {
      const { error } = await sb.auth.updateUser({ password: loginSecret })
      if (error) throw error
    },

    async getVault() {
      const { data, error } = await sb.from('vaults').select('*').maybeSingle()
      if (error) throw error
      return toVault(data)
    },

    async createVault(v) {
      const { data, error } = await sb
        .from('vaults')
        .insert({ user_id: await uid(), kdf: v.kdf, wrapped_key: v.wrappedKey, recovery_key: v.recoveryKey, data: v.data, version: 1 })
        .select('*')
        .single()
      if (error) throw error
      return toVault(data)!
    },

    async saveVault(expectedVersion, patch) {
      const row: Record<string, unknown> = { version: expectedVersion + 1 }
      if (patch.data) row.data = patch.data
      if (patch.wrappedKey) row.wrapped_key = patch.wrappedKey
      if (patch.recoveryKey) row.recovery_key = patch.recoveryKey
      const { data, error } = await sb.from('vaults').update(row).eq('user_id', await uid()).eq('version', expectedVersion).select('version')
      if (error) {
        if (error.code === '40001' || /version conflict/.test(error.message)) throw new ConflictError()
        throw error
      }
      if (!data || data.length === 0) throw new ConflictError()
      return data[0].version as number
    },

    async getSubscription() {
      const { data, error } = await sb.from('subscriptions').select('*').maybeSingle()
      if (error) throw error
      return toSub(data)
    },

    async listPayments() {
      const { data, error } = await sb.from('payments').select('*').order('created_at', { ascending: false }).limit(50)
      if (error) throw error
      return (data ?? []).map(
        (p: any): PaymentRecord => ({
          reference: p.reference,
          amount: p.amount,
          period: p.period,
          method: p.method,
          status: p.status,
          paidAt: p.paid_at,
          createdAt: p.created_at,
        }),
      )
    },

    startCheckout: (period, method) => fn('billing-checkout', { period, method }),
    verifyPayment: (reference) => fn('billing-verify', { reference }),
    manageLink: async () => (await fn<{ url: string }>('billing-manage')).url,
    async deleteAccount() {
      await fn('account-delete')
      await sb.auth.signOut()
    },
  }
}
