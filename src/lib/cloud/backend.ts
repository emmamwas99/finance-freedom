import type { PayMethod, Period, Subscription } from '@/lib/plans'
import type { AppData } from '@/lib/types'
import type { Sealed } from './keys'

export interface CloudUser {
  id: string
  email: string
}

export interface VaultRecord {
  version: number
  kdf: { name: string; iterations: number; v: number }
  wrappedKey: Sealed
  recoveryKey: Sealed
  data: Sealed
  updatedAt: string
}

export interface PaymentRecord {
  reference: string
  amount: number
  period: Period
  method: string | null
  status: 'pending' | 'success' | 'failed'
  paidAt: string | null
  createdAt: string
}

export type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'PASSWORD_RECOVERY' | 'OTHER'

export class ConflictError extends Error {
  constructor() {
    super('The data changed on another device')
  }
}

export class OfflineError extends Error {
  constructor() {
    super('You are offline')
  }
}

export interface CloudBackend {
  mode: 'go' | 'demo'
  getUser(): Promise<CloudUser | null>
  onAuthChange(cb: (event: AuthEvent, user: CloudUser | null) => void): () => void
  /** Returns needsConfirmation=true when the user must click the email link first. */
  signUp(email: string, loginSecret: string, name: string): Promise<{ user: CloudUser | null; needsConfirmation: boolean }>
  signIn(email: string, loginSecret: string): Promise<CloudUser>
  signOut(): Promise<void>
  sendPasswordReset(email: string): Promise<void>
  setLoginSecret(loginSecret: string): Promise<void>

  getVault(): Promise<VaultRecord | null>
  createVault(v: Omit<VaultRecord, 'version' | 'updatedAt'> & { finance?: AppData }): Promise<VaultRecord>
  /** Writes new ciphertext; throws ConflictError if the server version moved on. */
  saveVault(expectedVersion: number, patch: Partial<Pick<VaultRecord, 'data' | 'wrappedKey' | 'recoveryKey'>> & { finance?: AppData }): Promise<number>

  getSubscription(): Promise<Subscription | null>
  listPayments(): Promise<PaymentRecord[]>
  startCheckout(period: Period, method: PayMethod): Promise<{ url: string; reference: string }>
  verifyPayment(reference: string): Promise<{ status: string; subscription: Subscription | null }>
  manageLink(): Promise<string>
  deleteAccount(): Promise<void>
}

export function isNetworkError(e: unknown) {
  const msg = String((e as Error)?.message ?? e)
  return e instanceof OfflineError || /Failed to fetch|NetworkError|Load failed|network/i.test(msg) || (typeof navigator !== 'undefined' && !navigator.onLine)
}
