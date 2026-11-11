'use client'

/** Last-resort boundary (replaces the root layout), so it needs its own <html> and <body>. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-KE">
      <body style={{ fontFamily: 'system-ui, sans-serif', background: '#f4f6f9', color: '#333', display: 'grid', placeItems: 'center', minHeight: '100dvh', margin: 0 }}>
        <main style={{ textAlign: 'center', padding: 24 }}>
          <h1 style={{ color: '#0a3c6e' }}>Something went wrong</h1>
          <p>Your data is safe. Please try again.</p>
          <button type="button" onClick={reset} style={{ background: '#1470a8', color: '#fff', border: 0, borderRadius: 8, padding: '10px 16px', fontSize: 16 }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
