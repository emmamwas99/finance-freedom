'use client'

import Link from 'next/link'
import { useEffect } from 'react'

/** Error boundary for every route. Never shows error details (they could contain personal data). */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log only the digest, not the message, to avoid leaking anything personal into logs.
    if (error.digest) console.error('Unexpected error', error.digest)
  }, [error])
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-navy">Something went wrong</h1>
        <p className="mt-2 text-[16px] text-muted-foreground">Your data is safe. Try again, or go back to the home page.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-lg bg-primary px-4 py-2 font-medium text-white">
            Try again
          </button>
          <Link href="/" className="rounded-lg border bg-card px-4 py-2 text-navy">
            Home
          </Link>
        </div>
      </div>
    </main>
  )
}
