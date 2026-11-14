export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message) }
}

let refreshing: Promise<boolean> | null = null

export async function api<T>(baseURL: string, path: string, options: RequestInit = {}): Promise<T> {
  const send = () => fetch(`${baseURL.replace(/\/$/, '')}/api/v1${path}`, {
    ...options,
    credentials: 'include',
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
  })
  let res = await send()
  if (res.status === 401 && !['/auth/refresh', '/auth/login', '/auth/register', '/auth/forgot-password', '/auth/resend-verification', '/auth/verify-email', '/auth/recovery-session'].includes(path)) {
    refreshing ??= fetch(`${baseURL.replace(/\/$/, '')}/api/v1/auth/refresh`, {
      method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: '{}',
    }).then((r) => r.ok).catch(() => false).finally(() => { refreshing = null })
    if (await refreshing) res = await send()
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body?.error?.code ?? 'request_failed', body?.error?.message ?? `Request failed (${res.status})`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
