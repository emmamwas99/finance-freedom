/**
 * Integration test of the critical account workflow with the real crypto, merge and backend
 * contract (demo backend): sign up → encrypted vault → second device → concurrent edits →
 * conflict + three-way merge → recovery key → payment → delete account.
 */
import { beforeAll, describe, expect, it } from 'vitest'
import { ConflictError } from '../src/lib/cloud/backend'
import { createDemoBackend, demoMarkPaid } from '../src/lib/cloud/demoBackend'
import { deriveMasterKeys, newDataKey, newRecoveryCode, openJson, recoveryKeyFrom, sealJson, unwrapDataKey, wrapDataKey } from '../src/lib/cloud/keys'
import { merge3 } from '../src/lib/cloud/merge'
import { emptyData } from '../src/lib/defaults'
import { isPro } from '../src/lib/plans'
import type { AppData } from '../src/lib/types'
import { installBrowserGlobals } from './helpers/browser'

const IT = 1000 // fewer PBKDF2 iterations keep the test fast; the algorithm is identical
const EMAIL = 'wanjiku@example.com'
const PASSWORD = 'correct horse battery staple'

let store: Map<string, string>
beforeAll(() => {
  store = installBrowserGlobals().store
})

describe('account and sync workflow', () => {
  it('runs end to end without the server ever seeing plaintext', async () => {
    const backend = createDemoBackend()
    const master = await deriveMasterKeys(PASSWORD, EMAIL, IT)

    // 1. sign up: the server receives a derived secret, never the password
    const { user, needsConfirmation } = await backend.signUp(EMAIL, master.loginSecret)
    expect(needsConfirmation).toBe(false)
    expect(user?.email).toBe(EMAIL)
    expect(master.loginSecret).not.toContain(PASSWORD)
    const sub = await backend.getSubscription()
    expect(sub?.status).toBe('trialing')
    expect(isPro(sub)).toBe(true)

    // 2. create the encrypted vault
    const dataKey = await newDataKey()
    const code = newRecoveryCode()
    const initial = emptyData({ name: 'Wanjiku', expectedIncome: 85000 })
    const rec = await backend.createVault({
      kdf: { name: 'PBKDF2-SHA256', iterations: IT, v: 2 },
      wrappedKey: await wrapDataKey(dataKey, master.kek),
      recoveryKey: await wrapDataKey(dataKey, await recoveryKeyFrom(code)),
      data: await sealJson(dataKey, initial),
    })
    expect(rec.version).toBe(1)
    const raw = [...store.values()].join('')
    expect(raw).not.toContain('Wanjiku') // nothing readable at rest
    expect(raw).not.toContain('85000')

    // 3. a second device logs in with the password and decrypts the same data
    const masterB = await deriveMasterKeys(PASSWORD, EMAIL, IT)
    await backend.signIn(EMAIL, masterB.loginSecret)
    const remote = (await backend.getVault())!
    const keyB = await unwrapDataKey(remote.wrappedKey, masterB.kek)
    const base = await openJson<AppData>(keyB, remote.data)
    expect(base.settings.name).toBe('Wanjiku')

    // 4. both devices edit; A saves first, B hits a conflict and merges
    const cat = base.categories[0].id
    const a: AppData = { ...base, expenses: [{ id: 'a1', date: '2026-11-02', amount: 500, categoryId: cat, createdAt: 'x' }] }
    const b: AppData = { ...base, expenses: [{ id: 'b1', date: '2026-11-03', amount: 900, categoryId: cat, createdAt: 'y' }] }
    const v2 = await backend.saveVault(1, { data: await sealJson(dataKey, a) })
    expect(v2).toBe(2)
    await expect(backend.saveVault(1, { data: await sealJson(keyB, b) })).rejects.toBeInstanceOf(ConflictError)
    const latest = (await backend.getVault())!
    const merged = merge3(base, b, await openJson<AppData>(keyB, latest.data))
    expect(merged.expenses.map((e) => e.id).sort()).toEqual(['a1', 'b1'])
    expect(await backend.saveVault(latest.version, { data: await sealJson(keyB, merged) })).toBe(3)

    // 5. the recovery key opens the data; a wrong key does not
    const v = (await backend.getVault())!
    const viaRecovery = await unwrapDataKey(v.recoveryKey, await recoveryKeyFrom(code.toLowerCase()))
    expect((await openJson<AppData>(viaRecovery, v.data)).expenses).toHaveLength(2)
    await expect(unwrapDataKey(v.recoveryKey, await recoveryKeyFrom(newRecoveryCode()))).rejects.toThrow()

    // 6. pay for Pro (demo checkout) and verify, which extends from the end of the trial
    const { reference } = await backend.startCheckout('yearly', 'mpesa')
    demoMarkPaid(reference)
    const paid = await backend.verifyPayment(reference)
    expect(paid.status).toBe('success')
    expect(paid.subscription?.status).toBe('active')
    expect(Date.parse(paid.subscription!.currentPeriodEnd!)).toBeGreaterThan(Date.parse(sub!.trialEndsAt!))
    expect((await backend.listPayments())[0]).toMatchObject({ reference, status: 'success', amount: 2999 })

    // 7. delete the account: the vault is gone and the old password no longer works
    await backend.deleteAccount()
    expect(await backend.getVault()).toBeNull()
    await expect(backend.signIn(EMAIL, master.loginSecret)).rejects.toThrow()
  })

  it('a wrong password cannot sign in or unwrap the data key', async () => {
    const backend = createDemoBackend()
    const good = await deriveMasterKeys('right password', 'kamau@example.com', IT)
    const bad = await deriveMasterKeys('wrong password', 'kamau@example.com', IT)
    await backend.signUp('kamau@example.com', good.loginSecret)
    const key = await newDataKey()
    const wrapped = await wrapDataKey(key, good.kek)
    await backend.signOut()
    await expect(backend.signIn('kamau@example.com', bad.loginSecret)).rejects.toThrow(/Wrong email or password/)
    await expect(unwrapDataKey(wrapped, bad.kek)).rejects.toThrow()
  })
})
