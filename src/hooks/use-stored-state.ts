'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'

/**
 * State remembered in this browser only (localStorage), so a returning visitor finds their last
 * calculator inputs. Nothing is sent anywhere.
 * - Hydration-safe: the server and the first client render use `initial`; saved values appear after.
 * - Works when storage is blocked (private mode, disabled cookies): falls back to memory.
 * - `initial` must be a stable reference (define it outside the component).
 */
const memory = new Map<string, string>()
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key) ?? memory.get(key) ?? null
  } catch {
    return memory.get(key) ?? null
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
  } catch {
    /* storage unavailable: memory only */
  }
  if (value === null) memory.delete(key)
  else memory.set(key, value)
  notify()
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  window.addEventListener('storage', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', cb)
  }
}

export function useStoredState<T extends object>(key: string, initial: T) {
  const storageKey = `finfe:tool:${key}`
  const raw = useSyncExternalStore(subscribe, () => read(storageKey), () => null)
  const value = useMemo<T>(() => {
    if (raw === null) return initial
    try {
      return { ...initial, ...(JSON.parse(raw) as T) }
    } catch {
      return initial
    }
  }, [raw, initial])

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const cur = read(storageKey)
      let prev = initial
      if (cur !== null) {
        try {
          prev = { ...initial, ...(JSON.parse(cur) as T) }
        } catch {
          /* keep initial */
        }
      }
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      write(storageKey, JSON.stringify(resolved))
    },
    [storageKey, initial],
  )

  const reset = useCallback(() => write(storageKey, null), [storageKey])
  return [value, set, reset, raw !== null] as const
}
