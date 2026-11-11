"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { isPro, type Subscription } from '@/lib/plans'
import { backendMode, ConflictError, getBackend, isNetworkError, type CloudUser } from '@/lib/cloud'
import {
  deriveMasterKeys,
  KDF_V2,
  newDataKey,
  newRecoveryCode,
  openJson,
  recoveryKeyFrom,
  sealJson,
  unwrapDataKey,
  wrapDataKey,
  WrongKeyError,
  type MasterKeys,
  type Sealed,
} from '@/lib/cloud/keys'
import { merge3, sameData } from '@/lib/cloud/merge'
import { isVault, newSession, seal, unseal } from '@/lib/crypto'
import { emptyData } from '@/lib/defaults'
import { money, moneyCompact } from '@/lib/format'
import { useRouter } from 'next/navigation'
import { deleteVault as deleteLegacyVault, readVault as readLegacyVault, requestPersistence } from '@/lib/storage'
import type { AppData } from '@/lib/types'
import { useQueryClient } from '@tanstack/react-query'
import { validateSignup } from '@/lib/api/validation'

export type Status = 'loading' | 'signed-out' | 'locked' | 'setup' | 'recovery-key' | 'reset' | 'unlocked'
export type SyncState = 'synced' | 'pending' | 'syncing' | 'offline' | 'error'

export interface Profile {
  name: string
  expectedIncome: number
}

interface Ctx {
  status: Status
  user: CloudUser | null
  backendMode: 'go' | 'supabase' | 'demo'
  data: AppData
  update: (fn: (d: AppData) => AppData) => void

  sync: { state: SyncState; lastSyncedAt: number | null; error: string | null }
  syncNow: () => Promise<void>

  subscription: Subscription | null
  pro: boolean
  refreshSubscription: () => Promise<Subscription | null>

  signUp: (email: string, password: string, profile: Profile) => Promise<'confirm-email' | 'ok'>
  signIn: (email: string, password: string) => Promise<void>
  finishSetup: (password: string, profile?: Profile) => Promise<void>
  unlock: (password: string) => Promise<void>
  lock: () => Promise<void>
  signOut: () => Promise<void>

  recoveryCode: string | null
  acknowledgeRecovery: () => void
  regenerateRecoveryCode: (password: string) => Promise<string>

  sendPasswordReset: (email: string) => Promise<void>
  resetWithRecovery: (code: string, newPassword: string) => Promise<void>
  resetFresh: (newPassword: string) => Promise<void>
  changePassword: (current: string, next: string) => Promise<void>

  legacyOnDevice: boolean
  importLegacy: (password: string) => Promise<void>
  exportBackup: (password: string) => Promise<string>
  importBackup: (fileText: string, password: string) => Promise<void>
  deleteAccount: () => Promise<void>
}

const DataContext = createContext<Ctx | null>(null)

// ---------------- local encrypted cache (offline + fast start) ----------------

interface CacheState {
  data: AppData
  base: AppData
  baseVersion: number
  dirty: boolean
}
const cacheKey = (uid: string) => `ff.cache.v2:${uid}`
const subKey = (uid: string) => `ff.sub:${uid}`
const PENDING_PROFILE = 'ff.pendingProfile'

function readCacheRaw(uid: string): { wrappedKey: Sealed; sealed: Sealed } | null {
  try {
    return JSON.parse(localStorage.getItem(cacheKey(uid)) || '')
  } catch {
    return null
  }
}

function readSub(uid: string): Subscription | null {
  try {
    return JSON.parse(localStorage.getItem(subKey(uid)) || '')
  } catch {
    return null
  }
}

function isEmpty(d: AppData) {
  return !d.expenses.length && !d.incomes.length && !d.bills.length && !d.loans.length && !d.goals.length
}

export function DataProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<Status>('loading')
  const [user, setUser] = useState<CloudUser | null>(null)
  const [data, setData] = useState<AppData | null>(null)
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [sync, setSync] = useState<Ctx['sync']>({ state: 'synced', lastSyncedAt: null, error: null })
  // browser-only; never rendered before unlock, so it can't cause a hydration mismatch
  const [legacyOnDevice, setLegacyOnDevice] = useState(() => typeof window !== 'undefined' && !!readLegacyVault())
  const router = useRouter()

  // secrets & sync state live in refs, never in React state
  const dek = useRef<CryptoKey | null>(null)
  const userRef = useRef<CloudUser | null>(null)
  const dataRef = useRef<AppData | null>(null)
  const baseRef = useRef<AppData | null>(null)
  const baseVersion = useRef(0)
  const dirty = useRef(false)
  const wrappedKeyRef = useRef<Sealed | null>(null)
  const chain = useRef<Promise<unknown>>(Promise.resolve())
  const pushTimer = useRef<number | undefined>(undefined)

  /** Runs vault writes one at a time. */
  const serial = useCallback(<T,>(fn: () => Promise<T>): Promise<T> => {
    const next = chain.current.then(fn, fn)
    chain.current = next.catch(() => undefined)
    return next
  }, [])

  const writeCache = useCallback(async () => {
    const u = userRef.current
    const k = dek.current
    if (!u || !k || !dataRef.current || !baseRef.current || !wrappedKeyRef.current) return
    const state: CacheState = { data: dataRef.current, base: baseRef.current, baseVersion: baseVersion.current, dirty: dirty.current }
    const sealed = await sealJson(k, state)
    try {
      localStorage.setItem(cacheKey(u.id), JSON.stringify({ wrappedKey: wrappedKeyRef.current, sealed }))
    } catch {
      /* storage full — the server copy is still the source of truth */
    }
  }, [])

  const applyData = useCallback((d: AppData) => {
    dataRef.current = d
    setData(d)
  }, [])

  // ---------------- sync ----------------

  const pull = useCallback(async () => {
    const k = dek.current
    if (!k) return
    const remote = await getBackend().getVault()
    if (!remote || remote.version === baseVersion.current) return
    const remoteData = await openJson<AppData>(k, remote.data)
    wrappedKeyRef.current = remote.wrappedKey
    const merged = dirty.current && baseRef.current && dataRef.current ? merge3(baseRef.current, dataRef.current, remoteData) : remoteData
    baseRef.current = remoteData
    baseVersion.current = remote.version
    dirty.current = !sameData(merged, remoteData)
    applyData(merged)
  }, [applyData])

  const push = useCallback(
    () =>
      serial(async () => {
        const k = dek.current
        if (!k || !dirty.current || !dataRef.current) return
        setSync((s) => ({ ...s, state: 'syncing' }))
        try {
          for (let attempt = 0; attempt < 4; attempt++) {
            const snapshot = dataRef.current!
            try {
              const v = await getBackend().saveVault(baseVersion.current, { data: await sealJson(k, snapshot), finance: snapshot })
              baseVersion.current = v
              baseRef.current = snapshot
              dirty.current = !sameData(dataRef.current, snapshot)
              void queryClient.invalidateQueries({ queryKey: ['reports'] })
              break
            } catch (e) {
              if (!(e instanceof ConflictError)) throw e
              await pull() // merge the other device's changes, then try again
              if (!dirty.current) break
            }
          }
          setSync({ state: dirty.current ? 'pending' : 'synced', lastSyncedAt: Date.now(), error: null })
        } catch (e) {
          setSync((s) => ({ ...s, state: isNetworkError(e) ? 'offline' : 'error', error: (e as Error).message }))
        } finally {
          void writeCache()
        }
      }),
    [serial, pull, writeCache, queryClient],
  )

  const schedulePush = useCallback(() => {
    window.clearTimeout(pushTimer.current)
    pushTimer.current = window.setTimeout(() => void push(), 1200)
  }, [push])

  const syncNow = useCallback(
    () =>
      serial(async () => {
        if (!dek.current) return
        setSync((s) => ({ ...s, state: 'syncing' }))
        try {
          await pull()
          setSync({ state: dirty.current ? 'pending' : 'synced', lastSyncedAt: Date.now(), error: null })
          void writeCache()
        } catch (e) {
          setSync((s) => ({ ...s, state: isNetworkError(e) ? 'offline' : 'error', error: (e as Error).message }))
        }
      }).then(() => (dirty.current ? push() : undefined)),
    [serial, pull, push, writeCache],
  )

  const update = useCallback(
    (fn: (d: AppData) => AppData) => {
      if (!dataRef.current) return
      applyData(fn(dataRef.current))
      dirty.current = true
      setSync((s) => ({ ...s, state: 'pending' }))
      void writeCache()
      schedulePush()
    },
    [applyData, writeCache, schedulePush],
  )

  // ---------------- subscription ----------------

  const refreshSubscription = useCallback(async () => {
    const u = userRef.current
    if (!u) return null
    try {
      const s = await getBackend().getSubscription()
      setSubscription(s)
      localStorage.setItem(subKey(u.id), JSON.stringify(s))
      return s
    } catch {
      const cached = readSub(u.id)
      setSubscription(cached)
      return cached
    }
  }, [])

  // ---------------- open / create vault ----------------

  const openVault = useCallback(
    async (u: CloudUser, master: MasterKeys) => {
      let remote = null
      let offline = false
      try {
        remote = await getBackend().getVault()
      } catch (e) {
        if (!isNetworkError(e)) throw e
        offline = true
      }
      const cache = readCacheRaw(u.id)
      if (!remote && !offline) return false // no vault yet

      const wrapped = remote?.wrappedKey ?? cache?.wrappedKey
      if (!wrapped) throw new Error('You are offline and this device has no saved copy yet. Connect to the internet to unlock.')
      let key: CryptoKey
      try {
        key = await unwrapDataKey(wrapped, master.kek)
      } catch (e) {
        // the cached key may be older than a password change on another device
        if (remote || !cache) throw e
        throw new WrongKeyError()
      }

      let cached: CacheState | null = null
      if (cache) {
        try {
          cached = await openJson<CacheState>(key, cache.sealed)
        } catch {
          cached = null
        }
      }

      dek.current = key
      userRef.current = u
      if (remote) {
        const remoteData = await openJson<AppData>(key, remote.data)
        const merged = cached?.dirty ? merge3(cached.base, cached.data, remoteData) : remoteData
        baseRef.current = remoteData
        baseVersion.current = remote.version
        wrappedKeyRef.current = remote.wrappedKey
        dirty.current = !sameData(merged, remoteData)
        applyData(merged)
        setSync({ state: dirty.current ? 'pending' : 'synced', lastSyncedAt: Date.now(), error: null })
      } else if (cached) {
        baseRef.current = cached.base
        baseVersion.current = cached.baseVersion
        wrappedKeyRef.current = cache!.wrappedKey
        dirty.current = cached.dirty
        applyData(cached.data)
        setSync({ state: 'offline', lastSyncedAt: null, error: null })
      } else {
        throw new Error('Could not open your data on this device.')
      }
      await writeCache()
      if (dirty.current) schedulePush()
      return true
    },
    [applyData, writeCache, schedulePush],
  )

  const createVault = useCallback(
    async (u: CloudUser, master: MasterKeys, profile: Profile) => {
      const key = await newDataKey()
      const code = newRecoveryCode()
      const initial = emptyData(profile)
      const rec = await getBackend().createVault({
        kdf: { ...KDF_V2 },
        wrappedKey: await wrapDataKey(key, master.kek),
        recoveryKey: await wrapDataKey(key, await recoveryKeyFrom(code)),
        data: await sealJson(key, initial),
        finance: initial,
      })
      dek.current = key
      userRef.current = u
      baseRef.current = initial
      baseVersion.current = rec.version
      wrappedKeyRef.current = rec.wrappedKey
      dirty.current = false
      applyData(initial)
      await writeCache()
      localStorage.removeItem(PENDING_PROFILE)
      setRecoveryCode(code)
      setStatus('recovery-key')
    },
    [applyData, writeCache],
  )

  const pendingProfile = (): Profile => {
    try {
      const p = JSON.parse(localStorage.getItem(PENDING_PROFILE) || '')
      return { name: p.name ?? '', expectedIncome: Number(p.expectedIncome) || 0 }
    } catch {
      return { name: '', expectedIncome: 0 }
    }
  }

  const afterUnlock = useCallback(async () => {
    setStatus('unlocked')
    void requestPersistence()
    await refreshSubscription()
  }, [refreshSubscription])

  // ---------------- startup ----------------

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const u = await getBackend().getUser().catch(() => null)
      if (cancelled) return
      if (!u) {
        setStatus('signed-out')
        return
      }
      setUser(u)
      userRef.current = u
      setSubscription(readSub(u.id))
      if (window.location.pathname === '/reset') {
        setStatus('reset')
        return
      }
      try {
        const v = await getBackend().getVault()
        if (!cancelled) setStatus(v ? 'locked' : 'setup')
      } catch {
        if (!cancelled) setStatus('locked') // offline: unlock from this device's copy
      }
    })()
    const off = getBackend().onAuthChange((event, u) => {
      if (event === 'PASSWORD_RECOVERY' && u) {
        setUser(u)
        userRef.current = u
        setStatus('reset')
      } else if (event === 'SIGNED_OUT') {
        dek.current = null
        dataRef.current = null
        setData(null)
        setUser(null)
        setStatus('signed-out')
      }
    })
    return () => {
      cancelled = true
      off()
    }
  }, [])

  // ---------------- auth actions ----------------

  const signUp = useCallback<Ctx['signUp']>(
    async (email, password, profile) => {
      validateSignup({ email, password, name: profile.name, expectedIncome: profile.expectedIncome })
      const e = email.trim().toLowerCase()
      const master = await deriveMasterKeys(password, e)
      localStorage.setItem(PENDING_PROFILE, JSON.stringify(profile))
      const res = await getBackend().signUp(e, master.loginSecret)
      if (res.needsConfirmation || !res.user) return 'confirm-email'
      setUser(res.user)
      userRef.current = res.user
      await createVault(res.user, master, profile)
      await refreshSubscription()
      return 'ok'
    },
    [createVault, refreshSubscription],
  )

  const signIn = useCallback<Ctx['signIn']>(
    async (email, password) => {
      const e = email.trim().toLowerCase()
      const master = await deriveMasterKeys(password, e)
      const u = await getBackend().signIn(e, master.loginSecret)
      setUser(u)
      userRef.current = u
      const opened = await openVault(u, master)
      if (!opened) {
        await createVault(u, master, pendingProfile())
        await refreshSubscription()
        return
      }
      await afterUnlock()
    },
    [openVault, createVault, afterUnlock, refreshSubscription],
  )

  const finishSetup = useCallback<Ctx['finishSetup']>(
    async (password, profile) => {
      const u = userRef.current
      if (!u) throw new Error('Not signed in')
      const master = await deriveMasterKeys(password, u.email)
      await getBackend().signIn(u.email, master.loginSecret) // proves the password is right
      await createVault(u, master, profile ?? pendingProfile())
      await refreshSubscription()
    },
    [createVault, refreshSubscription],
  )

  const unlock = useCallback<Ctx['unlock']>(
    async (password) => {
      const u = userRef.current
      if (!u) throw new Error('Not signed in')
      const master = await deriveMasterKeys(password, u.email)
      const opened = await openVault(u, master)
      if (!opened) {
        setStatus('setup')
        return
      }
      await afterUnlock()
    },
    [openVault, afterUnlock],
  )

  const clearMemory = () => {
    window.clearTimeout(pushTimer.current)
    dek.current = null
    dataRef.current = null
    baseRef.current = null
    setData(null)
    setRecoveryCode(null)
  }

  const lock = useCallback(async () => {
    window.clearTimeout(pushTimer.current)
    if (dirty.current) await push().catch(() => undefined)
    await writeCache()
    await chain.current
    clearMemory()
    setStatus(userRef.current ? 'locked' : 'signed-out')
  }, [push, writeCache])

  const signOut = useCallback(async () => {
    window.clearTimeout(pushTimer.current)
    if (dirty.current) await push().catch(() => undefined)
    await chain.current
    const u = userRef.current
    if (u) {
      localStorage.removeItem(cacheKey(u.id)) // don't leave data on shared computers
      localStorage.removeItem(subKey(u.id))
    }
    clearMemory()
    userRef.current = null
    setUser(null)
    setSubscription(null)
    await getBackend().signOut()
    router.replace('/')
    setStatus('signed-out')
  }, [push, router])

  const acknowledgeRecovery = useCallback(() => {
    setRecoveryCode(null)
    void afterUnlock()
  }, [afterUnlock])

  // ---------------- passwords & recovery ----------------

  const sendPasswordReset = useCallback((email: string) => getBackend().sendPasswordReset(email.trim().toLowerCase()), [])

  const resetWithRecovery = useCallback<Ctx['resetWithRecovery']>(
    (code, newPassword) =>
      serial(async () => {
        const u = userRef.current
        if (!u) throw new Error('This reset link has expired. Request a new one.')
        const vault = await getBackend().getVault()
        if (!vault) throw new Error('No data found for this account.')
        let key: CryptoKey
        try {
          key = await unwrapDataKey(vault.recoveryKey, await recoveryKeyFrom(code))
        } catch {
          throw new WrongKeyError('That recovery key does not match this account.')
        }
        const master = await deriveMasterKeys(newPassword, u.email)
        const oldWrapped = vault.wrappedKey
        const v = await getBackend().saveVault(vault.version, { wrappedKey: await wrapDataKey(key, master.kek) })
        try {
          await getBackend().setLoginSecret(master.loginSecret)
        } catch (e) {
          await getBackend().saveVault(v, { wrappedKey: oldWrapped }).catch(() => undefined)
          throw e
        }
        localStorage.removeItem(cacheKey(u.id))
        await openVault(u, master)
        window.history.replaceState(null, '', '/app')
      }).then(afterUnlock),
    [serial, openVault, afterUnlock],
  )

  const resetFresh = useCallback<Ctx['resetFresh']>(
    (newPassword) =>
      serial(async () => {
        const u = userRef.current
        if (!u) throw new Error('This reset link has expired. Request a new one.')
        const master = await deriveMasterKeys(newPassword, u.email)
        const vault = await getBackend().getVault()
        await getBackend().setLoginSecret(master.loginSecret)
        localStorage.removeItem(cacheKey(u.id))
        window.history.replaceState(null, '', '/app')
        if (!vault) {
          await createVault(u, master, pendingProfile())
          return
        }
        const key = await newDataKey()
        const code = newRecoveryCode()
        const fresh = emptyData({ name: '', expectedIncome: 0 })
        const v = await getBackend().saveVault(vault.version, {
          wrappedKey: await wrapDataKey(key, master.kek),
          recoveryKey: await wrapDataKey(key, await recoveryKeyFrom(code)),
          data: await sealJson(key, fresh),
          finance: fresh,
        })
        dek.current = key
        baseRef.current = fresh
        baseVersion.current = v
        wrappedKeyRef.current = null
        dirty.current = false
        applyData(fresh)
        const nv = await getBackend().getVault()
        wrappedKeyRef.current = nv?.wrappedKey ?? null
        await writeCache()
        setRecoveryCode(code)
        setStatus('recovery-key')
      }),
    [serial, createVault, applyData, writeCache],
  )

  const changePassword = useCallback<Ctx['changePassword']>(
    (current, next) =>
      serial(async () => {
        const u = userRef.current
        const key = dek.current
        if (!u || !key) throw new Error('Locked')
        const oldMaster = await deriveMasterKeys(current, u.email)
        const vault = await getBackend().getVault()
        if (!vault) throw new Error('No data found')
        await unwrapDataKey(vault.wrappedKey, oldMaster.kek) // throws WrongKeyError if current is wrong
        const master = await deriveMasterKeys(next, u.email)
        const newWrapped = await wrapDataKey(key, master.kek)
        const v = await getBackend().saveVault(vault.version, { wrappedKey: newWrapped })
        try {
          await getBackend().setLoginSecret(master.loginSecret)
        } catch (e) {
          await getBackend().saveVault(v, { wrappedKey: vault.wrappedKey }).catch(() => undefined)
          throw e
        }
        // data didn't change on the server, only the version did
        if (vault.version === baseVersion.current) baseVersion.current = v
        wrappedKeyRef.current = newWrapped
        await writeCache()
      }),
    [serial, writeCache],
  )

  const regenerateRecoveryCode = useCallback<Ctx['regenerateRecoveryCode']>(
    (password) =>
      serial(async () => {
        const u = userRef.current
        const key = dek.current
        if (!u || !key) throw new Error('Locked')
        const master = await deriveMasterKeys(password, u.email)
        const vault = await getBackend().getVault()
        if (!vault) throw new Error('No data found')
        await unwrapDataKey(vault.wrappedKey, master.kek)
        const code = newRecoveryCode()
        const v = await getBackend().saveVault(vault.version, { recoveryKey: await wrapDataKey(key, await recoveryKeyFrom(code)) })
        if (vault.version === baseVersion.current) baseVersion.current = v
        return code
      }),
    [serial],
  )

  // ---------------- backups & old local data ----------------

  const mergeIn = useCallback(
    (incoming: AppData) => {
      update((cur) => (isEmpty(cur) ? { ...incoming, version: 1 } : merge3(emptyData({ name: '', expectedIncome: 0 }), cur, incoming)))
    },
    [update],
  )

  const importLegacy = useCallback<Ctx['importLegacy']>(
    async (password) => {
      const v = readLegacyVault()
      if (!v) throw new Error('No older data found on this device')
      const { data: old } = await unseal<AppData>(v, password)
      mergeIn(old)
      deleteLegacyVault()
      setLegacyOnDevice(false)
    },
    [mergeIn],
  )

  const exportBackup = useCallback<Ctx['exportBackup']>(async (password) => {
    if (!dataRef.current) throw new Error('Locked')
    const s = await newSession(password)
    const vault = await seal(s, dataRef.current)
    update((d) => ({ ...d, settings: { ...d.settings, lastBackupAt: new Date().toISOString() } }))
    return JSON.stringify(vault)
  }, [update])

  const importBackup = useCallback<Ctx['importBackup']>(
    async (fileText, password) => {
      let parsed: unknown
      try {
        parsed = JSON.parse(fileText)
      } catch {
        throw new Error('That file is not a Finfe backup')
      }
      if (!isVault(parsed)) throw new Error('That file is not a Finfe backup')
      const { data: incoming } = await unseal<AppData>(parsed, password)
      mergeIn(incoming)
    },
    [mergeIn],
  )

  const deleteAccount = useCallback(async () => {
    const u = userRef.current
    await getBackend().deleteAccount()
    if (u) {
      localStorage.removeItem(cacheKey(u.id))
      localStorage.removeItem(subKey(u.id))
    }
    clearMemory()
    userRef.current = null
    setUser(null)
    setSubscription(null)
    router.replace('/')
    setStatus('signed-out')
  }, [router])

  // ---------------- background sync & auto-lock ----------------

  useEffect(() => {
    if (status !== 'unlocked') return
    const onFocus = () => document.visibilityState === 'visible' && void syncNow()
    const iv = window.setInterval(() => document.visibilityState === 'visible' && void syncNow(), 45_000)
    window.addEventListener('online', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      window.clearInterval(iv)
      window.removeEventListener('online', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [status, syncNow])

  useEffect(() => {
    // warn before closing the tab with unsynced changes
    const onBefore = (e: BeforeUnloadEvent) => {
      if (dirty.current && navigator.onLine) {
        void push()
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', onBefore)
    return () => window.removeEventListener('beforeunload', onBefore)
  }, [push])

  const autoLockMin = data?.settings.autoLockMinutes ?? 5
  useEffect(() => {
    if (status !== 'unlocked') return
    const limit = autoLockMin * 60_000
    let last = Date.now()
    let hiddenAt = 0
    const bump = () => (last = Date.now())
    const onVis = () => {
      if (document.visibilityState === 'hidden') hiddenAt = Date.now()
      else if (hiddenAt && Date.now() - hiddenAt >= limit) void lock()
      else bump()
    }
    const iv = window.setInterval(() => {
      if (Date.now() - last >= limit) void lock()
    }, 10_000)
    const evs = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const
    evs.forEach((e) => window.addEventListener(e, bump, { passive: true }))
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearInterval(iv)
      evs.forEach((e) => window.removeEventListener(e, bump))
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [status, autoLockMin, lock])

  const pro = isPro(subscription)

  const value = useMemo<Ctx>(
    () => ({
      status,
      user,
      backendMode: backendMode,
      data: data as AppData,
      update,
      sync,
      syncNow,
      subscription,
      pro,
      refreshSubscription,
      signUp,
      signIn,
      finishSetup,
      unlock,
      lock,
      signOut,
      recoveryCode,
      acknowledgeRecovery,
      regenerateRecoveryCode,
      sendPasswordReset,
      resetWithRecovery,
      resetFresh,
      changePassword,
      legacyOnDevice,
      importLegacy,
      exportBackup,
      importBackup,
      deleteAccount,
    }),
    [
      status, user, data, update, sync, syncNow, subscription, pro, refreshSubscription, signUp, signIn, finishSetup, unlock, lock, signOut,
      recoveryCode, acknowledgeRecovery, regenerateRecoveryCode, sendPasswordReset, resetWithRecovery, resetFresh, changePassword,
      legacyOnDevice, importLegacy, exportBackup, importBackup, deleteAccount,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useStore() {
  const c = useContext(DataContext)
  if (!c) throw new Error('useStore outside provider')
  return c
}

/** Only use inside the unlocked app. */
export function useData() {
  return useStore().data
}

export function useFmt() {
  return FMT
}

const FMT = { m: money, mc: moneyCompact }
