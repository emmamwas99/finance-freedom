import type { MetadataRoute } from 'next'
import { SITE } from '@/config/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/app',
    name: SITE.name,
    short_name: SITE.shortName,
    description: 'Budget planner with synced records, reports and an encrypted vault backup.',
    lang: SITE.language,
    start_url: '/app',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: SITE.themeColor,
    background_color: '#f4f6f9',
    categories: ['finance', 'productivity'],
    icons: [
      { src: '/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
      { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [{ name: 'Add expense', short_name: 'Add', url: '/app', icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }] }],
  }
}
