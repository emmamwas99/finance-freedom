import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import { JsonLd } from '@/components/seo/json-ld'
import { SITE } from '@/config/site'
import { OG_SIZE } from '@/lib/seo/metadata'
import { organizationSchema, websiteSchema } from '@/lib/seo/schema'
import './globals.css'

// Self-hosted variable Geist (latin): no layout shift, no third-party font request.
const geist = localFont({
  src: '../fonts/geist-latin-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-geist',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
})

const defaultTitle = `${SITE.name}: budget planner and debt-free tracker for Kenya`

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: defaultTitle, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.company,
  category: 'finance',
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: { capable: true, title: SITE.shortName, statusBarStyle: 'default' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon-180x180.png',
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    title: defaultTitle,
    description: SITE.description,
    images: [{ url: '/og/home', ...OG_SIZE, alt: SITE.name }],
  },
  twitter: { card: 'summary_large_image', title: defaultTitle, description: SITE.description, images: ['/og/home'] },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={SITE.language} className={geist.variable}>
      <body>
        <a
          href="#main"
          className="sr-only z-[100] rounded-md bg-navy px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        {children}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  )
}
