import { isVault, type Vault } from './crypto'

const VAULT_KEY = 'ff.vault.v1'
const ATTEMPTS_KEY = 'ff.attempts'

export function readVault(): Vault | null {
  try {
    const raw = localStorage.getItem(VAULT_KEY)
    if (!raw) return null
    const v = JSON.parse(raw)
    return isVault(v) ? v : null
  } catch {
    return null
  }
}

export function writeVault(v: Vault) {
  localStorage.setItem(VAULT_KEY, JSON.stringify(v))
}

export function deleteVault() {
  localStorage.removeItem(VAULT_KEY)
  localStorage.removeItem(ATTEMPTS_KEY)
}

/** Ask the browser not to evict our data when the device is low on space. */
export async function requestPersistence() {
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) {
      await navigator.storage.persist()
    }
  } catch {
    /* ignore */
  }
}

// ---- brute-force protection: progressive lockout after failed attempts ----

interface Attempts {
  count: number
  until: number
}

export function getAttempts(): Attempts {
  try {
    return JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || '') as Attempts
  } catch {
    return { count: 0, until: 0 }
  }
}

export function recordFailedAttempt(): Attempts {
  const a = getAttempts()
  const count = a.count + 1
  // 5 free tries, then 30s, 60s, 120s ... up to 1 hour
  const until = count >= 5 ? Date.now() + Math.min(3600, 30 * 2 ** (count - 5)) * 1000 : 0
  const next = { count, until }
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(next))
  return next
}

export function clearAttempts() {
  localStorage.removeItem(ATTEMPTS_KEY)
}

// ---- files ----

export async function shareOrDownload(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const file = new File([blob], filename, { type: mime })
  // On phones, the share sheet lets you save straight to Google Drive, WhatsApp, email...
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename })
      return
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function readFileText(file: File) {
  return file.text()
}
