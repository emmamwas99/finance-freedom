/**
 * DEMO backend: runs entirely in this browser (localStorage) so the full SaaS flow —
 * sign up, trial, checkout, Pro — can be tried before Supabase and Paystack are set up.
 * It is used automatically when VITE_SUPABASE_URL is not configured. Never use it in production.
 */
import { PRICES, TRIAL_DAYS, type PayMethod, type Period, type Subscription } from '@/lib/plans'
import { ConflictError, type AuthEvent, type CloudBackend, type CloudUser, type PaymentRecord, type VaultRecord } from './backend'

const KEY = 'ff.demo.db'

interface Checkout {
  uid: string
  period: Period
  method: PayMethod
  paid: boolean
}

interface DB {
  users: Record<string, { id: string; secret: string }>
  session: string | null
  recoveryFor: string | null
  vaults: Record<string, VaultRecord>
  subs: Record<string, Subscription & { email: string }>
  payments: Record<string, PaymentRecord[]>
  checkouts: Record<string, Checkout>
}

function load(): DB {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || '')
    return { users: {}, session: null, recoveryFor: null, vaults: {}, subs: {}, payments: {}, checkouts: {}, ...d }
  } catch {
    return { users: {}, session: null, recoveryFor: null, vaults: {}, subs: {}, payments: {}, checkouts: {} }
  }
}
function save(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db))
}
const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

function userById(db: DB, id: string | null): CloudUser | null {
  if (!id) return null
  const email = Object.keys(db.users).find((e) => db.users[e].id === id)
  return email ? { id, email } : null
}

/** Used by the demo checkout page to simulate the customer paying (or cancelling). */
export function demoCheckout(ref: string) {
  return load().checkouts[ref] ?? null
}
export function demoMarkPaid(ref: string) {
  const db = load()
  if (db.checkouts[ref]) db.checkouts[ref].paid = true
  save(db)
}

/** Simulates a card subscription renewal failing (for testing the grace period). */
export function demoExpireNow() {
  const db = load()
  const uid = db.session
  if (uid && db.subs[uid]) {
    db.subs[uid].trialEndsAt = new Date(Date.now() - 864e5).toISOString()
    db.subs[uid].currentPeriodEnd = null
    db.subs[uid].status = 'expired'
    save(db)
  }
}

export function createDemoBackend(): CloudBackend {
  const listeners = new Set<(e: AuthEvent, u: CloudUser | null) => void>()
  const emit = (e: AuthEvent, u: CloudUser | null) => listeners.forEach((l) => l(e, u))

  return {
    mode: 'demo',

    async getUser() {
      const db = load()
      if (db.session) return userById(db, db.session)
      if (db.recoveryFor && window.location.pathname === '/reset') return userById(db, db.recoveryFor)
      return null
    },

    onAuthChange(cb) {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },

    async signUp(email, secret) {
      await delay()
      const db = load()
      const e = email.trim().toLowerCase()
      if (db.users[e]) throw new Error('An account with this email already exists. Log in instead.')
      const id = crypto.randomUUID()
      db.users[e] = { id, secret }
      db.session = id
      db.subs[id] = {
        email: e,
        status: 'trialing',
        trialEndsAt: new Date(Date.now() + TRIAL_DAYS * 864e5).toISOString(),
        currentPeriodEnd: null,
        billing: null,
        period: null,
        hasManageLink: false,
      }
      save(db)
      const u = { id, email: e }
      emit('SIGNED_IN', u)
      return { user: u, needsConfirmation: false }
    },

    async signIn(email, secret) {
      await delay()
      const db = load()
      const e = email.trim().toLowerCase()
      const u = db.users[e]
      if (!u || u.secret !== secret) throw new Error('Wrong email or password.')
      db.session = u.id
      save(db)
      const user = { id: u.id, email: e }
      emit('SIGNED_IN', user)
      return user
    },

    async signOut() {
      const db = load()
      db.session = null
      db.recoveryFor = null
      save(db)
      emit('SIGNED_OUT', null)
    },

    async sendPasswordReset(email) {
      await delay()
      const db = load()
      const u = db.users[email.trim().toLowerCase()]
      db.recoveryFor = u?.id ?? null
      save(db)
    },

    async setLoginSecret(secret) {
      const db = load()
      const uid = db.session ?? db.recoveryFor
      const email = Object.keys(db.users).find((e) => db.users[e].id === uid)
      if (!email) throw new Error('Not signed in')
      db.users[email].secret = secret
      if (!db.session) db.session = uid
      db.recoveryFor = null
      save(db)
    },

    async getVault() {
      await delay(60)
      const db = load()
      const uid = db.session ?? db.recoveryFor
      return uid ? (db.vaults[uid] ?? null) : null
    },

    async createVault(v) {
      const { finance: _finance, ...encrypted } = v
      const db = load()
      const uid = (db.session ?? db.recoveryFor)!
      if (db.vaults[uid]) throw new Error('Vault exists')
      db.vaults[uid] = { ...encrypted, version: 1, updatedAt: new Date().toISOString() }
      save(db)
      return db.vaults[uid]
    },

    async saveVault(expected, patch) {
      const { finance: _finance, ...encrypted } = patch
      await delay(80)
      const db = load()
      const uid = (db.session ?? db.recoveryFor)!
      const cur = db.vaults[uid]
      if (!cur || cur.version !== expected) throw new ConflictError()
      db.vaults[uid] = { ...cur, ...encrypted, version: expected + 1, updatedAt: new Date().toISOString() }
      save(db)
      return expected + 1
    },

    async getSubscription() {
      const db = load()
      const s = db.session ? db.subs[db.session] : null
      if (!s) return null
      const { email: _e, ...sub } = s
      return sub
    },

    async listPayments() {
      const db = load()
      return db.session ? [...(db.payments[db.session] ?? [])].reverse() : []
    },

    async startCheckout(period, method) {
      await delay()
      const db = load()
      const ref = `demo_${period}_${crypto.randomUUID().slice(0, 8)}`
      db.checkouts[ref] = { uid: db.session!, period, method, paid: false }
      ;(db.payments[db.session!] ??= []).push({
        reference: ref,
        amount: PRICES[period].amount,
        period,
        method,
        status: 'pending',
        paidAt: null,
        createdAt: new Date().toISOString(),
      })
      save(db)
      return { url: `/demo-checkout?ref=${ref}`, reference: ref }
    },

    async verifyPayment(ref) {
      await delay()
      const db = load()
      const c = db.checkouts[ref]
      const uid = db.session!
      const p = (db.payments[uid] ?? []).find((x) => x.reference === ref)
      if (!c || !p || c.uid !== uid) throw new Error('Payment not found')
      if (c.paid && p.status !== 'success') {
        const s = db.subs[uid]
        const base = Math.max(Date.now(), s.currentPeriodEnd ? Date.parse(s.currentPeriodEnd) : 0, s.trialEndsAt ? Date.parse(s.trialEndsAt) : 0)
        const end = new Date(base)
        if (c.period === 'yearly') end.setFullYear(end.getFullYear() + 1)
        else end.setMonth(end.getMonth() + 1)
        s.currentPeriodEnd = end.toISOString()
        s.status = 'active'
        s.billing = 'prepaid'
        s.period = c.period
        p.status = 'success'
        p.paidAt = new Date().toISOString()
      } else if (!c.paid && p.status === 'pending') {
        p.status = 'failed'
      }
      save(db)
      const { email: _e, ...sub } = db.subs[uid]
      return { status: p.status, subscription: sub }
    },

    async manageLink() {
      throw new Error('Card subscriptions are not available in demo mode')
    },

    async deleteAccount() {
      const db = load()
      const uid = db.session
      if (!uid) return
      const email = Object.keys(db.users).find((e) => db.users[e].id === uid)
      if (email) delete db.users[email]
      delete db.vaults[uid]
      delete db.subs[uid]
      delete db.payments[uid]
      db.session = null
      save(db)
      emit('SIGNED_OUT', null)
    },
  }
}
