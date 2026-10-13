#!/usr/bin/env node
/**
 * Screenshots each component of a locked collection into public/previews/<collection>/<n>.jpg,
 * so visitors see what they are buying without the markup ever being sent to them.
 *
 *   npm i -D playwright-core     (and have Chrome/Chromium installed)
 *   node scripts/make-previews.mjs application-ui-login
 *
 * Needs network access to cdn.tailwindcss.com (the pages are rendered with the Tailwind CDN script).
 * Set CHROME_PATH if Chrome is not found automatically.
 */
import { mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright-core'

const id = process.argv[2]
if (!id || !/^[a-z0-9-]+$/i.test(id)) {
  console.error('Usage: node scripts/make-previews.mjs <category-slug>')
  process.exit(1)
}

const src = join(process.cwd(), 'src/data/code', id)
const out = join(process.cwd(), 'public/previews', id)
mkdirSync(out, { recursive: true })

const files = readdirSync(src).filter((f) => /^\d+\.html$/.test(f))
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, channel: process.env.CHROME_PATH ? undefined : 'chrome' })
const page = await browser.newPage({ viewport: { width: 1200, height: 640 }, deviceScaleFactor: 1 })

for (const file of files) {
  const html = readFileSync(join(src, file), 'utf-8')
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-white">${html}</body></html>`,
    { waitUntil: 'networkidle' }
  )
  await page.screenshot({ path: join(out, file.replace('.html', '.jpg')), type: 'jpeg', quality: 80 })
  console.log('✓', file)
}
await browser.close()
