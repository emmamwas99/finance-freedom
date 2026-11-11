/**
 * All data is encrypted with AES-256-GCM. The key is derived from your password
 * with PBKDF2-SHA256 and is never stored anywhere — only kept in memory while unlocked.
 * Without the password the stored file is unreadable.
 */

const enc = new TextEncoder()
const dec = new TextDecoder()

export const KDF_ITERATIONS = 310_000

export interface Vault {
  app: 'finance-freedom'
  v: 1
  kdf: { name: 'PBKDF2-SHA256'; salt: string; iterations: number }
  iv: string
  ct: string
}

export interface Session {
  key: CryptoKey
  salt: Uint8Array<ArrayBuffer>
  iterations: number
}

export function cryptoAvailable() {
  return typeof crypto !== 'undefined' && !!crypto.subtle
}

export function toB64(bytes: Uint8Array) {
  let s = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    s += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(s)
}

export function fromB64(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

export function randomBytes(n: number) {
  return crypto.getRandomValues(new Uint8Array(n))
}

export async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>, iterations = KDF_ITERATIONS) {
  const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function newSession(password: string): Promise<Session> {
  const salt = randomBytes(16)
  const key = await deriveKey(password, salt, KDF_ITERATIONS)
  return { key, salt, iterations: KDF_ITERATIONS }
}

export async function seal(session: Session, data: unknown): Promise<Vault> {
  const iv = randomBytes(12)
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, session.key, enc.encode(JSON.stringify(data)))
  return {
    app: 'finance-freedom',
    v: 1,
    kdf: { name: 'PBKDF2-SHA256', salt: toB64(session.salt), iterations: session.iterations },
    iv: toB64(iv),
    ct: toB64(new Uint8Array(ct)),
  }
}

export class WrongPasswordError extends Error {
  constructor() {
    super('Wrong password')
  }
}

export async function unseal<T>(vault: Vault, password: string): Promise<{ data: T; session: Session }> {
  const salt = fromB64(vault.kdf.salt)
  const key = await deriveKey(password, salt, vault.kdf.iterations)
  let plain: ArrayBuffer
  try {
    plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(vault.iv) }, key, fromB64(vault.ct))
  } catch {
    throw new WrongPasswordError()
  }
  return { data: JSON.parse(dec.decode(plain)) as T, session: { key, salt, iterations: vault.kdf.iterations } }
}

export function isVault(x: unknown): x is Vault {
  const v = x as Vault
  return !!v && v.app === 'finance-freedom' && v.v === 1 && !!v.kdf?.salt && !!v.iv && !!v.ct
}
