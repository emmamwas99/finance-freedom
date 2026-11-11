'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/api/client'

function Verify() {
  const token = useSearchParams().get('token')
  const base = process.env.NEXT_PUBLIC_FINFE_API_URL
  const [state, setState] = useState<'loading' | 'ok' | 'error'>(token && base ? 'loading' : 'error')
  useEffect(() => {
    if (!base || !token) return
    api(base, '/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) })
      .then(() => setState('ok')).catch(() => setState('error'))
  }, [base, token])
  return <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 p-6 text-center">
    <h1 className="text-2xl font-semibold">{state === 'loading' ? 'Confirming your email…' : state === 'ok' ? 'Email confirmed' : 'This link is invalid or expired'}</h1>
    <Link href="/login" className="text-primary underline">Go to login</Link>
  </main>
}
export default function Page() { return <Suspense><Verify /></Suspense> }
