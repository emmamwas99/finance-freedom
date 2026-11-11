import { api, ApiError } from '@/lib/api/client'
import type { Subscription } from '@/lib/plans'
import { ConflictError, type AuthEvent, type CloudBackend, type CloudUser, type PaymentRecord, type VaultRecord } from './backend'

type UserResponse = { user: CloudUser }
type SubResponse = { subscription: Subscription | null }

export function createGoBackend(baseURL: string): CloudBackend {
  const listeners = new Set<(event: AuthEvent, user: CloudUser | null) => void>()
  const emit = (event: AuthEvent, user: CloudUser | null) => listeners.forEach((fn) => fn(event, user))
  const call = <T>(path: string, method = 'GET', body?: unknown, signal?: AbortSignal) =>
    api<T>(baseURL, path, { method, body: body === undefined ? undefined : JSON.stringify(body), signal })

  return {
    mode: 'go',
    async getUser() {
      if (window.location.pathname === '/reset') {
        const token = new URLSearchParams(window.location.search).get('token')
        if (token) {
          const { user } = await call<UserResponse>('/auth/recovery-session', 'POST', { token })
          window.history.replaceState(null, '', '/reset')
          emit('PASSWORD_RECOVERY', user)
          return user
        }
      }
      try { return (await call<UserResponse>('/users/me')).user }
      catch (e) { if (e instanceof ApiError && e.status === 401) return null; throw e }
    },
    onAuthChange(cb) { listeners.add(cb); return () => listeners.delete(cb) },
    async signUp(email, loginSecret) {
      const result = await call<{ user: CloudUser; needsConfirmation: boolean }>('/auth/register', 'POST', { email, password: loginSecret })
      if (!result.needsConfirmation) emit('SIGNED_IN', result.user)
      return result
    },
    async signIn(email, loginSecret) {
      const { user } = await call<UserResponse>('/auth/login', 'POST', { email, password: loginSecret })
      emit('SIGNED_IN', user)
      return user
    },
    async signOut() { await call<void>('/auth/logout', 'POST', {}); emit('SIGNED_OUT', null) },
    sendPasswordReset(email) { return call<void>('/auth/forgot-password', 'POST', { email }) },
    setLoginSecret(loginSecret) { return call<void>('/auth/password', 'POST', { password: loginSecret }) },
    async getVault() { return (await call<{ vault: VaultRecord | null }>('/vault')).vault },
    async createVault(v) { return (await call<{ vault: VaultRecord }>('/vault', 'POST', v)).vault },
    async saveVault(expectedVersion, patch) {
      try { return (await call<{ version: number }>('/vault', 'PATCH', { expectedVersion, ...patch })).version }
      catch (e) { if (e instanceof ApiError && e.code === 'version_conflict') throw new ConflictError(); throw e }
    },
    async getSubscription() { return (await call<SubResponse>('/billing/subscription')).subscription },
    async listPayments() {
      const { payments } = await call<{ payments: Array<Omit<PaymentRecord, 'amount'> & { amount_minor: number }> }>('/billing/payments')
      return payments.map(({ amount_minor, ...p }) => ({ ...p, amount: amount_minor / 100 }))
    },
    startCheckout(period, method) { return call<{ url: string; reference: string }>('/billing/checkout', 'POST', { period, method }) },
    verifyPayment(reference) { return call<{ status: string; subscription: Subscription | null }>('/billing/verify', 'POST', { reference }) },
    async manageLink() { return (await call<{ url: string }>('/billing/manage')).url },
    async deleteAccount() { await call<void>('/users/me', 'DELETE'); emit('SIGNED_OUT', null) },
  }
}
