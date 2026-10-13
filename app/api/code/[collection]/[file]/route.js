import { join } from 'node:path'
import { promises as fs } from 'node:fs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { getSiteUrl } from '@util/lib/site-url'
import { COOKIE, getAccess } from '@util/lib/entitlements'
import { CODE_DIR, getPack, isOpen } from '@util/lib/packs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FILE = /^(\d+)(?:-dark)?(?:-interactive)?\.html$/
const baseHeaders = { 'Cache-Control': 'private, no-store' }

/** PRO component HTML (from src/data/code). Previews are open to everyone; the code view/copy is for buyers and free samples. */
export async function GET(request, { params }) {
  const { collection, file } = await params
  const headers = { ...baseHeaders }
  const match = FILE.exec(file)
  const pack = match ? await getPack(collection) : null
  if (!pack?.pro) return NextResponse.json({ error: 'Not found' }, { status: 404, headers })

  const allowed = isOpen(pack, match[1]) || (await getAccess((await cookies()).get(COOKIE)?.value)).has(pack.id, match[1])

  // ?preview=1 is what the live preview uses: everyone gets the HTML to render, and the
  // X-Code-Access header tells the page whether to show and allow copying the code.
  const preview = new URL(request.url).searchParams.get('preview') === '1'
  if (!allowed && !preview) return NextResponse.json({ error: 'locked', pack: pack.id }, { status: 402, headers })
  headers['X-Code-Access'] = allowed ? 'granted' : 'locked'

  const send = (html) => new NextResponse(html, { headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } })

  try {
    return send(await fs.readFile(/* turbopackIgnore: true */ join(CODE_DIR, pack.id, file), 'utf-8'))
  } catch {}

  // Not locked away yet: the HTML is still in public/components. Read it from there so the page works,
  // but note that anyone can still download it directly until you run scripts/lock-pack.mjs.
  for (const folder of new Set([pack.id, pack.id.toLowerCase()])) {
    const response = await fetch(`${getSiteUrl(request)}/components/${folder}/${file}`, { cache: 'no-store' }).catch(() => null)
    const type = response?.headers.get('content-type') ?? ''
    if (response?.ok && type.includes('text/html')) {
      const html = await response.text()
      if (html && !/<title>\s*404/i.test(html)) {
        console.warn(`[code] ${pack.id}/${file} is served from public/. Run: node scripts/lock-pack.mjs ${pack.id}`)
        return send(html)
      }
    }
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404, headers })
}