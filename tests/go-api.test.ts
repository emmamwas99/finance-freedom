import { afterEach, expect, it, vi } from 'vitest'
import { createGoBackend } from '../src/lib/cloud/goBackend'

const response = (status: number, body: unknown) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json' },
})

afterEach(() => vi.unstubAllGlobals())

it('sends the registration fields required by the Finfe API', async () => {
  const fetch = vi.fn().mockResolvedValue(response(201, {
    user: { id: 'user-1', email: 'a@example.com' }, needsConfirmation: true,
  }))
  vi.stubGlobal('fetch', fetch)

  const result = await createGoBackend('http://localhost:8080').signUp('a@example.com', 'derived-secret', 'Amina')

  expect(result.needsConfirmation).toBe(true)
  expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/auth/register', expect.objectContaining({
    method: 'POST', body: JSON.stringify({ email: 'a@example.com', password: 'derived-secret', name: 'Amina' }), credentials: 'include',
  }))
})

it('maps the backend payment fields into billing history', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(200, { payments: [{
    reference: 'finfe_1', amount_minor: 29900, period: 'monthly', method: 'mpesa', status: 'success',
    paid_at: '2026-11-12T10:00:00Z', created_at: '2026-11-12T09:00:00Z',
  }] })))

  expect(await createGoBackend('http://localhost:8080').listPayments()).toEqual([{
    reference: 'finfe_1', amount: 299, period: 'monthly', method: 'mpesa', status: 'success',
    paidAt: '2026-11-12T10:00:00Z', createdAt: '2026-11-12T09:00:00Z',
  }])
})

it('treats an expired refresh cookie as signed out', async () => {
  const fetch = vi.fn()
    .mockResolvedValueOnce(response(401, { error: { code: 'unauthenticated', message: 'Sign in again' } }))
    .mockResolvedValueOnce(response(401, { error: { code: 'unauthenticated', message: 'Sign in again' } }))
  vi.stubGlobal('fetch', fetch)
  vi.stubGlobal('window', { location: { pathname: '/' } })

  expect(await createGoBackend('http://localhost:8080').getUser()).toBeNull()
  expect(fetch).toHaveBeenCalledTimes(2)
})
