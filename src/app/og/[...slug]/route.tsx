import { readFileSync } from 'node:fs'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import { SITE } from '@/config/site'
import { OG_SIZE } from '@/lib/seo/metadata'
import { publicRoutes } from '@/lib/seo/routes'

/**
 * Open Graph / Twitter images, one per public page, generated at build time.
 * Only known pages render; anything else is a 404, so the endpoint can't be used to make
 * arbitrary images on this domain.
 */
export const dynamic = 'force-static'
export const dynamicParams = false

// The real logo (white tile for the navy background), embedded once at build time.
const LOGO = `data:image/svg+xml;base64,${readFileSync(path.join(process.cwd(), 'public/logo-inverse.svg')).toString('base64')}`

const toSlug = (path: string) => (path === '/' ? ['home'] : path.slice(1).split('/'))

export function generateStaticParams() {
  return publicRoutes().map((r) => ({ slug: toSlug(r.path) }))
}

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await ctx.params
  const path = slug.join('/') === 'home' ? '/' : `/${slug.join('/')}`
  const route = publicRoutes().find((r) => r.path === path)
  if (!route) return new Response('Not found', { status: 404 })
  const title = route.title.length > 90 ? `${route.title.slice(0, 87)}…` : route.title

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0a3c6e', color: '#ffffff', padding: '64px 72px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, fontWeight: 600 }}>
          {/* oxlint-disable-next-line nextjs/no-img-element -- ImageResponse (Satori) renders plain <img> */}
          <img src={LOGO} width={56} height={56} alt="" />
          {SITE.name}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 28, color: '#5bb3e6', textTransform: 'uppercase', letterSpacing: 2 }}>{route.kicker}</div>
          <div style={{ fontSize: title.length > 60 ? 54 : 64, lineHeight: 1.12, fontWeight: 700, maxWidth: 1000 }}>{title}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: 'rgba(255,255,255,0.75)' }}>
          <span>Budget planning and reports for Kenya</span>
          <span>{SITE.url.replace(/^https?:\/\//, '')}</span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  )
}
