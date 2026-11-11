import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { isVault, newSession, seal, unseal, type Session } from '@/lib/crypto'
import { emptyData } from '@/lib/defaults'
import { money, moneyCompact } from '@/lib/format'
import { deleteVault, readVault, requestPersistence, writeVault } from '@/lib/storage'
import type { AppData } from '@/lib/types'

type Status = 'new' | 'locked' | 'unlocked'

interface Ctx {
  status: Status
  data: AppData
  update: (fn: (d: AppData) => AppData) => void
  create: (password: string, init: { name: string; expectedIncome: number }) => Promise<void>
  unlock: (password: string) => Promise<void>
  lock: () => Promise<void>
  changePassword: (current: string, next: string) => Promise<void>
  /** Returns the encrypted backup file contents (after marking the backup date). */
  backupContents: () => Promise<string>
  importBackup: (fileText: string, password: string) => Promise<void>
  wipe: () => void
}

const DataContext = createContext<Ctx | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>(() => (readVault() ? 'locked' : 'new'))
  const [data, setData] = useState<AppData | null>(null)
  const session = useRef<Session | null>(null)
  const dataRef = useRef<AppData | null>(null)
  const saving = useRef<Promise<void>>(Promise.resolve())

  const persist = useCallback((d: AppData) => {
    const s = session.current
    if (!s) return saving.current
    saving.current = saving.current.then(async () => {
      writeVault(await seal(s, d))
    })
    return saving.current
  }, [])

  const setAll = useCallback(
    (d: AppData) => {
      dataRef.current = d
      setData(d)
      return persist(d)
    },
    [persist],
  )

  const update = useCallback(
    (fn: (d: AppData) => AppData) => {
      if (!dataRef.current) return
      void setAll(fn(dataRef.current))
    },
    [setAll],
  )

  const create = useCallback<Ctx['create']>(
    async (password, init) => {
      session.current = await newSession(password)
      await setAll(emptyData(init))
      setStatus('unlocked')
      void requestPersistence()
    },
    [setAll],
  )

  const unlock = useCallback<Ctx['unlock']>(async (password) => {
    const vault = readVault()
    if (!vault) throw new Error('No data found')
    const { data: d, session: s } = await unseal<AppData>(vault, password)
    session.current = s
    dataRef.current = d
    setData(d)
    setStatus('unlocked')
    void requestPersistence()
  }, [])

  const lock = useCallback(async () => {
    await saving.current
    session.current = null
    dataRef.current = null
    setData(null)
    setStatus(readVault() ? 'locked' : 'new')
  }, [])

  const changePassword = useCallback<Ctx['changePassword']>(
    async (current, next) => {
      const vault = readVault()
      if (!vault) throw new Error('No data found')
      await unseal(vault, current) // throws WrongPasswordError if wrong
      await saving.current
      session.current = await newSession(next)
      await persist(dataRef.current!)
    },
    [persist],
  )

  const backupContents = useCallback(async () => {
    const d = dataRef.current!
    await setAll({ ...d, settings: { ...d.settings, lastBackupAt: new Date().toISOString() } })
    return JSON.stringify(readVault())
  }, [setAll])

  const importBackup = useCallback<Ctx['importBackup']>(
    async (fileText, password) => {
      let parsed: unknown
      try {
        parsed = JSON.parse(fileText)
      } catch {
        throw new Error('That file is not a Finance Freedom backup')
      }
      if (!isVault(parsed)) throw new Error('That file is not a Finance Freedom backup')
      const { data: d, session: s } = await unseal<AppData>(parsed, password)
      // When unlocked, keep using the current password. On a fresh device, adopt the backup's password.
      if (!session.current) session.current = s
      await setAll(d)
      setStatus('unlocked')
      void requestPersistence()
    },
    [setAll],
  )

  const wipe = useCallback(() => {
    deleteVault()
    session.current = null
    dataRef.current = null
    setData(null)
    setStatus('new')
  }, [])

  // ---- auto-lock on inactivity / when app goes to background ----
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

  const value = useMemo(
    () => ({
      status,
      data: data as AppData,
      update,
      create,
      unlock,
      lock,
      changePassword,
      backupContents,
      importBackup,
      wipe,
    }),
    [status, data, update, create, unlock, lock, changePassword, backupContents, importBackup, wipe],
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
