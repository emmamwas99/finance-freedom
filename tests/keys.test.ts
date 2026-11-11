import { describe, expect, it } from 'vitest'
import {
  deriveMasterKeys,
  newDataKey,
  newRecoveryCode,
  normalizeRecoveryCode,
  openJson,
  recoveryKeyFrom,
  sealJson,
  unwrapDataKey,
  wrapDataKey,
  WrongKeyError,
} from '../src/lib/cloud/keys'

// fewer iterations keep the tests fast; the algorithm is identical
const IT = 1000

describe('end-to-end keys', () => {
  it('derives the same login secret for the same password + email, different otherwise', async () => {
    const a = await deriveMasterKeys('correct horse', 'Chris@Example.com ', IT)
    const b = await deriveMasterKeys('correct horse', 'chris@example.com', IT)
    const c = await deriveMasterKeys('correct horsf', 'chris@example.com', IT)
    const d = await deriveMasterKeys('correct horse', 'other@example.com', IT)
    expect(a.loginSecret).toBe(b.loginSecret)
    expect(a.loginSecret).not.toBe(c.loginSecret)
    expect(a.loginSecret).not.toBe(d.loginSecret)
    expect(a.loginSecret).not.toContain('correct')
  })

  it('wraps the data key with the password and opens data again', async () => {
    const m = await deriveMasterKeys('pw-12345678', 'a@b.co', IT)
    const dek = await newDataKey()
    const wrapped = await wrapDataKey(dek, m.kek)
    const sealed = await sealJson(dek, { hello: 'KSh 85,000' })
    expect(sealed.ct).not.toContain('85,000')
    const m2 = await deriveMasterKeys('pw-12345678', 'a@b.co', IT)
    const dek2 = await unwrapDataKey(wrapped, m2.kek)
    expect(await openJson(dek2, sealed)).toEqual({ hello: 'KSh 85,000' })
  })

  it('rejects a wrong password', async () => {
    const m = await deriveMasterKeys('right-password', 'a@b.co', IT)
    const wrong = await deriveMasterKeys('wrong-password', 'a@b.co', IT)
    const wrapped = await wrapDataKey(await newDataKey(), m.kek)
    await expect(unwrapDataKey(wrapped, wrong.kek)).rejects.toBeInstanceOf(WrongKeyError)
  })

  it('recovery key unlocks the same data key, and tolerates spaces/lowercase', async () => {
    const code = newRecoveryCode()
    expect(code).toMatch(/^([A-Z2-9]{4}-){7}[A-Z2-9]{4}$/)
    const dek = await newDataKey()
    const wrapped = await wrapDataKey(dek, await recoveryKeyFrom(code))
    const sealed = await sealJson(dek, [1, 2, 3])
    const typed = code.toLowerCase().replace(/-/g, ' ')
    expect(normalizeRecoveryCode(typed)).toBe(code.replace(/-/g, ''))
    const back = await unwrapDataKey(wrapped, await recoveryKeyFrom(typed))
    expect(await openJson(back, sealed)).toEqual([1, 2, 3])
    await expect(unwrapDataKey(wrapped, await recoveryKeyFrom(newRecoveryCode()))).rejects.toBeInstanceOf(WrongKeyError)
  })
})
