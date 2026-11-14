import { NextRequest, NextResponse } from 'next/server'

const apiURL = process.env.FINFE_API_URL ?? process.env.NEXT_PUBLIC_FINFE_API_URL

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (path.startsWith('/api/v1/')) {
    if (!apiURL) return NextResponse.json({ error: { code: 'api_unavailable', message: 'Finfe API is not configured' } }, { status: 503 })
    const incomingOrigin = request.headers.get('origin')
    if (incomingOrigin && incomingOrigin !== request.nextUrl.origin) {
      return NextResponse.json({ error: { code: 'bad_origin', message: 'Origin is not allowed' } }, { status: 403 })
    }
    const destination = new URL(path + request.nextUrl.search, apiURL)
    const headers = new Headers(request.headers)
    headers.delete('host')
    const cookies = ['finfe_access', 'finfe_refresh']
      .map((name) => request.cookies.get(name))
      .filter((cookie) => cookie !== undefined)
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ')
    if (cookies) headers.set('cookie', cookies)
    else headers.delete('cookie')
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) headers.set('origin', request.nextUrl.origin)
    const response = NextResponse.rewrite(destination, { request: { headers } })
    response.headers.set('Cache-Control', 'no-store')
    return response
  }
  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}

export const config = {
  matcher: ['/api/v1/:path*', '/app/:path*', '/login', '/signup', '/forgot', '/reset', '/verify-email', '/demo-checkout'],
}
