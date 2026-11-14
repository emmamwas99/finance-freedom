/** Keep a non-extractable vault wrapping key for this tab's browser session. */
const DB_NAME = 'finfe-session-unlock'
const STORE = 'keys'
const MARKER = 'finfe.session-unlock'

type Marker = { id: string; userId: string; touchedAt: number; idleMs: number }
type StoredKey = { id: string; key: CryptoKey; createdAt: number }

function marker(): Marker | null {
  try {
    return JSON.parse(sessionStorage.getItem(MARKER) || 'null') as Marker | null
  } catch {
    return null
  }
}

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function removeKey(id: string) {
  const db = await database()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
  } finally {
    db.close()
  }
}

export async function rememberSessionUnlock(userId: string, key: CryptoKey, idleMinutes: number) {
  if (key.extractable) throw new Error('Session unlock key must not be extractable')
  const old = marker()
  const id = old?.userId === userId ? old.id : crypto.randomUUID()
  const db = await database()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put({ id, key, createdAt: Date.now() } satisfies StoredKey)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
    sessionStorage.setItem(MARKER, JSON.stringify({ id, userId, touchedAt: Date.now(), idleMs: Math.max(1, idleMinutes) * 60_000 } satisfies Marker))
  } finally {
    db.close()
  }
  if (old && old.id !== id) await removeKey(old.id).catch(() => undefined)
}

export async function rememberedSessionUnlock(userId: string): Promise<CryptoKey | null> {
  const saved = marker()
  if (!saved || saved.userId !== userId) return null
  if (Date.now() - saved.touchedAt > saved.idleMs) {
    await clearSessionUnlock(userId)
    return null
  }
  const db = await database()
  try {
    const row = await new Promise<StoredKey | undefined>((resolve, reject) => {
      const request = db.transaction(STORE, 'readonly').objectStore(STORE).get(saved.id)
      request.onsuccess = () => resolve(request.result as StoredKey | undefined)
      request.onerror = () => reject(request.error)
    })
    return row?.key ?? null
  } finally {
    db.close()
  }
}

export function touchSessionUnlock(userId: string) {
  const saved = marker()
  if (!saved || saved.userId !== userId) return
  if (Date.now() - saved.touchedAt < 10_000) return
  sessionStorage.setItem(MARKER, JSON.stringify({ ...saved, touchedAt: Date.now() } satisfies Marker))
}

export function setSessionUnlockIdle(userId: string, idleMinutes: number) {
  const saved = marker()
  if (!saved || saved.userId !== userId) return
  sessionStorage.setItem(MARKER, JSON.stringify({ ...saved, idleMs: Math.max(1, idleMinutes) * 60_000 } satisfies Marker))
}

export async function clearSessionUnlock(userId: string) {
  const saved = marker()
  if (!saved || saved.userId !== userId) return
  sessionStorage.removeItem(MARKER)
  await removeKey(saved.id)
}

export async function clearCurrentSessionUnlock() {
  const saved = marker()
  if (saved) await clearSessionUnlock(saved.userId)
}
