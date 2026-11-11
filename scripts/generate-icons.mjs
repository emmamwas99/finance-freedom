#!/usr/bin/env node
/**
 * Generates every Finfe logo and icon file in /public from one SVG definition.
 *   node scripts/generate-icons.mjs
 *
 * The mark: a lowercase "f" whose crossbar is a rising arrow, financial freedom moving upward.
 * Two variants: navy tile (light backgrounds, favicons, app icons) and white tile (navy backgrounds).
 * PNGs are rendered with Playwright's Chromium (a dev dependency); favicon.ico embeds PNGs.
 */
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'

const OUT = path.resolve(import.meta.dirname, '../public')
const NAVY = '#0A3C6E'
const SKY = '#5BB3E6'
const BRAND = '#1783C1'

/** The glyph on a 100×100 grid, centred on (50, 50). */
const glyph = (f, arrow) => `
    <path d="M43 80V42c0-13 7-21 19-21 4 0 7.5.8 10.5 2.2" fill="none" stroke="${f}" stroke-width="12" stroke-linecap="round"/>
    <path d="M25 61 70 45" fill="none" stroke="${arrow}" stroke-width="9.5" stroke-linecap="round"/>
    <path d="M58.5 39.5 71.5 44.5 64.5 56.5" fill="none" stroke="${arrow}" stroke-width="9.5" stroke-linecap="round" stroke-linejoin="round"/>`

/** Rounded tile with the glyph. `scale` shrinks the glyph for full-bleed/maskable icons. */
function svg({ bg = NAVY, f = '#FFFFFF', arrow = SKY, radius = 24, scale = 1, title = 'Finfe' } = {}) {
  const t = scale === 1 ? '' : ` transform="translate(${50 - 50 * scale} ${50 - 50 * scale}) scale(${scale})"`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${title}">
  <title>${title}</title>
  <rect width="100" height="100" rx="${radius}" fill="${bg}"/>
  <g${t}>${glyph(f, arrow)}
  </g>
</svg>
`
}

const variants = {
  'logo.svg': svg(),
  'favicon.svg': svg(),
  'logo-inverse.svg': svg({ bg: '#FFFFFF', f: NAVY, arrow: BRAND }),
}
for (const [name, content] of Object.entries(variants)) writeFileSync(path.join(OUT, name), content)

// Raster icons: [file, size, svg]
const rasters = [
  ['pwa-64x64.png', 64, svg()],
  ['pwa-192x192.png', 192, svg()],
  ['pwa-512x512.png', 512, svg()],
  // iOS masks the corners itself, so the touch icon is a full square
  ['apple-touch-icon-180x180.png', 180, svg({ radius: 0, scale: 0.82 })],
  // maskable: content inside the central 80% safe zone, full-bleed background
  ['maskable-icon-512x512.png', 512, svg({ radius: 0, scale: 0.66 })],
]
const icoSizes = [16, 32, 48]

const browser = await chromium.launch()
const page = await browser.newPage()
async function render(size, content) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(`<html><body style="margin:0;background:transparent">${content.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`)
  return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } })
}
for (const [name, size, content] of rasters) writeFileSync(path.join(OUT, name), await render(size, content))

// favicon.ico with embedded PNGs (supported by every current browser)
const pngs = await Promise.all(icoSizes.map((s) => render(s, svg())))
await browser.close()
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(pngs.length, 4)
let offset = 6 + 16 * pngs.length
const entries = pngs.map((png, i) => {
  const e = Buffer.alloc(16)
  e.writeUInt8(icoSizes[i] % 256, 0)
  e.writeUInt8(icoSizes[i] % 256, 1)
  e.writeUInt8(0, 2)
  e.writeUInt8(0, 3)
  e.writeUInt16LE(1, 4)
  e.writeUInt16LE(32, 6)
  e.writeUInt32LE(png.length, 8)
  e.writeUInt32LE(offset, 12)
  offset += png.length
  return e
})
writeFileSync(path.join(OUT, 'favicon.ico'), Buffer.concat([header, ...entries, ...pngs]))

console.log(`Wrote ${Object.keys(variants).length} SVGs, ${rasters.length} PNGs and favicon.ico (${icoSizes.join('/')}) to public/`)
