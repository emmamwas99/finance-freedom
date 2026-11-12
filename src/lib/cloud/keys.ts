/**
 * Browser encryption for the vault backup.
 *
 *   password + email ──PBKDF2-SHA256(600k)──▶ master key
 *        master ──HKDF("auth")──▶ login secret   (sent to the server instead of your password)
 *        master ──HKDF("kek")───▶ key-encryption key
 *   random data key (AES-256-GCM) encrypts your data
 *   data key is stored wrapped twice: with the key-encryption key, and with the recovery key
 *
 * The server never sees the password, master key or data key. In Go mode it
 * separately receives readable finance records for server reports.
 */
import { fromB64, toB64 } from '../crypto'

const enc = new TextEncoder()
const dec = new TextDecoder()

export const KDF_V2 = { name: 'PBKDF2-SHA256', iterations: 600_000, v: 2 } as const

export interface Sealed {
  iv: string
  ct: string
}

export interface MasterKeys {
  /** Goes to the Finfe API as the account password. */
  loginSecret: string
  kek: CryptoKey
}

/**
 * PROTOCOL CONSTANTS: the 'finance-freedom:…' salts and 'ff-…' HKDF labels below are part of the key
 * derivation. They predate the Finfe rename and must never change: doing so would make every
 * existing account, vault and recovery key impossible to decrypt.
 */
const normEmail = (e: string) => e.trim().toLowerCase()

export async function deriveMasterKeys(password: string, email: string, iterations: number = KDF_V2.iterations): Promise<MasterKeys> {
  const pw = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(`finance-freedom:v2:${normEmail(email)}`), iterations },
    pw,
    256,
  )
  const master = await crypto.subtle.importKey('raw', bits, 'HKDF', false, ['deriveBits', 'deriveKey'])
  const loginBits = await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: enc.encode('ff-auth') }, master, 256)
  const kek = await crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: enc.encode('ff-kek') },
    master,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
  return { loginSecret: toB64(new Uint8Array(loginBits)), kek }
}

// ---------------- data key ----------------

export async function newDataKey() {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
}

async function encryptBytes(key: CryptoKey, bytes: Uint8Array<ArrayBuffer>): Promise<Sealed> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, bytes)
  return { iv: toB64(iv), ct: toB64(new Uint8Array(ct)) }
}

async function decryptBytes(key: CryptoKey, s: Sealed) {
  return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(s.iv) }, key, fromB64(s.ct)))
}

export async function wrapDataKey(dataKey: CryptoKey, wrappingKey: CryptoKey) {
  const raw = new Uint8Array(await crypto.subtle.exportKey('raw', dataKey))
  return encryptBytes(wrappingKey, raw)
}

export class WrongKeyError extends Error {
  constructor(msg = 'Wrong password') {
    super(msg)
  }
}

export async function unwrapDataKey(wrapped: Sealed, wrappingKey: CryptoKey) {
  let raw: Uint8Array<ArrayBuffer>
  try {
    raw = await decryptBytes(wrappingKey, wrapped)
  } catch {
    throw new WrongKeyError()
  }
  // extractable so it can be re-wrapped when the password changes
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt'])
}

export async function sealJson(key: CryptoKey, value: unknown) {
  return encryptBytes(key, enc.encode(JSON.stringify(value)))
}

export async function openJson<T>(key: CryptoKey, s: Sealed): Promise<T> {
  return JSON.parse(dec.decode(await decryptBytes(key, s))) as T
}

// ---------------- recovery key ----------------

const B32 = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no I, O, 0, 1 — easy to copy by hand

/** 20 random bytes → 32 characters shown as 8 groups of 4, e.g. "K7QM-2XDA-…" */
export function newRecoveryCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(20))
  let bits = 0
  let value = 0
  let out = ''
  for (const b of bytes) {
    value = (value << 8) | b
    bits += 8
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  return out.match(/.{4}/g)!.join('-')
}

export function normalizeRecoveryCode(code: string) {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export async function recoveryKeyFrom(code: string) {
  const norm = normalizeRecoveryCode(code)
  const base = await crypto.subtle.importKey('raw', enc.encode(norm), 'HKDF', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: enc.encode('finance-freedom:recovery'), info: enc.encode('ff-recovery') },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}
